"""Offline media regression check; requires numpy and opencv-python-headless.

Run against original and stable masters. These are authoring tools, not web-app
dependencies. The shot boundaries belong to the existing 455-frame hero edit.
"""
import sys
import cv2
import numpy as np


def motion(path):
    capture = cv2.VideoCapture(path)
    assert capture.isOpened(), f'Cannot open {path}'
    assert capture.get(cv2.CAP_PROP_FPS) == 30, 'Hero cadence changed'
    previous = None
    velocities = {}
    frame_count = 0
    while True:
        ok, frame = capture.read()
        if not ok:
            break
        gray = cv2.cvtColor(cv2.resize(frame, (640, 360)), cv2.COLOR_BGR2GRAY)
        if previous is not None:
            points = cv2.goodFeaturesToTrack(previous, 500, .01, 10)
            if points is not None and len(points) >= 12:
                next_points, status, _ = cv2.calcOpticalFlowPyrLK(previous, gray, points, None, winSize=(21, 21), maxLevel=3)
                back, back_status, _ = cv2.calcOpticalFlowPyrLK(gray, previous, next_points, None, winSize=(21, 21), maxLevel=3)
                valid = (status.ravel() == 1) & (back_status.ravel() == 1) & (np.linalg.norm(back - points, axis=2).ravel() < .75)
                if np.sum(valid) >= 12:
                    transform, _ = cv2.estimateAffinePartial2D(points[valid], next_points[valid], method=cv2.RANSAC, ransacReprojThreshold=1)
                    if transform is not None:
                        velocities[frame_count] = transform @ np.array([320, 180, 1]) - np.array([320, 180])
        previous = gray
        frame_count += 1
    capture.release()
    assert frame_count == 455, f'Hero edit changed: {frame_count} frames'
    return velocities


def jerk_score(velocities, start, end):
    changes = [np.linalg.norm(velocities[i] - velocities[i - 1])
               for i in range(start + 4, end - 3)
               if i in velocities and i - 1 in velocities]
    assert len(changes) >= .7 * (end - start - 7), 'Insufficient reliable tracks'
    return np.percentile(changes, 95)


if __name__ == '__main__':
    if len(sys.argv) != 3:
        raise SystemExit('Usage: python check-hero-stability.py original.mp4 stable.mp4')
    cv2.setNumThreads(2)
    original, stable = (motion(path) for path in sys.argv[1:])
    cuts = [0, 79, 169, 248, 333, 406, 455]
    for start, end in zip(cuts, cuts[1:]):
        before = jerk_score(original, start, end)
        after = jerk_score(stable, start, end)
        assert after < before * .35, f'Wobble regression in shot {start}:{end}'
        print(f'PASS shot {start}:{end}: irregular translation reduced by {100 * (1 - after / before):.1f}%')
