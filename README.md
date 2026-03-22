## Rectangle Box

```
import React from "react";
import { render, Box as InkBox, Text } from "ink";
import {
  Box,
  InfoBox,
  SuccessBox,
  WarnBox,
  ErrorBox
} from "./components/rectangleBox.jsx";

const App = () => {
  return (
    <InkBox flexDirection="column" gap={2} padding={1}>

      
      <InkBox flexDirection="column">
        <Text bold color="cyanBright">
          Terminal UI Components Showcase
        </Text>
        <Text dimColor>
          Demonstrating Box component with variants and styling
        </Text>
      </InkBox>

      {/* Default */}
      <Box title="DEFAULT BOX" variant="default" width={60}>
        <Text>This is a default container with neutral styling.</Text>
      </Box>

      {/* Info */}
      <Box title="INFO" variant="info" width={60}>
        <Text>
          Deployment target: <Text color="blueBright">production</Text>
        </Text>
      </Box>

      {/* Success */}
      <SuccessBox title="SUCCESS" width={60}>
        <Text>
          Build completed in <Text bold>2.3s</Text> with no errors.
        </Text>
      </SuccessBox>

      {/* Warning */}
      <WarnBox title="WARNING" width={60}>
        <Text>
          Memory usage exceeded <Text color="yellow">80%</Text>.
        </Text>
      </WarnBox>

      {/* Error */}
      <ErrorBox title="ERROR" width={60}>
        <Text>
          Failed to connect to <Text color="redBright">database:5432</Text>
        </Text>
      </ErrorBox>

      {/* Side-by-side layout */}
      <InkBox gap={2}>
        <InfoBox title="INFO CARD" width={28}>
          <Text>Left side content</Text>
        </InfoBox>

        <SuccessBox title="SUCCESS CARD" width={28}>
          <Text>Right side content</Text>
        </SuccessBox>
      </InkBox>

      {/* Nested Box */}
      <Box title="NESTED BOX" variant="default" width={60}>
        <InkBox flexDirection="column" gap={1}>
          <Text>Outer content</Text>

          <SuccessBox title="INNER BOX" width={40}>
            <Text>This is a nested component example.</Text>
          </SuccessBox>

          <Text>More outer content</Text>
        </InkBox>
      </Box>

    </InkBox>
  );
};

render(<App />);
```




## BOX Component

```
import React from "react";
import { Box, Text, render } from "ink";
import {
  Badge,
  InfoBadge,
  SuccessBadge,
  WarnBadge,
  ErrorBadge,
  NeutralBadge,
  PurpleBadge
} from "./components/Badge.jsx";

// ─── Helper Row Component ────────────────────────────────────────────────

const Row = ({ title, children }) => (
  <Box marginBottom={1}>
    <Box width={20}>
      <Text color="gray" dimColor>
        {title}
      </Text>
    </Box>
    <Box gap={1} flexWrap="wrap">
      {children}
    </Box>
  </Box>
);

// ─── Demo App ────────────────────────────────────────────────────────────

const App = () => {
  return (
    <Box flexDirection="column" padding={1}>

      {/* Header */}
      <Box flexDirection="column" marginBottom={2}>
        <Text bold color="cyanBright">
          Badge Component Showcase
        </Text>
        <Text dimColor>
          Variants, styles, and real-world usage examples
        </Text>
      </Box>

      {/* Filled badges */}
      <Row title="Filled">
        <InfoBadge label="INFO" />
        <SuccessBadge label="PASS" />
        <WarnBadge label="WARN" />
        <ErrorBadge label="FAIL" />
        <NeutralBadge label="SKIP" />
        <PurpleBadge label="BETA" />
      </Row>

      {/* With icons */}
      <Row title="With Icon">
        <Badge variant="info" label="INFO" icon />
        <Badge variant="success" label="SUCCESS" icon />
        <Badge variant="warn" label="WARNING" icon />
        <Badge variant="error" label="ERROR" icon />
      </Row>

      {/* Icon only */}
      <Row title="Icon Only">
        <Badge variant="info" />
        <Badge variant="success" />
        <Badge variant="warn" />
        <Badge variant="error" />
        <Badge variant="neutral" />
        <Badge variant="purple" />
      </Row>

      {/* Pill style */}
      <Row title="Pill Style">
        <Badge variant="info" label="v1.0.0" pill />
        <Badge variant="success" label="STABLE" pill />
        <Badge variant="warn" label="ALPHA" pill />
        <Badge variant="neutral" label="MIT" pill />
      </Row>

      {/* Inverted */}
      <Row title="Inverted">
        <Badge variant="info" label="INFO" inverted />
        <Badge variant="success" label="PASS" inverted />
        <Badge variant="warn" label="WARN" inverted />
        <Badge variant="error" label="FAIL" inverted />
      </Row>

      {/* Real-world example */}
      <Box flexDirection="column" marginTop={2}>
        <Text color="gray">── real-world usage ─────────────────────────</Text>

        <Box marginTop={1} gap={2}>
          <Text>ink</Text>
          <Badge variant="success" label="5.0.1" pill />
          <Badge variant="neutral" label="MIT" pill />
          <Badge variant="info" label="ESM" pill />
        </Box>

        <Box gap={2}>
          <Text>zod</Text>
          <Badge variant="warn" label="3.22.4" pill />
          <Badge variant="neutral" label="MIT" pill />
        </Box>

        <Box gap={2}>
          <Text>legacy-lib</Text>
          <Badge variant="error" label="DEPRECATED" icon />
        </Box>
      </Box>

    </Box>
  );
};

render(<App />);
```

