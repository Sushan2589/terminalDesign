import React from "react";
import { Box, Text, render } from "ink";

// ─── Theme ────────────────────────────────────────────────────────────────────

const SEPARATOR_STYLES = {
  dot:   "·",
  pipe:  "│",
  slash: "/",
  space: " ",
  none:  "",
};

const SIZE_STYLES = {
  sm: { keyPad: 0, fontSize: "small"  },
  md: { keyPad: 1, fontSize: "normal" },
  lg: { keyPad: 2, fontSize: "normal" },
};

const VARIANT_STYLES = {
  default: { keyColor: "white",       keyDim: false, descColor: "gray", bracket: true  },
  muted:   { keyColor: "gray",        keyDim: true,  descColor: "gray", bracket: true  },
  bright:  { keyColor: "blueBright",  keyDim: false, descColor: "white",bracket: true  },
  plain:   { keyColor: "white",       keyDim: false, descColor: "gray", bracket: false },
};

// ─── KeyChip ─────────────────────────────────────────────────────────────────

/**
 * A single key + description pair.
 * Renders as: ‹key› desc  or  key desc  depending on variant.
 */
function KeyChip({ binding, variant = "default", size = "md" }) {
  const { keyColor, keyDim, descColor, bracket } = VARIANT_STYLES[variant];
  const pad = size === "lg" ? " " : "";

  const keys = Array.isArray(binding.key) ? binding.key : [binding.key];

  return (
    <Box flexDirection="row" gap={1} alignItems="center">
      {/* One or more key caps */}
      {keys.map((k, i) => (
        <Box key={i} flexDirection="row">
          {/* Separator between multiple keys (e.g. ctrl+c) */}
          {i > 0 && <Text color="gray" dimColor>+</Text>}

          {bracket ? (
            <Box flexDirection="row">
              <Text color="gray" dimColor>{"‹"}</Text>
              <Text color={keyColor} dimColor={keyDim} bold>
                {pad}{k}{pad}
              </Text>
              <Text color="gray" dimColor>{"›"}</Text>
            </Box>
          ) : (
            <Text color={keyColor} dimColor={keyDim} bold>
              {k}
            </Text>
          )}
        </Box>
      ))}

      {/* Description */}
      {binding.desc && (
        <Text color={descColor} dimColor>{binding.desc}</Text>
      )}
    </Box>
  );
}

// ─── KeyHints ────────────────────────────────────────────────────────────────

/**
 * KeyHints
 *
 * Renders a row (or column) of keyboard shortcut hints — the status-bar
 * footer you see at the bottom of terminal UIs.
 *
 * Props
 * ─────
 * bindings  Array<{
 *   key:   string | string[]   — key label(s). e.g. "enter", ["ctrl","c"], "↑↓"
 *   desc:  string              — short description
 *   group?: string             — group name for grouped layout
 * }>
 *
 * variant    "default" | "muted" | "bright" | "plain"   default: "default"
 * size       "sm" | "md" | "lg"                         default: "md"
 * separator  "dot" | "pipe" | "slash" | "space" | "none" default: "dot"
 * direction  "row" | "column"                           default: "row"
 * grouped    boolean — render group headers above clusters. default: false
 * wrap       boolean — allow row to wrap.               default: false
 *
 * @example
 * // Basic footer bar
 * <KeyHints bindings={[
 *   { key: "↑↓",    desc: "navigate" },
 *   { key: "enter", desc: "select"   },
 *   { key: "space", desc: "toggle"   },
 *   { key: ["ctrl","c"], desc: "exit" },
 * ]} />
 *
 * @example
 * // Muted, no brackets
 * <KeyHints variant="plain" bindings={[
 *   { key: "q", desc: "quit" },
 *   { key: "?", desc: "help" },
 * ]} />
 *
 * @example
 * // Grouped in a column
 * <KeyHints
 *   direction="column"
 *   grouped
 *   bindings={[
 *     { key: "↑↓",    desc: "move cursor",   group: "Navigation" },
 *     { key: "enter", desc: "open",           group: "Navigation" },
 *     { key: "d",     desc: "delete",         group: "Actions"    },
 *     { key: "r",     desc: "rename",         group: "Actions"    },
 *   ]}
 * />
 */
export function KeyHints({
  bindings = [],
  variant   = "default",
  size      = "md",
  separator = "dot",
  direction = "row",
  grouped   = false,
  wrap      = false,
}) {
  const sep = SEPARATOR_STYLES[separator];

  // ── Grouped layout ─────────────────────────────────────────────────────────
  if (grouped) {
    // Collect unique groups preserving order
    const groups = [];
    const seen   = new Set();
    for (const b of bindings) {
      const g = b.group ?? "";
      if (!seen.has(g)) { seen.add(g); groups.push(g); }
    }

    return (
      <Box flexDirection="column" gap={1}>
        {groups.map((g) => {
          const items = bindings.filter((b) => (b.group ?? "") === g);
          return (
            <Box key={g} flexDirection="column" gap={0}>
              {g && (
                <Box marginBottom={0}>
                  <Text color="gray" dimColor bold>{g}</Text>
                </Box>
              )}
              <Box
                flexDirection={direction}
                flexWrap={wrap ? "wrap" : "nowrap"}
                gap={direction === "row" ? 1 : 0}
              >
                {items.map((b, i) => (
                  <Box key={i} flexDirection="row" gap={1}>
                    {direction === "row" && i > 0 && sep && (
                      <Text color="gray" dimColor>{sep}</Text>
                    )}
                    <KeyChip binding={b} variant={variant} size={size} />
                  </Box>
                ))}
              </Box>
            </Box>
          );
        })}
      </Box>
    );
  }

  // ── Flat layout ────────────────────────────────────────────────────────────
  return (
    <Box
      flexDirection={direction}
      flexWrap={wrap ? "wrap" : "nowrap"}
      gap={direction === "row" ? 1 : 0}
    >
      {bindings.map((b, i) => (
        <Box key={i} flexDirection="row" gap={1}>
          {direction === "row" && i > 0 && sep && (
            <Text color="gray" dimColor>{sep}</Text>
          )}
          <KeyChip binding={b} variant={variant} size={size} />
        </Box>
      ))}
    </Box>
  );
}

