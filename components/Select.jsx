import React, { useState, useCallback } from "react";
import { Box, Text, useInput, render } from "ink";

// ─── Theme ────────────────────────────────────────────────────────────────────

const VARIANT_STYLES = {
  default: { cursor: "blueBright",  selected: "greenBright", focused: "blueBright"  },
  success: { cursor: "greenBright", selected: "greenBright", focused: "greenBright" },
  warn:    { cursor: "yellow",      selected: "yellow",      focused: "yellow"      },
  error:   { cursor: "redBright",   selected: "redBright",   focused: "redBright"   },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const CURSOR_GLYPH   = "›";
const CHECKED_GLYPH  = "◉";
const UNCHECKED_GLYPH= "○";
const RADIO_ON       = "●";
const RADIO_OFF      = "○";

// ─── Select ───────────────────────────────────────────────────────────────────

/**
 * Select
 *
 * A keyboard-navigable list with single-select, multi-select, and radio modes.
 *
 * Props
 * ─────
 * items     Array<{
 *   label:     string
 *   value:     any
 *   hint?:     string   — dim right-side hint text
 *   disabled?: boolean  — grayed out, not selectable
 *   group?:    string   — group header label rendered above item
 * }>
 *
 * mode      "single" | "multi" | "radio"     default: "single"
 *           single — Enter confirms one item, fires onSelect
 *           multi  — Space toggles, Enter confirms all checked, fires onSubmit
 *           radio  — like single but shows radio glyphs
 *
 * variant   "default" | "success" | "warn" | "error"   default: "default"
 *
 * initialIndex   number — starting cursor position.    default: 0
 * initialValues  any[]  — pre-checked values (multi mode).
 *
 * onSelect  (item) => void          — single/radio: fires on Enter
 * onSubmit  (items[]) => void       — multi: fires on Enter with checked items
 * onHighlight (item) => void        — fires whenever cursor moves
 *
 * showInstructions  boolean — show key hint footer.    default: true
 * width             number  — item row width.          default: 40
 * maxVisible        number  — scroll window height.    default: 8
 *
 * @example
 * // Single select
 * <Select
 *   items={[
 *     { label: "bun install",  value: "bun"  },
 *     { label: "npm install",  value: "npm"  },
 *     { label: "pnpm install", value: "pnpm" },
 *   ]}
 *   onSelect={(item) => console.log(item.value)}
 * />
 *
 * @example
 * // Multi select with hints
 * <Select
 *   mode="multi"
 *   items={[
 *     { label: "TypeScript", value: "ts",  hint: "recommended" },
 *     { label: "ESLint",     value: "lint" },
 *     { label: "Prettier",   value: "fmt"  },
 *   ]}
 *   onSubmit={(items) => console.log(items.map(i => i.value))}
 * />
 *
 * @example
 * // With groups
 * <Select
 *   items={[
 *     { label: "Production", value: "prod", group: "Environments" },
 *     { label: "Staging",    value: "stg"  },
 *     { label: "main",       value: "main", group: "Branches"     },
 *     { label: "develop",    value: "dev"  },
 *   ]}
 *   onSelect={(item) => console.log(item.value)}
 * />
 */
export function Select({
  items = [],
  mode = "single",
  variant = "default",
  initialIndex = 0,
  initialValues = [],
  onSelect,
  onSubmit,
  onHighlight,
  showInstructions = true,
  width = 40,
  maxVisible = 8,
}) {
  const { cursor: cursorColor, selected: selectedColor } =
    VARIANT_STYLES[variant] ?? VARIANT_STYLES.default;

  const [cursorIndex, setCursorIndex] = useState(
    Math.min(initialIndex, items.length - 1)
  );
  const [checked, setChecked] = useState(
    new Set(initialValues)
  );
  const [submitted, setSubmitted] = useState(false);

  // Scroll window
  const visibleCount = Math.min(maxVisible, items.length);
  const scrollOffset = Math.max(
    0,
    Math.min(cursorIndex - Math.floor(visibleCount / 2), items.length - visibleCount)
  );
  const visibleItems = items.slice(scrollOffset, scrollOffset + visibleCount);

  const moveCursor = useCallback((dir) => {
    setCursorIndex((prev) => {
      let next = prev + dir;
      // Skip disabled items
      while (
        next >= 0 &&
        next < items.length &&
        items[next]?.disabled
      ) {
        next += dir;
      }
      if (next < 0 || next >= items.length) return prev;
      onHighlight?.(items[next]);
      return next;
    });
  }, [items, onHighlight]);

  useInput(
    useCallback(
      (input, key) => {
        if (submitted) return;

        if (key.upArrow)   { moveCursor(-1); return; }
        if (key.downArrow) { moveCursor(1);  return; }

        // Space — toggle in multi mode
        if (input === " " && mode === "multi") {
          const item = items[cursorIndex];
          if (!item || item.disabled) return;
          setChecked((prev) => {
            const next = new Set(prev);
            next.has(item.value) ? next.delete(item.value) : next.add(item.value);
            return next;
          });
          return;
        }

        // Enter — confirm
        if (key.return) {
          const item = items[cursorIndex];
          if (!item || item.disabled) return;

          if (mode === "multi") {
            const selectedItems = items.filter((i) => checked.has(i.value));
            setSubmitted(true);
            onSubmit?.(selectedItems);
          } else {
            setSubmitted(true);
            onSelect?.(item);
          }
        }
      },
      [cursorIndex, items, mode, checked, submitted, moveCursor, onSelect, onSubmit]
    )
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <Box flexDirection="column">
      {visibleItems.map((item, vi) => {
        const realIndex    = scrollOffset + vi;
        const isCursor     = realIndex === cursorIndex;
        const isChecked    = checked.has(item.value);
        const isDisabled   = item.disabled;
        const showGroup    = item.group !== undefined;

        // Glyph logic
        let glyph = " ";
        let glyphColor = "gray";
        if (mode === "multi") {
          glyph      = isChecked ? CHECKED_GLYPH : UNCHECKED_GLYPH;
          glyphColor = isChecked ? selectedColor : "gray";
        } else if (mode === "radio") {
          glyph      = isCursor ? RADIO_ON : RADIO_OFF;
          glyphColor = isCursor ? cursorColor : "gray";
        }

        return (
          <Box key={item.value ?? item.label} flexDirection="column">
            {/* Group header */}
            {showGroup && (
              <Box paddingLeft={2} marginTop={vi > 0 ? 1 : 0}>
                <Text color="gray" dimColor bold>
                  {item.group}
                </Text>
              </Box>
            )}

            {/* Item row */}
            <Box width={width}>
              {/* Cursor arrow */}
              <Text color={isCursor ? cursorColor : "gray"}>
                {isCursor ? CURSOR_GLYPH : " "}
              </Text>
              <Text> </Text>

              {/* Glyph (multi / radio) */}
              {(mode === "multi" || mode === "radio") && (
                <>
                  <Text color={isDisabled ? "gray" : glyphColor}>{glyph}</Text>
                  <Text> </Text>
                </>
              )}

              {/* Label */}
              <Box flexGrow={1}>
                <Text
                  color={
                    isDisabled
                      ? "gray"
                      : isCursor
                      ? cursorColor
                      : "white"
                  }
                  dimColor={isDisabled}
                  bold={isCursor && !isDisabled}
                >
                  {item.label}
                </Text>
              </Box>

              {/* Hint */}
              {item.hint && (
                <Text color="gray" dimColor>
                  {item.hint}
                </Text>
              )}
            </Box>
          </Box>
        );
      })}

      {/* Scroll indicator */}
      {items.length > maxVisible && (
        <Box paddingLeft={2} marginTop={0}>
          <Text color="gray" dimColor>
            {scrollOffset > 0 ? "↑ " : "  "}
            {`${cursorIndex + 1}/${items.length}`}
            {scrollOffset + visibleCount < items.length ? " ↓" : "  "}
          </Text>
        </Box>
      )}

      {/* Instructions footer */}
      {showInstructions && !submitted && (
        <Box marginTop={1} gap={2}>
          <Text color="gray" dimColor>↑↓ navigate</Text>
          {mode === "multi" && <Text color="gray" dimColor>space toggle</Text>}
          <Text color="gray" dimColor>enter {mode === "multi" ? "confirm" : "select"}</Text>
        </Box>
      )}

      {/* Submitted confirmation */}
      {submitted && (
        <Box marginTop={1}>
          <Text color="greenBright">{"✓ "}</Text>
          <Text color="gray">Selection confirmed</Text>
        </Box>
      )}
    </Box>
  );
}

export default Select;

// ─── Demo (bun run Select.jsx) ───────────────────────────────────────────────

function Divider({ label }) {
  return (
    <Box marginY={1}>
      <Text color="gray" dimColor>{"─── " + label + " "}</Text>
    </Box>
  );
}

function Demo() {
  const [singleResult, setSingleResult] = useState(null);
  const [multiResult,  setMultiResult]  = useState(null);

  return (
    <Box flexDirection="column" paddingX={2} paddingY={1}>

      <Divider label="single select" />
      <Select
        mode="single"
        items={[
          { label: "bun install",   value: "bun",  hint: "fastest"   },
          { label: "pnpm install",  value: "pnpm", hint: "efficient" },
          { label: "npm install",   value: "npm"                      },
          { label: "yarn install",  value: "yarn", disabled: true     },
        ]}
        onSelect={(item) => setSingleResult(item.value)}
        width={44}
      />
      {singleResult && (
        <Box marginTop={1}>
          <Text color="gray">Selected: </Text>
          <Text color="blueBright">{singleResult}</Text>
        </Box>
      )}

      <Divider label="radio select" />
      <Select
        mode="radio"
        variant="success"
        items={[
          { label: "development", value: "dev"  },
          { label: "staging",     value: "stg"  },
          { label: "production",  value: "prod" },
        ]}
        onSelect={(item) => {}}
        width={44}
        showInstructions={false}
      />

      <Divider label="multi select" />
      <Select
        mode="multi"
        variant="default"
        initialValues={["ts"]}
        items={[
          { label: "TypeScript",  value: "ts",     hint: "recommended" },
          { label: "ESLint",      value: "lint"                        },
          { label: "Prettier",    value: "fmt"                         },
          { label: "Husky",       value: "husky",  hint: "git hooks"   },
          { label: "Changesets",  value: "cs",     hint: "versioning"  },
        ]}
        onSubmit={(items) => setMultiResult(items.map((i) => i.value).join(", "))}
        width={44}
      />
      {multiResult && (
        <Box marginTop={1}>
          <Text color="gray">Confirmed: </Text>
          <Text color="greenBright">{multiResult}</Text>
        </Box>
      )}

      <Divider label="grouped items + scroll (maxVisible=4)" />
      <Select
        mode="single"
        maxVisible={4}
        items={[
          { label: "Production",  value: "prod",  group: "Environments" },
          { label: "Staging",     value: "stg"                          },
          { label: "Development", value: "dev"                          },
          { label: "main",        value: "main",  group: "Branches"     },
          { label: "develop",     value: "develop"                      },
          { label: "release/v3",  value: "rel"                          },
        ]}
        onSelect={() => {}}
        width={44}
        showInstructions={false}
      />

      <Box marginTop={1}>
        <Text color="gray" dimColor>ctrl+c to exit</Text>
      </Box>
    </Box>
  );
}

render(<Demo />);