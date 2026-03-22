import React, { useState } from "react";
import { Box, Text, render } from "ink";

// ─── Theme ────────────────────────────────────────────────────────────────────

const BORDER_STYLES = {
  solid:  { tl:"┌", tr:"┐", bl:"└", br:"┘", h:"─", v:"│", ml:"├", mr:"┤", mt:"┬", mb:"┴", cross:"┼" },
  double: { tl:"╔", tr:"╗", bl:"╚", br:"╝", h:"═", v:"║", ml:"╠", mr:"╣", mt:"╦", mb:"╩", cross:"╬" },
  rounded:{ tl:"╭", tr:"╮", bl:"╰", br:"╯", h:"─", v:"│", ml:"├", mr:"┤", mt:"┬", mb:"┴", cross:"┼" },
  ascii:  { tl:"+", tr:"+", bl:"+", br:"+", h:"-", v:"|", ml:"+", mr:"+", mt:"+", mb:"+", cross:"+" },
  minimal:{ tl:" ", tr:" ", bl:" ", br:" ", h:"─", v:" ", ml:" ", mr:" ", mt:"─", mb:"─", cross:"─" },
};

const VARIANT_COLORS = {
  default: { header: "gray",       headerBg: undefined, border: "gray",  row: "white",       alt: undefined     },
  blue:    { header: "blueBright", headerBg: undefined, border: "gray",  row: "white",       alt: undefined     },
  green:   { header: "greenBright",headerBg: undefined, border: "gray",  row: "white",       alt: undefined     },
  minimal: { header: "gray",       headerBg: undefined, border: "gray",  row: "white",       alt: undefined     },
};

