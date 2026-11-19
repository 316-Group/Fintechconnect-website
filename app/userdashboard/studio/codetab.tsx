'use client';

import React, { useMemo, useState } from 'react';
import { Check, ChevronDown, Copy, Download } from 'lucide-react';
import { moduleFor, type ModuleId } from './phone-cards';
import { EDITABLE_SCHEMA } from './editable-schema';

/* ─────────────────────────── Inputs ─────────────────────────── */

/** The parts of a studio object box that the code generators read. */
export type CodeBox = {
  x?: number; y?: number; w?: number; h?: number;
  frameId?: string;
  name?: string;
  text?: string;
  textColor?: string;
  fontSize?: number | string;
  fontWeight?: number | string;
  opacity?: number;
  padding?: { top: number; right: number; bottom: number; left: number };
  cornerRadius?: { topLeft: number; topRight: number; bottomRight: number; bottomLeft: number };
  shapeType?: string;
  strokeWidth?: number;
  strokeColor?: string;
  fillType?: string;
  fillColor?: string;
  fillGradient?: { type: string; startColor: string; endColor: string; angle: number };
  imageFill?: { name?: string; visible?: boolean };
  assetName?: string;
};

/** One object in the phone: `type` is its canvas type, or null for a library component. */
export type CodeSource = { id: string; type: string | null; box: CodeBox };

type Overrides = Record<string, { text: Record<string, string>; colors: Record<string, string> }>;

/* ─────────────────────────── Model ─────────────────────────── */

type Rgba = { r: number; g: number; b: number; a: number };
type Paint =
  | { kind: 'color'; color: Rgba }
  | { kind: 'gradient'; from: Rgba; to: Rgba; angle: number; radial: boolean };
type Kind =
  | 'component' | 'frame' | 'text' | 'rect' | 'ellipse' | 'image'
  | 'line' | 'arrow' | 'star' | 'triangle' | 'path' | 'element';
type Prop = {
  key: string;
  kind: 'text' | 'color';
  value: string;
  color?: Rgba;
  role: 'title' | 'value' | 'body';
};
type CodeNode = {
  id: string;
  kind: Kind;
  name: string;
  /** Type/function name for components and frames, which get their own definitions. */
  ident: string;
  x: number; y: number; w?: number; h?: number;
  fill?: Paint;
  stroke?: { color: Rgba; width: number };
  radius: number;
  opacity: number;
  padding?: { top: number; right: number; bottom: number; left: number };
  text?: string;
  textColor?: Rgba;
  fontSize?: number;
  fontWeight?: number;
  asset?: string;
  props: Prop[];
  /** Key of the colour prop used as the component background. */
  bgProp?: string;
  /** Text colour that reads on the component background. */
  onColor?: Rgba;
  children: CodeNode[];
};

const KIND_FOR_TYPE: Record<string, Kind> = {
  frame: 'frame', 'shape-text': 'text', 'shape-rect': 'rect', 'shape-circle': 'ellipse',
  asset: 'image', 'shape-line': 'line', 'shape-arrow': 'arrow', 'shape-star': 'star',
  'shape-triangle': 'triangle', 'shape-scribble': 'path', element: 'element',
};

function parseColor(value: string | undefined): Rgba | null {
  if (!value) return null;
  const v = value.trim().toLowerCase();
  if (v === 'transparent') return { r: 0, g: 0, b: 0, a: 0 };
  if (v === 'white') return { r: 255, g: 255, b: 255, a: 1 };
  if (v === 'black') return { r: 0, g: 0, b: 0, a: 1 };
  const hex = v.match(/^#([0-9a-f]{3,8})$/)?.[1];
  if (hex) {
    const full = hex.length <= 4 ? hex.split('').map((c) => c + c).join('') : hex;
    return {
      r: parseInt(full.slice(0, 2), 16),
      g: parseInt(full.slice(2, 4), 16),
      b: parseInt(full.slice(4, 6), 16),
      a: full.length === 8 ? parseInt(full.slice(6, 8), 16) / 255 : 1,
    };
  }
  const rgb = v.match(/^rgba?\(([^)]+)\)$/)?.[1];
  if (rgb) {
    const [r, g, b, a] = rgb.split(/[,\s/]+/).filter(Boolean).map(Number);
    if ([r, g, b].some((n) => Number.isNaN(n))) return null;
    return { r, g, b, a: a === undefined || Number.isNaN(a) ? 1 : a };
  }
  return null;
}

const luminance = ({ r, g, b }: Rgba) => (0.299 * r + 0.587 * g + 0.114 * b) / 255;
const WHITE: Rgba = { r: 255, g: 255, b: 255, a: 1 };
const INK: Rgba = { r: 15, g: 23, b: 42, a: 1 };

function paintFor(box: CodeBox): Paint | undefined {
  if (box.fillType === 'none') return undefined;
  if (box.fillGradient) {
    const from = parseColor(box.fillGradient.startColor);
    const to = parseColor(box.fillGradient.endColor);
    if (from && to) {
      return { kind: 'gradient', from, to, angle: box.fillGradient.angle ?? 180, radial: box.fillGradient.type === 'Radial' };
    }
  }
  const color = parseColor(box.fillColor);
  return color && color.a > 0 ? { kind: 'color', color } : undefined;
}

const firstColor = (paint: Paint | undefined) =>
  paint?.kind === 'color' ? paint.color : paint?.kind === 'gradient' ? paint.from : undefined;

function radiusFor(box: CodeBox): number {
  const w = box.w ?? 0;
  const h = box.h ?? 0;
  if (box.shapeType === 'pill') return Math.min(w, h) / 2;
  if (box.shapeType === 'squircle') return Math.min(w, h) * 0.28;
  if (box.shapeType === 'sharp') return 0;
  const c = box.cornerRadius;
  return c ? Math.max(c.topLeft, c.topRight, c.bottomRight, c.bottomLeft) : 0;
}

const toNumber = (value: number | string | undefined) => {
  if (value === undefined) return undefined;
  if (value === 'bold') return 700;
  if (value === 'normal') return 400;
  const n = parseFloat(String(value));
  return Number.isNaN(n) ? undefined : n;
};

function pascal(name: string, fallback: string) {
  const words = name.replace(/^[^A-Za-z]+/, '').split(/[^A-Za-z0-9]+/).filter(Boolean);
  const out = words.map((w) => w[0].toUpperCase() + w.slice(1)).join('');
  return out || fallback;
}

const camel = (name: string) => {
  const p = pascal(name, 'value');
  return p[0].toLowerCase() + p.slice(1);
};

