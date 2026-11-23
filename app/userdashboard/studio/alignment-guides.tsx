'use client';

/**
 * Figma-style smart alignment guides.
 *
 * While an object is moved or resized, its left / centre / right edges and its
 * top / middle / bottom edges are compared with those of every other object (and
 * of the area it sits in). When one comes within a few screen pixels of another,
 * the object snaps to it and a red guide line is drawn through the aligned edges,
 * with a small cross on each object's ends. Holding Ctrl/Cmd while dragging
 * turns snapping off, as in Figma.
 *
 * Everything here works in one coordinate space (canvas units, not screen pixels);
 * the caller converts rectangles in and guides out.
 */

import React from 'react';

export type SnapRect = { x: number; y: number; w: number; h: number };

/**
 * A guide line. `axis: 'x'` is a vertical line at x = `pos` running from `from` to `to`
 * (in y); `axis: 'y'` is a horizontal line at y = `pos` running along x.
 * `marks` are the points along the line where an aligned object starts or ends.
 */
export type Guide = { axis: 'x' | 'y'; pos: number; from: number; to: number; marks: number[] };

/** Snapping distance, in screen pixels (Figma uses about this much). */
export const SNAP_DISTANCE_PX = 6;

/** Figma's guide red. */
const GUIDE_COLOR = '#F24822';

type Axis = 'x' | 'y';

/** An edge or centre line of a rectangle along one axis. */
const anchors = (rect: SnapRect, axis: Axis): [number, number, number] => axis === 'x'
  ? [rect.x, rect.x + rect.w / 2, rect.x + rect.w]
  : [rect.y, rect.y + rect.h / 2, rect.y + rect.h];

/** The span of a rectangle across the other axis (where a guide along `axis` touches it). */
const span = (rect: SnapRect, axis: Axis): [number, number] => axis === 'x'
  ? [rect.y, rect.y + rect.h]
  : [rect.x, rect.x + rect.w];

/**
 * The smallest shift (within `threshold`) that lines up one of `moving` with one of the
 * targets' anchors along `axis`, or null when nothing is close enough.
 */
function nearestShift(moving: number[], targets: SnapRect[], axis: Axis, threshold: number): number | null {
  let best: number | null = null;
  for (const target of targets) {
    for (const t of anchors(target, axis)) {
      for (const m of moving) {
        const shift = t - m;
        if (Math.abs(shift) <= threshold && (best === null || Math.abs(shift) < Math.abs(best))) best = shift;
      }
    }
  }
  return best;
}

/**
 * The guide lines for `rect` against the targets: one line per position where any of the
 * rect's `edges` (indexes into its anchors: 0 start, 1 centre, 2 end) meets a target anchor.
 */
export function guidesFor(rect: SnapRect, targets: SnapRect[], edges: { x: number[]; y: number[] }): Guide[] {
  const guides: Guide[] = [];
  (['x', 'y'] as Axis[]).forEach((axis) => {
    const own = anchors(rect, axis);
    const lines = new Map<number, Guide>();
    for (const target of targets) {
      const theirs = anchors(target, axis);
      for (const index of edges[axis]) {
        const value = own[index];
        if (!theirs.some((t) => Math.abs(t - value) < 0.5)) continue;
        const key = Math.round(value * 2) / 2;
        const [a0, a1] = span(rect, axis);
        const [b0, b1] = span(target, axis);
        const line = lines.get(key) ?? { axis, pos: value, from: a0, to: a1, marks: [a0, a1] };
        line.from = Math.min(line.from, b0);
        line.to = Math.max(line.to, b1);
        line.marks.push(b0, b1);
        lines.set(key, line);
      }
    }
    guides.push(...lines.values());
  });
  return guides;
}

/** Pointer details a session looks at: the position (for `isActive`) and Ctrl/Cmd (to skip snapping). */
export type SnapPointer = { clientX: number; clientY: number; ctrlKey?: boolean; metaKey?: boolean };

export type SnapSession = {
  /** Moving by (dx, dy) from the start: returns the delta to use, snapped when something lines up. */
  move: (dx: number, dy: number, pointer?: SnapPointer) => { dx: number; dy: number };
  /** Resizing by `handle` ('n', 'se', …) to `rect`: returns the rect with its dragged edges snapped. */
  resize: (rect: SnapRect, handle: string, pointer?: SnapPointer) => SnapRect;
  /** The drag is over: hide the guides. */
  end: () => void;
};

/**
 * One drag's worth of snapping. `moving` is the dragged object's bounds when the drag
 * started (for a frame or group, everything that moves with it); `targets` are the
 * objects it can line up with. `onGuides` receives the guide lines to draw.
 */