## ALERT component

```
import React from "react";
import { render, Box, Text } from "ink";
import {
  Alert,
  InfoAlert,
  SuccessAlert,
  WarnAlert,
  ErrorAlert,
} from "./components/Alert.jsx"; // adjust path if needed

function Section({ title, children }) {
  return (
    <Box flexDirection="column" marginBottom={1}>
      <Text color="gray" dimColor>
        ─── {title} ───────────────────────────────
      </Text>
      <Box flexDirection="column" marginTop={1}>
        {children}
      </Box>
    </Box>
  );
}

function App() {
  return (
    <Box flexDirection="column" paddingX={2} paddingY={1}>

      <Section title="Basic Alerts">
        <Alert variant="info" message="This is an info message." />
        <Alert variant="success" message="Operation completed successfully." />
        <Alert variant="warn" message="This is a warning." />
        <Alert variant="error" message="Something went wrong!" />
        <Alert variant="neutral" message="Just a neutral note." />
      </Section>

      <Section title="Custom Titles">
        <Alert
          variant="error"
          title="Build Failed"
          message="Cannot find module './auth'"
        />
        <Alert
          variant="success"
          title="Deployment Complete"
          message="Released to production in 12s."
        />
      </Section>

      <Section title="Title Suppressed">
        <Alert variant="warn" title="" message="Low disk space." />
        <Alert variant="info" title="" message="Server running on :3000" />
      </Section>

      <Section title="Compact Mode">
        <Alert variant="info" message="New update available." compact />
        <Alert variant="success" message="Upload complete." compact />
        <Alert variant="warn" message="API deprecated." compact />
        <Alert variant="error" message="Connection failed." compact />
      </Section>

      <Section title="Rich Content">
        <Alert variant="error" title="Type Error">
          <Text>
            Expected <Text color="redBright">number</Text> but got{" "}
            <Text color="redBright">string</Text>.
          </Text>
        </Alert>

        <Alert variant="info" title="Tip">
          <Text>
            Use <Text color="blueBright">bun run dev</Text> to start the app.
          </Text>
        </Alert>
      </Section>

      <Section title="Convenience Components">
        <InfoAlert message="Using InfoAlert wrapper." />
        <SuccessAlert message="Using SuccessAlert wrapper." />
        <WarnAlert message="Using WarnAlert wrapper." />
        <ErrorAlert message="Using ErrorAlert wrapper." />
      </Section>

    </Box>
  );
}

render(<App />);
```


## TextInput component