function buildTree(sources: CodeSource[], overrides: Overrides): CodeNode[] {
  const used = new Set<string>();
  const uniqueIdent = (base: string) => {
    let ident = base;
    for (let i = 2; used.has(ident); i++) ident = `${base}${i}`;
    used.add(ident);
    return ident;
  };

  const nodes = new Map<string, CodeNode>();
  const parents = new Map<string, string>();
  const boxes = new Map(sources.map((s) => [s.id, s.box]));

  for (const { id, type, box } of sources) {
    const kind: Kind | undefined = type ? KIND_FOR_TYPE[type] : 'component';
    if (!kind) continue;
    const node: CodeNode = {
      id, kind, name: box.name ?? id, ident: '',
      x: box.x ?? 0, y: box.y ?? 0, w: box.w, h: box.h,
      fill: paintFor(box),
      radius: radiusFor(box),
      opacity: box.opacity === undefined ? 1 : box.opacity / 100,
      padding: box.padding,
      props: [],
      children: [],
    };
    const strokeColor = parseColor(box.strokeColor);
    if (box.strokeWidth && strokeColor) node.stroke = { color: strokeColor, width: box.strokeWidth };

    if (kind === 'component') {
      const mod = moduleFor(id as ModuleId);
      if (!mod) continue;
      node.name = mod.title;
      node.ident = uniqueIdent(`${pascal(mod.title, 'Custom')}Component`);
      const schema = EDITABLE_SCHEMA[id as ModuleId];
      const over = overrides[id];
      const keys = new Set<string>();
      const keyFor = (slot: string, suffix: string) => {
        let key = camel(slot);
        if (keys.has(key)) key += suffix;
        keys.add(key);
        return key;
      };
      schema?.text?.forEach((slot, index) => {
        const value = over?.text[slot.slot] ?? slot.defaultValue;
        const role = /balance|value|amount/i.test(`${slot.slot} ${slot.label}`) ? 'value' : index === 0 ? 'title' : 'body';
        node.props.push({ key: keyFor(slot.slot, 'Text'), kind: 'text', value, role });
      });
      schema?.colors?.forEach((slot) => {
        const value = over?.colors[slot.slot] ?? slot.defaultValue;
        const color = parseColor(value);
        if (!color) return;
        const key = keyFor(slot.slot, 'Color');
        node.props.push({ key, kind: 'color', value, color, role: 'body' });
        if (slot.slot === 'bg' && !node.fill) node.bgProp = key;
      });
      const bg = firstColor(node.fill) ?? node.props.find((p) => p.key === node.bgProp)?.color;
      if (bg && !node.radius) node.radius = 24;
      if (bg && !node.padding) node.padding = { top: 20, right: 20, bottom: 20, left: 20 };
      node.onColor = bg && bg.a > 0.3 && luminance(bg) < 0.55 ? WHITE : INK;
    } else if (kind === 'frame') {
      node.ident = uniqueIdent(pascal(node.name, 'Frame'));
    } else if (kind === 'text') {
      node.text = box.text ?? '';
      node.textColor = parseColor(box.textColor) ?? INK;
      node.fontSize = toNumber(box.fontSize) ?? 16;
      node.fontWeight = toNumber(box.fontWeight) ?? 400;
      node.fill = undefined;
    } else if (kind === 'image') {
      node.asset = (box.assetName ?? 'image').replace(/\.[a-z0-9]+$/i, '').replace(/[^A-Za-z0-9_]+/g, '_').toLowerCase() || 'image';
    }
    nodes.set(id, node);
    if (box.frameId && box.frameId !== id && boxes.has(box.frameId)) parents.set(id, box.frameId);
  }

  const roots: CodeNode[] = [];
  for (const { id } of sources) {
    const node = nodes.get(id);
    if (!node) continue;
    const parent = nodes.get(parents.get(id) ?? '');
    if (parent) {
      node.x -= parent.x;
      node.y -= parent.y;
      parent.children.push(node);
    } else {
      roots.push(node);
    }
  }
  return roots;
}

/** Components and frames, which each get their own definition, in tree order. */
function definitions(nodes: CodeNode[]): CodeNode[] {
  const out: CodeNode[] = [];
  const walk = (list: CodeNode[]) => list.forEach((n) => {
    if (n.kind === 'component' || n.kind === 'frame') out.push(n);
    walk(n.children);
  });
  walk(nodes);
  return out;
}

/* ─────────────────────────── Formatting helpers ─────────────────────────── */

const fmt = (n: number) => String(Math.round(n * 100) / 100);
const indent = (lines: string[], by = 4) => lines.map((l) => (l ? ' '.repeat(by) + l : l));
const hex6 = ({ r, g, b }: Rgba) =>
  [r, g, b].map((c) => Math.round(c).toString(16).padStart(2, '0')).join('').toUpperCase();
const argb = (c: Rgba) => `0x${Math.round(c.a * 255).toString(16).padStart(2, '0').toUpperCase()}${hex6(c)}`;
const cssColor = (c: Rgba) => (c.a >= 1 ? `#${hex6(c)}` : `rgba(${c.r}, ${c.g}, ${c.b}, ${fmt(c.a)})`);
const quoted = (s: string, q: '"' | "'", dollar = false) => {
  let out = s.replace(/\\/g, '\\\\').replace(/\n/g, '\\n');
  out = out.split(q).join(`\\${q}`);
  if (dollar) out = out.replace(/\$/g, '\\$');
  return `${q}${out}${q}`;
};

/** Unit start/end points for a CSS gradient angle (0deg points up). */
function gradientPoints(angle: number) {
  const rad = (angle * Math.PI) / 180;
  const dx = Math.sin(rad) / 2;
  const dy = -Math.cos(rad) / 2;
  return {
    start: { x: Math.round((0.5 - dx) * 100) / 100, y: Math.round((0.5 - dy) * 100) / 100 },
    end: { x: Math.round((0.5 + dx) * 100) / 100, y: Math.round((0.5 + dy) * 100) / 100 },
  };
}

const textSize = (role: Prop['role']) => (role === 'value' ? 28 : role === 'title' ? 13 : 15);
const textWeight = (role: Prop['role']) => (role === 'value' ? 700 : role === 'title' ? 400 : 500);

/* ─────────────────────────── SwiftUI ─────────────────────────── */

const swiftColor = (c: Rgba) => {
  const ch = (v: number) => fmt(v / 255);
  return `Color(red: ${ch(c.r)}, green: ${ch(c.g)}, blue: ${ch(c.b)}${c.a < 1 ? `, opacity: ${fmt(c.a)}` : ''})`;
};
const swiftPaint = (p: Paint) => {
  if (p.kind === 'color') return swiftColor(p.color);
  if (p.radial) return `RadialGradient(colors: [${swiftColor(p.from)}, ${swiftColor(p.to)}], center: .center, startRadius: 0, endRadius: 200)`;
  const { start, end } = gradientPoints(p.angle);
  return `LinearGradient(colors: [${swiftColor(p.from)}, ${swiftColor(p.to)}], startPoint: UnitPoint(x: ${start.x}, y: ${start.y}), endPoint: UnitPoint(x: ${end.x}, y: ${end.y}))`;
};
const swiftWeight = (w: number) =>
  w >= 800 ? 'heavy' : w >= 700 ? 'bold' : w >= 600 ? 'semibold' : w >= 500 ? 'medium' : w <= 300 ? 'light' : 'regular';
const swiftFrame = (n: CodeNode) =>
  n.w !== undefined && n.h !== undefined ? [`.frame(width: ${fmt(n.w)}, height: ${fmt(n.h)})`] : [];

