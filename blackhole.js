'use strict';
// A ray-traced black hole for the hero panel.
// Every pixel sends a light ray that is bent by gravity (Schwarzschild approximation, horizon radius 1)
// and coloured where it crosses a thin, turbulent accretion disk. The far side of the disk is lensed
// over and under the shadow, and the side rotating towards the viewer is Doppler-brightened.
(() => {
  const stage = document.querySelector('.bh-stage');
  if (!stage) return;
  const canvas = stage.querySelector('canvas');
  const gl = canvas.getContext('webgl', { premultipliedAlpha: true, alpha: true, antialias: false, powerPreference: 'low-power' });
  if (!gl) { stage.classList.add('bh-css'); return; }

  const vert = 'attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }';
  const frag = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uView;   // camera yaw and pitch, driven by the pointer
uniform float uZoom;  // wider view on narrow screens so the disk fits
const float RIN = 2.6;
const float ROUT = 7.4;

float hash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { v += a * noise(p); p = p * 2.03 + 7.1; a *= 0.5; }
  return v;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  float roll = -0.13;
  uv = vec2(uv.x * cos(roll) - uv.y * sin(roll), uv.x * sin(roll) + uv.y * cos(roll));

  float yaw = uView.x, pitch = uView.y;
  vec3 cam = 16.0 * vec3(sin(yaw) * cos(pitch), sin(pitch), -cos(yaw) * cos(pitch));
  vec3 fwd = normalize(-cam);
  vec3 right = normalize(cross(vec3(0.0, 1.0, 0.0), fwd));
  vec3 up = cross(fwd, right);
  vec3 vel = normalize(fwd + (uv.x * right + uv.y * up) * uZoom);
  vec3 pos = cam;
  vec3 hv = cross(pos, vel);
  float h2 = dot(hv, hv);

  vec3 col = vec3(0.0);
  float alpha = 0.0;

  for (int i = 0; i < 240; i++) {
    float r = length(pos);
    if (r < 1.0) { alpha = 1.0; break; }                          // fell through the horizon
    if (r > 40.0 && dot(pos, vel) > 0.0) break;                    // escaped
    float dt = clamp(0.06 * r, 0.025, 0.9);
    vec3 prev = pos;
    vel += -1.5 * h2 * pos / pow(r, 5.0) * dt;                     // light bending
    pos += vel * dt;

    if (prev.y * pos.y < 0.0) {                                    // crossed the disk plane
      vec3 p = mix(prev, pos, prev.y / (prev.y - pos.y));
      float rr = length(p.xz);
      if (rr > RIN && rr < ROUT) {
        float ang = uTime * 2.2 * pow(rr, -1.5);                   // inner parts orbit faster
        float c = cos(ang), s = sin(ang);
        vec2 q = vec2(c * p.x - s * p.z, s * p.x + c * p.z);
        float n = fbm(q * 1.35);
        float streaks = 0.55 + 0.45 * sin(rr * 7.0 + n * 6.0);
        float t = clamp((rr - RIN) / (ROUT - RIN), 0.0, 1.0);
        float density = smoothstep(RIN, RIN + 0.35, rr) * (1.0 - smoothstep(ROUT - 3.2, ROUT, rr));
        float a = clamp(density * (0.35 + 0.75 * n) * streaks, 0.0, 1.0);

        vec3 hot = vec3(1.0, 0.93, 0.78);
        vec3 warm = vec3(1.0, 0.56, 0.2);
        vec3 cool = vec3(0.7, 0.2, 0.06);
        vec3 base = mix(mix(hot, warm, smoothstep(0.0, 0.35, t)), cool, smoothstep(0.35, 1.0, t));
        float intensity = 2.4 * pow(1.0 - t, 2.2) + 0.2;

        vec3 orbit = normalize(vec3(-p.z, 0.0, p.x));              // disk rotation direction
        float beta = clamp(sqrt(0.5 / rr), 0.0, 0.7);
        float d = sqrt(1.0 - beta * beta) / (1.0 - beta * dot(orbit, -normalize(vel)));
        float boost = clamp(pow(d, 3.0), 0.15, 5.0);
        float redshift = sqrt(max(0.0, 1.0 - 1.0 / rr));

        vec3 emit = base * intensity * boost * redshift;
        col += (1.0 - alpha) * emit * a;
        alpha += (1.0 - alpha) * a;
        if (alpha > 0.985) break;
      }
    }
  }
  col = 1.0 - exp(-col * 1.5);                                     // tone map
  alpha = max(alpha, max(col.r, max(col.g, col.b)));
  gl_FragColor = vec4(col, alpha);
}`;

  function compile(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  }
  let prog;
  try {
    prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, vert));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, frag));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
  } catch (e) {
    console.warn('Black hole shader unavailable:', e);
    stage.classList.add('bh-css');
    return;
  }
  gl.useProgram(prog);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const uRes = gl.getUniformLocation(prog, 'uRes');
  const uTime = gl.getUniformLocation(prog, 'uTime');
  const uView = gl.getUniformLocation(prog, 'uView');
  const uZoom = gl.getUniformLocation(prog, 'uZoom');
  gl.clearColor(0, 0, 0, 0);

  const root = document.documentElement;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const moving = () => root.dataset.motion !== 'off' && !reduce.matches;
  let visible = true, raf = 0, start = performance.now(), frozenAt = 6;

  // camera angles: resting view is slightly above the disk; the pointer orbits it
  const REST = { yaw: 0, pitch: 0.1 };
  const view = { ...REST }, target = { ...REST };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  function aim(clientX, clientY) {
    const r = stage.getBoundingClientRect();
    const dx = clamp((clientX - (r.left + r.width / 2)) / (r.width / 2), -1.4, 1.4);
    const dy = clamp((clientY - (r.top + r.height / 2)) / (r.height / 2), -1.4, 1.4);
    target.yaw = dx * 0.75;                       // left/right swings around the hole
    target.pitch = clamp(0.1 - dy * 0.45, -0.55, 0.75); // up looks down onto the disk, down looks from below
    kick();
  }
  function rest() { target.yaw = REST.yaw; target.pitch = REST.pitch; kick(); }

  const scene = stage.closest('.hero-visual') || stage;
  scene.addEventListener('pointermove', e => { if (e.pointerType === 'mouse') aim(e.clientX, e.clientY); });
  scene.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') rest(); });
  // touch: drag across the black hole to orbit it
  stage.style.touchAction = 'pan-y';
  stage.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') aim(e.clientX, e.clientY); });
  stage.addEventListener('pointermove', e => { if (e.pointerType !== 'mouse' && e.buttons) aim(e.clientX, e.clientY); });
  stage.addEventListener('pointerup', e => { if (e.pointerType !== 'mouse') setTimeout(rest, 1200); });

  function resize() {
    const rect = stage.getBoundingClientRect();
    // keep the pixel count modest: this shader runs a ray march per pixel
    const scale = Math.min(window.devicePixelRatio || 1, rect.width < 600 ? 1.25 : 1.5);
    canvas.width = Math.max(1, Math.round(rect.width * scale));
    canvas.height = Math.max(1, Math.round(rect.height * scale));
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(uRes, canvas.width, canvas.height);
    const aspect = rect.width / Math.max(1, rect.height);
    gl.uniform1f(uZoom, aspect < 1.15 ? 0.95 * 1.15 / Math.max(aspect, 0.6) : 0.95);
  }
  function frame(now) {
    const anim = moving();
    const t = anim ? (now - start) / 1000 : frozenAt;
    // ease toward the pointer target; jump straight there when animations are off
    const k = anim ? 0.08 : 1;
    view.yaw += (target.yaw - view.yaw) * k;
    view.pitch += (target.pitch - view.pitch) * k;
    const settling = Math.abs(target.yaw - view.yaw) + Math.abs(target.pitch - view.pitch) > 0.001;
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(uTime, t + 6);
    gl.uniform2f(uView, view.yaw, view.pitch);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    raf = (anim || settling) && visible && !document.hidden ? requestAnimationFrame(frame) : 0;
  }
  function kick() { if (!raf) raf = requestAnimationFrame(frame); }

  resize();
  kick();
  new ResizeObserver(() => { resize(); kick(); }).observe(stage);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) kick(); }).observe(stage);
  }
  document.addEventListener('visibilitychange', () => { if (!document.hidden) kick(); });
  new MutationObserver(() => { if (!moving()) frozenAt = (performance.now() - start) / 1000; kick(); })
    .observe(root, { attributes: true, attributeFilter: ['data-motion'] });
  reduce.addEventListener('change', kick);
})();
