import React, { useState, useEffect } from "react";
import { Box, Text, render } from "ink";

// ─── Spinner frames ───────────────────────────────────────────────────────────

const SPINNERS = {
  dots:    { frames: ["⠋","⠙","⠹","⠸","⠼","⠴","⠦","⠧","⠇","⠏"], interval: 80  },
  line:    { frames: ["─","\\","|","/"],                            interval: 120 },
  arc:     { frames: ["◜","◠","◝","◞","◡","◟"],                    interval: 100 },
  bounce:  { frames: ["⠁","⠂","⠄","⠂"],                            interval: 120 },
  pulse:   { frames: ["▁","▂","▃","▄","▅","▆","▇","█","▇","▆","▅","▄","▃","▂"], interval: 80 },
  arrow:   { frames: ["←","↖","↑","↗","→","↘","↓","↙"],            interval: 120 },
  clock:   { frames: ["🕐","🕑","🕒","🕓","🕔","🕕","🕖","🕗","🕘","🕙","🕚","🕛"], interval: 100 },
  minimal: { frames: ["·","·","·","●"],                             interval: 200 },
};

// ─── Theme ────────────────────────────────────────────────────────────────────

const VARIANT_COLORS = {
  default: "blueBright",
  success: "greenBright",
  warn:    "yellow",
  error:   "redBright",
  muted:   "gray",
};

// ─── Spinner ──────────────────────────────────────────────────────────────────

/**
 * Spinner
 *
 * An animated terminal spinner with optional label, status, and multiple frame sets.
 *
 * Props
 * ─────
 * type      keyof SPINNERS — animation frame set.            default: "dots"
 *           "dots" | "line" | "arc" | "bounce" | "pulse" | "arrow" | "clock" | "minimal"
 *
 * label     string — text shown after the spinner frame.
 *
 * variant   "default" | "success" | "warn" | "error" | "muted"
 *           default: "default"
 *
 * status    "spinning" | "done" | "error"
 *           When "done"  → spinner stops, replaced with ✓ in green.
 *           When "error" → spinner stops, replaced with ✕ in red.
 *           default: "spinning"
 *
 * interval  number — ms per frame. Overrides the type default when set.
 *
 * prefix    string — static character shown before the spinner frame.
 *
 * @example
 * // Basic
 * <Spinner label="Installing packages…" />
 *
 * @example
 * // Custom type
 * <Spinner type="arc" label="Fetching types…" variant="muted" />
 *
 * @example
 * // Controlled status
 * <Spinner label="Building…" status={done ? "done" : "spinning"} />
 *
 * @example
 * // With prefix
 * <Spinner prefix="›" label="Connecting to database…" />
 */
export function Spinner({
  type = "dots",
  label = "",
  variant = "default",
  status = "spinning",
  interval: intervalOverride,
  prefix = "",
}) {
  const { frames, interval: defaultInterval } = SPINNERS[type] ?? SPINNERS.dots;
  const interval = intervalOverride ?? defaultInterval;
  const color    = VARIANT_COLORS[variant] ?? VARIANT_COLORS.default;

  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (status !== "spinning") return;
    const id = setInterval(() => setFrame((f) => (f + 1) % frames.length), interval);
    return () => clearInterval(id);
  }, [frames, interval, status]);

  // ── Resolved glyph ─────────────────────────────────────────────────────────
  let glyph, glyphColor;

  if (status === "done") {
    glyph      = "✓";
    glyphColor = "greenBright";
  } else if (status === "error") {
    glyph      = "✕";
    glyphColor = "redBright";
  } else {
    glyph      = frames[frame];
    glyphColor = color;
  }

  return (
    <Box gap={1}>
      {/* Optional static prefix */}
      {prefix && <Text color="gray">{prefix}</Text>}

      {/* Animated / status glyph */}
      <Text color={glyphColor} bold>{glyph}</Text>

      {/* Label */}
      {label && (
        <Text color={status === "spinning" ? "white" : glyphColor}>
          {label}
        </Text>
      )}
    </Box>
  );
}

// ─── SpinnerGroup ─────────────────────────────────────────────────────────────

/**
 * SpinnerGroup
 *
 * Renders a vertical list of Spinner items, each with its own independent state.
 * Useful for showing concurrent async tasks (install, build, lint, etc.)
 *
 * Props
 * ─────
 * items   Array<{ label: string; status?: "spinning"|"done"|"error"; type?: string; variant?: string }>
 *
 * @example
 * <SpinnerGroup items={[
 *   { label: "Installing packages", status: "done"     },
 *   { label: "Building…",           status: "spinning" },
 *   { label: "Running lint",        status: "error"    },
 * ]} />
 */
export function SpinnerGroup({ items = [] }) {
  return (
    <Box flexDirection="column" gap={0}>
      {items.map((item, i) => (
        <Spinner
          key={i}
          label={item.label}
          status={item.status ?? "spinning"}
          type={item.type ?? "dots"}
          variant={item.variant ?? "default"}
          prefix={item.prefix}
        />
      ))}
    </Box>
  );
}

export default Spinner;

// ─── Demo (bun run Spinner.jsx) ───────────────────────────────────────────────

function Divider({ label }) {
  return (
    <Box marginY={1}>
      <Text color="gray" dimColor>{"─── " + label + " "}</Text>
    </Box>
  );
}

function Demo() {
  // Simulate a task completing after 3s
  const [buildStatus, setBuildStatus] = useState("spinning");
  const [lintStatus,  setLintStatus]  = useState("spinning");
  const [testStatus,  setTestStatus]  = useState("spinning");

  useEffect(() => {
    const t1 = setTimeout(() => setLintStatus("done"),    1200);
    const t2 = setTimeout(() => setTestStatus("error"),   2400);
    const t3 = setTimeout(() => setBuildStatus("done"),   3600);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, []);

  return (
    <Box flexDirection="column" paddingX={2} paddingY={1}>

      <Divider label="all spinner types" />
      <Box flexDirection="column" gap={0}>
        <Spinner type="dots"    label="dots    — installing packages"  />
        <Spinner type="line"    label="line    — fetching registry"    variant="muted"   />
        <Spinner type="arc"     label="arc     — compiling sources"    variant="default" />
        <Spinner type="bounce"  label="bounce  — waiting for lock"     variant="warn"    />
        <Spinner type="pulse"   label="pulse   — streaming output"     variant="muted"   />
        <Spinner type="arrow"   label="arrow   — resolving deps"       variant="default" />
        <Spinner type="minimal" label="minimal — background task"      variant="muted"   />
      </Box>

      <Divider label="status transitions (watch me)" />
      <Box flexDirection="column" gap={0}>
        <Spinner label="Running lint…"   status={lintStatus}  />
        <Spinner label="Running tests…"  status={testStatus}  variant="default" />
        <Spinner label="Building…"       status={buildStatus} />
      </Box>

      <Divider label="with prefix" />
      <Box flexDirection="column" gap={0}>
        <Spinner prefix="›" label="Connecting to database…" type="dots" />
        <Spinner prefix="›" label="Syncing schema…"         type="dots" variant="muted" />
      </Box>

      <Divider label="SpinnerGroup" />
      <SpinnerGroup items={[
        { label: "Install packages",  status: "done"     },
        { label: "Generate types",    status: "spinning" },
        { label: "Run pre-commit",    status: "spinning", type: "arc", variant: "muted" },
        { label: "Upload sourcemaps", status: "error"    },
      ]} />

      <Box marginTop={1}>
        <Text color="gray" dimColor>ctrl+c to exit</Text>
      </Box>
    </Box>
  );
}

render(<Demo />);