function swiftShape(n: CodeNode, shape: string): string[] {
  return [
    shape,
    n.fill ? `.fill(${swiftPaint(n.fill)})` : '.fill(Color.clear)',
    ...(n.stroke ? [`.overlay(${shape}.stroke(${swiftColor(n.stroke.color)}, lineWidth: ${fmt(n.stroke.width)}))`] : []),
    ...swiftFrame(n),
  ];
}

function swiftExpr(n: CodeNode, child = false): string[] {
  let lines: string[];
  const rounded = `RoundedRectangle(cornerRadius: ${fmt(n.radius)})`;
  const symbol = (name: string) => [
    `Image(systemName: "${name}")`, '.resizable()', '.scaledToFit()',
    `.foregroundStyle(${n.fill ? swiftPaint(n.fill) : swiftColor(n.stroke?.color ?? INK)})`,
    ...swiftFrame(n),
  ];
  switch (n.kind) {
    case 'component':
    case 'frame':
      lines = [`${n.ident}()`];
      break;
    case 'text':
      lines = [
        `Text(${quoted(n.text ?? '', '"')})`,
        `.font(.system(size: ${fmt(n.fontSize ?? 16)}, weight: .${swiftWeight(n.fontWeight ?? 400)}))`,
        `.foregroundStyle(${swiftColor(n.textColor ?? INK)})`,
      ];
      break;
    case 'rect':
    case 'element':
      lines = [...(n.kind === 'element' ? ['// Copied layer'] : []), ...swiftShape(n, rounded)];
      break;
    case 'ellipse':
      lines = swiftShape(n, 'Ellipse()');
      break;
    case 'image':
      lines = [`Image("${n.asset}")`, '.resizable()', '.scaledToFill()', ...swiftFrame(n), `.clipShape(${rounded})`];
      break;
    case 'line':
      lines = ['Rectangle()', `.fill(${swiftColor(n.stroke?.color ?? INK)})`, `.frame(width: ${fmt(n.w ?? 0)}, height: ${fmt(n.stroke?.width ?? 1)})`];
      break;
    case 'arrow':
      lines = symbol('arrow.right');
      break;
    case 'star':
      lines = symbol('star.fill');
      break;
    case 'triangle':
      lines = symbol('triangle.fill');
      break;
    case 'path':
      lines = ['// Freehand path: export it as an SVG asset', 'Rectangle()', '.fill(Color.clear)', ...swiftFrame(n)];
      break;
  }
  if (n.opacity < 1) lines.push(`.opacity(${fmt(n.opacity)})`);
  if (n.children.length && n.kind !== 'component' && n.kind !== 'frame') {
    lines = [
      'ZStack(alignment: .topLeading) {',
      ...indent(lines),
      ...n.children.flatMap((c) => indent(swiftExpr(c, true))),
      '}',
    ];
  }
  if (child) lines.push(`.offset(x: ${fmt(n.x)}, y: ${fmt(n.y)})`);
  return lines;
}

function swiftDefinition(n: CodeNode): string[] {
  if (n.kind === 'component') {
    const bg = n.fill ? swiftPaint(n.fill) : n.bgProp;
    const on = swiftColor(n.onColor ?? INK);
    const texts = n.props.filter((p) => p.kind === 'text');
    const body = [
      'VStack(alignment: .leading, spacing: 8) {',
      ...indent(texts.flatMap((p) => [
        `Text(${p.key})`,
        `    .font(.system(size: ${textSize(p.role)}, weight: .${swiftWeight(textWeight(p.role))}))`,
        `    .foregroundStyle(${on}${p.role === 'title' ? '.opacity(0.8)' : ''})`,
      ])),
      ...(texts.length ? [] : ['    // Add content']),
      '}',
      ...(n.padding ? [`.padding(EdgeInsets(top: ${n.padding.top}, leading: ${n.padding.left}, bottom: ${n.padding.bottom}, trailing: ${n.padding.right}))`] : []),
      '.frame(maxWidth: .infinity, alignment: .leading)',
      ...(bg ? [`.background(${bg})`] : []),
      ...(n.radius ? [`.clipShape(RoundedRectangle(cornerRadius: ${fmt(n.radius)}))`] : []),
    ];
    return [
      `struct ${n.ident}: View {`,
      ...n.props.map((p) => (p.kind === 'text'
        ? `    var ${p.key}: String = ${quoted(p.value, '"')}`
        : `    var ${p.key}: Color = ${swiftColor(p.color!)}`)),
      '',
      '    var body: some View {',
      ...indent(body, 8),
      '    }',
      '}',
    ];
  }
  const rounded = `RoundedRectangle(cornerRadius: ${fmt(n.radius)})`;
  return [
    `struct ${n.ident}: View {`,
    '    var body: some View {',
    ...indent([
      ...(n.children.length
        ? ['ZStack(alignment: .topLeading) {', ...n.children.flatMap((c) => indent(swiftExpr(c, true))), '}']
        : ['Color.clear']),
      `.frame(width: ${fmt(n.w ?? 0)}, height: ${fmt(n.h ?? 0)}, alignment: .topLeading)`,
      ...(n.fill ? [`.background(${swiftPaint(n.fill)})`] : []),
      ...(n.radius ? [`.clipShape(${rounded})`] : []),
      ...(n.stroke ? [`.overlay(${rounded}.stroke(${swiftColor(n.stroke.color)}, lineWidth: ${fmt(n.stroke.width)}))`] : []),
      ...(n.opacity < 1 ? [`.opacity(${fmt(n.opacity)})`] : []),
    ], 8),
    '    }',
    '}',
  ];
}

function generateSwift(roots: CodeNode[], ident: string, screen: boolean): string {
  const defs = definitions(roots);
  const out = ['import SwiftUI', ''];
  if (screen) {
    out.push(
      `struct ${ident}: View {`,
      '    var body: some View {',
      '        ScrollView {',
      '            VStack(alignment: .leading, spacing: 16) {',
      ...indent(roots.length ? roots.flatMap((n) => swiftExpr(n)) : ['// Drag components into the phone to generate code'], 16),
      '            }',
      '            .padding(16)',
      '        }',
      '    }',
      '}',
      '',
    );
  }
  defs.forEach((d) => out.push(...swiftDefinition(d), ''));
  out.push('#Preview {', `    ${ident}()`, '}');
  return out.join('\n');
}

/* ─────────────────────────── React Native ─────────────────────────── */

type StyleValue = string | number | Record<string, number>[];
type StyleMap = Map<string, Record<string, StyleValue>>;

function rnStyleName(styles: StyleMap, base: string, style: Record<string, StyleValue>) {
  let name = base;
  for (let i = 2; styles.has(name); i++) name = `${base}${i}`;
  styles.set(name, style);
  return name;
}

function rnBoxStyle(n: CodeNode, child: boolean): Record<string, StyleValue> {
  const s: Record<string, StyleValue> = {};
  if (child) Object.assign(s, { position: 'absolute', left: n.x, top: n.y });
  if (n.w !== undefined) s.width = n.w;
  if (n.h !== undefined) s.height = n.h;
  if (n.fill?.kind === 'color') s.backgroundColor = cssColor(n.fill.color);
  if (n.radius) s.borderRadius = Math.round(n.radius * 100) / 100;
  if (n.kind === 'ellipse') s.borderRadius = 9999;
  if (n.stroke) Object.assign(s, { borderWidth: n.stroke.width, borderColor: cssColor(n.stroke.color) });
  if (n.opacity < 1) s.opacity = Math.round(n.opacity * 100) / 100;
  return s;
}

