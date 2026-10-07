# Hero playback investigation — 5 October 2026

The reported problem concerns movement in the scene, rather than the particle
wordmark. One reproducible selection bug was found: a 736 × 648 browser panel
loaded the 720 × 1280 portrait crop because selection used width alone. Covering
that panel with an already cropped portrait film magnifies movement and removes
much more of the scene than a landscape encode.

The selector now considers orientation and touch input. It responds to media
query changes and rebinds playback observers when the video changes. A narrow
landscape panel loads a 1280 × 720 encode of the original full composition.
Portrait phones retain their full-height portrait crop; wide desktops retain
the original 1920 × 1080 film. The landscape encode preserves the original
30 fps cadence, uses H.264/yuv420p, has no audio and uses MP4 fast start.

Checks: TypeScript/build, lint and the five responsive-selection regression
cases passed. Browser checks covered 1440 × 900, 390 × 844 and the original
736 × 648 panel. The first two had no page overflow; services retained their
images. Desktop rows reduced from at least 132 px to approximately 82 px.

The original film has 455 frames at a constant 30 fps. A consecutive frame-hash
check found no identical repeated frames. Temporary native video quality
instrumentation in the local app recorded roughly 0.5% dropped frames with the
particle field enabled and 0.3% without it. This does not rule out compositor
stutter or motion already present in the footage. Instrumentation was removed.

A separate 1280 × 720 comparison export uses FFmpeg motion interpolation at
60 fps with scene-change detection. It is held outside the shipping assets
for visual review: interpolation can introduce artifacts and is not proof of
camera stabilization. Do not claim that the scene movement is fully resolved
solely from frame counts or a still screenshot. The user's visual comparison
of the corrected preview determines whether further footage work is needed.

[FFmpeg interpolation documentation](https://ffmpeg.org/ffmpeg-filters.html#minterpolate)

## 6 October: source wobble corrected

The owner confirmed that the unwanted movement remained after correcting the
format and described it as bad stabilization. Sparse feature tracking in the
original file found alternating global subpixel translations inside individual
shots, including the opening architecture shot. A 60 fps conversion does not
remove this underlying spatial wobble and is not used in the site.

The new stable master smooths the measured camera trajectory within each shot.
The five hard-cut boundaries remain at frames 79, 169, 248, 333 and 406; smoothing
never crosses them. A fixed 1% safety crop prevents exposed borders, retaining
the original duration, 455 frames and 30 fps cadence. Desktop, landscape and
portrait exports derive from the same corrected master, with matching posters.
Original files are retained and separately named URLs prevent a cached old
video from being reused. The hero pause button was removed at the owner's
request; hidden-tab/offscreen pausing and reduced-motion posters remain.

The same independent motion estimator was run on the original and corrected
masters. Within-shot P95 changes in global translation fell by 79–96%, depending
on the shot. This is a geometric motion measure, not a perceptual quality score.
All three exports fully decode and retain the original frame count/cadence.
Measurements and export details are in [hero-stabilization-report.json](hero-stabilization-report.json).
The offline regression check in `scripts/check-hero-stability.py` compares the
original and corrected masters and rejects an export unless irregular global
translation falls by at least 65% in every shot. It requires NumPy and OpenCV
only in the authoring environment; the website has no Python dependency.

The measurement uses [OpenCV sparse optical flow](https://docs.opencv.org/4.x/dc/d6b/group__video__track.html)
and [partial affine estimation](https://docs.opencv.org/4.x/d9/d0c/group__calib3d.html).
