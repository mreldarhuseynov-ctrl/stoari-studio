/**
 * The particle field — a faithful port of the approved build's renderer.
 *
 * Not a reinterpretation: the shapes, the physics constants, the shaders and
 * the bloom chain are the ones that were signed off. The only things added are
 * teardown (the original never unmounts; React does) and types.
 *
 * Pipeline per frame:
 *   scene FBO  ← stars + ring system + the morphing body
 *   bright pass → two separable Gaussian blurs at quarter res
 *   composite   → bloom + vignette + Reinhard-ish tone curve
 *
 * Shapes:
 *   0 INDEX       the word STOARI, sampled from rasterised type
 *   1 CAPABILITY  a house — walls, ridge, floor bands, mullions
 *   2 SCALE       a 9×4 city grid, storey bands per block
 *   3 METHOD      a tilted disc
 */

export function createField(): () => void {
  const isCoarse =
    matchMedia('(pointer: coarse)').matches || innerWidth < 820
  const COUNT = isCoarse ? 15000 : 46000
  const RINGN = isCoarse ? 4200 : 9000

  const canvas = document.getElementById('gl') as HTMLCanvasElement | null
  if (!canvas) return () => {}

  /* alpha: true is what lets the hero film show through the field. The canvas
     covers the whole page, so with an opaque drawing buffer nothing behind it
     can ever be seen — no z-index arrangement helps. Unpremultiplied, because
     the composite pass below writes colour and coverage separately. */
  const gl = canvas.getContext('webgl', {
    antialias: false,
    alpha: true,
    premultipliedAlpha: false,
  })
  if (!gl) {
    const l = document.getElementById('loader')
    if (l) l.innerHTML = 'WEBGL NOT AVAILABLE'
    return () => {}
  }

  const compile = (t: number, src: string) => {
    const s = gl.createShader(t)!
    gl.shaderSource(s, src)
    gl.compileShader(s)
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
      throw new Error(gl.getShaderInfoLog(s) || 'compile')
    return s
  }
  const link = (vs: string, fs: string) => {
    const p = gl.createProgram()!
    gl.attachShader(p, compile(gl.VERTEX_SHADER, vs))
    gl.attachShader(p, compile(gl.FRAGMENT_SHADER, fs))
    gl.linkProgram(p)
    if (!gl.getProgramParameter(p, gl.LINK_STATUS))
      throw new Error(gl.getProgramInfoLog(p) || 'link')
    return p
  }

  const pProg = link(
    `
attribute vec3 aPos; attribute float aGlow; attribute float aRand;
uniform mat4 uMV, uP; uniform float uSize;
varying float vG, vR;
void main(){
  vG=aGlow; vR=aRand;
  vec4 mv = uMV * vec4(aPos,1.0);
  gl_PointSize = uSize * aRand * (1.0 + vG*2.0) * (640.0 / max(-mv.z, 1.0));
  gl_Position = uP * mv;
}`,
    `
precision mediump float;
uniform float uAlpha;
varying float vG, vR;
void main(){
  vec2 d = gl_PointCoord - 0.5;
  float r = length(d);
  if(r > 0.5) discard;
  float core = smoothstep(0.5, 0.0, r);
  core *= core;
  float lum = mix(0.55, 0.95, clamp(vR-0.35, 0.0, 1.0));
  lum = mix(lum, 1.0, clamp(vG*1.8, 0.0, 1.0));
  gl_FragColor = vec4(vec3(lum), core * uAlpha * (0.34 + vG*0.66));
}`
  )

  const PL = {
    aPos: gl.getAttribLocation(pProg, 'aPos'),
    aGlow: gl.getAttribLocation(pProg, 'aGlow'),
    aRand: gl.getAttribLocation(pProg, 'aRand'),
    uMV: gl.getUniformLocation(pProg, 'uMV'),
    uP: gl.getUniformLocation(pProg, 'uP'),
    uSize: gl.getUniformLocation(pProg, 'uSize'),
    uAlpha: gl.getUniformLocation(pProg, 'uAlpha'),
  }

  const QUAD_VS = `
attribute vec2 aP; varying vec2 vUv;
void main(){ vUv = aP*0.5 + 0.5; gl_Position = vec4(aP,0.0,1.0); }`

  const brightProg = link(
    QUAD_VS,
    `
precision mediump float; uniform sampler2D uTex; varying vec2 vUv;
void main(){
  vec3 c = texture2D(uTex, vUv).rgb;
  float l = dot(c, vec3(0.2126,0.7152,0.0722));
  gl_FragColor = vec4(c * smoothstep(0.16, 0.62, l), 1.0);
}`
  )

  const blurProg = link(
    QUAD_VS,
    `
precision mediump float; uniform sampler2D uTex; uniform vec2 uDir; varying vec2 vUv;
void main(){
  vec3 s  = texture2D(uTex, vUv).rgb * 0.2270270270;
  s += (texture2D(uTex, vUv + uDir*1.3846153846).rgb + texture2D(uTex, vUv - uDir*1.3846153846).rgb) * 0.3162162162;
  s += (texture2D(uTex, vUv + uDir*3.2307692308).rgb + texture2D(uTex, vUv - uDir*3.2307692308).rgb) * 0.0702702703;
  gl_FragColor = vec4(s, 1.0);
}`
  )

  const compProg = link(
    QUAD_VS,
    `
precision mediump float;
uniform sampler2D uScene, uBloom; uniform float uAmt;
varying vec2 vUv;
void main(){
  vec3 c = texture2D(uScene, vUv).rgb;
  vec3 b = texture2D(uBloom, vUv).rgb;
  c += b * uAmt;
  vec2 q = vUv - 0.5;
  c *= 1.0 - dot(q,q) * 0.42;
  c = c / (c + vec3(1.25)) * 2.05;
  /* Coverage, not a flat one. The page composites source-over, so writing
     alpha = the brightest channel and un-multiplying the colour gives
     final = c + page * (1 - a): the field adds light where it burns and
     leaves the frame behind it untouched where it is dark. Without this the
     canvas is a black sheet over everything. */
  float a = clamp(max(max(c.r, c.g), c.b), 0.0, 1.0);
  gl_FragColor = vec4(c / max(a, 0.0015), a);
}`
  )

  const quadBuf = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)

  const drawQuad = (prog: WebGLProgram) => {
    const l = gl.getAttribLocation(prog, 'aP')
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf)
    gl.enableVertexAttribArray(l)
    gl.vertexAttribPointer(l, 2, gl.FLOAT, false, 0, 0)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
  }

  type FBO = { fb: WebGLFramebuffer; tex: WebGLTexture; w: number; h: number }
  const makeFBO = (w: number, h: number): FBO => {
    const tex = gl.createTexture()!
    gl.bindTexture(gl.TEXTURE_2D, tex)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    const fb = gl.createFramebuffer()!
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb)
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0)
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    return { fb, tex, w, h }
  }

  let sceneFBO: FBO, bloomA: FBO, bloomB: FBO

  /* The original allocated three fresh framebuffers on every resize and never
     released the old ones — a drag of the window edge leaked a texture per
     frame of the drag. */
  const dropFBO = (f?: FBO) => {
    if (!f) return
    gl.deleteFramebuffer(f.fb)
    gl.deleteTexture(f.tex)
  }

  /* ── Geometry ─────────────────────────────────────────── */

  type Pt = [number, number, number]

  function segSampler() {
    const segs: { a: Pt; b: Pt; acc: number }[] = []
    let total = 0
    return {
      add(a: Pt, b: Pt, weight?: number) {
        const dx = b[0] - a[0], dy = b[1] - a[1], dz = b[2] - a[2]
        total += Math.sqrt(dx * dx + dy * dy + dz * dz) * (weight || 1)
        segs.push({ a, b, acc: total })
        return this
      },
      sample(n: number, jitter?: number): Pt[] {
        const out: Pt[] = []
        const j = jitter === undefined ? 2.2 : jitter
        for (let i = 0; i < n; i++) {
          const r = Math.random() * total
          let lo = 0, hi = segs.length - 1
          while (lo < hi) {
            const m = (lo + hi) >> 1
            if (segs[m].acc < r) lo = m + 1
            else hi = m
          }
          const s = segs[lo], t = Math.random()
          out.push([
            s.a[0] + (s.b[0] - s.a[0]) * t + (Math.random() - 0.5) * j,
            s.a[1] + (s.b[1] - s.a[1]) * t + (Math.random() - 0.5) * j,
            s.a[2] + (s.b[2] - s.a[2]) * t + (Math.random() - 0.5) * j,
          ])
        }
        return out
      },
    }
  }

  /** The brand name, rasterised then sampled — the identity IS the hero shape. */
  /**
   * The wordmark as a particle cloud, with the descriptor tracked out under it.
   *
   * The face is the approved one — Bahnschrift, Microsoft's DIN — not the
   * monospace this used to be drawn in. That matters: the capital I in this face
   * is a bare vertical stem, the same figure as the slot cut through the mark,
   * so the word the field settles into and the mark it morphs to afterwards are
   * one geometry. The monospace slabs fought the mark, which is why the wordmark
   * moved off it — see START-HERE.md.
   *
   * The descriptor is tracked, not sized, to the width of the word above it.
   * Canvas can measure, so the spacing is solved rather than guessed: a line
   * that nearly matches reads as a mistake, one that matches reads as built.
   */
  function wordmarkPoints(text: string, sub?: string): Pt[] {
    const W = 1600, H = 440
    const c = document.createElement('canvas')
    c.width = W
    c.height = H
    const g = c.getContext('2d')!
    g.fillStyle = '#fff'
    g.textAlign = 'left'
    g.textBaseline = 'middle'

    const FACE = "Bahnschrift, 'DIN Next', 'DIN Pro', Archivo, sans-serif"
    const font = (s: number) => `400 ${s}px ${FACE}`
    /** Not supported everywhere; where it is missing the line simply sits tighter. */
    const track = (px: number) => {
      try {
        ;(g as unknown as { letterSpacing: string }).letterSpacing = `${px}px`
      } catch {
        /* ignore */
      }
    }
    /** Canvas counts the tracking after the final glyph too — that is phantom width. */
    const ink = (t: string, sp: number) => g.measureText(t).width - sp

    let size = 300
    let sp = size * 0.2
    track(sp)
    g.font = font(size)
    while (ink(text, sp) > W * 0.86 && size > 40) {
      size -= 8
      sp = size * 0.2
      track(sp)
      g.font = font(size)
    }
    const wordW = ink(text, sp)
    const x0 = (W - wordW) / 2
    g.fillText(text, x0, sub ? H * 0.42 : H * 0.5)

    if (sub) {
      const ds = Math.round(size * 0.315)
      track(0)
      g.font = font(ds)
      const glyphs = g.measureText(sub).width
      const gaps = Math.max(sub.length - 1, 1)
      const sp2 = Math.max((wordW - glyphs) / gaps, 0)
      track(sp2)
      g.font = font(ds)
      g.fillText(sub, x0, H * 0.72)
    }
    track(0)

    const d = g.getImageData(0, 0, W, H).data
    const raw: Pt[] = []
    let yMin = H, yMax = 0
    const sc = 960 / W
    for (let y = 0; y < H; y += 2)
      for (let x = 0; x < W; x += 2)
        if (d[(y * W + x) * 4 + 3] > 128) {
          raw.push([(x - W / 2) * sc, y, (Math.random() - 0.5) * 26])
          if (y < yMin) yMin = y
          if (y > yMax) yMax = y
        }
    // Recentre on the ink rather than on the canvas: with two lines the block no
    // longer sits on H/2, and an off-centre wordmark reads as a layout slip.
    const mid = (yMin + yMax) / 2
    return raw.map(([x, y, z]) => [x, -(y - mid) * sc, z] as Pt)
  }

  function housePoints(n: number): Pt[] {
    const W = 560, D = 380, Hw = 210, Hr = 150
    const x0 = -W / 2, x1 = W / 2, z0 = -D / 2, z1 = D / 2
    const y0 = -Hw / 2, y1 = Hw / 2, yr = y1 + Hr
    const S = segSampler()
    const P = (x: number, y: number, z: number): Pt => [x, y, z]
    ;([[y0, 1.0], [y1, 1.0]] as [number, number][]).forEach(([y, w]) => {
      S.add(P(x0, y, z0), P(x1, y, z0), w).add(P(x1, y, z0), P(x1, y, z1), w)
        .add(P(x1, y, z1), P(x0, y, z1), w).add(P(x0, y, z1), P(x0, y, z0), w)
    })
    S.add(P(x0, y0, z0), P(x0, y1, z0), 1).add(P(x1, y0, z0), P(x1, y1, z0), 1)
      .add(P(x1, y0, z1), P(x1, y1, z1), 1).add(P(x0, y0, z1), P(x0, y1, z1), 1)
    S.add(P(0, yr, z0), P(0, yr, z1), 1.4)
    S.add(P(x0, y1, z0), P(0, yr, z0), 1.2).add(P(x1, y1, z0), P(0, yr, z0), 1.2)
    S.add(P(x0, y1, z1), P(0, yr, z1), 1.2).add(P(x1, y1, z1), P(0, yr, z1), 1.2)
    for (let i = 1; i < 9; i++) {
      const x = x0 + W * i / 9
      S.add(P(x, y0, z0), P(x, y1, z0), 0.55)
      S.add(P(x, y0, z1), P(x, y1, z1), 0.35)
    }
    for (let i = 1; i < 6; i++) {
      const z = z0 + D * i / 6
      S.add(P(x0, y0, z), P(x1, y0, z), 0.3)
    }
    for (let i = 1; i < 9; i++) {
      const x = x0 + W * i / 9
      S.add(P(x, y0, z0), P(x, y0, z1), 0.22)
    }
    const ym = y0 + Hw * 0.5
    S.add(P(x0, ym, z0), P(x1, ym, z0), 0.7).add(P(x0, ym, z1), P(x1, ym, z1), 0.5)
      .add(P(x0, ym, z0), P(x0, ym, z1), 0.5).add(P(x1, ym, z0), P(x1, ym, z1), 0.5)
    return S.sample(n, 2.4)
  }

  function cityPoints(n: number): Pt[] {
    const S = segSampler()
    const cols = 9, rows = 4, cw = 118, cd = 118, gap = 16
    const ox = -(cols * cw + (cols - 1) * gap) / 2
    const oz = -(rows * cd + (rows - 1) * gap) / 2
    let seed = 7
    const rnd = () => {
      seed = (seed * 16807) % 2147483647
      return seed / 2147483647
    }
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++) {
        const cx = ox + c * (cw + gap), cz = oz + r * (cd + gap)
        const w = cw * (0.5 + rnd() * 0.42), d = cd * (0.5 + rnd() * 0.42)
        const cxx = cx + cw / 2, czz = cz + cd / 2
        const h = 70 + rnd() * rnd() * 430
        const y0 = -260, y1 = y0 + h
        const X0 = cxx - w / 2, X1 = cxx + w / 2, Z0 = czz - d / 2, Z1 = czz + d / 2
        const P = (x: number, y: number, z: number): Pt => [x, y, z]
        S.add(P(X0, y0, Z0), P(X0, y1, Z0), 1).add(P(X1, y0, Z0), P(X1, y1, Z0), 1)
          .add(P(X1, y0, Z1), P(X1, y1, Z1), 1).add(P(X0, y0, Z1), P(X0, y1, Z1), 1)
        S.add(P(X0, y1, Z0), P(X1, y1, Z0), 1.3).add(P(X1, y1, Z0), P(X1, y1, Z1), 1.3)
          .add(P(X1, y1, Z1), P(X0, y1, Z1), 1.3).add(P(X0, y1, Z1), P(X0, y1, Z0), 1.3)
        const bands = Math.max(2, Math.floor(h / 58))
        for (let b = 1; b < bands; b++) {
          const y = y0 + h * b / bands
          S.add(P(X0, y, Z0), P(X1, y, Z0), 0.3).add(P(X1, y, Z0), P(X1, y, Z1), 0.22)
            .add(P(X1, y, Z1), P(X0, y, Z1), 0.3).add(P(X0, y, Z1), P(X0, y, Z0), 0.22)
        }
      }
    return S.sample(n, 1.8)
  }

  function ringPoints(n: number): Pt[] {
    const pts: Pt[] = []
    const AX = 0.92, AZ = -0.46
    const ca = Math.cos(AX), sa = Math.sin(AX)
    const cz = Math.cos(AZ), sz = Math.sin(AZ)
    const push = (x: number, y: number, z: number) => {
      const y1 = y * ca - z * sa, z1 = y * sa + z * ca
      pts.push([x * cz - y1 * sz, x * sz + y1 * cz, z1])
    }
    for (let i = 0; i < n; i++) {
      const t = Math.random() * Math.PI * 2
      const u = Math.random()
      const r = 250 + Math.pow(u, 0.55) * 150
      const thin = (1 - u) * 26 + 4
      push(Math.cos(t) * r, (Math.random() - 0.5) * thin, Math.sin(t) * r)
    }
    for (let i = 0; i < n * 0.12; i++) {
      const t = Math.random() * Math.PI * 2
      const r = 236 + Math.random() * 8
      push(Math.cos(t) * r, (Math.random() - 0.5) * 4, Math.sin(t) * r)
    }
    return pts
  }

  /**
   * La Concha, the massif above Marbella — the studio's own horizon.
   *
   * Built the way the rest of the field is built: a height field walked as
   * cross-sections, so the silhouette reads as a survey of the mountain rather
   * than a picture of it. The ridge slice carries the most weight, everything
   * behind it thins out, which is what gives the shell its depth when the
   * camera drifts.
   */
  function conchaPoints(n: number): Pt[] {
    const W = 1180, D = 560, HGT = 430, y0 = -215
    // Normalised ridge: long western climb, summit, the scoop, a second crest.
    const RIDGE: [number, number][] = [
      [-1.0, 0.02], [-0.82, 0.15], [-0.64, 0.33], [-0.48, 0.5], [-0.34, 0.69],
      [-0.21, 0.87], [-0.1, 0.97], [0.0, 1.0], [0.09, 0.94], [0.17, 0.73],
      [0.25, 0.62], [0.34, 0.68], [0.43, 0.59], [0.56, 0.42], [0.71, 0.25],
      [0.86, 0.11], [1.0, 0.02],
    ]
    const ridge = (u: number) => {
      if (u <= RIDGE[0][0]) return RIDGE[0][1]
      for (let i = 1; i < RIDGE.length; i++) {
        if (u <= RIDGE[i][0]) {
          const [x0, h0] = RIDGE[i - 1], [x1, h1] = RIDGE[i]
          const t = (u - x0) / (x1 - x0)
          return h0 + (h1 - h0) * (t * t * (3 - 2 * t))
        }
      }
      return RIDGE[RIDGE.length - 1][1]
    }
    /** Height falls away from the ridge line, so the mass is a lens, not a wall. */
    const falloff = (v: number) => Math.pow(Math.cos((Math.abs(v) * Math.PI) / 2), 1.35)
    const h = (u: number, v: number) => y0 + HGT * ridge(u) * falloff(v)

    const S = segSampler()
    const P = (u: number, v: number): Pt => [u * (W / 2), h(u, v), v * (D / 2)]
    const XS = 72, ZS = 13

    for (let zi = 0; zi < ZS; zi++) {
      const v = -1 + (2 * zi) / (ZS - 1)
      const w = Math.abs(v) < 0.001 ? 1.5 : 0.42 + 0.5 * (1 - Math.abs(v))
      for (let xi = 0; xi < XS; xi++) {
        const u0 = -1 + (2 * xi) / XS, u1 = -1 + (2 * (xi + 1)) / XS
        S.add(P(u0, v), P(u1, v), w)
      }
    }
    for (let xi = 0; xi <= 18; xi++) {
      const u = -1 + (2 * xi) / 18
      for (let zi = 0; zi < ZS - 1; zi++) {
        const v0 = -1 + (2 * zi) / (ZS - 1), v1 = -1 + (2 * (zi + 1)) / (ZS - 1)
        S.add(P(u, v0), P(u, v1), 0.3)
      }
    }
    // The plain it stands on — one hairline, so the mountain has a ground.
    const G = (u: number, v: number): Pt => [u * (W / 2) * 1.06, y0, v * (D / 2) * 1.06]
    for (let i = 0; i < 48; i++) {
      const a = (i / 48) * Math.PI * 2, b = ((i + 1) / 48) * Math.PI * 2
      S.add(G(Math.cos(a), Math.sin(a)), G(Math.cos(b), Math.sin(b)), 0.5)
    }
    return S.sample(n, 2.2)
  }

  /**
   * The studio mark as a solid: a slab with a vertical opening cut through it.
   * Built from exactly the numbers in `make-logo.mjs`, so the shape the field
   * morphs into and the logo in the corner are the same object — change one
   * and the other has to follow.
   */
  function markPoints(n: number): Pt[] {
    const K = 8.2, D = 58
    // 100-space, as drawn in the SVG: outer 22..78 × 6..94, opening 45.5..54.5 × 24..70.
    const X = (u: number) => (u - 50) * K
    const Y = (v: number) => -(v - 50) * K
    const x0 = X(22), x1 = X(78), y0 = Y(94), y1 = Y(6)
    const hx0 = X(45.5), hx1 = X(54.5), hy0 = Y(70), hy1 = Y(24)

    const S = segSampler()
    const P = (x: number, y: number, z: number): Pt => [x, y, z]

    for (const z of [-D, D]) {
      // outer edge, heavy — it carries the silhouette
      S.add(P(x0, y0, z), P(x1, y0, z), 1.5).add(P(x1, y0, z), P(x1, y1, z), 1.5)
        .add(P(x1, y1, z), P(x0, y1, z), 1.5).add(P(x0, y1, z), P(x0, y0, z), 1.5)
      // the opening, heavier still — it is the whole idea of the mark
      S.add(P(hx0, hy0, z), P(hx1, hy0, z), 2).add(P(hx1, hy0, z), P(hx1, hy1, z), 2)
        .add(P(hx1, hy1, z), P(hx0, hy1, z), 2).add(P(hx0, hy1, z), P(hx0, hy0, z), 2)
      // face fill, stepping around the opening so the hole stays empty
      const ROWS = 46
      for (let i = 1; i < ROWS; i++) {
        const y = y0 + ((y1 - y0) * i) / ROWS
        if (y > hy0 && y < hy1) {
          S.add(P(x0, y, z), P(hx0, y, z), 0.34)
          S.add(P(hx1, y, z), P(x1, y, z), 0.34)
        } else {
          S.add(P(x0, y, z), P(x1, y, z), 0.34)
        }
      }
    }
    // depth: outer corners and the four corners of the opening
    for (const [x, y] of [
      [x0, y0], [x1, y0], [x1, y1], [x0, y1],
      [hx0, hy0], [hx1, hy0], [hx1, hy1], [hx0, hy1],
    ] as [number, number][]) {
      S.add(P(x, y, -D), P(x, y, D), 0.8)
    }
    // and the reveal of the opening — the four inner walls of the slot
    for (let i = 0; i <= 10; i++) {
      const y = hy0 + ((hy1 - hy0) * i) / 10
      S.add(P(hx0, y, -D), P(hx0, y, D), 0.4)
      S.add(P(hx1, y, -D), P(hx1, y, D), 0.4)
    }
    return S.sample(n, 2.2)
  }

  const SHAPES = [
    { name: 'INDEX', pts: wordmarkPoints('STOARI', 'REAL ESTATE MEDIA') },
    { name: 'CAPABILITY', pts: housePoints(Math.max(COUNT, 20000)) },
    { name: 'SCALE', pts: cityPoints(Math.max(COUNT, 20000)) },
    { name: 'METHOD', pts: ringPoints(Math.max(COUNT, 20000)) },
    { name: 'CONCHA', pts: conchaPoints(Math.max(COUNT, 20000)) },
    { name: 'MARK', pts: markPoints(Math.max(COUNT, 20000)) },
  ]

  const pos = new Float32Array(COUNT * 3), vel = new Float32Array(COUNT * 3)
  const home = new Float32Array(COUNT * 3), from = new Float32Array(COUNT * 3)
  const to = new Float32Array(COUNT * 3), glow = new Float32Array(COUNT)
  const rnd = new Float32Array(COUNT)

  const fillTarget = (buf: Float32Array, shape: { pts: Pt[] }) => {
    const p = shape.pts, len = p.length
    for (let i = 0; i < COUNT; i++) {
      const s = p[(i * 7919) % len]
      buf[i * 3] = s[0]
      buf[i * 3 + 1] = s[1]
      buf[i * 3 + 2] = s[2]
    }
  }
  fillTarget(home, SHAPES[0])
  fillTarget(from, SHAPES[0])
  fillTarget(to, SHAPES[0])

  for (let i = 0; i < COUNT; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 2600
    pos[i * 3 + 1] = (Math.random() - 0.5) * 1600
    pos[i * 3 + 2] = (Math.random() - 0.5) * 1400
    rnd[i] = 0.42 + Math.random() * 0.98
  }

  const mkBuf = (data: Float32Array, usage: number) => {
    const b = gl.createBuffer()!
    gl.bindBuffer(gl.ARRAY_BUFFER, b)
    gl.bufferData(gl.ARRAY_BUFFER, data, usage)
    return b
  }
  const bPos = mkBuf(pos, gl.DYNAMIC_DRAW)
  const bGlow = mkBuf(glow, gl.DYNAMIC_DRAW)
  const bRand = mkBuf(rnd, gl.STATIC_DRAW)

  const ringPos = new Float32Array(RINGN * 3), ringGlow = new Float32Array(RINGN)
  const ringRand = new Float32Array(RINGN), ringR = new Float32Array(RINGN)
  {
    let i = 0
    const RINGS = 54
    while (i < RINGN) {
      const ri = Math.floor((i / RINGN) * RINGS)
      const r = 115 + Math.pow(ri / RINGS, 0.88) * 1190
      const t = Math.random() * Math.PI * 2
      ringPos[i * 3] = Math.cos(t) * r
      ringPos[i * 3 + 1] = (Math.random() - 0.5) * 3
      ringPos[i * 3 + 2] = Math.sin(t) * r
      ringR[i] = r
      ringRand[i] = 0.5 + Math.random() * 0.7
      i++
    }
  }
  const bRingPos = mkBuf(ringPos, gl.STATIC_DRAW)
  const bRingGlow = mkBuf(ringGlow, gl.DYNAMIC_DRAW)
  const bRingRand = mkBuf(ringRand, gl.STATIC_DRAW)

  const STARS = 900
  const starPos = new Float32Array(STARS * 3)
  const starGlow = new Float32Array(STARS)
  const starRand = new Float32Array(STARS)
  for (let i = 0; i < STARS; i++) {
    starPos[i * 3] = (Math.random() - 0.5) * 4000
    starPos[i * 3 + 1] = (Math.random() - 0.5) * 2600
    starPos[i * 3 + 2] = -900 - Math.random() * 1800
    starRand[i] = 0.35 + Math.random() * 0.45
  }
  const bStarPos = mkBuf(starPos, gl.STATIC_DRAW)
  const bStarGlow = mkBuf(starGlow, gl.STATIC_DRAW)
  const bStarRand = mkBuf(starRand, gl.STATIC_DRAW)

  const bindP = (bp: WebGLBuffer, bg: WebGLBuffer, br: WebGLBuffer) => {
    gl.bindBuffer(gl.ARRAY_BUFFER, bp)
    gl.enableVertexAttribArray(PL.aPos)
    gl.vertexAttribPointer(PL.aPos, 3, gl.FLOAT, false, 0, 0)
    gl.bindBuffer(gl.ARRAY_BUFFER, bg)
    gl.enableVertexAttribArray(PL.aGlow)
    gl.vertexAttribPointer(PL.aGlow, 1, gl.FLOAT, false, 0, 0)
    gl.bindBuffer(gl.ARRAY_BUFFER, br)
    gl.enableVertexAttribArray(PL.aRand)
    gl.vertexAttribPointer(PL.aRand, 1, gl.FLOAT, false, 0, 0)
  }

  const MP = new Float32Array(16), MV = new Float32Array(16), MVF = new Float32Array(16)
  const FOV = (55 * Math.PI) / 180, CAM_Z = 780

  const perspective = (out: Float32Array, fovy: number, aspect: number, near: number, far: number) => {
    const f = 1 / Math.tan(fovy / 2), nf = 1 / (near - far)
    out.fill(0)
    out[0] = f / aspect; out[5] = f; out[10] = (far + near) * nf
    out[11] = -1; out[14] = 2 * far * near * nf
  }
  const setMV = (out: Float32Array, ry: number, rx: number, k: number, ox: number, oy: number) => {
    const cy = Math.cos(ry), sy = Math.sin(ry), cx = Math.cos(rx), sx = Math.sin(rx)
    out[0] = cy * k; out[1] = 0; out[2] = -sy * k; out[3] = 0
    out[4] = sy * sx * k; out[5] = cx * k; out[6] = cy * sx * k; out[7] = 0
    out[8] = sy * cx * k; out[9] = -sx * k; out[10] = cy * cx * k; out[11] = 0
    out[12] = ox || 0; out[13] = oy || 0; out[14] = -CAM_Z; out[15] = 1
  }
  const setMVFloor = (out: Float32Array, pitch: number, k: number, dropY: number, ox: number) => {
    const c = Math.cos(pitch), s = Math.sin(pitch)
    out[0] = k; out[1] = 0; out[2] = 0; out[3] = 0
    out[4] = 0; out[5] = c * k; out[6] = s * k; out[7] = 0
    out[8] = 0; out[9] = -s * k; out[10] = c * k; out[11] = 0
    out[12] = ox || 0; out[13] = dropY; out[14] = -CAM_Z; out[15] = 1
  }

  let ndcX = 0, ndcY = 0, lastInput = -1e9
  let smX = 0, smY = 0, smZ = 0
  const setPointer = (cx: number, cy: number) => {
    ndcX = (cx / innerWidth) * 2 - 1
    ndcY = -(cy / innerHeight) * 2 + 1
    lastInput = performance.now()
  }
  const onPointer = (e: PointerEvent) => setPointer(e.clientX, e.clientY)
  const onTouch = (e: TouchEvent) => {
    if (e.touches[0]) setPointer(e.touches[0].clientX, e.touches[0].clientY)
  }
  addEventListener('pointermove', onPointer, { passive: true })
  addEventListener('touchmove', onTouch, { passive: true })

  let shapeIdx = 0, morphT = 1
  /**
   * Horizontal push of the field, one entry per section, in SECTIONS order.
   * Positive pushes the cloud away from a left-hand text column, negative away
   * from a right-hand one — so this array has to be re-checked whenever a
   * section is added or a column changes side, or the shape ends up sitting
   * behind the copy.
   *
   *   0 index    hero, centred      1 work      left, wide
   *   2 packages  right, wide        3 films     left, wide
   *   4 services  right              5 program   left, wide
   *   6 project   right, wide        7 funnel    left, wide
   *   8 travel    right, wide        9 how       left
   *  10 why       right             11 faq       left
   *  12 contact   right
   *
   * Strict alternation the whole way down. Twelve sections under the hero is an
   * even count, which is what lets `contact` land on the right with no repeat.
   */
  const OFFSETS = [
    [0, 170],
    [250, 30], [-250, 30], [250, 30], [-250, 30], [250, 30], [-250, 30],
    [250, 30], [-250, 30], [250, 20], [-250, 0],
  ]
  let tgtOX = 0, tgtOY = isCoarse ? 268 : 170
  let offX = 0, offY = isCoarse ? 268 : 170

  const morphTo = (i: number) => {
    if (i === shapeIdx) return
    from.set(home)
    shapeIdx = i
    fillTarget(to, SHAPES[i])
    morphT = 0
  }

  const sections = Array.prototype.slice.call(
    document.querySelectorAll('section')
  ) as HTMLElement[]
  const elProgress = document.getElementById('progress')
  const elNow = document.getElementById('cNow')
  const elLabel = document.getElementById('cLabel')
  let scrollN = 0

  const onScroll = () => {
    const max = Math.max(1, document.body.scrollHeight - innerHeight)
    scrollN = Math.min(1, Math.max(0, scrollY / max))
    if (elProgress) elProgress.style.width = scrollN * 100 + '%'
    const mid = scrollY + innerHeight * 0.5
    let idx = 0
    for (let i = 0; i < sections.length; i++)
      if (sections[i].offsetTop <= mid) idx = i
    morphTo(+(sections[idx].dataset.shape || 0))
    const o = OFFSETS[Math.min(idx, OFFSETS.length - 1)]
    if (isCoarse) { tgtOX = 0; tgtOY = 268 } else { tgtOX = o[0]; tgtOY = o[1] }
    if (elNow) elNow.textContent = String(idx + 1).padStart(2, '0')
    if (elLabel) elLabel.textContent = sections[idx].dataset.label || ''
  }
  addEventListener('scroll', onScroll, { passive: true })

  /* 0.22 of the section has to be on screen before it reveals. A section
     taller than about four and a half screens can never reach that fraction,
     and would simply stay at opacity 0 for ever — which is what a pinned
     horizontal row does to the section that holds it. The threshold is
     therefore capped at what half a screen of that section actually comes to,
     so a tall section reveals when half a viewport of it is showing and every
     normal section keeps the 0.22 it had. */
  const reveal = (e: IntersectionObserverEntry) => {
    if (e.isIntersecting) e.target.classList.add('in')
  }
  const ios = sections.map((s) => {
    const h = s.offsetHeight || innerHeight
    const threshold = Math.min(0.22, (innerHeight * 0.5) / h)
    const o = new IntersectionObserver((es) => es.forEach(reveal), { threshold })
    o.observe(s)
    return o
  })

  const R = 195, PUSH = 4.2, SPRING = 0.045, DAMP = 0.862
  const BASE_SIZE = isCoarse ? 2.3 : 2.1
  let rotY = 0, rotX = 0, prevT = 0, acc = 0, modelScale = 1

  const resize = () => {
    const dpr = Math.min(devicePixelRatio || 1, isCoarse ? 2 : 1.75)
    const w = Math.floor(innerWidth * dpr), h = Math.floor(innerHeight * dpr)
    if (w < 1 || h < 1) return
    canvas.width = w
    canvas.height = h
    canvas.style.width = innerWidth + 'px'
    canvas.style.height = innerHeight + 'px'
    const aspect = innerWidth / innerHeight
    perspective(MP, FOV, aspect, 1, 7000)
    const halfW = Math.tan(FOV / 2) * CAM_Z * aspect
    modelScale = Math.min(isCoarse ? 1 : 0.82, (halfW * 1.75) / 1150)
    dropFBO(sceneFBO)
    dropFBO(bloomA)
    dropFBO(bloomB)
    sceneFBO = makeFBO(w, h)
    const bw = Math.max(2, w >> 2), bh = Math.max(2, h >> 2)
    bloomA = makeFBO(bw, bh)
    bloomB = makeFBO(bw, bh)
  }
  const onResize = () => { resize(); onScroll() }
  addEventListener('resize', onResize)
  resize()

  /* A canvas built while the viewport is still zero — collapsed pane, hidden
     tab — would never get a size back, because `resize` does not fire on the
     way in. */
  let ro: ResizeObserver | null = null
  if (typeof ResizeObserver !== 'undefined') {
    ro = new ResizeObserver(() => { if (canvas.width < 1) onResize() })
    ro.observe(document.documentElement)
  }

  const drawScene = () => {
    gl.bindFramebuffer(gl.FRAMEBUFFER, sceneFBO.fb)
    gl.viewport(0, 0, sceneFBO.w, sceneFBO.h)
    gl.clearColor(0, 0, 0, 1)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.disable(gl.DEPTH_TEST)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE)
    gl.useProgram(pProg)
    gl.uniformMatrix4fv(PL.uP, false, MP)
    gl.uniform1f(PL.uSize, BASE_SIZE * Math.max(0.86, modelScale))

    setMV(MV, rotY * 0.35, rotX * 0.35, 1, 0, 0)
    gl.uniformMatrix4fv(PL.uMV, false, MV)
    gl.uniform1f(PL.uAlpha, 0.55)
    bindP(bStarPos, bStarGlow, bStarRand)
    gl.drawArrays(gl.POINTS, 0, STARS)

    setMVFloor(MVF, -0.46, modelScale, (offY - 330) * 0.9, offX * 0.85)
    gl.uniformMatrix4fv(PL.uMV, false, MVF)
    gl.uniform1f(PL.uAlpha, 0.95)
    gl.bindBuffer(gl.ARRAY_BUFFER, bRingGlow)
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, ringGlow)
    bindP(bRingPos, bRingGlow, bRingRand)
    gl.drawArrays(gl.POINTS, 0, RINGN)

    setMV(MV, rotY, rotX, modelScale, offX, offY)
    gl.uniformMatrix4fv(PL.uMV, false, MV)
    gl.uniform1f(PL.uAlpha, 1.0)
    gl.bindBuffer(gl.ARRAY_BUFFER, bPos)
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, pos)
    gl.bindBuffer(gl.ARRAY_BUFFER, bGlow)
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, glow)
    bindP(bPos, bGlow, bRand)
    gl.drawArrays(gl.POINTS, 0, COUNT)
  }

  const post = () => {
    gl.disable(gl.BLEND)
    gl.bindFramebuffer(gl.FRAMEBUFFER, bloomA.fb)
    gl.viewport(0, 0, bloomA.w, bloomA.h)
    gl.useProgram(brightProg)
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, sceneFBO.tex)
    gl.uniform1i(gl.getUniformLocation(brightProg, 'uTex'), 0)
    drawQuad(brightProg)

    gl.useProgram(blurProg)
    const uT = gl.getUniformLocation(blurProg, 'uTex')
    const uD = gl.getUniformLocation(blurProg, 'uDir')
    gl.uniform1i(uT, 0)
    for (let i = 0; i < 2; i++) {
      const spread = 1.0 + i * 1.7
      gl.bindFramebuffer(gl.FRAMEBUFFER, bloomB.fb)
      gl.viewport(0, 0, bloomB.w, bloomB.h)
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, bloomA.tex)
      gl.uniform2f(uD, spread / bloomA.w, 0)
      drawQuad(blurProg)
      gl.bindFramebuffer(gl.FRAMEBUFFER, bloomA.fb)
      gl.viewport(0, 0, bloomA.w, bloomA.h)
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, bloomB.tex)
      gl.uniform2f(uD, 0, spread / bloomA.h)
      drawQuad(blurProg)
    }

    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    gl.viewport(0, 0, canvas.width, canvas.height)
    /* The scene pass leaves additive blending on. The composite writes the
       finished frame and must replace the buffer, not add to it. */
    gl.disable(gl.BLEND)
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.useProgram(compProg)
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, sceneFBO.tex)
    gl.uniform1i(gl.getUniformLocation(compProg, 'uScene'), 0)
    gl.activeTexture(gl.TEXTURE1)
    gl.bindTexture(gl.TEXTURE_2D, bloomA.tex)
    gl.uniform1i(gl.getUniformLocation(compProg, 'uBloom'), 1)
    gl.uniform1f(gl.getUniformLocation(compProg, 'uAmt'), 1.65)
    drawQuad(compProg)
  }

  let raf = 0
  let alive = true

  const frame = (now: number) => {
    if (!alive) return
    raf = requestAnimationFrame(frame)
    if (canvas.width < 1) return

    const dt = prevT ? Math.min(now - prevT, 50) : 16.7
    prevT = now
    const idle = now - lastInput > 2800
    if (idle) {
      const t = now * 0.0002
      ndcX = Math.sin(t * 1.7) * 0.52
      ndcY = Math.sin(t * 1.1 + 1.3) * 0.34
    }
    offX += (tgtOX - offX) * 0.055
    offY += (tgtOY - offY) * 0.055
    rotY = Math.sin(now * 0.00012) * 0.16 + scrollN * 0.5
    rotX = Math.sin(now * 0.00009) * 0.06

    const halfH = Math.tan(FOV / 2) * CAM_Z
    const wx = ndcX * halfH * (innerWidth / innerHeight) - offX
    const wy = ndcY * halfH - offY
    const cy = Math.cos(-rotY), sy = Math.sin(-rotY)
    const x1 = wx * cy, y1 = wy, z1 = -wx * sy
    const cx = Math.cos(-rotX), sx = Math.sin(-rotX)
    const curX = x1 / modelScale
    const curY = (y1 * cx - z1 * sx) / modelScale
    const curZ = (y1 * sx + z1 * cx) / modelScale
    const k = idle ? 0.05 : 0.2
    smX += (curX - smX) * k
    smY += (curY - smY) * k
    smZ += (curZ - smZ) * k

    if (morphT < 1) {
      morphT = Math.min(1, morphT + dt / 1700)
      const t = morphT
      const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
      for (let i = 0; i < COUNT * 3; i++) home[i] = from[i] + (to[i] - from[i]) * e
    }

    acc += dt
    let steps = 0
    while (acc >= 16.7 && steps < 2) { acc -= 16.7; steps++ }
    if (steps === 0 && dt > 8) steps = 1
    if (acc > 40) acc = 0

    const R2 = R * R
    for (let st = 0; st < steps; st++)
      for (let i = 0; i < COUNT; i++) {
        const i3 = i * 3
        const px = pos[i3], py = pos[i3 + 1], pz = pos[i3 + 2]
        let vx = vel[i3], vy = vel[i3 + 1], vz = vel[i3 + 2]
        const dx = px - smX, dy = py - smY, dz = (pz - smZ) * 0.45
        const d2 = dx * dx + dy * dy + dz * dz
        let g = 0
        if (d2 < R2) {
          const d = Math.sqrt(d2) + 0.001, f = 1 - d / R, s = f * f * PUSH / d
          vx += dx * s; vy += dy * s; vz += dz * s; g = f
        }
        vx = (vx + (home[i3] - px) * SPRING) * DAMP
        vy = (vy + (home[i3 + 1] - py) * SPRING) * DAMP
        vz = (vz + (home[i3 + 2] - pz) * SPRING) * DAMP
        pos[i3] = px + vx; pos[i3 + 1] = py + vy; pos[i3 + 2] = pz + vz
        vel[i3] = vx; vel[i3 + 1] = vy; vel[i3 + 2] = vz
        const sp = Math.min(1, (vx * vx + vy * vy + vz * vz) * 0.0035)
        glow[i] += ((g > sp ? g : sp) - glow[i]) * 0.24
      }

    const wt = now * 0.0011
    for (let i = 0; i < RINGN; i++) {
      const r = ringR[i]
      let w = Math.sin(r * 0.0135 - wt * 1.9)
      w = w > 0 ? w : 0
      w *= w; w *= w
      const fall = 1 - Math.min(1, (r - 110) / 1180)
      ringGlow[i] = w * fall * 0.95
    }

    drawScene()
    post()
  }

  /* Loader — timers keep running where rAF does not, so the curtain always lifts. */
  let p = 0
  const barIn = document.getElementById('barIn')
  const pct = document.getElementById('pct')
  const tick = setInterval(() => {
    p = Math.min(100, p + 8 + Math.random() * 14)
    if (barIn) barIn.style.width = p + '%'
    if (pct) pct.textContent = Math.round(p) + '%'
    if (p >= 100) {
      clearInterval(tick)
      document.getElementById('loader')?.classList.add('hide')
      sections[0]?.classList.add('in')
    }
  }, 70)

  onScroll()
  raf = requestAnimationFrame(frame)

  return () => {
    alive = false
    cancelAnimationFrame(raf)
    clearInterval(tick)
    ios.forEach((o) => o.disconnect())
    ro?.disconnect()
    removeEventListener('pointermove', onPointer)
    removeEventListener('touchmove', onTouch)
    removeEventListener('scroll', onScroll)
    removeEventListener('resize', onResize)
  }
}
