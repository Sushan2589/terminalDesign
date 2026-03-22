import React, { useState, useCallback } from "react";
import { Box, Text, useInput, render } from "ink";

// ─── Theme ────────────────────────────────────────────────────────────────────

const STATE_STYLES = {
  idle:     { border: "gray",       prompt: "greenBright" },
  focused:  { border: "blueBright", prompt: "greenBright" },
  error:    { border: "redBright",  prompt: "redBright"   },
  success:  { border: "greenBright",prompt: "greenBright" },
  disabled: { border: "gray",       prompt: "gray"        },
};

// ─── Cursor ───────────────────────────────────────────────────────────────────

/**
 * Blinking block cursor rendered as an inverse-video space.
 * Ink doesn't have a blink animation primitive, so we toggle visibility
 * via setInterval and useState.
 */
function Cursor({ visible }) {
  return visible
    ? <Text inverse> </Text>
    : <Text> </Text>;
}

// ─── TextInput ───────────────────────────────────────────────────────────────

/**
 * TextInput
 *
 * A single-line text input with a prompt prefix, live cursor, validation,
 * placeholder, and masked (password) mode.
 *
 * Props
 * ─────
 * value         string — controlled value.
 * onChange      (value: string) => void
 * onSubmit      (value: string) => void — called on Enter.
 *
 * placeholder   string — dimmed hint shown when value is empty.
 * prompt        string — prefix glyph(s).               default: "›"
 * hint          string — right-aligned helper text.
 * error         string — validation message shown below the input.
 *               When set, border turns red.
 * mask          boolean — replace characters with "●" (password mode).
 * disabled      boolean — ignores keystrokes, dims everything.
 * width         number — total width of the input row.  default: 50
 * focus         boolean — whether this input captures keystrokes. default: true
 *
 * @example
 * // Basic controlled input
 * const [val, setVal] = useState("");
 * <TextInput value={val} onChange={setVal} placeholder="Enter project name…" />
 *
 * @example
 * // With validation error
 * <TextInput
 *   value={val}
 *   onChange={setVal}
 *   error="Name must be lowercase with hyphens only"
 * />
 *
 * @example
 * // Password field
 * <TextInput value={val} onChange={setVal} prompt="🔑" mask />
 *
 * @example
 * // With submit handler
 * <TextInput
 *   value={val}
 *   onChange={setVal}
 *   onSubmit={(v) => console.log("submitted:", v)}
 *   hint="press enter"
 * />
 */