```
import React, { useState } from "react";
import { render, Box, Text } from "ink";
import TextInput from "./components/TextInput.jsx"; // adjust path if needed

function Section({ title, children }) {
  return (
    <Box flexDirection="column" marginBottom={1}>
      <Text color="gray" dimColor>
        ─── {title} ───────────────────────────────
      </Text>
      <Box flexDirection="column" marginTop={1}>
        {children}
      </Box>
    </Box>
  );
}

function Row({ label, children }) {
  return (
    <Box gap={2} marginBottom={1}>
      <Text color="gray" dimColor>
        {label.padEnd(22)}
      </Text>
      {children}
    </Box>
  );
}

function App() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [tag, setTag] = useState("my-project");
  const [submitted, setSubmitted] = useState(null);

  // validation example
  const tagError =
    tag.length > 0 && !/^[a-z0-9-]+$/.test(tag)
      ? "Only lowercase letters, numbers, and hyphens allowed"
      : "";

  return (
    <Box flexDirection="column" paddingX={2} paddingY={1}>

      <Section title="Basic Input">
        <Row label="default">
          <TextInput
            value={name}
            onChange={setName}
            placeholder="Type something..."
            width={40}
          />
        </Row>

        <Row label="with hint">
          <TextInput
            value={name}
            onChange={setName}
            placeholder="Enter your name..."
            hint="press enter ↵"
            width={40}
          />
        </Row>
      </Section>

      <Section title="Interaction">
        <Row label="submit">
          <TextInput
            value={name}
            onChange={setName}
            onSubmit={(v) => setSubmitted(v)}
            placeholder="Press Enter to submit"
            width={40}
          />
        </Row>

        {submitted && (
          <Box marginTop={1}>
            <Text color="greenBright">✓ </Text>
            <Text>Submitted: </Text>
            <Text color="blueBright">{submitted}</Text>
          </Box>
        )}
      </Section>

      <Section title="Variants">
        <Row label="prompt customization">
          <TextInput
            value={name}
            onChange={setName}
            prompt="$"
            width={40}
          />
        </Row>

        <Row label="password (mask)">
          <TextInput
            value={password}
            onChange={setPassword}
            placeholder="Enter password..."
            prompt="🔒"
            mask
            width={40}
          />
        </Row>
      </Section>

      <Section title="Validation">
        <Row label="error state">
          <TextInput
            value={tag}
            onChange={setTag}
            error={tagError}
            placeholder="slug-name"
            width={40}
          />
        </Row>
      </Section>

      <Section title="Disabled">
        <Row label="readonly">
          <TextInput
            value="production"
            onChange={() => {}}
            disabled
            width={40}
          />
        </Row>
      </Section>

      <Box marginTop={1}>
        <Text color="gray" dimColor>
          Ctrl + C to exit
        </Text>
      </Box>

    </Box>
  );
}

render(<App />);
```


## Spinner Component

```
import React, { useState, useEffect } from "react";
import { render, Box, Text } from "ink";
import { Spinner, SpinnerGroup } from "./components/Spinner"; // adjust path if needed

function Section({ title, children }) {
  return (
    <Box flexDirection="column" marginBottom={1}>
      <Text color="gray" dimColor>
        ─── {title} ───────────────────────────────
      </Text>
      <Box flexDirection="column" marginTop={1}>
        {children}
      </Box>
    </Box>
  );
}

function Row({ label, children }) {
  return (
    <Box gap={2} marginBottom={1}>
      <Text color="gray" dimColor>
        {label.padEnd(20)}
      </Text>
      {children}
    </Box>
  );
}

function App() {
  const [build, setBuild] = useState("spinning");
  const [test, setTest] = useState("spinning");
  const [deploy, setDeploy] = useState("spinning");

  // simulate async flow
  useEffect(() => {
    const t1 = setTimeout(() => setTest("done"), 1200);
    const t2 = setTimeout(() => setDeploy("error"), 2400);
    const t3 = setTimeout(() => setBuild("done"), 3600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <Box flexDirection="column" paddingX={2} paddingY={1}>

      <Section title="Spinner Types">
        <Row label="dots">
          <Spinner type="dots" label="Installing…" />
        </Row>

        <Row label="line">
          <Spinner type="line" label="Fetching…" variant="muted" />
        </Row>

        <Row label="arc">
          <Spinner type="arc" label="Compiling…" />
        </Row>

        <Row label="bounce">
          <Spinner type="bounce" label="Waiting…" variant="warn" />
        </Row>

        <Row label="pulse">
          <Spinner type="pulse" label="Streaming…" variant="muted" />
        </Row>

        <Row label="arrow">
          <Spinner type="arrow" label="Resolving…" />
        </Row>

        <Row label="minimal">
          <Spinner type="minimal" label="Background job…" variant="muted" />
        </Row>
      </Section>

      <Section title="Status Control">
        <Row label="done">
          <Spinner label="Completed task" status="done" />
        </Row>

        <Row label="error">
          <Spinner label="Failed task" status="error" />
        </Row>

        <Row label="dynamic (live)">
          <Spinner label="Building…" status={build} />
        </Row>

        <Row label="test">
          <Spinner label="Running tests…" status={test} />
        </Row>

        <Row label="deploy">
          <Spinner label="Deploying…" status={deploy} />
        </Row>
      </Section>

      <Section title="Variants">
        <Row label="default">
          <Spinner label="Default variant" />
        </Row>

        <Row label="muted">
          <Spinner label="Muted variant" variant="muted" />
        </Row>

        <Row label="success">
          <Spinner label="Success variant" variant="success" />
        </Row>

        <Row label="warn">
          <Spinner label="Warning variant" variant="warn" />
        </Row>

        <Row label="error">
          <Spinner label="Error variant" variant="error" />
        </Row>
      </Section>

      <Section title="With Prefix">
        <Row label="cli style">
          <Spinner prefix="›" label="Running command…" />
        </Row>

        <Row label="db">
          <Spinner prefix="⚡" label="Connecting to DB…" type="arc" />
        </Row>
      </Section>

      <Section title="SpinnerGroup">
        <SpinnerGroup
          items={[
            { label: "Install dependencies", status: "done" },
            { label: "Generate types", status: "spinning" },
            { label: "Run lint", status: "spinning", type: "arc", variant: "muted" },
            { label: "Run tests", status: "error" },
          ]}
        />
      </Section>

      <Box marginTop={1}>
        <Text color="gray" dimColor>
          Ctrl + C to exit
        </Text>
      </Box>

    </Box>
  );
}

render(<App />);
```