function rnGradient(p: Extract<Paint, { kind: 'gradient' }>, style: string, inner: string[]): string[] {
  const { start, end } = gradientPoints(p.angle);
  return [
    '<LinearGradient',
    `  colors={['${cssColor(p.from)}', '${cssColor(p.to)}']}`,
    `  start={{ x: ${start.x}, y: ${start.y} }}`,
    `  end={{ x: ${end.x}, y: ${end.y} }}`,
    `  style={styles.${style}}`,
    ...(inner.length ? ['>', ...indent(inner, 2), '</LinearGradient>'] : ['/>']),
  ];
}

function rnExpr(n: CodeNode, styles: StyleMap, child = false): string[] {
  const base = camel(n.kind === 'text' ? 'text' : n.kind);
  const kids = n.children.flatMap((c) => rnExpr(c, styles, true));
  if (n.kind === 'component' || n.kind === 'frame') {
    if (!child) return [`<${n.ident} />`];
    const pos = rnStyleName(styles, `${camel(n.ident)}Position`, { position: 'absolute', left: n.x, top: n.y });
    return [`<View style={styles.${pos}}>`, `  <${n.ident} />`, '</View>'];
  }
  if (n.kind === 'text') {
    const style = rnStyleName(styles, base, {
      ...(child ? { position: 'absolute', left: n.x, top: n.y } : {}),
      fontSize: n.fontSize ?? 16,
      fontWeight: String(n.fontWeight ?? 400),
      color: cssColor(n.textColor ?? INK),
      ...(n.opacity < 1 ? { opacity: Math.round(n.opacity * 100) / 100 } : {}),
    });
    return [`<Text style={styles.${style}}>${(n.text ?? '').replace(/[{}<>]/g, (c) => `{'${c}'}`)}</Text>`];
  }
  const style = rnStyleName(styles, base, rnBoxStyle(n, child));
  if (n.kind === 'image') {
    return [`<Image source={require('./assets/${n.asset}.png')} style={styles.${style}} resizeMode="cover" />`];
  }
  if (n.kind === 'line') {
    styles.set(style, { ...rnBoxStyle(n, child), height: n.stroke?.width ?? 1, backgroundColor: cssColor(n.stroke?.color ?? INK), borderWidth: 0 });
  }
  const glyph = { star: '★', triangle: '▲', arrow: '→' }[n.kind as 'star' | 'triangle' | 'arrow'];
  const inner = [
    ...(n.kind === 'path' ? ['{/* Freehand path: draw it with react-native-svg */}'] : []),
    ...(n.kind === 'element' ? ['{/* Copied layer */}'] : []),
    ...(glyph ? [`<Text style={{ fontSize: ${fmt(Math.min(n.w ?? 24, n.h ?? 24))}, color: '${cssColor(firstColor(n.fill) ?? INK)}' }}>${glyph}</Text>`] : []),
    ...kids,
  ];
  if (n.fill?.kind === 'gradient') return rnGradient(n.fill, style, inner);
  if (glyph) styles.get(style)!.backgroundColor = 'transparent';
  return inner.length ? [`<View style={styles.${style}}>`, ...indent(inner, 2), '</View>'] : [`<View style={styles.${style}} />`];
}

function rnDefinition(n: CodeNode, styles: StyleMap): string[] {
  const name = camel(n.ident);
  if (n.kind === 'component') {
    const on = cssColor(n.onColor ?? INK);
    const container: Record<string, StyleValue> = { alignSelf: 'stretch', gap: 8 };
    if (n.padding) Object.assign(container, { paddingTop: n.padding.top, paddingRight: n.padding.right, paddingBottom: n.padding.bottom, paddingLeft: n.padding.left });
    if (n.radius) container.borderRadius = Math.round(n.radius * 100) / 100;
    if (n.fill?.kind === 'color') container.backgroundColor = cssColor(n.fill.color);
    styles.set(name, container);
    const texts = n.props.filter((p) => p.kind === 'text');
    const inner = texts.map((p) => {
      const s = rnStyleName(styles, `${name}${p.key[0].toUpperCase()}${p.key.slice(1)}`, {
        fontSize: textSize(p.role), fontWeight: String(textWeight(p.role)), color: on,
        ...(p.role === 'title' ? { opacity: 0.8 } : {}),
      });
      return `<Text style={styles.${s}}>{${p.key}}</Text>`;
    });
    const bgStyle = n.bgProp ? `[styles.${name}, { backgroundColor: ${n.bgProp} }]` : `styles.${name}`;
    const typeName = `${n.ident}Props`;
    const body = n.fill?.kind === 'gradient'
      ? rnGradient(n.fill, name, inner)
      : [`<View style={${bgStyle}}>`, ...indent(inner, 2), '</View>'];
    return [
      `type ${typeName} = {`,
      ...n.props.map((p) => `  ${p.key}?: string;`),
      '};',
      '',
      `export function ${n.ident}({`,
      ...n.props.map((p) => `  ${p.key} = ${quoted(p.value, "'")},`),
      `}: ${typeName}) {`,
      '  return (',
      ...indent(body, 4),
      '  );',
      '}',
    ];
  }
  const frame = { ...rnBoxStyle(n, false), overflow: 'hidden' } as Record<string, StyleValue>;
  styles.set(name, frame);
  const kids = n.children.flatMap((c) => rnExpr(c, styles, true));
  const body = n.fill?.kind === 'gradient'
    ? rnGradient(n.fill, name, kids)
    : kids.length ? [`<View style={styles.${name}}>`, ...indent(kids, 2), '</View>'] : [`<View style={styles.${name}} />`];
  return [`export function ${n.ident}() {`, '  return (', ...indent(body, 4), '  );', '}'];
}

function rnStyleValue(v: StyleValue): string {
  return typeof v === 'number' ? fmt(v) : typeof v === 'string' ? `'${v}'` : JSON.stringify(v);
}

function generateReactNative(roots: CodeNode[], ident: string, screen: boolean): string {
  const styles: StyleMap = new Map();
  const defs = definitions(roots);
  const body: string[] = [];
  if (screen) {
    styles.set('screen', { flex: 1, backgroundColor: '#FFFFFF' });
    styles.set('content', { padding: 16, gap: 16 });
    body.push(
      `export default function ${ident}() {`,
      '  return (',
      '    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>',
      ...indent(roots.length ? roots.flatMap((n) => rnExpr(n, styles)) : ['{/* Drag components into the phone to generate code */}'], 6),
      '    </ScrollView>',
      '  );',
      '}',
      '',
    );
  }
  defs.forEach((d) => body.push(...rnDefinition(d, styles), ''));
  if (!screen && defs[0]) {
    body.push(`export default ${ident};`, '');
  }
  body.push(
    'const styles = StyleSheet.create({',
    ...[...styles].flatMap(([name, s]) => [
      `  ${name}: {`,
      ...Object.entries(s).map(([k, v]) => `    ${k}: ${rnStyleValue(v)},`),
      '  },',
    ]),
    '});',
  );
  const code = body.join('\n');
  const rn = ['View', 'Text', 'Image', 'ScrollView', 'StyleSheet'].filter((t) => t === 'StyleSheet' || code.includes(`<${t}`));
  const imports = [
    "import React from 'react';",
    `import { ${rn.join(', ')} } from 'react-native';`,
    ...(code.includes('<LinearGradient') ? ["import { LinearGradient } from 'expo-linear-gradient';"] : []),
  ];
  return `${imports.join('\n')}\n\n${code}`;
}