// ─── Preset binding collections ───────────────────────────────────────────────

/** Common navigation hints — arrow keys + enter + escape */
export const NAV_BINDINGS = [
  { key: "↑↓",    desc: "navigate" },
  { key: "enter", desc: "select"   },
  { key: "esc",   desc: "back"     },
];

/** Common list hints */
export const LIST_BINDINGS = [
  { key: "↑↓",    desc: "move"    },
  { key: "enter", desc: "open"    },
  { key: "d",     desc: "delete"  },
  { key: "r",     desc: "rename"  },
  { key: "?",     desc: "help"    },
];

/** Multi-select hints */
export const MULTI_SELECT_BINDINGS = [
  { key: "↑↓",    desc: "navigate" },
  { key: "space", desc: "toggle"   },
  { key: "a",     desc: "all"      },
  { key: "enter", desc: "confirm"  },
  { key: "esc",   desc: "cancel"   },
];

/** Vim-style motion hints */
export const VIM_BINDINGS = [
  { key: "h",  desc: "left",  group: "Motion" },
  { key: "j",  desc: "down",  group: "Motion" },
  { key: "k",  desc: "up",    group: "Motion" },
  { key: "l",  desc: "right", group: "Motion" },
  { key: "gg", desc: "top",   group: "Jump"   },
  { key: "G",  desc: "bottom",group: "Jump"   },
  { key: "dd", desc: "delete",group: "Edit"   },
  { key: "yy", desc: "yank",  group: "Edit"   },
  { key: "p",  desc: "paste", group: "Edit"   },
];

export default KeyHints;

// ─── Demo (bun run KeyHints.jsx) ─────────────────────────────────────────────

function Divider({ label }) {
  return (
    <Box marginY={1}>
      <Text color="gray" dimColor>{"─── " + label + " "}</Text>
    </Box>
  );
}

function Demo() {
  return (
    <Box flexDirection="column" paddingX={2} paddingY={1}>

      <Divider label="default (dot separator)" />
      <KeyHints bindings={[
        { key: "↑↓",         desc: "navigate" },
        { key: "enter",      desc: "select"   },
        { key: "space",      desc: "toggle"   },
        { key: ["ctrl","c"], desc: "exit"     },
      ]} />

      <Divider label="separators" />
      <Box flexDirection="column" gap={1}>
        {["dot","pipe","slash","space","none"].map((sep) => (
          <Box key={sep} gap={2}>
            <Text color="gray" dimColor>{sep.padEnd(6)}</Text>
            <KeyHints
              separator={sep}
              bindings={[
                { key: "↑↓",    desc: "move"   },
                { key: "enter", desc: "open"   },
                { key: "esc",   desc: "cancel" },
              ]}
            />
          </Box>
        ))}
      </Box>

      <Divider label="variants" />
      <Box flexDirection="column" gap={1}>
        {["default","muted","bright","plain"].map((v) => (
          <Box key={v} gap={2}>
            <Text color="gray" dimColor>{v.padEnd(8)}</Text>
            <KeyHints
              variant={v}
              bindings={[
                { key: "↑↓",    desc: "navigate" },
                { key: "enter", desc: "select"   },
                { key: "esc",   desc: "cancel"   },
              ]}
            />
          </Box>
        ))}
      </Box>

      <Divider label="sizes" />
      <Box flexDirection="column" gap={1}>
        {["sm","md","lg"].map((s) => (
          <Box key={s} gap={2}>
            <Text color="gray" dimColor>{s.padEnd(4)}</Text>
            <KeyHints
              size={s}
              bindings={[
                { key: "↑↓",    desc: "navigate" },
                { key: "enter", desc: "select"   },
              ]}
            />
          </Box>
        ))}
      </Box>

      <Divider label="multi-key chords" />
      <KeyHints bindings={[
        { key: ["ctrl","c"],  desc: "exit"       },
        { key: ["ctrl","z"],  desc: "suspend"    },
        { key: ["ctrl","r"],  desc: "reload"     },
        { key: ["shift","?"], desc: "help"       },
      ]} />

      <Divider label="column direction" />
      <KeyHints
        direction="column"
        bindings={LIST_BINDINGS}
        variant="muted"
      />

      <Divider label="grouped (vim bindings)" />
      <KeyHints
        direction="column"
        grouped
        variant="plain"
        bindings={VIM_BINDINGS}
      />

      <Divider label="preset — multi-select" />
      <KeyHints bindings={MULTI_SELECT_BINDINGS} variant="muted" />

      <Divider label="typical app footer" />
      <Box
        borderStyle="single"
        borderColor="gray"
        borderTop={true}
        borderBottom={false}
        borderLeft={false}
        borderRight={false}
        paddingTop={0}
        paddingX={0}
      >
        <KeyHints
          variant="muted"
          separator="pipe"
          bindings={[
            { key: "↑↓",         desc: "navigate" },
            { key: "enter",      desc: "open"     },
            { key: "d",          desc: "delete"   },
            { key: "r",          desc: "refresh"  },
            { key: "?",          desc: "help"     },
            { key: ["ctrl","c"], desc: "quit"     },
          ]}
        />
      </Box>

    </Box>
  );
}

render(<Demo />);