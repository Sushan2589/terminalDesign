import React, { useState, useEffect, useRef, useCallback } from "react";
import { Box, Text, render, useInput } from "ink";

// ─── Theme ────────────────────────────────────────────────────────────────────

const LEVEL_STYLES = {
  info:    { label: "INFO", color: "blueBright",   symbol: "i" },
  success: { label: " OK ", color: "greenBright",  symbol: "✓" },
  warn:    { label: "WARN", color: "yellow",        symbol: "!" },
  error:   { label: " ERR", color: "redBright",     symbol: "✕" },
  debug:   { label: " DBG", color: "magentaBright", symbol: "·" },
  verbose: { label: " VRB", color: "gray",          symbol: "·" },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

let _id = 0;
function uid() { return ++_id; }

function timestamp() {
  const now = new Date();
  const hh  = String(now.getHours()).padStart(2, "0");
  const mm  = String(now.getMinutes()).padStart(2, "0");
  const ss  = String(now.getSeconds()).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

// ─── LogLine ─────────────────────────────────────────────────────────────────

/**
 * Renders a single log line.
 * Supports a `children` render prop for rich message content,
 * or a plain `message` string.
 */
function LogLine({ entry, showTimestamp, showLevel, compact, highlight }) {
  const { label, color } = LEVEL_STYLES[entry.level] ?? LEVEL_STYLES.info;

  return (
    <Box
      flexDirection="row"
      gap={1}
      backgroundColor={highlight ? "gray" : undefined}
    >
      {/* Timestamp */}
      {showTimestamp && (
        <Text color="gray" dimColor>{entry.ts}</Text>
      )}

      {/* Level badge */}
      {showLevel && !compact && (
        <Text color={color} bold>{label}</Text>
      )}
      {showLevel && compact && (
        <Text color={color} bold>{LEVEL_STYLES[entry.level]?.symbol ?? "·"}</Text>
      )}

      {/* Tag / namespace */}
      {entry.tag && (
        <Text color="magentaBright" dimColor>{`[${entry.tag}]`}</Text>
      )}

      {/* Message */}
      {entry.children
        ? entry.children
        : <Text>{entry.message ?? ""}</Text>
      }

      {/* Meta key=value pairs */}
      {entry.meta && Object.entries(entry.meta).map(([k, v]) => (
        <Text key={k} color="gray" dimColor>{`${k}=${v}`}</Text>
      ))}
    </Box>
  );
}

// ─── LogStream ────────────────────────────────────────────────────────────────

/**
 * LogStream
 *
 * A scrollable, filterable log viewer that accepts a stream of log entries
 * and renders them in a fixed-height viewport.
 *
 * Props
 * ─────
 * entries   LogEntry[]
 *   Each entry: {
 *     id?:       number | string   — auto-assigned if omitted
 *     level?:    "info"|"success"|"warn"|"error"|"debug"|"verbose"
 *     message?:  string
 *     children?: ReactNode         — rich message (overrides message)
 *     ts?:       string            — timestamp string (auto if omitted)
 *     tag?:      string            — namespace label e.g. "[db]"
 *     meta?:     Record<string,string>  — appended as key=value pairs
 *   }
 *
 * height          number  — visible row count.              default: 10
 * showTimestamp   boolean — show HH:MM:SS column.           default: true
 * showLevel       boolean — show level label column.        default: true
 * showScrollbar   boolean — show scroll position indicator. default: true
 * compact         boolean — use single-char level symbols.  default: false
 * follow          boolean — auto-scroll to bottom on new entries. default: true
 * filterLevel     string  — only show entries at this level or above.
 * filterText      string  — text search filter.
 * showFilter      boolean — show live filter bar.           default: false
 *
 * @example
 * // Basic streaming log
 * const [entries, setEntries] = useState([]);
 * const log = (level, message) =>
 *   setEntries(prev => [...prev, { level, message }]);
 *
 * <LogStream entries={entries} height={12} />
 *
 * @example
 * // With tag and meta
 * { level: "info", message: "Query executed", tag: "db",
 *   meta: { rows: "42", ms: "12" } }
 *
 * @example
 * // Rich children
 * { level: "error", children:
 *   <Text>Failed on <Text color="redBright">line 88</Text></Text> }
 */
export function LogStream({
  entries = [],
  height = 10,
  showTimestamp = true,
  showLevel = true,
  showScrollbar = true,
  compact = false,
  follow = true,
  filterLevel,
  filterText = "",
  showFilter = false,
}) {
  const [scrollTop, setScrollTop]   = useState(0);
  const [filter,    setFilter]      = useState(filterText);
  const [paused,    setPaused]      = useState(false);

  const LEVEL_ORDER = ["verbose", "debug", "info", "success", "warn", "error"];

  // Filter entries
  const filtered = entries.filter((e) => {
    if (filterLevel) {
      const eIdx = LEVEL_ORDER.indexOf(e.level ?? "info");
      const fIdx = LEVEL_ORDER.indexOf(filterLevel);
      if (eIdx < fIdx) return false;
    }
    if (filter) {
      const haystack = [e.message, e.tag, ...(Object.values(e.meta ?? {}))].join(" ").toLowerCase();
      if (!haystack.includes(filter.toLowerCase())) return false;
    }
    return true;
  });

  // Auto-follow: jump to bottom when new entries arrive
  useEffect(() => {
    if (follow && !paused) {
      setScrollTop(Math.max(0, filtered.length - height));
    }
  }, [filtered.length, follow, paused, height]);

  // Clamp scrollTop
  const maxScroll  = Math.max(0, filtered.length - height);
  const clampedTop = Math.min(scrollTop, maxScroll);
  const visible    = filtered.slice(clampedTop, clampedTop + height);

  // Keyboard scroll
  useInput(useCallback((_, key) => {
    if (key.upArrow) {
      setPaused(true);
      setScrollTop((t) => Math.max(0, t - 1));
    }
    if (key.downArrow) {
      setScrollTop((t) => {
        const next = Math.min(maxScroll, t + 1);
        if (next >= maxScroll) setPaused(false);
        return next;
      });
    }
    if (key.pageUp) {
      setPaused(true);
      setScrollTop((t) => Math.max(0, t - height));
    }
    if (key.pageDown) {
      setScrollTop((t) => {
        const next = Math.min(maxScroll, t + height);
        if (next >= maxScroll) setPaused(false);
        return next;
      });
    }
    // "f" to toggle follow
    if (_.toLowerCase() === "f") {
      setPaused((p) => !p);
      if (paused) setScrollTop(maxScroll);
    }
  }, [maxScroll, height, paused]));

  // Scrollbar
  const scrollbarHeight = height;
  const thumbSize  = Math.max(1, Math.round((height / Math.max(filtered.length, height)) * scrollbarHeight));
  const thumbPos   = filtered.length > height
    ? Math.round((clampedTop / maxScroll) * (scrollbarHeight - thumbSize))
    : 0;

  return (
    <Box flexDirection="column">
      {/* ── Filter bar ── */}
      {showFilter && (
        <Box marginBottom={0} gap={1}>
          <Text color="gray" dimColor>filter:</Text>
          <Text color="blueBright">{filter || "—"}</Text>
          {paused && <Text color="yellow" dimColor> [paused]</Text>}
        </Box>
      )}

      {/* ── Log body ── */}
      <Box flexDirection="row">
        <Box flexDirection="column" flexGrow={1}>
          {/* Pad with blank lines if not enough entries yet */}
          {Array.from({ length: Math.max(0, height - visible.length) }).map((_, i) => (
            <Text key={`blank-${i}`}> </Text>
          ))}
          {visible.map((entry, i) => (
            <LogLine
              key={entry.id ?? i}
              entry={entry}
              showTimestamp={showTimestamp}
              showLevel={showLevel}
              compact={compact}
              highlight={false}
            />
          ))}
        </Box>

        {/* ── Scrollbar ── */}
        {showScrollbar && filtered.length > height && (
          <Box flexDirection="column" width={1} marginLeft={1}>
            {Array.from({ length: scrollbarHeight }).map((_, i) => {
              const isThumb = i >= thumbPos && i < thumbPos + thumbSize;
              return (
                <Text key={i} color={isThumb ? "gray" : "gray"} dimColor={!isThumb}>
                  {isThumb ? "█" : "░"}
                </Text>
              );
            })}
          </Box>
        )}
      </Box>

      {/* ── Status bar ── */}
      <Box marginTop={0} gap={2}>
        <Text color="gray" dimColor>
          {filtered.length}/{entries.length} lines
        </Text>
        {paused && (
          <Text color="yellow" dimColor>paused — f to follow</Text>
        )}
        {!paused && (
          <Text color="gray" dimColor>following — ↑/↓ to scroll</Text>
        )}
        {filterLevel && (
          <Text color="gray" dimColor>level≥{filterLevel}</Text>
        )}
      </Box>
    </Box>
  );
}

// ─── useLogStream hook ────────────────────────────────────────────────────────

/**
 * useLogStream
 *
 * Convenience hook that manages a log entries array and provides
 * helper methods to append new entries.
 *
 * @example
 * const { entries, log } = useLogStream();
 * log.info("Server started on :3000");
 * log.error("Connection failed", { tag: "db", meta: { code: "ECONNREFUSED" } });
 *
 * <LogStream entries={entries} />
 */
export function useLogStream({ maxEntries = 500 } = {}) {
  const [entries, setEntries] = useState([]);

  const append = useCallback((level, message, opts = {}) => {
    setEntries((prev) => {
      const next = [
        ...prev,
        { id: uid(), level, message, ts: timestamp(), ...opts },
      ];
      return next.length > maxEntries ? next.slice(-maxEntries) : next;
    });
  }, [maxEntries]);

  const log = {
    info:    (msg, opts) => append("info",    msg, opts),
    success: (msg, opts) => append("success", msg, opts),
    warn:    (msg, opts) => append("warn",    msg, opts),
    error:   (msg, opts) => append("error",   msg, opts),
    debug:   (msg, opts) => append("debug",   msg, opts),
    verbose: (msg, opts) => append("verbose", msg, opts),
    clear:   ()          => setEntries([]),
  };

  return { entries, log };
}

export default LogStream;

// ─── Demo (bun run LogStream.jsx) ────────────────────────────────────────────

const DEMO_MESSAGES = [
  { level: "info",    message: "Server listening on :3000"                          },
  { level: "success", message: "Database connected",      tag: "db", meta: { ms: "12" } },
  { level: "info",    message: "Loading routes…"                                    },
  { level: "debug",   message: "GET /health 200",         tag: "http"               },
  { level: "info",    message: "Compiling TypeScript…"                              },
  { level: "warn",    message: "JWT secret not set, using default"                  },
  { level: "debug",   message: "POST /api/deploy 202",    tag: "http"               },
  { level: "info",    message: "Worker thread spawned",   meta: { pid: "4821" }     },
  { level: "error",   message: "Unhandled rejection in worker.ts:88", tag: "worker" },
  { level: "info",    message: "Retrying in 5s…",         meta: { attempt: "2/3" } },
  { level: "success", message: "Schema migration applied",tag: "db"                },
  { level: "warn",    message: "Memory usage above 80%",  meta: { heap: "412 MB" } },
  { level: "debug",   message: "Cache hit ratio: 94%",    tag: "cache"             },
  { level: "error",   message: "Rate limit exceeded for 192.168.1.5"               },
  { level: "info",    message: "Graceful shutdown initiated"                        },
];

function Demo() {
  const { entries, log } = useLogStream();
  const [tick, setTick]  = useState(0);

  // Stream one message every 600ms
  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      if (i >= DEMO_MESSAGES.length) { clearInterval(id); return; }
      const { level, message, tag, meta } = DEMO_MESSAGES[i++];
      log[level](message, { tag, meta });
      setTick((t) => t + 1);
    }, 600);
    return () => clearInterval(id);
  }, []);

  return (
    <Box flexDirection="column" paddingX={2} paddingY={1}>
      <Box marginBottom={1}>
        <Text color="gray" dimColor>{"─── LogStream — live demo ───────────────────────────"}</Text>
      </Box>

      <LogStream
        entries={entries}
        height={10}
        follow
        showFilter
      />

      <Box marginTop={1}>
        <Text color="gray" dimColor>↑↓ scroll  ·  f toggle-follow  ·  ctrl+c exit</Text>
      </Box>
    </Box>
  );
}

render(<Demo />);