/* ─────────────────────────── Jetpack Compose (Kotlin) ─────────────────────────── */

const ktColor = (c: Rgba) => `Color(${argb(c)})`;
const ktPaint = (p: Paint) => {
  if (p.kind === 'color') return ktColor(p.color);
  const colors = `listOf(${ktColor(p.from)}, ${ktColor(p.to)})`;
  if (p.radial) return `Brush.radialGradient(${colors})`;
  const a = ((p.angle % 360) + 360) % 360;
  if (a === 180 || a === 0) return `Brush.verticalGradient(${a === 0 ? `listOf(${ktColor(p.to)}, ${ktColor(p.from)})` : colors})`;
  if (a === 90 || a === 270) return `Brush.horizontalGradient(${a === 270 ? `listOf(${ktColor(p.to)}, ${ktColor(p.from)})` : colors})`;
  return `Brush.linearGradient(${colors})`;
};
const ktShape = (n: CodeNode) => (n.kind === 'ellipse' ? 'CircleShape' : `RoundedCornerShape(${fmt(n.radius)}.dp)`);
const ktModifier = (calls: string[]) =>
  calls.length === 0 ? 'Modifier' : calls.length === 1 ? `Modifier.${calls[0]}` : ['Modifier', ...calls.map((c) => `    .${c}`)].join('\n');

function ktBoxCalls(n: CodeNode, child: boolean): string[] {
  const calls: string[] = [];
  if (child) calls.push(`offset(x = ${fmt(n.x)}.dp, y = ${fmt(n.y)}.dp)`);
  if (n.w !== undefined && n.h !== undefined) calls.push(`size(width = ${fmt(n.w)}.dp, height = ${fmt(n.h)}.dp)`);
  if (n.radius || n.kind === 'ellipse') calls.push(`clip(${ktShape(n)})`);
  if (n.fill) calls.push(`background(${ktPaint(n.fill)})`);
  if (n.stroke) calls.push(`border(${fmt(n.stroke.width)}.dp, ${ktColor(n.stroke.color)}, ${ktShape(n)})`);
  if (n.opacity < 1) calls.push(`alpha(${fmt(n.opacity)}f)`);
  return calls;
}

/** `name(args)` with the modifier as a named argument, split over lines when it is long. */
function ktCall(name: string, args: string[], modifierCalls: string[], content?: string[]): string[] {
  const modifier = ktModifier(modifierCalls);
  const all = [...args, ...(modifierCalls.length ? [`modifier = ${modifier}`] : [])];
  const head = all.join(', ');
  const open = content ? ' {' : '';
  const lines = head.length <= 60 && !head.includes('\n')
    ? [`${name}(${head})${open}`]
    : [`${name}(`, ...indent(all.join(',\n').split('\n')), `)${open}`];
  return content ? [...lines, ...indent(content), '}'] : lines;
}

const ktWeight = (w: number) => `FontWeight.W${Math.min(900, Math.max(100, Math.round(w / 100) * 100))}`;

function ktExpr(n: CodeNode, child = false): string[] {
  const kids = n.children.flatMap((c) => ktExpr(c, true));
  switch (n.kind) {
    case 'component':
    case 'frame':
      return child ? [`Box(modifier = Modifier.offset(x = ${fmt(n.x)}.dp, y = ${fmt(n.y)}.dp)) {`, `    ${n.ident}()`, '}'] : [`${n.ident}()`];
    case 'text':
      return ktCall('Text', [
        `text = ${quoted(n.text ?? '', '"', true)}`,
        `color = ${ktColor(n.textColor ?? INK)}`,
        `fontSize = ${fmt(n.fontSize ?? 16)}.sp`,
        `fontWeight = ${ktWeight(n.fontWeight ?? 400)}`,
      ], [...(child ? [`offset(x = ${fmt(n.x)}.dp, y = ${fmt(n.y)}.dp)`] : []), ...(n.opacity < 1 ? [`alpha(${fmt(n.opacity)}f)`] : [])]);
    case 'image':
      return ktCall('Image', [
        `painter = painterResource(R.drawable.${n.asset})`,
        `contentDescription = ${quoted(n.name, '"', true)}`,
        'contentScale = ContentScale.Crop',
      ], ktBoxCalls({ ...n, fill: undefined }, child));
    case 'star':
    case 'arrow':
      return ktCall('Icon', [
        `imageVector = ${n.kind === 'star' ? 'Icons.Filled.Star' : 'Icons.AutoMirrored.Filled.ArrowForward'}`,
        'contentDescription = null',
        `tint = ${ktColor(firstColor(n.fill) ?? n.stroke?.color ?? INK)}`,
      ], [...(child ? [`offset(x = ${fmt(n.x)}.dp, y = ${fmt(n.y)}.dp)`] : []), `size(width = ${fmt(n.w ?? 24)}.dp, height = ${fmt(n.h ?? 24)}.dp)`]);
    case 'line':
      return ktCall('Box', [], [
        ...(child ? [`offset(x = ${fmt(n.x)}.dp, y = ${fmt(n.y)}.dp)`] : []),
        `size(width = ${fmt(n.w ?? 0)}.dp, height = ${fmt(n.stroke?.width ?? 1)}.dp)`,
        `background(${ktColor(n.stroke?.color ?? INK)})`,
      ]);
    default: {
      const note = { triangle: '// Triangle: draw it with a GenericShape', path: '// Freehand path: import it as a vector drawable', element: '// Copied layer' }[n.kind as 'triangle' | 'path' | 'element'];
      return [...(note ? [note] : []), ...ktCall('Box', [], ktBoxCalls(n, child), kids.length ? kids : undefined)];
    }
  }
}

