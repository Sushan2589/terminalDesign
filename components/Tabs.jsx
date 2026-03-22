import React, { useState, useCallback } from "react";
import { Box, Text, useInput, render } from "ink";

// ─── Theme ────────────────────────────────────────────────────────────────────

const VARIANT_STYLES = {
  default: { active: "blueBright",  inactive: "gray", border: "gray"        },
  success: { active: "greenBright", inactive: "gray", border: "gray"        },
  warn:    { active: "yellow",      inactive: "gray", border: "gray"        },
  error:   { active: "redBright",   inactive: "gray", border: "gray"        },
};

const STYLE_CHARS = {
  // underline active tab with a bar
  underline: {
    activeBar:   "─",
    inactiveBar: " ",
    separator:   " ",
  },
  // box-style — active tab has a top border
  box: {
    activeBar:   "▄",
    inactiveBar: " ",
    separator:   "│",
  },
  // pill — fill active tab background
  pill: {
    activeBar:   null, // handled via backgroundColor
    inactiveBar: null,
    separator:   " ",
  },
  // minimal — just bold text, no decorators
  minimal: {
    activeBar:   null,
    inactiveBar: null,
    separator:   "  ",
  },
};

// ─── TabBar ───────────────────────────────────────────────────────────────────

function TabBar({ tabs, activeIndex, variant, tabStyle, onTabChange }) {
  const { active: activeColor, inactive: inactiveColor, border: borderColor } =
    VARIANT_STYLES[variant] ?? VARIANT_STYLES.default;
  const chars = STYLE_CHARS[tabStyle] ?? STYLE_CHARS.underline;

  return (
    <Box flexDirection="column">
      {/* ── Tab labels row ── */}
      <Box flexDirection="row">
        {tabs.map((tab, i) => {
          const isActive   = i === activeIndex;
          const isDisabled = tab.disabled;

          if (tabStyle === "pill") {
            return (
              <Box key={tab.id ?? i} flexDirection="row">
                {i > 0 && <Text> </Text>}
                <Box
                  paddingX={2}
                  backgroundColor={isActive ? activeColor : undefined}
                >
                  <Text
                    color={isActive ? "black" : isDisabled ? "gray" : inactiveColor}
                    bold={isActive}
                    dimColor={isDisabled}
                  >
                    {tab.label}
                    {tab.badge !== undefined
                      ? ` (${tab.badge})`
                      : ""}
                  </Text>
                </Box>
              </Box>
            );
          }

          if (tabStyle === "minimal") {
            return (
              <Box key={tab.id ?? i} flexDirection="row">
                {i > 0 && (
                  <Text color="gray" dimColor>{chars.separator}</Text>
                )}
                <Text
                  color={isActive ? activeColor : isDisabled ? "gray" : inactiveColor}
                  bold={isActive}
                  dimColor={isDisabled}
                  underline={isActive}
                >
                  {tab.label}
                  {tab.badge !== undefined ? ` ${tab.badge}` : ""}
                </Text>
              </Box>
            );
          }

          // underline / box styles
          const padH = 2;
          const labelText =
            tab.label + (tab.badge !== undefined ? ` (${tab.badge})` : "");
          const width = labelText.length + padH * 2;

          return (
            <Box key={tab.id ?? i} flexDirection="row" alignItems="flex-end">
              {/* Separator between tabs */}
              {i > 0 && tabStyle === "box" && (
                <Text color={borderColor} dimColor>{chars.separator}</Text>
              )}

              <Box flexDirection="column" width={width}>
                {/* Tab-style top indicator (box only) */}
                {tabStyle === "box" && (
                  <Text color={isActive ? activeColor : "gray"} dimColor={!isActive}>
                    {isActive ? chars.activeBar.repeat(width) : " ".repeat(width)}
                  </Text>
                )}

                {/* Label */}
                <Box paddingX={padH}>
                  <Text
                    color={isActive ? activeColor : isDisabled ? "gray" : inactiveColor}
                    bold={isActive}
                    dimColor={isDisabled}
                  >
                    {labelText}
                  </Text>
                </Box>

                {/* Underline indicator (underline style only) */}
                {tabStyle === "underline" && (
                  <Text color={isActive ? activeColor : borderColor} dimColor={!isActive}>
                    {(isActive ? chars.activeBar : chars.inactiveBar).repeat(width)}
                  </Text>
                )}
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* ── Bottom border rule (underline / box styles) ── */}
      {(tabStyle === "underline" || tabStyle === "box") && (
        <Text color={borderColor} dimColor>{"─".repeat(60)}</Text>
      )}
    </Box>
  );
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────

/**
 * Tabs
 *
 * A keyboard-navigable tabbed container. Left/Right arrows switch tabs.
 * Renders a tab bar + the active panel's content.
 *
 * Props
 * ─────
 * tabs   Array<{
 *   id?:       string | number
 *   label:     string
 *   badge?:    string | number   — short annotation shown in the tab (e.g. count)
 *   disabled?: boolean
 *   content:   ReactNode         — panel body
 * }>
 *
 * initialIndex  number — starting active tab.     default: 0
 * variant       "default"|"success"|"warn"|"error" default: "default"
 * tabStyle      "underline"|"box"|"pill"|"minimal" default: "underline"
 * onChange      (tab, index) => void
 *
 * showInstructions  boolean — show ← → key hint.  default: true
 *
 * @example
 * <Tabs tabs={[
 *   { label: "Output",   content: <Text>Build log…</Text>    },
 *   { label: "Errors",   badge: 3, content: <ErrorList />    },
 *   { label: "Warnings", badge: 1, content: <WarnList />     },
 *   { label: "Stats",    content: <StatsPanel />             },
 * ]} />
 *
 * @example
 * // Pill style, controlled
 * <Tabs
 *   tabStyle="pill"
 *   variant="success"
 *   tabs={[...]}
 *   onChange={(tab) => console.log(tab.label)}
 * />
 */
export function Tabs({
  tabs = [],
  initialIndex = 0,
  variant = "default",
  tabStyle = "underline",
  onChange,
  showInstructions = true,
}) {
  const [activeIndex, setActiveIndex] = useState(
    Math.min(initialIndex, tabs.length - 1)
  );

  const switchTab = useCallback((dir) => {
    setActiveIndex((prev) => {
      let next = prev + dir;
      // Skip disabled
      while (next >= 0 && next < tabs.length && tabs[next]?.disabled) {
        next += dir;
      }
      if (next < 0 || next >= tabs.length) return prev;
      onChange?.(tabs[next], next);
      return next;
    });
  }, [tabs, onChange]);

  useInput(useCallback((_, key) => {
    if (key.leftArrow)  switchTab(-1);
    if (key.rightArrow) switchTab(1);
    // Number keys 1-9 jump directly
    const num = parseInt(_, 10);
    if (!isNaN(num) && num >= 1 && num <= tabs.length) {
      const i = num - 1;
      if (!tabs[i]?.disabled) {
        setActiveIndex(i);
        onChange?.(tabs[i], i);
      }
    }
  }, [switchTab, tabs, onChange]));

  const activeTab = tabs[activeIndex];

  return (
    <Box flexDirection="column">
      {/* Tab bar */}
      <TabBar
        tabs={tabs}
        activeIndex={activeIndex}
        variant={variant}
        tabStyle={tabStyle}
        onTabChange={setActiveIndex}
      />

      {/* Active panel */}
      <Box marginTop={1}>
        {activeTab?.content}
      </Box>

      {/* Key hints */}
      {showInstructions && (
        <Box marginTop={1} gap={2}>
          <Text color="gray" dimColor>← → switch tab</Text>
          <Text color="gray" dimColor>1–{tabs.length} jump</Text>
        </Box>
      )}
    </Box>
  );
}

export default Tabs;

// ─── Demo (bun run Tabs.jsx) ─────────────────────────────────────────────────

function Panel({ title, lines = [], color = "white" }) {
  return (
    <Box flexDirection="column" gap={0}>
      <Text color="gray" dimColor>{title}</Text>
      {lines.map((l, i) => (
        <Text key={i} color={color}>{l}</Text>
      ))}
    </Box>
  );
}

const DEMO_TABS = [
  {
    label: "Output",
    content: (
      <Panel
        title="Build output"
        lines={[
          "› Compiled 42 files in 2341ms",
          "› Tree-shaking complete",
          "› Bundle size: 128 kB (gzipped: 38 kB)",
          "✓ Build succeeded",
        ]}
        color="white"
      />
    ),
  },
  {
    label: "Errors",
    badge: 2,
    content: (
      <Panel
        title="Type errors"
        lines={[
          "src/auth.ts:88  — Argument of type 'string' not assignable to 'number'",
          "src/db.ts:12    — Object is possibly 'undefined'",
        ]}
        color="redBright"
      />
    ),
  },
  {
    label: "Warnings",
    badge: 1,
    content: (
      <Panel
        title="Warnings"
        lines={[
          "src/legacy.ts:4 — 'require' is deprecated, use ESM import",
        ]}
        color="yellow"
      />
    ),
  },
  {
    label: "Stats",
    content: (
      <Panel
        title="Build stats"
        lines={[
          "Files compiled  :  42",
          "Duration        :  2341 ms",
          "Cache hits      :  38 / 42",
          "Peak memory     :  412 MB",
        ]}
        color="blueBright"
      />
    ),
  },
  {
    label: "Disabled",
    disabled: true,
    content: <Text>You should not see this.</Text>,
  },
];

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

      <Divider label="underline (default)" />
      <Tabs tabs={DEMO_TABS} tabStyle="underline" showInstructions />

      <Divider label="box style" />
      <Tabs tabs={DEMO_TABS} tabStyle="box" variant="default" showInstructions={false} />

      <Divider label="pill style" />
      <Tabs tabs={DEMO_TABS} tabStyle="pill" variant="success" showInstructions={false} />

      <Divider label="minimal style" />
      <Tabs tabs={DEMO_TABS} tabStyle="minimal" variant="warn" showInstructions={false} />

      <Box marginTop={1}>
        <Text color="gray" dimColor>← → switch  ·  1–4 jump  ·  ctrl+c exit</Text>
      </Box>
    </Box>
  );
}

render(<Demo />);