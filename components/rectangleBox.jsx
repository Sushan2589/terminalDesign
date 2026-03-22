import React from "react";
import { Box as InkBox, Text, render } from "ink";

// ─── Theme ────────────────────────────────────────────────────────────────────

const VARIANT_COLORS = {
  default: { border: "gray",        title: "white"       },
  info:    { border: "blueBright",  title: "blueBright"  },
  success: { border: "greenBright", title: "greenBright" },
  warn:    { border: "yellow",      title: "yellow"      },
  error:   { border: "redBright",   title: "redBright"   },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

/**
 * Renders the top border.
 * Splits into three <Text> nodes when a title is present so each segment
 * can carry its own color — Ink doesn't support inline substring styling.
 *
 *  No title:    ┌──────────────────────┐
 *  With title:  ┌─ TITLE ──────────────┐
 */
function TopBorder({ borderColor, titleColor, title, innerWidth }) {
  if (!title) {
    return (
      <Text color={borderColor}>
        {"┌" + "─".repeat(innerWidth) + "┐"}
      </Text>
    );
  }

  // "┌─ " + TITLE + " ─" + padding + "┐"
  const dashAfter = Math.max(0, innerWidth - title.length - 4);

  return (
    <InkBox flexDirection="row">
      <Text color={borderColor}>{"┌─ "}</Text>
      <Text color={titleColor} bold>{title}</Text>
      <Text color={borderColor}>{" ─" + "─".repeat(dashAfter) + "┐"}</Text>
    </InkBox>
  );
}

function BottomBorder({ borderColor, innerWidth }) {
  return (
    <Text color={borderColor}>
      {"└" + "─".repeat(innerWidth) + "┘"}
    </Text>
  );
}

// ─── Box ─────────────────────────────────────────────────────────────────────

/**
 * Box
 *
 * A bordered container with an optional floating title and variant coloring.
 *
 * Props
 * ─────
 * variant   "default" | "info" | "success" | "warn" | "error"   default: "default"
 * title     string — label embedded in the top border             default: undefined
 * padding   0 | 1 | 2 — inner cell padding                       default: 1
 * width     number — fixed character width of the box            default: 60
 * children  ReactNode
 *
 * @example
 * <Box variant="success" title="BUILD PASSED" width={50}>
 *   <Text>142 tests · 0 failures · 2341 ms</Text>
 * </Box>
 */
export function Box({ variant = "default", title, padding = 1, width = 60, children }) {
  const { border: borderColor, title: titleColor } = VARIANT_COLORS[variant];
  const innerWidth = width - 2; // subtract the two side wall chars

  const vertPad = padding > 0 ? Math.floor(padding / 2) : 0;

  return (
    <InkBox flexDirection="column" width={width}>
      <TopBorder
        borderColor={borderColor}
        titleColor={titleColor}
        title={title}
        innerWidth={innerWidth}
      />

      <InkBox>
        <Text color={borderColor}>{"│"}</Text>

        <InkBox
          flexDirection="column"
          paddingLeft={padding}
          paddingRight={padding}
          paddingTop={vertPad}
          paddingBottom={vertPad}
          flexGrow={1}
        >
          {children}
        </InkBox>

        <Text color={borderColor}>{"│"}</Text>
      </InkBox>

      <BottomBorder borderColor={borderColor} innerWidth={innerWidth} />
    </InkBox>
  );
}

// ─── Convenience wrappers ─────────────────────────────────────────────────────

export const InfoBox    = (props) => <Box variant="info"    {...props} />;
export const SuccessBox = (props) => <Box variant="success" {...props} />;
export const WarnBox    = (props) => <Box variant="warn"    {...props} />;
export const ErrorBox   = (props) => <Box variant="error"   {...props} />;

export default Box;

// ─── Demo (bun run Box.jsx) ──────────────────────────────────────────────────

function Demo() {
  return (
    <InkBox flexDirection="column" gap={1} padding={1}>
      <Box variant="default" title="DEFAULT" width={52}>
        <Text>Plain container, no variant.</Text>
      </Box>

      <Box variant="info" title="INFO" width={52}>
        <Text>Deployment target: <Text color="blueBright">production</Text></Text>
      </Box>

      <Box variant="success" title="BUILD PASSED" width={52}>
        <Text>142 tests · 0 failures · 2341 ms</Text>
      </Box>

      <Box variant="warn" title="WARN" width={52}>
        <Text>Memory usage above <Text color="yellow">80%</Text>.</Text>
      </Box>

      <Box variant="error" title="ERROR" width={52}>
        <Text>Connection refused on <Text color="redBright">:5432</Text></Text>
      </Box>

      <InkBox gap={1}>
        <InfoBox title="NOTE" width={25}>
          <Text>Uses InfoBox</Text>
        </InfoBox>
        <SuccessBox title="OK" width={25}>
          <Text>Uses SuccessBox</Text>
        </SuccessBox>
      </InkBox>
    </InkBox>
  );
}

render(<Demo />);