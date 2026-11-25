'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowUp, Check, Eye, EyeOff, MessagesSquare, RotateCcw, SendHorizontal, Smile } from 'lucide-react';

export type CommentReply = {
  id: string;
  text: string;
  author: string;
  createdAt: number;
};

/** A comment pinned to the canvas. `x`/`y` are world coordinates of the pin's tip. */
export type CanvasComment = {
  id: string;
  x: number;
  y: number;
  text: string;
  author: string;
  createdAt: number;
  /** Name of the component (or "Canvas") the comment was placed on. */
  target: string;
  resolved: boolean;
  /** Hidden from the canvas; still listed in the comments panel. */
  hidden: boolean;
  replies: CommentReply[];
  /** Emoji → people who reacted with it. */
  reactions: Record<string, string[]>;
};

/** A comment being written: placed, but not posted yet. */
export type CommentDraft = { x: number; y: number; target: string };

/** Shown until the studio knows who is signed in. */
export const COMMENT_AUTHOR = 'You';
export const COMMENT_AUTHOR_ROLE = 'Editor';

/** Marks comment UI so canvas tools ignore clicks on it. */
export const COMMENT_UI_ATTR = 'data-comment-ui';

const COMMENT_BLUE = '#0D99FF';
const COMMENT_DARK = '#2C2C2C';
const AVATAR_COLOR = '#0E8F7E';
const PANEL_BLUE = '#0040DF';
const REACTION_CHOICES = ['👍', '🚀', '❤️', '🎉', '👀', '✅'];

/**
 * The comment tool cursor: the toolbar's speech bubble (lucide MessageCircle) drawn white
 * with a dark outline, with its hotspot on the bubble's tail so a click lands where it points.
 */
const cursorSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" fill="#ffffff" stroke="#1E1E1E" stroke-width="1.6" stroke-linejoin="round"/><path d="M12 8v6M9 11h6" stroke="#1E1E1E" stroke-width="1.6" stroke-linecap="round"/></svg>`;
export const COMMENT_CURSOR = `url("data:image/svg+xml;utf8,${encodeURIComponent(cursorSvg)}") 2 24, crosshair`;

/** Pin shape: round, except the bottom-left corner, which points at the commented spot. */
const PIN_RADIUS = '9999px 9999px 9999px 4px';

function timeAgo(createdAt: number, now: number) {
  const seconds = Math.max(0, Math.round((now - createdAt) / 1000));
  if (seconds < 60) return 'just now';
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

/** The current time, refreshed every 30s so "just now" turns into "1m ago". */
function useNow() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(timer);
  }, []);
  return now;
}

const initialOf = (name: string) => name.trim().charAt(0).toUpperCase() || '?';

function Avatar({ name, size = 24 }: { name: string; size?: number }) {
  return (
    <span
      className="grid shrink-0 place-items-center rounded-full font-semibold text-white"
      style={{ width: size, height: size, background: AVATAR_COLOR, fontSize: size * 0.48 }}
    >
      {initialOf(name)}
    </span>
  );
}

/**
 * Places a comment UI at a world point. The pin's tip sits on the point, and the UI is
 * counter-scaled so it keeps the same on-screen size at every zoom level (like Figma).
 */
function Anchor({
  x, y, scale, children, onContextMenu,
}: {
  x: number; y: number; scale: number; children: React.ReactNode;
  onContextMenu?: (event: React.MouseEvent) => void;
}) {
  return (
    <div className="absolute h-0 w-0" style={{ left: x, top: y }}>
      <div
        {...{ [COMMENT_UI_ATTR]: '' }}
        className="pointer-events-auto absolute bottom-0 left-0"
        style={{ transform: `scale(${1 / scale})`, transformOrigin: 'bottom left' }}
        // Keep canvas tools (drawing, selecting, panning) from reacting to the comment.
        onMouseDown={(event) => event.stopPropagation()}
        onClick={(event) => event.stopPropagation()}
        onContextMenu={(event) => {
          event.stopPropagation();
          onContextMenu?.(event);
        }}
      >
        {children}
      </div>
    </div>
  );
}

