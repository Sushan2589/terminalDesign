import React from "react";
import { Box, Text, render } from "ink";

// ─── Theme ────────────────────────────────────────────────────────────────────

const VARIANT_STYLES = {
  info:    { bar: "blueBright",   icon: "i", iconColor: "blueBright",   labelColor: "blueBright",   label: "Info"    },
  success: { bar: "greenBright",  icon: "✓", iconColor: "greenBright",  labelColor: "greenBright",  label: "Done"    },
  warn:    { bar: "yellow",       icon: "!", iconColor: "yellow",       labelColor: "yellow",       label: "Warning" },
  error:   { bar: "redBright",    icon: "✕", iconColor: "redBright",    labelColor: "redBright",    label: "Error"   },
  neutral: { bar: "gray",         icon: "·", iconColor: "gray",         labelColor: "gray",         label: "Note"    },
};

// ─── Alert ────────────────────────────────────────────────────────────────────

/**
 * Alert
 *
 * A prominent inline message block with a colored left-bar accent,
 * an icon, an auto-derived (or custom) label, and a message body.
 *
 * Props
 * ─────
 * variant   "info" | "success" | "warn" | "error" | "neutral"
 *           default: "info"
 *
 * title     string — overrides the default variant label (e.g. "Info", "Done").
 *           Pass an empty string "" to suppress the title entirely.
 *
 * message   string — the main body text.
 *
 * width     number — total width of the alert block in characters.
 *           default: 60
 *
 * compact   boolean — single-line mode: icon + title + message on one row.
 *           default: false
 *
 * children  ReactNode — alternative to `message`; renders below the title.
 *           Ignored when `compact` is true.
 *
 * @example
 * // Auto-label from variant
 * <Alert variant="success" message="Deployed to production in 12s." />
 *
 * @example
 * // Custom title
 * <Alert variant="error" title="Build failed" message="Cannot find module './auth'" />
 *
 * @example
 * // Suppress title
 * <Alert variant="warn" title="" message="Deprecated API usage detected." />
 *
 * @example
 * // Compact single-line
 * <Alert variant="info" message="New version 2.4.1 is available." compact />
 *
 * @example
 * // Rich children
 * <Alert variant="error" title="Type error">
 *   <Text>Argument of type <Text color="redBright">'string'</Text> is not assignable.</Text>
 * </Alert>
 */
export function Alert({
  variant = "info",
  title,
  message,
  width = 60,
  compact = false,
  children,
}) {
  const { bar, icon, iconColor, labelColor, label } = VARIANT_STYLES[variant];

  // Resolve the displayed title: explicit prop > variant default > suppressed
  const displayTitle = title === undefined ? label : title;
  const showTitle    = displayTitle !== "";

  // ── Compact: single line ────────────────────────────────────────────────────
  if (compact) {
    return (
      <Box width={width}>
        {/* Left accent bar */}
        <Text color={bar}>{"▌ "}</Text>

        {/* Icon */}
        <Text color={iconColor} bold>{icon} </Text>

        {/* Title */}
        {showTitle && (
          <Text color={labelColor} bold>{displayTitle}{"  "}</Text>
        )}

        {/* Message */}
        <Text>{message ?? ""}</Text>
      </Box>
    );
  }

  // ── Full: title row + body row ──────────────────────────────────────────────
  return (
    <Box flexDirection="column" width={width}>
      {/* Title row */}
      <Box>
        <Text color={bar}>{"▌ "}</Text>
        <Text color={iconColor} bold>{icon} </Text>
        {showTitle && (
          <Text color={labelColor} bold>{displayTitle}</Text>
        )}
      </Box>

      {/* Body row — indented to align with title text */}
      <Box>
        <Text color={bar}>{"▌ "}</Text>
        
        <Box flexDirection="column" flexGrow={1}>
          {message !== undefined && <Text>{message}</Text>}
          {children}
        </Box>
      </Box>
    </Box>
  );
}

// ─── Convenience wrappers ─────────────────────────────────────────────────────

export const InfoAlert    = (props) => <Alert variant="info"    {...props} />;
export const SuccessAlert = (props) => <Alert variant="success" {...props} />;
export const WarnAlert    = (props) => <Alert variant="warn"    {...props} />;
export const ErrorAlert   = (props) => <Alert variant="error"   {...props} />;

export default Alert;

// ─── Demo (bun run Alert.jsx) ─────────────────────────────────────────────────

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

      <Divider label="all variants — full" />

      <Box flexDirection="column" gap={1}>
        <Alert variant="info"    message="New version 2.4.1 is available." />
        <Alert variant="success" message="Deployed to production in 12s." />
        <Alert variant="warn"    message="Deprecated API usage detected." />
        <Alert variant="error"   message="Failed to resolve module './auth'" />
        <Alert variant="neutral" message="Running in offline mode." />
      </Box>

      <Divider label="custom title" />

      <Box flexDirection="column" gap={1}>
        <Alert variant="error" title="Build failed" message="Cannot find module './auth'" />
        <Alert variant="success" title="All tests passed" message="142 tests · 0 failures · 2341 ms" />
      </Box>

      <Divider label="suppressed title" />

      <Box flexDirection="column" gap={1}>
        <Alert variant="warn" title="" message="Memory usage above 80%. Consider scaling up." />
        <Alert variant="info" title="" message="Listening on :3000" />
      </Box>

      <Divider label="compact (single-line)" />

      <Box flexDirection="column" gap={0}>
        <Alert variant="info"    message="New version 2.4.1 is available." compact />
        <Alert variant="success" message="Deployed to production in 12s."  compact />
        <Alert variant="warn"    message="Deprecated API usage detected."  compact />
        <Alert variant="error"   message="Connection refused on :5432"     compact />
      </Box>

      <Divider label="rich children" />

      <Box flexDirection="column" gap={1}>
        <Alert variant="error" title="Type error">
          <Text>
            Argument of type <Text color="redBright">'string'</Text> is not
            assignable to parameter of type <Text color="redBright">'number'</Text>.
          </Text>
        </Alert>

        <Alert variant="info" title="Hint">
          <Text>
            Run <Text color="blueBright">bun install</Text> to sync dependencies,
            then <Text color="blueBright">bun run dev</Text> to start.
          </Text>
        </Alert>
      </Box>

    </Box>
  );
}

render(<Demo />);