export function TextInput({
  value = "",
  onChange,
  onSubmit,
  placeholder = "",
  prompt = "›",
  hint = "",
  error = "",
  mask = false,
  disabled = false,
  width = 50,
  focus = true,
}) {
  const [cursorVisible, setCursorVisible] = useState(true);
  const [isFocused, setIsFocused] = useState(focus);

  // Blink cursor every 530ms
  React.useEffect(() => {
    if (!isFocused || disabled) {
      setCursorVisible(false);
      return;
    }
    const id = setInterval(() => setCursorVisible((v) => !v), 530);
    return () => clearInterval(id);
  }, [isFocused, disabled]);

  // Derive visual state
  const state = disabled
    ? "disabled"
    : error
    ? "error"
    : isFocused
    ? "focused"
    : "idle";

  const { border: borderColor, prompt: promptColor } = STATE_STYLES[state];

  // Keyboard handling
  useInput(
    useCallback(
      (input, key) => {
        if (disabled || !isFocused) return;

        if (key.return) {
          onSubmit?.(value);
          return;
        }

        if (key.backspace || key.delete) {
          onChange?.(value.slice(0, -1));
          return;
        }

        // Ignore non-printable keys (arrows, ctrl combos, etc.)
        if (
          key.upArrow || key.downArrow || key.leftArrow || key.rightArrow ||
          key.ctrl || key.meta || key.escape || key.tab
        ) return;

        if (input) {
          onChange?.(value + input);
        }
      },
      [value, onChange, onSubmit, disabled, isFocused]
    )
  );

  // Displayed text
  const displayValue = mask ? "●".repeat(value.length) : value;

  // ── Layout measurements ────────────────────────────────────────────────────
  // width = [ prompt(1) + space(1) ] + [ value area ] + [ hint ]
  const promptSection  = prompt.length + 1;           // prompt + " "
  const hintSection    = hint ? hint.length + 1 : 0;  // " " + hint
  const valueAreaWidth = Math.max(4, width - promptSection - hintSection - 2); // -2 for borders

  return (
    <Box flexDirection="column">
      {/* ── Input row ── */}
      <Box width={width}>
        {/* Left border */}
        <Text color={borderColor}>{"["}</Text>

        {/* Prompt */}
        <Text color={disabled ? "gray" : promptColor} bold>
          {prompt}
        </Text>
        <Text> </Text>

        {/* Value / placeholder / cursor */}
        <Box width={valueAreaWidth} overflow="hidden">
          {value.length === 0 && !isFocused ? (
            <Text color="gray" dimColor>{placeholder}</Text>
          ) : (
            <Text>
              <Text color={disabled ? "gray" : "white"}>
                {displayValue}
              </Text>
              {isFocused && !disabled && (
                <Cursor visible={cursorVisible} />
              )}
            </Text>
          )}
        </Box>

        {/* Hint */}
        {hint && (
          <>
            <Text> </Text>
            <Text color="gray" dimColor>{hint}</Text>
          </>
        )}

        {/* Right border */}
        <Text color={borderColor}>{"]"}</Text>
      </Box>

      {/* ── Error message ── */}
      {error && (
        <Box paddingLeft={2}>
          <Text color="redBright">{"✕ "}</Text>
          <Text color="redBright" dimColor>{error}</Text>
        </Box>
      )}
    </Box>
  );
}

export default TextInput;

// ─── Demo (bun run TextInput.jsx) ────────────────────────────────────────────

function Label({ text }) {
  return <Text color="gray" dimColor>{text.padEnd(20)}</Text>;
}

function DemoRow({ label, children }) {
  return (
    <Box gap={2} marginBottom={1}>
      <Label text={label} />
      {children}
    </Box>
  );
}

function InteractiveDemo() {
  const [name,  setName]  = useState("");
  const [pass,  setPass]  = useState("");
  const [tag,   setTag]   = useState("my project");
  const [submitted, setSubmitted] = useState(null);

  // Validate tag: lowercase + hyphens only
  const tagError =
    tag.length > 0 && !/^[a-z0-9-]+$/.test(tag)
      ? "name must be lowercase with hyphens only"
      : "";

  return (
    <Box flexDirection="column" paddingX={2} paddingY={1} gap={1}>
      <Text color="gray" dimColor>{"─── TextInput demo — type to interact ───────────────"}</Text>

      <DemoRow label="idle / placeholder">
        <TextInput
          value={name}
          onChange={setName}
          placeholder="Enter your name…"
          focus={false}
          width={40}
        />
      </DemoRow>

      <DemoRow label="focused">
        <TextInput
          value={name}
          onChange={setName}
          onSubmit={(v) => setSubmitted(v)}
          placeholder="Enter your name…"
          hint="enter ↵"
          width={40}
        />
      </DemoRow>

      <DemoRow label="password mask">
        <TextInput
          value={pass}
          onChange={setPass}
          placeholder="Enter password…"
          prompt="🔒"
          mask
          focus={false}
          width={40}
        />
      </DemoRow>

      <DemoRow label="validation error">
        <TextInput
          value={tag}
          onChange={setTag}
          error={tagError}
          hint="slug format"
          width={40}
          focus={false}
        />
      </DemoRow>

      <DemoRow label="disabled">
        <TextInput
          value="production"
          onChange={() => {}}
          prompt="$"
          disabled
          width={40}
        />
      </DemoRow>

      {submitted && (
        <Box marginTop={1}>
          <Text color="greenBright">{"✓ "}</Text>
          <Text>Submitted: </Text>
          <Text color="blueBright">{submitted}</Text>
        </Box>
      )}

      <Box marginTop={1}>
        <Text color="gray" dimColor>ctrl+c to exit</Text>
      </Box>
    </Box>
  );
}

render(<InteractiveDemo />);