/** A just-placed comment: blue pin plus the "Add a comment" box. */
function CommentComposer({ onPost, onCancel }: { onPost: (text: string) => void; onCancel: () => void }) {
  const [text, setText] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const canPost = text.trim().length > 0;

  useEffect(() => {
    // Focus after the placing click has finished, so it doesn't steal focus back.
    const timer = window.setTimeout(() => inputRef.current?.focus(), 0);
    return () => window.clearTimeout(timer);
  }, []);

  const post = () => { if (canPost) onPost(text.trim()); };

  return (
    // The pin alone sets the size, so its tip stays exactly on the commented spot;
    // the box sits beside it, centred on the pin.
    <div className="relative h-8 w-8">
      <span
        aria-hidden="true"
        className="block h-8 w-8 shadow-[0_2px_6px_rgba(0,0,0,0.25)]"
        style={{ background: COMMENT_BLUE, borderRadius: PIN_RADIUS }}
      />
      <form
        onSubmit={(event) => { event.preventDefault(); post(); }}
        className="absolute left-10 top-1/2 flex w-[300px] -translate-y-1/2 items-center gap-2 rounded-[14px] border-[1.5px] py-1.5 pl-3.5 pr-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.3)]"
        style={{ background: COMMENT_DARK, borderColor: COMMENT_BLUE }}
      >
        <textarea
          ref={inputRef}
          value={text}
          rows={1}
          aria-label="Add a comment"
          placeholder="Add a comment"
          onChange={(event) => {
            setText(event.target.value);
            // Grow with the text, up to a few lines.
            event.target.style.height = 'auto';
            event.target.style.height = `${Math.min(event.target.scrollHeight, 96)}px`;
          }}
          onKeyDown={(event) => {
            event.stopPropagation();
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              post();
            } else if (event.key === 'Escape') {
              event.preventDefault();
              onCancel();
            }
          }}
          className="max-h-24 min-w-0 flex-1 resize-none bg-transparent py-1 text-[13px] leading-5 text-white caret-white outline-none placeholder:text-[#8F8F8F]"
        />
        <button
          type="submit"
          disabled={!canPost}
          aria-label="Post comment"
          title="Post (Enter)"
          className="grid h-7 w-7 shrink-0 place-items-center self-end rounded-full text-white transition disabled:cursor-default"
          style={{ background: canPost ? COMMENT_BLUE : '#5C5C5C', color: canPost ? '#fff' : '#2C2C2C' }}
        >
          <ArrowUp className="h-4 w-4" strokeWidth={2.5} />
        </button>
      </form>
    </div>
  );
}