## Progress Bar

```
import React, { useState, useEffect } from "react";
import { render, Box, Text } from "ink";
import { ProgressBar, MultiProgressBar } from "./ProgressBar"; // adjust path if needed

function Section({ title, children }) {
  return (
    <Box flexDirection="column" marginBottom={1}>
      <Text color="gray" dimColor>
        ─── {title} ───────────────────────────────
      </Text>
      <Box flexDirection="column" marginTop={1}>
        {children}
      </Box>
    </Box>
  );
}

function Row({ label, children }) {
  return (
    <Box gap={2} marginBottom={1}>
      <Text color="gray" dimColor>
        {label.padEnd(18)}
      </Text>
      {children}
    </Box>
  );
}

function App() {
  const [progress, setProgress] = useState(0);

  // simulate live progress
  useEffect(() => {
    const id = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(id);
          return 100;
        }
        return p + 1.5;
      });
    }, 60);

    return () => clearInterval(id);
  }, []);

  return (
    <Box flexDirection="column" paddingX={2} paddingY={1}>

      <Section title="Basic Progress">
        <Row label="default">
          <ProgressBar value={65} label="Uploading" />
        </Row>

        <Row label="with percentage">
          <ProgressBar value={82} label="Processing" />
        </Row>

        <Row label="with total">
          <ProgressBar
            value={34}
            total={142}
            label="Tests"
            showValue
            showPct={false}
          />
        </Row>
      </Section>

      <Section title="Variants">
        <ProgressBar value={80} label="Default" />
        <ProgressBar value={100} label="Success" variant="success" />
        <ProgressBar value={60} label="Warning" variant="warn" />
        <ProgressBar value={30} label="Error" variant="error" />
        <ProgressBar value={45} label="Muted" variant="muted" />
      </Section>

      <Section title="Bar Styles">
        <ProgressBar value={70} label="block"  style="block" />
        <ProgressBar value={70} label="smooth" style="smooth" />
        <ProgressBar value={70} label="shade"  style="shade" />
        <ProgressBar value={70} label="dots"   style="dots" />
        <ProgressBar value={70} label="thin"   style="thin" />
        <ProgressBar value={70} label="ascii"  style="ascii" />
      </Section>

      <Section title="Auto Error Threshold">
        <ProgressBar value={80} label="CPU"    errorBelow={20} />
        <ProgressBar value={15} label="Memory" errorBelow={20} />
        <ProgressBar value={5}  label="Disk"   errorBelow={20} />
      </Section>

      <Section title="Animated Live Progress">
        <ProgressBar
          value={progress}
          label="Building"
          width={40}
          style="smooth"
        />
      </Section>

      <Section title="Multi Progress">
        <MultiProgressBar
          items={[
            { label: "Install", value: 100, variant: "success" },
            { label: "Build",   value: 65 },
            { label: "Test",    value: 40, variant: "warn" },
            { label: "Deploy",  value: 20, variant: "error" },
          ]}
        />
      </Section>

      <Box marginTop={1}>
        <Text color="gray" dimColor>
          Ctrl + C to exit
        </Text>
      </Box>

    </Box>
  );
}

render(<App />);
```