function ktDefinition(n: CodeNode): string[] {
  if (n.kind === 'component') {
    const on = ktColor(n.onColor ?? INK);
    const texts = n.props.filter((p) => p.kind === 'text');
    const calls = ['fillMaxWidth()'];
    if (n.radius) calls.push(`clip(RoundedCornerShape(${fmt(n.radius)}.dp))`);
    if (n.fill) calls.push(`background(${ktPaint(n.fill)})`);
    else if (n.bgProp) calls.push(`background(${n.bgProp})`);
    if (n.padding) calls.push(`padding(start = ${n.padding.left}.dp, top = ${n.padding.top}.dp, end = ${n.padding.right}.dp, bottom = ${n.padding.bottom}.dp)`);
    const params = n.props.map((p) => (p.kind === 'text'
      ? `${p.key}: String = ${quoted(p.value, '"', true)}`
      : `${p.key}: Color = ${ktColor(p.color!)}`));
    return [
      '@Composable',
      ...(params.length ? [`fun ${n.ident}(`, ...indent(params.map((p, i) => (i < params.length - 1 ? `${p},` : p))), ') {'] : [`fun ${n.ident}() {`]),
      ...indent([
        'Column(',
        `    modifier = ${ktModifier(calls).split('\n').join('\n        ')},`,
        '    verticalArrangement = Arrangement.spacedBy(8.dp)',
        ') {',
        ...indent(texts.map((p) => `Text(text = ${p.key}, color = ${on}${p.role === 'title' ? '.copy(alpha = 0.8f)' : ''}, fontSize = ${textSize(p.role)}.sp, fontWeight = ${ktWeight(textWeight(p.role))})`)),
        '}',
      ].join('\n').split('\n')),
      '}',
    ];
  }
  return [
    '@Composable',
    `fun ${n.ident}() {`,
    ...indent(ktCall('Box', [], ktBoxCalls(n, false), n.children.length ? n.children.flatMap((c) => ktExpr(c, true)) : undefined)),
    '}',
  ];
}

const KT_IMPORTS: [string, string][] = [
  ['androidx.compose.foundation.Image', 'Image('],
  ['androidx.compose.foundation.background', '.background('],
  ['androidx.compose.foundation.border', '.border('],
  ['androidx.compose.foundation.layout.*', ''],
  ['androidx.compose.foundation.rememberScrollState', 'rememberScrollState'],
  ['androidx.compose.foundation.shape.CircleShape', 'CircleShape'],
  ['androidx.compose.foundation.shape.RoundedCornerShape', 'RoundedCornerShape'],
  ['androidx.compose.foundation.verticalScroll', 'verticalScroll'],
  ['androidx.compose.material.icons.Icons', 'Icons.'],
  ['androidx.compose.material.icons.automirrored.filled.ArrowForward', 'ArrowForward'],
  ['androidx.compose.material.icons.filled.Star', 'Icons.Filled.Star'],
  ['androidx.compose.material3.Icon', 'Icon('],
  ['androidx.compose.material3.Text', 'Text('],
  ['androidx.compose.runtime.Composable', ''],
  ['androidx.compose.ui.Modifier', ''],
  ['androidx.compose.ui.draw.alpha', '.alpha('],
  ['androidx.compose.ui.draw.clip', '.clip('],
  ['androidx.compose.ui.graphics.Brush', 'Brush.'],
  ['androidx.compose.ui.graphics.Color', 'Color'],
  ['androidx.compose.ui.layout.ContentScale', 'ContentScale'],
  ['androidx.compose.ui.res.painterResource', 'painterResource'],
  ['androidx.compose.ui.text.font.FontWeight', 'FontWeight'],
  ['androidx.compose.ui.tooling.preview.Preview', ''],
  ['androidx.compose.ui.unit.dp', '.dp'],
  ['androidx.compose.ui.unit.sp', '.sp'],
];

function generateKotlin(roots: CodeNode[], ident: string, screen: boolean): string {
  const defs = definitions(roots);
  const body: string[] = [];
  if (screen) {
    body.push(
      '@Composable',
      `fun ${ident}() {`,
      '    Column(',
      '        modifier = Modifier',
      '            .fillMaxSize()',
      '            .verticalScroll(rememberScrollState())',
      '            .padding(16.dp),',
      '        verticalArrangement = Arrangement.spacedBy(16.dp)',
      '    ) {',
      ...indent(roots.length ? roots.flatMap((n) => ktExpr(n)) : ['// Drag components into the phone to generate code'], 8),
      '    }',
      '}',
      '',
    );
  }
  defs.forEach((d) => body.push(...ktDefinition(d), ''));
  body.push('@Preview(showBackground = true)', '@Composable', `private fun ${ident}Preview() {`, `    ${ident}()`, '}');
  const code = body.join('\n');
  const imports = KT_IMPORTS.filter(([, token]) => !token || code.includes(token)).map(([path]) => `import ${path}`);
  return ['package com.app.ui', '', ...imports, '', code].join('\n');
}

/* ─────────────────────────── Flutter (Dart) ─────────────────────────── */

const dartColor = (c: Rgba) => `Color(${argb(c)})`;
const dartPaint = (p: Paint) => {
  if (p.kind === 'color') return `color: ${dartColor(p.color)}`;
  const colors = `colors: [${dartColor(p.from)}, ${dartColor(p.to)}]`;
  if (p.radial) return `gradient: RadialGradient(${colors})`;
  const { start, end } = gradientPoints(p.angle);
  const align = (pt: { x: number; y: number }) => `Alignment(${fmt(pt.x * 2 - 1)}, ${fmt(pt.y * 2 - 1)})`;
  return `gradient: LinearGradient(begin: ${align(start)}, end: ${align(end)}, ${colors})`;
};
const dartWeight = (w: number) => `FontWeight.w${Math.min(900, Math.max(100, Math.round(w / 100) * 100))}`;

function dartDecoration(n: CodeNode, fillExpr?: string): string | null {
  const parts: string[] = [];
  if (fillExpr) parts.push(fillExpr);
  else if (n.fill) parts.push(dartPaint(n.fill));
  if (n.kind === 'ellipse') parts.push('shape: BoxShape.circle');
  else if (n.radius) parts.push(`borderRadius: BorderRadius.circular(${fmt(n.radius)})`);
  if (n.stroke) parts.push(`border: Border.all(color: ${dartColor(n.stroke.color)}, width: ${fmt(n.stroke.width)})`);
  return parts.length ? `BoxDecoration(${parts.join(', ')})` : null;
}

/** `Name(\n  arg: value,\n)` in Flutter's trailing-comma style. */
function dartCall(name: string, args: (string | string[])[]): string[] {
  if (!args.length) return [`${name}()`];
  const lines = [`${name}(`];
  for (const arg of args) {
    if (typeof arg === 'string') lines.push(`  ${arg},`);
    else lines.push(...indent([...arg.slice(0, -1), `${arg[arg.length - 1]},`], 2));
  }
  lines.push(')');
  return lines;
}

/** `label: expr`, keeping any leading comment lines above the label. */
const dartChild = (label: string, expr: string[]) => {
  const notes = expr.filter((line, i) => line.startsWith('//') && expr.slice(0, i).every((l) => l.startsWith('//')));
  const rest = expr.slice(notes.length);
  return [...notes, `${label}: ${rest[0]}`, ...rest.slice(1)];
};

function dartStack(n: CodeNode, base?: string[]): string[] {
  const items = [
    ...(base ? [base] : []),
    ...n.children.map((c) => dartCall('Positioned', [`left: ${fmt(c.x)}`, `top: ${fmt(c.y)}`, dartChild('child', dartExpr(c))])),
  ];
  if (!items.length) return ['const Stack()'];
  return dartCall('Stack', [['children: [', ...items.flatMap((e) => indent([...e.slice(0, -1), `${e[e.length - 1]},`], 2)), ']']]);
}

