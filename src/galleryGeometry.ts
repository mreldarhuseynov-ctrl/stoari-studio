export function galleryOffset(top: number, stickyTop: number, distance: number, speed: number) {
  return Math.min(distance, Math.max(0, (stickyTop - top) * speed))
}

export function cardOffset(left: number, width: number, viewport: number, distance: number) {
  return Math.min(distance, Math.max(0, left - Math.max(0, (viewport - width) / 2)))
}