## TABLE 

```
import React, { useState } from "react";
import { render, Box, Text } from "ink";
import { Table } from "./components/Table"; // adjust path if needed

// ─── Demo Data ───────────────────────────────────────────────────────────────

const PACKAGES = [
  { name: "ink",          version: "5.0.1",  size: "42 kB",  status: "PASS", license: "MIT"     },
  { name: "react",        version: "18.3.0", size: "6.4 kB",  status: "PASS", license: "MIT"     },
  { name: "zod",          version: "3.22.4", size: "58 kB",  status: "WARN", license: "MIT"     },
  { name: "@types/node",  version: "20.0.0", size: "2.1 MB", status: "SKIP", license: "MIT"     },
  { name: "legacy-pkg",   version: "1.0.0",  size: "320 kB", status: "FAIL", license: "UNKNOWN" },
];

// ─── Columns ────────────────────────────────────────────────────────────────

const COLUMNS = [
  { key: "name",    header: "PACKAGE",  width: 18 },
  { key: "version", header: "VERSION",  width: 10, align: "right" },
  { key: "size",    header: "SIZE",     width: 10, align: "right" },
  { key: "license", header: "LICENSE",  width: 10 },
  {
    key: "status",
    header: "STATUS",
    width: 8,
    render: (value) => {
      const color =
        value === "PASS" ? "greenBright" :
        value === "WARN" ? "yellow" :
        value === "FAIL" ? "redBright" : "gray";

      return <Text color={color} bold>{value}</Text>;
    },
  },
];

// ─── UI Sections ────────────────────────────────────────────────────────────

function Section({ title, children }) {
  return (
    <Box flexDirection="column" marginBottom={1}>
      <Text color="gray" dimColor>
        ─── {title} ───────────────────────────────
      </Text>
      <Box flexDirection="column" marginTop={1}>
        {children}
      </Box>
    </Box>
  );
}

function App() {
  const [selected, setSelected] = useState(1);

  return (
    <Box flexDirection="column" paddingX={2} paddingY={1}>

      <Section title="Basic Table">
        <Table columns={COLUMNS} data={PACKAGES} />
      </Section>

      <Section title="Interactive Selection">
        <Table
          columns={COLUMNS}
          data={PACKAGES}
          selectedIndex={selected}
          onSelect={(_, i) => setSelected(i)}
        />
        <Text color="gray" dimColor>
          Selected row: {selected + 1}
        </Text>
      </Section>

      <Section title="Striped Rows">
        <Table columns={COLUMNS} data={PACKAGES} striped />
      </Section>

      <Section title="Rounded Border">
        <Table columns={COLUMNS} data={PACKAGES} borderStyle="rounded" />
      </Section>

      <Section title="Double Border + Blue Theme">
        <Table columns={COLUMNS} data={PACKAGES} borderStyle="double" variant="blue" />
      </Section>

      <Section title="Minimal Style">
        <Table columns={COLUMNS} data={PACKAGES} borderStyle="minimal" />
      </Section>

      <Section title="ASCII Style (Classic)">
        <Table columns={COLUMNS} data={PACKAGES} borderStyle="ascii" />
      </Section>

      <Section title="Row Dividers">
        <Table columns={COLUMNS} data={PACKAGES} rowDividers />
      </Section>

      <Section title="No Header">
        <Table columns={COLUMNS} data={PACKAGES} showHeader={false} />
      </Section>

      <Section title="Empty State">
        <Table columns={COLUMNS} data={[]} emptyMessage="No data available." />
      </Section>

      <Box marginTop={1}>
        <Text color="gray" dimColor>
          Use this as your component showcase · Ctrl + C to exit
        </Text>
      </Box>

    </Box>
  );
}

// ─── Render ────────────────────────────────────────────────────────────────

render(<App />);
```


## SELECT Component