function dartExpr(n: CodeNode): string[] {
  let expr: string[];
  const size = [...(n.w !== undefined ? [`width: ${fmt(n.w)}`] : []), ...(n.h !== undefined ? [`height: ${fmt(n.h)}`] : [])];
  switch (n.kind) {
    case 'component':
    case 'frame':
      return [`const ${n.ident}()`];
    case 'text':
      expr = dartCall('Text', [
        quoted(n.text ?? '', "'", true),
        `style: TextStyle(fontSize: ${fmt(n.fontSize ?? 16)}, fontWeight: ${dartWeight(n.fontWeight ?? 400)}, color: ${dartColor(n.textColor ?? INK)})`,
      ]);
      break;
    case 'image':
      expr = dartCall('ClipRRect', [
        `borderRadius: BorderRadius.circular(${fmt(n.radius)})`,
        dartChild('child', dartCall('Image.asset', [`'assets/${n.asset}.png'`, ...size, 'fit: BoxFit.cover'])),
      ]);
      break;
    case 'star':
    case 'arrow':
      expr = dartCall('Icon', [
        n.kind === 'star' ? 'Icons.star' : 'Icons.arrow_forward',
        `size: ${fmt(Math.min(n.w ?? 24, n.h ?? 24))}`,
        `color: ${dartColor(firstColor(n.fill) ?? n.stroke?.color ?? INK)}`,
      ]);
      break;
    case 'line':
      expr = dartCall('Container', [`width: ${fmt(n.w ?? 0)}`, `height: ${fmt(n.stroke?.width ?? 1)}`, `color: ${dartColor(n.stroke?.color ?? INK)}`]);
      break;
    default: {
      const decoration = dartDecoration(n);
      const note = { triangle: '// Triangle: draw it with a CustomPainter', path: '// Freehand path: import it as an SVG asset', element: '// Copied layer' }[n.kind as 'triangle' | 'path' | 'element'];
      expr = [...(note ? [note] : []), ...dartCall('Container', [...size, ...(decoration ? [`decoration: ${decoration}`] : [])])];
    }
  }
  if (n.children.length) {
    expr = dartCall('SizedBox', [...size, dartChild('child', dartStack(n, expr))]);
  }
  if (n.opacity < 1) expr = dartCall('Opacity', [`opacity: ${fmt(n.opacity)}`, dartChild('child', expr)]);
  return expr;
}

function dartDefinition(n: CodeNode): string[] {
  let build: string[];
  let fields: string[] = [];
  let ctor = `const ${n.ident}({super.key});`;
  if (n.kind === 'component') {
    const on = dartColor(n.onColor ?? INK);
    const texts = n.props.filter((p) => p.kind === 'text');
    fields = n.props.map((p) => `final ${p.kind === 'text' ? 'String' : 'Color'} ${p.key};`);
    const params = n.props.map((p) => `this.${p.key} = ${p.kind === 'text' ? quoted(p.value, "'", true) : `const ${dartColor(p.color!)}`}`);
    ctor = params.length
      ? [`const ${n.ident}({`, '  super.key,', ...params.map((p) => `  ${p},`), '});'].join('\n')
      : ctor;
    const decoration = dartDecoration(n, n.fill ? undefined : n.bgProp ? `color: ${n.bgProp}` : undefined);
    const p = n.padding;
    build = dartCall('Container', [
      'width: double.infinity',
      ...(p ? [`padding: const EdgeInsets.fromLTRB(${p.left}, ${p.top}, ${p.right}, ${p.bottom})`] : []),
      ...(decoration ? [`decoration: ${decoration}`] : []),
      dartChild('child', dartCall('Column', [
        'crossAxisAlignment: CrossAxisAlignment.start',
        'spacing: 8',
        ['children: [', ...texts.map((t) => `  Text(${t.key}, style: TextStyle(fontSize: ${textSize(t.role)}, fontWeight: ${dartWeight(textWeight(t.role))}, color: ${t.role === 'title' ? `${on}.withValues(alpha: 0.8)` : on})),`), ']'],
      ])),
    ]);
  } else {
    const decoration = dartDecoration(n);
    build = dartCall('Container', [
      `width: ${fmt(n.w ?? 0)}`,
      `height: ${fmt(n.h ?? 0)}`,
      ...(decoration ? [`decoration: ${decoration}`] : []),
      'clipBehavior: Clip.antiAlias',
      dartChild('child', dartStack(n)),
    ]);
    if (n.opacity < 1) build = dartCall('Opacity', [`opacity: ${fmt(n.opacity)}`, dartChild('child', build)]);
  }
  return [
    `class ${n.ident} extends StatelessWidget {`,
    ...indent(ctor.split('\n'), 2),
    ...(fields.length ? ['', ...indent(fields, 2)] : []),
    '',
    '  @override',
    '  Widget build(BuildContext context) {',
    `    return ${build[0]}`,
    ...indent([...build.slice(1, -1), `${build[build.length - 1]};`], 4),
    '  }',
    '}',
  ];
}

function generateFlutter(roots: CodeNode[], ident: string, screen: boolean): string {
  const defs = definitions(roots);
  const out = ["import 'package:flutter/material.dart';", ''];
  if (screen) {
    const items = roots.length
      ? roots.flatMap((n) => { const e = dartExpr(n); return [...e.slice(0, -1), `${e[e.length - 1]},`]; })
      : ['// Drag components into the phone to generate code'];
    out.push(
      `class ${ident} extends StatelessWidget {`,
      `  const ${ident}({super.key});`,
      '',
      '  @override',
      '  Widget build(BuildContext context) {',
      '    return Scaffold(',
      '      body: SafeArea(',
      '        child: SingleChildScrollView(',
      '          padding: const EdgeInsets.all(16),',
      '          child: Column(',
      '            crossAxisAlignment: CrossAxisAlignment.start,',
      '            spacing: 16,',
      '            children: [',
      ...indent(items, 14),
      '            ],',
      '          ),',
      '        ),',
      '      ),',
      '    );',
      '  }',
      '}',
      '',
    );
  }
  defs.forEach((d) => out.push(...dartDefinition(d), ''));
  return out.join('\n').trimEnd() + '\n';
}

/* ─────────────────────────── Frameworks ─────────────────────────── */

type FrameworkId = 'swiftui' | 'react-native' | 'kotlin' | 'flutter';

const FRAMEWORKS: {
  id: FrameworkId;
  label: string;
  badge: string;
  framework: string;
  lang: 'swift' | 'tsx' | 'kotlin' | 'dart';
  file: (ident: string) => string;
  deps: (code: string) => string[];
  generate: (roots: CodeNode[], ident: string, screen: boolean) => string;
}[] = [
  {
    id: 'swiftui', label: 'SwiftUI', badge: 'iOS 17+', framework: 'SwiftUI 5.0 (iOS 17+)', lang: 'swift',
    file: (i) => `${i}.swift`,
    deps: () => ['SwiftUI'],
    generate: generateSwift,
  },
  {
    id: 'react-native', label: 'React Native', badge: 'RN 0.76', framework: 'React Native 0.76 (TypeScript)', lang: 'tsx',
    file: (i) => `${i}.tsx`,
    deps: (code) => ['react-native 0.76', ...(code.includes('expo-linear-gradient') ? ['expo-linear-gradient'] : [])],
    generate: generateReactNative,
  },
  {
    id: 'kotlin', label: 'Kotlin', badge: 'API 26+', framework: 'Jetpack Compose (Kotlin 2.0)', lang: 'kotlin',
    file: (i) => `${i}.kt`,
    deps: (code) => ['compose-material3', ...(code.includes('Icons.') ? ['material-icons-extended'] : [])],
    generate: generateKotlin,
  },
  {
    id: 'flutter', label: 'Flutter', badge: 'Flutter 3.27', framework: 'Flutter 3.27 (Dart 3)', lang: 'dart',
    file: (i) => `${i.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase()}.dart`,
    deps: () => ['flutter/material'],
    generate: generateFlutter,
  },
];

