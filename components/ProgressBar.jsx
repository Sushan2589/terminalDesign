import React, { useState, useEffect } from "react";
import { Box, Text, render } from "ink";

// ─── Theme ────────────────────────────────────────────────────────────────────

const VARIANT_COLORS = {
  default: { fill: "blueBright",   track: "gray", label: "blueBright"   },
  success: { fill: "greenBright",  track: "gray", label: "greenBright"  },
  warn:    { fill: "yellow",       track: "gray", label: "yellow"       },
  error:   { fill: "redBright",    track: "gray", label: "redBright"    },
  muted:   { fill: "gray",         track: "gray", label: "gray"         },
};

// ─── Bar styles ───────────────────────────────────────────────────────────────

const BAR_STYLES = {
  // filled block chars
  block:  { filled: "█", empty: "░" },
  // thin line
  thin:   { filled: "─", empty: "─" },
  // shaded
  shade:  { filled: "▓", empty: "░" },
  // dotted
  dots:   { filled: "●", empty: "·" },
  // classic ASCII
  ascii:  { filled: "#", empty: "-" },
  // braille-based smooth
  smooth: { filled: "▰", empty: "▱" },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function clamp(val, min, max) {
  return Math.min(max, Math.max(min, val));
}

function formatPct(value) {
  return `${Math.round(clamp(value, 0, 100))}%`;
}

// ─── ProgressBar ─────────────────────────────────────────────────────────────

/**
 * ProgressBar
 *
 * A single-line progress bar with label, percentage, value display,
 * multiple fill styles, and variant coloring.
 *
 * Props
 * ─────
 * value      number — current progress 0–100.               default: 0
 * total      number — when set, shows "value/total" instead of percent.
 *
 * label      string — text shown to the left of the bar.
 * labelWidth number — fixed width for label column.          default: 14
 *
 * width      number — total character width of the bar track. default: 30
 *
 * variant    "default" | "success" | "warn" | "error" | "muted"
 *            Auto-switches to "success" at 100%, "error" below threshold.
 *            default: "default"
 *
 * style      "block" | "thin" | "shade" | "dots" | "ascii" | "smooth"
 *            default: "block"
 *
 * showPct    boolean — show percentage on the right.         default: true
 * showValue  boolean — show "value/total" on the right.      default: false
 *
 * errorBelow number — auto-switch to error variant when value < threshold.
 *            default: undefined (disabled)
 *
 * animated   boolean — animate value from 0 to `value` on mount.
 *            default: false
 *
 * @example
 * // Basic
 * <ProgressBar value={72} label="Uploading" />
 *
 * @example
 * // With total count
 * <ProgressBar value={34} total={142} label="Tests" showValue />
 *
 * @example
 * // Custom style and variant
 * <ProgressBar value={55} style="smooth" variant="warn" label="Memory" />
 *
 * @example
 * // Auto error threshold
 * <ProgressBar value={12} label="Disk" errorBelow={20} />
 *
 * @example
 * // Animated on mount
 * <ProgressBar value={88} label="Loading" animated />
 */
export function ProgressBar({
  value = 0,
  total,
  label = "",
  labelWidth = 14,
  width = 30,
  variant = "default",
  style = "block",
  showPct = true,
  showValue = false,
  errorBelow,
  animated = false,
}) {
  const [displayed, setDisplayed] = useState(animated ? 0 : value);

  // Animate from 0 → value on mount
  useEffect(() => {
    if (!animated) {
      setDisplayed(value);
      return;
    }
    let current = 0;
    const step  = Math.max(1, value / 30); // ~30 frames
    const id    = setInterval(() => {
      current += step;
      if (current >= value) {
        setDisplayed(value);
        clearInterval(id);
      } else {
        setDisplayed(Math.round(current));
      }
    }, 30);
    return () => clearInterval(id);
  }, [value, animated]);

  // Auto-resolve variant
  const resolvedVariant =
    displayed >= 100
      ? "success"
      : errorBelow !== undefined && displayed < errorBelow
      ? "error"
      : variant;

  const { fill: fillColor, track: trackColor, label: labelColor } =
    VARIANT_COLORS[resolvedVariant] ?? VARIANT_COLORS.default;

  const { filled, empty } = BAR_STYLES[style] ?? BAR_STYLES.block;

  // Build the bar string
  const pct        = clamp(displayed, 0, 100) / 100;
  const filledCols = Math.round(pct * width);
  const emptyCols  = width - filledCols;
  const bar        = filled.repeat(filledCols) + empty.repeat(emptyCols);

  // Right-side annotation
  let annotation = "";
  if (showValue && total !== undefined) {
    annotation = `${Math.round(displayed * total / 100)}/${total}`;
  } else if (showPct) {
    annotation = formatPct(displayed);
  }

  return (
    <Box gap={1}>
      {/* Label column */}
      {label && (
        <Box width={labelWidth}>
          <Text color="gray" dimColor>{label.slice(0, labelWidth)}</Text>
        </Box>
      )}

      {/* Track — filled portion */}
      <Text color={fillColor}>{bar.slice(0, filledCols)}</Text>
      {/* Track — empty portion */}
      <Text color={trackColor} dimColor>{bar.slice(filledCols)}</Text>

      {/* Annotation */}
      {annotation && (
        <Box width={6} justifyContent="flex-end">
          <Text color={labelColor}>{annotation}</Text>
        </Box>
      )}
    </Box>
  );
}

// ─── MultiProgressBar ─────────────────────────────────────────────────────────

/**
 * MultiProgressBar
 *
 * Renders a labeled list of progress bars aligned in a column grid.
 *
 * Props
 * ─────
 * items   Array<{ label: string; value: number; total?: number;
 *                 variant?: string; style?: string }>
 *
 * width       number — bar track width.      default: 30
 * labelWidth  number — label column width.   default: 14
 * showPct     boolean                        default: true
 *
 * @example
 * <MultiProgressBar items={[
 *   { label: "Uploading",  value: 72 },
 *   { label: "Tests",      value: 100, variant: "success" },
 *   { label: "Lint",       value: 43,  variant: "warn"    },
 * ]} />
 */
export function MultiProgressBar({
  items = [],
  width = 30,
  labelWidth = 14,
  showPct = true,
}) {
  return (
    <Box flexDirection="column" gap={0}>
      {items.map((item, i) => (
        <ProgressBar
          key={i}
          value={item.value}
          total={item.total}
          label={item.label}
          labelWidth={labelWidth}
          width={width}
          variant={item.variant ?? "default"}
          style={item.style ?? "block"}
          showPct={showPct && item.total === undefined}
          showValue={item.total !== undefined}
          errorBelow={item.errorBelow}
          animated={item.animated}
        />
      ))}
    </Box>
  );
}

export default ProgressBar;

// ─── Demo (bun run ProgressBar.jsx) ──────────────────────────────────────────

function Divider({ label }) {
  return (
    <Box marginY={1}>
      <Text color="gray" dimColor>{"─── " + label + " "}</Text>
    </Box>
  );
}

function AnimatedDemo() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(id); return 100; }
        return p + 2;
      });
    }, 80);
    return () => clearInterval(id);
  }, []);

  return (
    <Box flexDirection="column" paddingX={2} paddingY={1}>

      <Divider label="variants" />
      <MultiProgressBar items={[
        { label: "Uploading",  value: 72                      },
        { label: "Tests",      value: 100, variant: "success" },
        { label: "Lint",       value: 43,  variant: "warn"    },
        { label: "Deploy",     value: 18,  variant: "error"   },
        { label: "Backup",     value: 55,  variant: "muted"   },
      ]} />

      <Divider label="bar styles" />
      <Box flexDirection="column" gap={0}>
        <ProgressBar value={65} label="block"  style="block"  />
        <ProgressBar value={65} label="smooth" style="smooth" />
        <ProgressBar value={65} label="shade"  style="shade"  />
        <ProgressBar value={65} label="dots"   style="dots"   />
        <ProgressBar value={65} label="thin"   style="thin"   />
        <ProgressBar value={65} label="ascii"  style="ascii"  />
      </Box>

      <Divider label="with total count" />
      <Box flexDirection="column" gap={0}>
        <ProgressBar value={Math.round(34/142*100)} total={142} label="Tests"   showValue showPct={false} />
        <ProgressBar value={Math.round(8/20*100)}   total={20}  label="Files"   showValue showPct={false} variant="warn" />
        <ProgressBar value={100}                    total={60}  label="Seconds" showValue showPct={false} variant="success" />
      </Box>

      <Divider label="auto error threshold" />
      <Box flexDirection="column" gap={0}>
        <ProgressBar value={82} label="CPU"    errorBelow={20} />
        <ProgressBar value={15} label="Memory" errorBelow={20} />
        <ProgressBar value={8}  label="Disk"   errorBelow={20} />
      </Box>

      <Divider label="live progress" />
      <ProgressBar
        value={progress}
        label="Building…"
        width={36}
        style="smooth"
        animated={false}
      />
      <Box marginTop={1}>
        <Text color="gray" dimColor>ctrl+c to exit</Text>
      </Box>

    </Box>
  );
}

render(<AnimatedDemo />);