```
import React from "react";
import { render } from "ink";
import Select from "./components/Select"; // adjust path if needed

// ─── Simple Demo App ────────────────────────────────────────────────────────

function App() {
  return (
    <Select
      mode="single"
      items={[
        { label: "bun install",  value: "bun",  hint: "⚡ fastest" },
        { label: "pnpm install", value: "pnpm", hint: "efficient" },
        { label: "npm install",  value: "npm" },
        { label: "yarn install", value: "yarn", disabled: true },
      ]}
      onSelect={(item) => {
        console.clear();
        console.log("Selected:", item);
      }}
      onHighlight={(item) => {
        // Optional live preview (like CLI tools)
        process.stdout.write(`\rHover: ${item.label}            `);
      }}
      variant="default"
      width={50}
      maxVisible={6}
    />
  );
}

// ─── Render ────────────────────────────────────────────────────────────────

render(<App />);



##Logstream

import React from "react";
import { render } from "ink";
import LogStream, { useLogStream } from "./components/LogStream"; // adjust path if needed

function App() {
  const { entries, log } = useLogStream();

  // Simulate live logging
  React.useEffect(() => {
    log.info("Server starting…", { tag: "system" });

    const id = setInterval(() => {
      const levels = ["info", "success", "warn", "error", "debug"];
      const level = levels[Math.floor(Math.random() * levels.length)];

      log[level](
        `Random ${level} message`,
        {
          tag: "demo",
          meta: { id: Math.floor(Math.random() * 1000) }
        }
      );
    }, 800);

    return () => clearInterval(id);
  }, [log]);

  return (
    <LogStream
      entries={entries}
      height={12}
      follow
      showFilter
      compact={false}
    />
  );
}

render(<App />);

```


## KeyHints

```
import React from "react";
import { Box, Text, render } from "ink";
import KeyHints from "./KeyHints"; // adjust path if needed

function App() {
  return (
    <Box flexDirection="column" paddingX={2} paddingY={1}>
      
      <Box marginBottom={1}>
        <Text color="gray" dimColor>
          ─── KeyHints Demo ─────────────────────────────
        </Text>
      </Box>

      {/* Default footer-style hints */}
      <KeyHints
        bindings={[
          { key: "↑↓", desc: "navigate" },
          { key: "enter", desc: "select" },
          { key: "space", desc: "toggle" },
          { key: ["ctrl", "c"], desc: "exit" },
        ]}
      />

      <Box marginTop={1} />

      {/* Muted style */}
      <KeyHints
        variant="muted"
        separator="pipe"
        bindings={[
          { key: "q", desc: "quit" },
          { key: "?", desc: "help" },
        ]}
      />

      <Box marginTop={1} />

      {/* Grouped (like Vim-style UI) */}
      <KeyHints
        direction="column"
        grouped
        variant="plain"
        bindings={[
          { key: "h", desc: "left", group: "Motion" },
          { key: "j", desc: "down", group: "Motion" },
          { key: "k", desc: "up", group: "Motion" },
          { key: "l", desc: "right", group: "Motion" },
          { key: "dd", desc: "delete", group: "Edit" },
          { key: "yy", desc: "copy", group: "Edit" },
        ]}
      />

      <Box marginTop={1}>
        <Text color="gray" dimColor>
          ctrl+c to exit
        </Text>
      </Box>

    </Box>
  );
}

render(<App />);
```


## TABS

```
import React from "react";
import { Box, Text, render } from "ink";
import Tabs from "./Tabs"; // adjust path if needed

function App() {
  const tabs = [
    {
      label: "Home",
      content: (
        <Box flexDirection="column">
          <Text>Welcome to the Home tab</Text>
          <Text color="gray" dimColor>Use ← → to switch tabs</Text>
        </Box>
      ),
    },
    {
      label: "Info",
      badge: 3,
      content: (
        <Box flexDirection="column">
          <Text color="blueBright">Some information here</Text>
          <Text>Details about the app</Text>
        </Box>
      ),
    },
    {
      label: "Warnings",
      badge: 1,
      content: (
        <Box flexDirection="column">
          <Text color="yellow">⚠ Warning message example</Text>
        </Box>
      ),
    },
    {
      label: "Errors",
      badge: 2,
      content: (
        <Box flexDirection="column">
          <Text color="redBright">✕ Error occurred!</Text>
        </Box>
      ),
    },
    {
      label: "Disabled",
      disabled: true,
      content: <Text>This should not be selectable</Text>,
    },
  ];

  return (
    <Box flexDirection="column" paddingX={2} paddingY={1}>
      
      <Box marginBottom={1}>
        <Text color="gray" dimColor>
          ─── Tabs Demo ─────────────────────────────
        </Text>
      </Box>

      <Tabs
        tabs={tabs}
        tabStyle="underline"
        variant="default"
        showInstructions
      />

      <Box marginTop={1}>
        <Text color="gray" dimColor>
          ← → switch tabs  ·  1–9 jump  ·  ctrl+c exit
        </Text>
      </Box>

    </Box>
  );
}

render(<App />);

```