export function createSnapSession({
  moving,
  targets,
  threshold,
  onGuides,
  isActive,
}: {
  moving: SnapRect;
  targets: SnapRect[];
  /** Snapping distance in the same units as the rectangles. */
  threshold: number;
  onGuides: (guides: Guide[]) => void;
  /** Snapping only applies while this is true (e.g. the pointer is still over this area). */
  isActive?: (pointer: SnapPointer) => boolean;
}): SnapSession {
  let shown = false;
  const show = (guides: Guide[]) => {
    if (!guides.length && !shown) return;
    shown = guides.length > 0;
    onGuides(guides);
  };
  const skip = (pointer?: SnapPointer) =>
    !!pointer && (!!pointer.ctrlKey || !!pointer.metaKey || (isActive ? !isActive(pointer) : false));

  return {
    move(dx, dy, pointer) {
      if (skip(pointer) || targets.length === 0) {
        show([]);
        return { dx, dy };
      }
      const moved = { ...moving, x: moving.x + dx, y: moving.y + dy };
      const shiftX = nearestShift(anchors(moved, 'x'), targets, 'x', threshold) ?? 0;
      const shiftY = nearestShift(anchors(moved, 'y'), targets, 'y', threshold) ?? 0;
      const snapped = { ...moved, x: moved.x + shiftX, y: moved.y + shiftY };
      show(guidesFor(snapped, targets, { x: [0, 1, 2], y: [0, 1, 2] }));
      return { dx: dx + shiftX, dy: dy + shiftY };
    },

    resize(rect, handle, pointer) {
      if (skip(pointer) || targets.length === 0) {
        show([]);
        return rect;
      }
      const next = { ...rect };
      const edges: { x: number[]; y: number[] } = { x: [], y: [] };
      // Only the edges being dragged snap; the opposite edge stays put.
      if (handle.includes('e')) {
        const shift = nearestShift([rect.x + rect.w], targets, 'x', threshold);
        if (shift !== null) next.w = rect.w + shift;
        edges.x.push(2);
      } else if (handle.includes('w')) {
        const shift = nearestShift([rect.x], targets, 'x', threshold);
        if (shift !== null) {
          next.x = rect.x + shift;
          next.w = rect.w - shift;
        }
        edges.x.push(0);
      }
      if (handle.includes('s')) {
        const shift = nearestShift([rect.y + rect.h], targets, 'y', threshold);
        if (shift !== null) next.h = rect.h + shift;
        edges.y.push(2);
      } else if (handle.includes('n')) {
        const shift = nearestShift([rect.y], targets, 'y', threshold);
        if (shift !== null) {
          next.y = rect.y + shift;
          next.h = rect.h - shift;
        }
        edges.y.push(0);
      }
      if (next.w < 1 || next.h < 1) {
        show([]);
        return rect;
      }
      show(guidesFor(next, targets, edges));
      return next;
    },

    end() {
      show([]);
    },
  };
}

/** The smallest rectangle around all of these. */
export function unionRect(rects: SnapRect[]): SnapRect | null {
  if (rects.length === 0) return null;
  const left = Math.min(...rects.map((r) => r.x));
  const top = Math.min(...rects.map((r) => r.y));
  const right = Math.max(...rects.map((r) => r.x + r.w));
  const bottom = Math.max(...rects.map((r) => r.y + r.h));
  return { x: left, y: top, w: right - left, h: bottom - top };
}

/** An element's on-screen box mapped into canvas units by `toCanvas` (screen point → canvas point). */
export function elementRect(
  element: Element,
  toCanvas: (clientX: number, clientY: number) => { x: number; y: number },
): SnapRect | null {
  const box = element.getBoundingClientRect();
  if (box.width === 0 && box.height === 0) return null;
  const a = toCanvas(box.left, box.top);
  const b = toCanvas(box.right, box.bottom);
  return { x: a.x, y: a.y, w: b.x - a.x, h: b.y - a.y };
}

/**
 * Draws guide lines (in the coordinates of the layer it is placed in). `scale` is how many
 * screen pixels one unit of that layer takes, so the lines stay 1px wide at any zoom.
 */
export function AlignmentGuides({ guides, scale }: { guides: Guide[]; scale: number }) {
  if (guides.length === 0) return null;
  const px = 1 / (scale || 1);
  const mark = 3.5 * px;
  return (
    <svg
      aria-hidden="true"
      data-alignment-guides
      className="pointer-events-none absolute left-0 top-0 overflow-visible"
      style={{ zIndex: 9500 }}
      width="1"
      height="1"
    >
      {guides.map((guide, index) => {
        const vertical = guide.axis === 'x';
        const at = (along: number) => (vertical ? { x: guide.pos, y: along } : { x: along, y: guide.pos });
        const start = at(guide.from);
        const end = at(guide.to);
        return (
          <g key={`${guide.axis}-${guide.pos}-${index}`} stroke={GUIDE_COLOR} strokeWidth={px} fill="none">
            <line x1={start.x} y1={start.y} x2={end.x} y2={end.y} />
            {[...new Set(guide.marks.map((m) => Math.round(m * 2) / 2))].map((m) => {
              const p = at(m);
              return (
                <path
                  key={m}
                  d={`M${p.x - mark} ${p.y - mark}L${p.x + mark} ${p.y + mark}M${p.x + mark} ${p.y - mark}L${p.x - mark} ${p.y + mark}`}
                />
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}
