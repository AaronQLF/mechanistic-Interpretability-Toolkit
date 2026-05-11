import type { Vec2 } from "./linalg";

export type World = {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
};

export type Frame = {
  width: number;
  height: number;
  world: World;
  pad: number;
};

export function makeFrame(
  width: number,
  height: number,
  world: World,
  pad = 0
): Frame {
  return { width, height, world, pad };
}

// World coordinates -> SVG screen coordinates (y is inverted).
export function w2s(frame: Frame, p: Vec2): [number, number] {
  const { width, height, world, pad } = frame;
  const wW = world.xMax - world.xMin;
  const wH = world.yMax - world.yMin;
  const inner = { w: width - 2 * pad, h: height - 2 * pad };
  const x = pad + ((p[0] - world.xMin) / wW) * inner.w;
  const y = pad + (1 - (p[1] - world.yMin) / wH) * inner.h;
  return [x, y];
}

// SVG screen coordinates -> world.
export function s2w(frame: Frame, p: [number, number]): Vec2 {
  const { width, height, world, pad } = frame;
  const wW = world.xMax - world.xMin;
  const wH = world.yMax - world.yMin;
  const inner = { w: width - 2 * pad, h: height - 2 * pad };
  const x = world.xMin + ((p[0] - pad) / inner.w) * wW;
  const y = world.yMin + (1 - (p[1] - pad) / inner.h) * wH;
  return [x, y];
}

export function unitsPerPixel(frame: Frame): number {
  const wW = frame.world.xMax - frame.world.xMin;
  const inner = frame.width - 2 * frame.pad;
  return wW / inner;
}