/** A posted comment: a small avatar bubble that opens into the full comment on hover or focus. */
function CommentBubble({
  comment, now, active, onResolve, onActivate,
}: {
  comment: CanvasComment; now: number; active: boolean; onResolve: () => void; onActivate: () => void;
}) {
  return (
    <div
      tabIndex={0}
      aria-label={`Comment by ${comment.author} on ${comment.target}: ${comment.text}`}
      onClick={onActivate}
      className={`group relative max-h-9 max-w-9 overflow-hidden border shadow-[0_4px_14px_rgba(0,0,0,0.35)] outline-none transition-[max-width,max-height,border-radius,box-shadow] duration-200 ease-out hover:z-10 hover:max-h-[220px] hover:max-w-[300px] hover:rounded-[18px_18px_18px_4px] hover:shadow-[0_10px_30px_rgba(0,0,0,0.4)] focus-visible:max-h-[220px] focus-visible:max-w-[300px] focus-visible:ring-2 focus-visible:ring-[#0D99FF] ${active ? 'border-[#0D99FF] ring-2 ring-[#0D99FF]' : 'border-white/15'}`}
      style={{ background: COMMENT_DARK, borderRadius: PIN_RADIUS }}
    >
      <div className="flex w-max max-w-[300px] items-start gap-2.5 p-[5px] pr-4 group-hover:py-2.5 group-hover:pl-3 group-hover:pr-10 group-focus-visible:py-2.5 group-focus-visible:pl-3 group-focus-visible:pr-10">
        <Avatar name={comment.author} />
        <div className="min-w-0 max-w-[230px] pt-px opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-hover:delay-75 group-focus-visible:opacity-100">
          <p className="whitespace-nowrap text-[13px] leading-5">
            <span className="font-semibold text-white">{comment.author}</span>
            <span className="ml-1.5 text-[#9A9A9A]">{timeAgo(comment.createdAt, now)}</span>
          </p>
          <p className="whitespace-pre-wrap break-words text-[13px] leading-5 text-[#E6E6E6]">{comment.text}</p>
          {comment.replies.length > 0 && (
            <p className="mt-0.5 text-[12px] leading-5 text-[#9A9A9A]">
              {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
            </p>
          )}
        </div>
      </div>
      <button
        type="button"
        onClick={(event) => { event.stopPropagation(); onResolve(); }}
        aria-label="Resolve comment"
        title="Resolve"
        className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full text-[#9A9A9A] opacity-0 transition hover:bg-white/10 hover:text-white group-hover:opacity-100 group-focus-visible:opacity-100"
      >
        <Check className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

/** Right-click menu for a comment on the canvas. */
function CommentContextMenu({
  x, y, onHide, onClose,
}: { x: number; y: number; onHide: () => void; onClose: () => void }) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ left: x, top: y });

  React.useLayoutEffect(() => {
    const el = menuRef.current;
    if (!el) return;
    const { width, height } = el.getBoundingClientRect();
    setPosition({
      left: Math.max(8, Math.min(x, window.innerWidth - width - 8)),
      top: Math.max(8, Math.min(y, window.innerHeight - height - 8)),
    });
  }, [x, y]);

  useEffect(() => {
    const closeOnOutside = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) onClose();
    };
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('mousedown', closeOnOutside, true);
    window.addEventListener('keydown', closeOnEscape);
    window.addEventListener('wheel', onClose, { passive: true });
    window.addEventListener('resize', onClose);
    window.addEventListener('blur', onClose);
    return () => {
      window.removeEventListener('mousedown', closeOnOutside, true);
      window.removeEventListener('keydown', closeOnEscape);
      window.removeEventListener('wheel', onClose);
      window.removeEventListener('resize', onClose);
      window.removeEventListener('blur', onClose);
    };
  }, [onClose]);

  return createPortal(
    <div
      ref={menuRef}
      role="menu"
      {...{ [COMMENT_UI_ATTR]: '' }}
      onContextMenu={(event) => event.preventDefault()}
      className="fixed z-[200] min-w-[200px] rounded-lg bg-white p-1 shadow-[0_12px_32px_rgba(15,23,42,0.18)] ring-1 ring-slate-200"
      style={position}
    >
      <button
        type="button"
        role="menuitem"
        autoFocus
        onClick={() => { onHide(); onClose(); }}
        className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-[11px] font-medium text-slate-700 hover:bg-[#0040DF] hover:text-white focus-visible:bg-[#0040DF] focus-visible:text-white focus-visible:outline-none"
      >
        <EyeOff className="h-3 w-3 shrink-0" /> Hide comment on canvas
      </button>
    </div>,
    document.body,
  );
}