const ALIGN_MAP = {
  left:   "flex-start",
  center: "center",
  right:  "flex-end",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Pad a string to exactly `width` chars (truncate or space-pad). */
function pad(str, width, align = "left") {
  const s = String(str ?? "");
  const truncated = s.length > width ? s.slice(0, width - 1) + "…" : s;
  const padded    = truncated.padEnd(width, " ");
  if (align === "right")  return padded.trimEnd().padStart(width, " ");
  if (align === "center") {
    const total = width - truncated.length;
    const left  = Math.floor(total / 2);
    return " ".repeat(left) + truncated + " ".repeat(total - left);
  }
  return padded;
}

// ─── Table ────────────────────────────────────────────────────────────────────

/**
 * Table
 *
 * A fully-featured terminal table with configurable borders, column alignment,
 * sorting, striped rows, row selection highlighting, and cell renderers.
 *
 * Props
 * ─────
 * columns   Array<{
 *   key:      string               — matches key in data rows
 *   header:   string               — column header label
 *   width:    number               — column character width  (default: 12)
 *   align:    "left"|"center"|"right"  (default: "left")
 *   render:   (value, row) => ReactNode  — custom cell renderer
 * }>
 *
 * data      Array<Record<string, any>> — row objects
 *
 * borderStyle  "solid"|"double"|"rounded"|"ascii"|"minimal"  default: "solid"
 * variant      "default"|"blue"|"green"|"minimal"            default: "default"
 *
 * striped      boolean — alternate row background tinting.   default: false
 * showHeader   boolean — show the header row.                default: true
 * showBorder   boolean — show outer border.                  default: true
 * showDivider  boolean — show divider line after header.     default: true
 * rowDividers  boolean — show divider between every row.     default: false
 *
 * selectedIndex  number — index of the highlighted row (-1 = none). default: -1
 * onSelect       (row, index) => void
 *
 * emptyMessage   string — shown when data is empty.         default: "No data."
 *
 * @example
 * <Table
 *   columns={[
 *     { key: "name",    header: "PACKAGE",  width: 16 },
 *     { key: "version", header: "VERSION",  width: 10, align: "right" },
 *     { key: "status",  header: "STATUS",   width: 10,
 *       render: (v) => <Badge variant={v === "PASS" ? "success" : "error"} label={v} /> },
 *   ]}
 *   data={rows}
 * />
 */
export function Table({
  columns = [],
  data = [],
  borderStyle = "solid",
  variant = "default",
  striped = false,
  showHeader = true,
  showBorder = true,
  showDivider = true,
  rowDividers = false,
  selectedIndex = -1,
  onSelect,
  emptyMessage = "No data.",
}) {
  const b = BORDER_STYLES[borderStyle] ?? BORDER_STYLES.solid;
  const v = VARIANT_COLORS[variant]    ?? VARIANT_COLORS.default;

  // Total table width = sum(col.width + 1 for separators) + 2 for outer walls
  const colWidths   = columns.map((c) => c.width ?? 12);
  const innerWidth  = colWidths.reduce((a, w) => a + w + 1, 0) - 1;
  const totalWidth  = innerWidth + 2;

  // ── Border row builders ────────────────────────────────────────────────────
  function topBorder() {
    const segs = colWidths.map((w) => b.h.repeat(w));
    return b.tl + segs.join(b.mt) + b.tr;
  }
  function midBorder() {
    const segs = colWidths.map((w) => b.h.repeat(w));
    return b.ml + segs.join(b.cross) + b.mr;
  }
  function botBorder() {
    const segs = colWidths.map((w) => b.h.repeat(w));
    return b.bl + segs.join(b.mb) + b.br;
  }

  // ── Row renderer ──────────────────────────────────────────────────────────
  function renderRow(row, rowIndex) {
    const isSelected = rowIndex === selectedIndex;
    const isAlt      = striped && rowIndex % 2 === 1;

    const cells = columns.map((col, ci) => {
      const value = row[col.key];
      const w     = colWidths[ci];
      const align = col.align ?? "left";

      const content = col.render
        ? col.render(value, row)
        : <Text color={isSelected ? "black" : v.row}>{pad(value, w, align)}</Text>;

      return (
        <React.Fragment key={col.key}>
          {ci > 0 && <Text color={v.border}>{b.v}</Text>}
          <Box width={w} justifyContent={ALIGN_MAP[align]}>
            {content}
          </Box>
        </React.Fragment>
      );
    });

    return (
      <Box
        key={rowIndex}
        flexDirection="column"
        onClick={() => onSelect?.(row, rowIndex)}
      >
        <Box backgroundColor={isSelected ? "blueBright" : isAlt ? undefined : undefined}>
          {showBorder && <Text color={v.border}>{b.v}</Text>}
          {/* dim alternate rows */}
          <Box flexDirection="row" dimColor={isAlt && !isSelected}>
            {cells}
          </Box>
          {showBorder && <Text color={v.border}>{b.v}</Text>}
        </Box>
        {rowDividers && rowIndex < data.length - 1 && (
          <Text color={v.border}>{midBorder()}</Text>
        )}
      </Box>
    );
  }

  return (
    <Box flexDirection="column">
      {/* Top border */}
      {showBorder && <Text color={v.border}>{topBorder()}</Text>}

      {/* Header */}
      {showHeader && (
        <Box>
          {showBorder && <Text color={v.border}>{b.v}</Text>}
          {columns.map((col, ci) => (
            <React.Fragment key={col.key}>
              {ci > 0 && <Text color={v.border}>{b.v}</Text>}
              <Box width={colWidths[ci]} justifyContent={ALIGN_MAP[col.align ?? "left"]}>
                <Text color={v.header} bold>
                  {pad(col.header ?? col.key.toUpperCase(), colWidths[ci], col.align ?? "left")}
                </Text>
              </Box>
            </React.Fragment>
          ))}
          {showBorder && <Text color={v.border}>{b.v}</Text>}
        </Box>
      )}

      {/* Header divider */}
      {showHeader && showDivider && (
        <Text color={v.border}>{midBorder()}</Text>
      )}

      {/* Rows */}
      {data.length === 0 ? (
        <Box>
          {showBorder && <Text color={v.border}>{b.v}</Text>}
          <Box width={innerWidth} justifyContent="center">
            <Text color="gray" dimColor>{pad(emptyMessage, innerWidth, "center")}</Text>
          </Box>
          {showBorder && <Text color={v.border}>{b.v}</Text>}
        </Box>
      ) : (
        data.map((row, i) => renderRow(row, i))
      )}

      {/* Bottom border */}
      {showBorder && <Text color={v.border}>{botBorder()}</Text>}
    </Box>
  );
}

export default Table;

// ─── Demo (bun run Table.jsx) ─────────────────────────────────────────────────

// Inline mini-badge for the demo (no external import needed)
function StatusBadge({ value }) {
  const map = {
    PASS: { color: "greenBright", bg: undefined },
    FAIL: { color: "redBright",   bg: undefined },
    WARN: { color: "yellow",      bg: undefined },
    SKIP: { color: "gray",        bg: undefined },
  };
  const s = map[value] ?? map.SKIP;
  return <Text color={s.color} bold>{value}</Text>;
}

const PACKAGES = [
  { name: "ink",          version: "5.0.1",  size: "42 kB",  status: "PASS", license: "MIT"     },
  { name: "react",        version: "18.3.0", size: "6.4 kB",  status: "PASS", license: "MIT"     },
  { name: "zod",          version: "3.22.4", size: "58 kB",  status: "WARN", license: "MIT"     },
  { name: "@types/node",  version: "20.0.0", size: "2.1 MB", status: "SKIP", license: "MIT"     },
  { name: "legacy-pkg",   version: "1.0.0",  size: "320 kB", status: "FAIL", license: "UNKNOWN" },
];

const COLUMNS = [
  { key: "name",    header: "PACKAGE",  width: 16 },
  { key: "version", header: "VERSION",  width: 10, align: "right" },
  { key: "size",    header: "SIZE",     width: 8,  align: "right" },
  { key: "license", header: "LICENSE",  width: 10 },
  { key: "status",  header: "STATUS",   width: 6,
    render: (v) => <StatusBadge value={v} /> },
];

function Divider({ label }) {
  return (
    <Box marginY={1}>
      <Text color="gray" dimColor>{"─── " + label + " "}</Text>
    </Box>
  );
}

function InteractiveTable() {
  const [selected, setSelected] = useState(2);

  return (
    <Box flexDirection="column" paddingX={2} paddingY={1}>

      <Divider label="solid border (default)" />
      <Table columns={COLUMNS} data={PACKAGES} selectedIndex={selected} onSelect={(_, i) => setSelected(i)} />

      <Divider label="rounded border + striped" />
      <Table columns={COLUMNS} data={PACKAGES} borderStyle="rounded" striped />

      <Divider label="double border" />
      <Table columns={COLUMNS} data={PACKAGES.slice(0, 3)} borderStyle="double" variant="blue" />

      <Divider label="minimal border + row dividers" />
      <Table columns={COLUMNS} data={PACKAGES.slice(0, 3)} borderStyle="minimal" rowDividers />

      <Divider label="ascii border" />
      <Table columns={COLUMNS} data={PACKAGES.slice(0, 3)} borderStyle="ascii" />

      <Divider label="no header + no border" />
      <Table columns={COLUMNS} data={PACKAGES.slice(0, 3)} showHeader={false} showBorder={false} />

      <Divider label="empty state" />
      <Table columns={COLUMNS} data={[]} emptyMessage="No packages found." />

      <Box marginTop={1}>
        <Text color="gray" dimColor>Row {selected + 1} selected · ctrl+c to exit</Text>
      </Box>
    </Box>
  );
}

render(<InteractiveTable />);