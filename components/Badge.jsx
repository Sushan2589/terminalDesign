import React from "react";
import { Box, Text, render } from "ink";

// ─── Theme ────────────────────────────────────────────────────────────────────

const VARIANT_STYLES = {
  info:    { bg: "blueBright",   fg: "white", symbol: "i" },
  success: { bg: "greenBright",  fg: "black", symbol: "✓" },
  warn:    { bg: "yellow",       fg: "black", symbol: "!" },
  error:   { bg: "redBright",    fg: "white", symbol: "✕" },
  neutral: { bg: "gray",         fg: "white", symbol: "·" },
  purple:  { bg: "magentaBright",fg: "white", symbol: "β" },
};

// ─── Badge ────────────────────────────────────────────────────────────────────

/**
 * Badge
 *
 * A compact inline label for statuses, versions, tags, and flags.
 *
 * Props
 * ─────
 * variant   "info" | "success" | "warn" | "error" | "neutral" | "purple"
 *           default: "neutral"
 *
 * label     string — text shown inside the badge.
 *           Falls back to a symbol when omitted (icon-only mode).
 *
 * icon      boolean — prefix the badge with the variant symbol.
 *           default: false
 *
 * pill      boolean — wrap label with spaces for a wider, pill-like look.
 *           default: false
 *
 * inverted  boolean — flip colors: colored text on transparent bg, with brackets.
 *           Useful inside dense log lines where a filled badge is too heavy.
 *           default: false
 *
 * @example
 * // Filled badge
 * <Badge variant="success" label="PASS" />
 *
 * @example
 * // With icon prefix
 * <Badge variant="error" label="FAIL" icon />
 *
 * @example
 * // Icon-only
 * <Badge variant="warn" />
 *
 * @example
 * // Inverted (text-only, no bg)
 * <Badge variant="info" label="v2.4.1" inverted />
 *
 * @example
 * // Pill style
 * <Badge variant="purple" label="BETA" pill />
 */
export function Badge({
  variant = "neutral",
  label,
  icon = false,
  pill = false,
  inverted = false,
}) {
  const { bg, fg, symbol } = VARIANT_STYLES[variant];

  // ── Inverted mode: [ LABEL ] in variant color, no background ──────────────
  if (inverted) {
    const text = label ?? symbol;
    return (
      <Text color={bg}>
        {"["}
        <Text color={bg} bold>{text}</Text>
        {"]"}
      </Text>
    );
  }

  // ── Filled mode ────────────────────────────────────────────────────────────
  const prefix   = icon ? `${symbol} ` : "";
  const padLeft  = pill ? " " : "";
  const padRight = pill ? " " : "";
  const content  = label
    ? `${padLeft}${prefix}${label}${padRight}`
    : ` ${symbol} `;

  return (
    <Text backgroundColor={bg} color={fg} bold>
      {content}
    </Text>
  );
}

// ─── Convenience wrappers ─────────────────────────────────────────────────────

export const InfoBadge    = (props) => <Badge variant="info"    {...props} />;
export const SuccessBadge = (props) => <Badge variant="success" {...props} />;
export const WarnBadge    = (props) => <Badge variant="warn"    {...props} />;
export const ErrorBadge   = (props) => <Badge variant="error"   {...props} />;
export const NeutralBadge = (props) => <Badge variant="neutral" {...props} />;
export const PurpleBadge  = (props) => <Badge variant="purple"  {...props} />;

export default Badge;

// ─── Demo (bun run Badge.jsx) ─────────────────────────────────────────────────

function Row({ label, children }) {
  return (
    <Box gap={1} marginBottom={0}>
      <Text color="gray" dimColor>{label.padEnd(18)}</Text>
      {children}
    </Box>
  );
}

function Demo() {
  return (
    <Box flexDirection="column" gap={1} paddingX={2} paddingY={1}>

      {/* ── Filled ── */}
      <Row label="filled">
        <Badge variant="info"    label="INFO"    />
        <Badge variant="success" label="PASS"    />
        <Badge variant="warn"    label="WARN"    />
        <Badge variant="error"   label="FAIL"    />
        <Badge variant="neutral" label="SKIP"    />
        <Badge variant="purple"  label="BETA"    />
      </Row>

      {/* ── With icon prefix ── */}
      <Row label="icon + label">
        <Badge variant="info"    label="INFO"  icon />
        <Badge variant="success" label="PASS"  icon />
        <Badge variant="warn"    label="WARN"  icon />
        <Badge variant="error"   label="FAIL"  icon />
      </Row>

      {/* ── Icon only ── */}
      <Row label="icon only">
        <Badge variant="info"    />
        <Badge variant="success" />
        <Badge variant="warn"    />
        <Badge variant="error"   />
        <Badge variant="neutral" />
        <Badge variant="purple"  />
      </Row>

      {/* ── Pill ── */}
      <Row label="pill">
        <Badge variant="success" label="v2.4.1" pill />
        <Badge variant="neutral" label="MIT"    pill />
        <Badge variant="purple"  label="BETA"   pill />
        <Badge variant="info"    label="main"   pill />
      </Row>

      {/* ── Inverted ── */}
      <Row label="inverted">
        <Badge variant="info"    label="INFO"  inverted />
        <Badge variant="success" label="PASS"  inverted />
        <Badge variant="warn"    label="WARN"  inverted />
        <Badge variant="error"   label="FAIL"  inverted />
        <Badge variant="neutral" label="SKIP"  inverted />
      </Row>

      {/* ── Real-world usage example ── */}
      <Box marginTop={1} flexDirection="column" gap={0}>
        <Text color="gray">─── real-world usage ───────────────────────────</Text>
        <Box gap={2} marginTop={1}>
          <Text>ink</Text>
          <Badge variant="success" label="5.0.1" pill />
          <Badge variant="neutral" label="MIT"   pill />
          <Badge variant="info"    label="ESM"   pill />
        </Box>
        <Box gap={2}>
          <Text>zod</Text>
          <Badge variant="warn"   label="3.22.4" pill />
          <Badge variant="neutral" label="MIT"   pill />
        </Box>
        <Box gap={2}>
          <Text>legacy-pkg</Text>
          <Badge variant="error" label="DEPRECATED" icon />
        </Box>
      </Box>

    </Box>
  );
}

render(<Demo />);