/* ─────────────────────────── Syntax highlighting ─────────────────────────── */

const KEYWORDS: Record<string, string[]> = {
  swift: ['import', 'struct', 'var', 'let', 'some', 'func', 'return', 'private', 'true', 'false', 'nil', 'self', 'class'],
  tsx: ['import', 'from', 'export', 'default', 'function', 'return', 'const', 'type', 'true', 'false', 'null'],
  kotlin: ['package', 'import', 'fun', 'val', 'var', 'private', 'return', 'true', 'false', 'null'],
  dart: ['import', 'class', 'extends', 'const', 'final', 'super', 'this', 'return', 'true', 'false', 'null', 'double'],
};

const TOKEN = /(\/\/[^\n]*|\{\/\*.*?\*\/\})|("(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*')|(@\w+|#\w+)|(\b0x[0-9A-Fa-f]+\b|\b\d+(?:\.\d+)?\b)|(\b[A-Za-z_]\w*\b)/g;

function highlight(code: string, lang: string): React.ReactNode[] {
  const keywords = new Set(KEYWORDS[lang]);
  const out: React.ReactNode[] = [];
  let last = 0;
  let key = 0;
  for (const m of code.matchAll(TOKEN)) {
    const index = m.index ?? 0;
    if (index > last) out.push(code.slice(last, index));
    const [text, comment, str, attr, number, word] = m;
    let cls = '';
    if (comment) cls = 'text-[#7F8C98] italic';
    else if (str) cls = 'text-[#FF8170]';
    else if (attr) cls = 'text-[#CC9768]';
    else if (number) cls = 'text-[#D9C97C]';
    else if (word && keywords.has(word)) cls = 'font-semibold text-[#FF7AB2]';
    else if (word && /^[A-Z]/.test(word)) cls = 'text-[#5DD8FF]';
    else if (word && code[index - 1] === '.') cls = 'text-[#67B7A4]';
    out.push(cls ? <span key={key++} className={cls}>{text}</span> : text);
    last = index + text.length;
  }
  if (last < code.length) out.push(code.slice(last));
  return out;
}

/* ─────────────────────────── Tab ─────────────────────────── */

const SCREEN_FILE = '__screen';

export function CodeTab({ sources, overrides, screenName, selectedId }: {
  sources: CodeSource[];
  overrides: Overrides;
  /** The phone page, e.g. "Home". */
  screenName: string;
  selectedId: string | null;
}) {
  const [frameworkId, setFrameworkId] = useState<FrameworkId>('swiftui');
  const [filePick, setFilePick] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const roots = useMemo(() => buildTree(sources, overrides), [sources, overrides]);
  const defs = useMemo(() => definitions(roots), [roots]);
  const screenIdent = `${pascal(screenName, 'Home')}Screen`;

  // The file follows the selected phone component until one is picked from the list.
  const fileId = filePick && defs.some((d) => d.id === filePick)
    ? filePick
    : filePick === SCREEN_FILE ? SCREEN_FILE
      : defs.find((d) => d.id === selectedId)?.id ?? SCREEN_FILE;
  const fileNode = defs.find((d) => d.id === fileId);
  const fw = FRAMEWORKS.find((f) => f.id === frameworkId)!;
  const ident = fileNode?.ident ?? screenIdent;
  const fileName = fw.file(ident);
  const code = useMemo(
    () => fw.generate(fileNode ? [fileNode] : roots, ident, !fileNode),
    [fw, fileNode, roots, ident],
  );
  const highlighted = useMemo(() => highlight(code, fw.lang), [code, fw.lang]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  const download = () => {
    const url = URL.createObjectURL(new Blob([code], { type: 'text/plain' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-3 px-3 py-3">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Generated Code &amp; SDK Export</h3>
        <span className="shrink-0 rounded-md bg-[#EEF2FF] px-2 py-1 text-[10px] font-semibold text-[#0040DF]">{fw.badge}</span>
      </div>

      <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Code framework">
        {FRAMEWORKS.map((f) => {
          const active = f.id === frameworkId;
          return (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setFrameworkId(f.id)}
              className={`rounded-md px-3 py-1.5 text-[11px] font-semibold transition ${
                active ? 'bg-[#0040DF] text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      <div className="space-y-2.5 rounded-lg border border-slate-200 bg-slate-50 p-3 text-[11px]">
        <div className="flex items-center justify-between gap-3">
          <span className="shrink-0 text-slate-500">Component File</span>
          <label className="relative flex min-w-0 items-center">
            <span className="sr-only">Component file</span>
            <select
              value={fileId}
              onChange={(event) => setFilePick(event.target.value)}
              className="min-w-0 max-w-full cursor-pointer appearance-none truncate bg-transparent pr-4 text-right font-bold text-slate-900 outline-none"
            >
              <option value={SCREEN_FILE}>{fw.file(screenIdent)}</option>
              {defs.map((d) => <option key={d.id} value={d.id}>{fw.file(d.ident)}</option>)}
            </select>
            <ChevronDown className="pointer-events-none absolute right-0 h-3 w-3 text-slate-400" />
          </label>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="shrink-0 text-slate-500">Framework</span>
          <span className="truncate font-semibold text-slate-900">{fw.framework}</span>
        </div>
        <div className="flex items-start justify-between gap-3">
          <span className="shrink-0 text-slate-500">Dependencies</span>
          <div className="flex flex-wrap justify-end gap-1">
            {fw.deps(code).map((dep) => (
              <span key={dep} className="rounded bg-[#EEF2FF] px-1.5 py-0.5 text-[10px] font-semibold text-[#0040DF]">{dep}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-900">
          <span className="h-2 w-2 rounded-full bg-[#0040DF]" />
          {fw.label} Source
        </span>
        <button
          type="button"
          onClick={copy}
          className="flex items-center gap-1 text-[11px] font-semibold text-[#0040DF] hover:underline"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? 'Copied' : 'Copy Code'}
        </button>
      </div>

      <pre
        aria-label={`${fw.label} source for ${fileName}`}
        className="max-h-[60vh] overflow-auto rounded-xl bg-[#292A30] p-3.5 font-mono text-[10.5px] leading-[1.7] text-[#DFDFE0] shadow-inner"
      >
        <code>{highlighted}</code>
      </pre>

      <button
        type="button"
        onClick={download}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#0040DF] py-2.5 text-[12px] font-semibold text-white shadow-sm transition hover:bg-[#0035b8]"
      >
        <Download className="h-4 w-4" />
        Export {fileName}
      </button>
    </div>
  );
}