/** Every comment on the canvas, plus the one being written. Render inside the zoomed world layer. */
export function CommentLayer({
  comments, draft, scale, activeId, onPost, onCancelDraft, onResolve, onHide, onActivate,
}: {
  comments: CanvasComment[];
  draft: CommentDraft | null;
  scale: number;
  activeId: string | null;
  onPost: (text: string) => void;
  onCancelDraft: () => void;
  onResolve: (id: string) => void;
  onHide: (id: string) => void;
  onActivate: (id: string) => void;
}) {
  const now = useNow();
  const [menu, setMenu] = useState<{ id: string; x: number; y: number } | null>(null);
  const closeMenu = React.useCallback(() => setMenu(null), []);

  return (
    <div className="pointer-events-none absolute inset-0 z-[60]">
      {comments.filter((comment) => !comment.resolved && !comment.hidden).map((comment) => (
        <Anchor
          key={comment.id}
          x={comment.x}
          y={comment.y}
          scale={scale}
          onContextMenu={(event) => {
            event.preventDefault();
            setMenu({ id: comment.id, x: event.clientX, y: event.clientY });
          }}
        >
          <CommentBubble
            comment={comment}
            now={now}
            active={comment.id === activeId}
            onResolve={() => onResolve(comment.id)}
            onActivate={() => onActivate(comment.id)}
          />
        </Anchor>
      ))}
      {draft && (
        // Keyed by position so placing a new comment starts with an empty box.
        <Anchor key={`${draft.x},${draft.y}`} x={draft.x} y={draft.y} scale={scale}>
          <CommentComposer onPost={onPost} onCancel={onCancelDraft} />
        </Anchor>
      )}
      {menu && (
        <CommentContextMenu
          key={`${menu.id}-${menu.x}-${menu.y}`}
          x={menu.x}
          y={menu.y}
          onHide={() => onHide(menu.id)}
          onClose={closeMenu}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------------------------------ */
/* Right panel: Comments & Activity Stream                                                     */
/* ------------------------------------------------------------------------------------------ */

type CommentFilter = 'all' | 'resolved' | 'mentions';

const mentionsMe = (text: string) => text.toLowerCase().includes(`@${COMMENT_AUTHOR.toLowerCase()}`);

function ReplyBox({ comment, onReply }: { comment: CanvasComment; onReply: (text: string) => void }) {
  const [text, setText] = useState('');
  const others = [...new Set([comment.author, ...comment.replies.map((reply) => reply.author)])]
    .filter((name) => name !== COMMENT_AUTHOR);
  const placeholder = others.length ? `Add reply to ${others.join(' & ')}…` : 'Add a reply…';
  const send = () => {
    const value = text.trim();
    if (!value) return;
    onReply(value);
    setText('');
  };
  return (
    <form
      onSubmit={(event) => { event.preventDefault(); send(); }}
      onClick={(event) => event.stopPropagation()}
      className="mt-3 flex items-center gap-2 rounded-xl bg-white py-1.5 pl-3 pr-1.5 ring-1 ring-transparent focus-within:ring-[#0040DF]/40"
    >
      <input
        value={text}
        onChange={(event) => setText(event.target.value)}
        onKeyDown={(event) => event.stopPropagation()}
        placeholder={placeholder}
        aria-label={placeholder}
        className="min-w-0 flex-1 bg-transparent py-1 text-[13px] text-slate-800 outline-none placeholder:text-slate-400"
      />
      <button
        type="submit"
        disabled={!text.trim()}
        aria-label="Send reply"
        className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-[#0040DF] transition hover:bg-[#0040DF]/10 disabled:opacity-40 disabled:hover:bg-transparent"
      >
        <SendHorizontal className="h-4 w-4" />
      </button>
    </form>
  );
}

function Reactions({
  reactions, onToggle,
}: { reactions: Record<string, string[]>; onToggle: (emoji: string) => void }) {
  const [picking, setPicking] = useState(false);
  const used = Object.entries(reactions).filter(([, people]) => people.length > 0);
  return (
    <div className="relative mt-2.5 flex flex-wrap items-center gap-1.5" onClick={(event) => event.stopPropagation()}>
      {used.map(([emoji, people]) => {
        const mine = people.includes(COMMENT_AUTHOR);
        return (
          <button
            key={emoji}
            type="button"
            onClick={() => onToggle(emoji)}
            aria-pressed={mine}
            title={people.join(', ')}
            className={`flex h-6 items-center gap-1 rounded-full px-2 text-[11px] font-semibold transition ${mine ? 'bg-[#0040DF]/10 text-[#0040DF] ring-1 ring-[#0040DF]/30' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
          >
            <span className="text-[12px] leading-none">{emoji}</span>{people.length}
          </button>
        );
      })}
      <button
        type="button"
        onClick={() => setPicking((open) => !open)}
        aria-label="Add reaction"
        aria-expanded={picking}
        className="grid h-6 w-6 place-items-center rounded-full text-slate-500 transition hover:bg-white hover:text-slate-700"
      >
        <Smile className="h-4 w-4" />
      </button>
      {picking && (
        <div className="absolute left-0 top-full z-10 mt-1 flex gap-0.5 rounded-full bg-white p-1 shadow-[0_6px_18px_rgba(15,23,42,0.15)] ring-1 ring-slate-200">
          {REACTION_CHOICES.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => { onToggle(emoji); setPicking(false); }}
              aria-label={`React with ${emoji}`}
              className="grid h-7 w-7 place-items-center rounded-full text-[15px] transition hover:bg-slate-100"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function CommentCard({
  comment, number, now, active, onActivate, update,
}: {
  comment: CanvasComment;
  number: number;
  now: number;
  active: boolean;
  onActivate: () => void;
  update: (patch: (comment: CanvasComment) => CanvasComment) => void;
}) {
  const cardRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (active) cardRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [active]);

  const toggleReaction = (emoji: string) => update((current) => {
    const people = current.reactions[emoji] ?? [];
    const next = people.includes(COMMENT_AUTHOR)
      ? people.filter((name) => name !== COMMENT_AUTHOR)
      : [...people, COMMENT_AUTHOR];
    return { ...current, reactions: { ...current.reactions, [emoji]: next } };
  });

  return (
    <article
      ref={cardRef}
      onClick={onActivate}
      className={`cursor-pointer rounded-2xl bg-[#EEF0FB] p-3.5 transition ${active ? 'ring-2 ring-[#0040DF]/40' : 'hover:bg-[#E8EBFA]'}`}
    >
      <header className="flex items-center gap-2">
        <span
          className="grid h-5 min-w-5 shrink-0 place-items-center rounded-full px-1 text-[10px] font-bold text-white dashdark:bg-[#3a6ff0]!"
          style={{ background: PANEL_BLUE }}
        >
          {number}
        </span>
        <h3 className="min-w-0 flex-1 truncate text-[12.5px] font-bold text-slate-900" title={comment.target}>
          {comment.target}
        </h3>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            update((current) => ({ ...current, resolved: !current.resolved }));
          }}
          className="flex h-6 shrink-0 items-center gap-1 rounded-md bg-white px-2 text-[11px] font-medium text-slate-700 shadow-[0_1px_2px_rgba(15,23,42,0.08)] transition hover:text-[#0040DF]"
        >
          {comment.resolved
            ? <><RotateCcw className="h-3 w-3" /> Reopen</>
            : <><Check className="h-3 w-3" /> Resolve</>}
        </button>
      </header>

      <div className="mt-3 flex gap-2.5">
        <Avatar name={comment.author} size={34} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="truncate text-[14px] font-medium leading-5 text-slate-900">{comment.author}</p>
            <span className="shrink-0 pt-0.5 text-[11px] text-slate-500">{timeAgo(comment.createdAt, now)}</span>
          </div>
          <span className="mt-0.5 inline-block rounded bg-[#DCE2FA] px-1.5 py-px text-[10.5px] font-medium text-[#3A4A8C]">
            {COMMENT_AUTHOR_ROLE}
          </span>
          <p className="mt-2 whitespace-pre-wrap break-words text-[13px] leading-[1.55] text-slate-700">{comment.text}</p>

          {comment.replies.length > 0 && (
            <ul className="mt-3 space-y-2.5 border-l-2 border-[#D6DBF5] pl-3">
              {comment.replies.map((reply) => (
                <li key={reply.id} className="flex gap-2">
                  <Avatar name={reply.author} size={22} />
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] leading-5">
                      <span className="font-semibold text-slate-900">{reply.author}</span>
                      <span className="ml-1.5 text-slate-500">{timeAgo(reply.createdAt, now)}</span>
                    </p>
                    <p className="whitespace-pre-wrap break-words text-[12.5px] leading-[1.5] text-slate-700">{reply.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <Reactions reactions={comment.reactions} onToggle={toggleReaction} />

          {comment.hidden && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                update((current) => ({ ...current, hidden: false }));
              }}
              className="mt-2 flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-[#0040DF]"
            >
              <EyeOff className="h-3 w-3" /> Hidden on canvas · <Eye className="h-3 w-3" /> Show
            </button>
          )}
        </div>
      </div>

      {active && !comment.resolved && (
        <ReplyBox
          comment={comment}
          onReply={(text) => update((current) => ({
            ...current,
            replies: [...current.replies, {
              id: `${current.id}-reply-${Date.now()}`,
              text,
              author: COMMENT_AUTHOR,
              createdAt: Date.now(),
            }],
          }))}
        />
      )}
    </article>
  );
}

/** Replaces the right panel while the comment tool is active. */
export function CommentsPanel({
  comments, setComments, activeId, onActivate,
}: {
  comments: CanvasComment[];
  setComments: React.Dispatch<React.SetStateAction<CanvasComment[]>>;
  activeId: string | null;
  onActivate: (id: string) => void;
}) {
  const now = useNow();
  const [filter, setFilter] = useState<CommentFilter>('all');

  const open = comments.filter((comment) => !comment.resolved);
  const resolved = comments.filter((comment) => comment.resolved);
  const mentions = comments.filter((comment) =>
    mentionsMe(comment.text) || comment.replies.some((reply) => mentionsMe(reply.text)));
  const shown = filter === 'all' ? open : filter === 'resolved' ? resolved : mentions;

  const filters: { id: CommentFilter; label: string }[] = [
    { id: 'all', label: `All Comments (${open.length})` },
    { id: 'resolved', label: `Resolved (${resolved.length})` },
    { id: 'mentions', label: 'Mentions (@me)' },
  ];

  const update = (id: string) => (patch: (comment: CanvasComment) => CanvasComment) =>
    setComments((list) => list.map((comment) => (comment.id === id ? patch(comment) : comment)));

  const emptyText = filter === 'all'
    ? 'No comments yet. Click anywhere on the canvas to leave one.'
    : filter === 'resolved'
      ? 'Resolved comments will appear here.'
      : `Comments that mention @${COMMENT_AUTHOR} will appear here.`;

  return (
    <aside className="flex h-full min-h-0 flex-col bg-white" aria-label="Comments">
      <div className="shrink-0 px-4 pb-3 pt-4">
        <h2 className="flex items-center gap-2 text-[15px] font-semibold text-slate-900">
          <MessagesSquare className="h-[18px] w-[18px] text-[#0040DF]" strokeWidth={2.2} />
          Comments &amp; Activity Stream
        </h2>
        <div role="tablist" aria-label="Filter comments" className="mt-3 flex gap-1.5 overflow-x-auto pb-0.5 [scrollbar-width:none]">
          {filters.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={filter === item.id}
              onClick={() => setFilter(item.id)}
              className={`h-7 shrink-0 whitespace-nowrap rounded-full px-3 text-[11.5px] font-medium transition ${filter === item.id ? 'text-white dashdark:bg-[#3a6ff0]!' : 'bg-[#EEF0F8] text-slate-700 hover:bg-[#E2E6F5]'}`}
              style={filter === item.id ? { background: PANEL_BLUE } : undefined}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pt-5 px-3 pb-4">
        {shown.length === 0 ? (
          <p className="px-3 py-10 text-center text-[12.5px] leading-relaxed text-slate-500">{emptyText}</p>
        ) : shown.map((comment) => (
          <CommentCard
            key={comment.id}
            comment={comment}
            number={comments.indexOf(comment) + 1}
            now={now}
            active={comment.id === activeId}
            onActivate={() => onActivate(comment.id)}
            update={update(comment.id)}
          />
        ))}
      </div>
    </aside>
  );
}
