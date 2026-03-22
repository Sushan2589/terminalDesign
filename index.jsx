// import React from "react";
// import { Box, Text, render } from "ink";
// import Tabs from "./components/Tabs"; // adjust path if needed

// function App() {
//   const tabs = [
//     {
//       label: "Home",
//       content: (
//         <Box flexDirection="column">
//           <Text>Welcome to the Home tab</Text>
//           <Text color="gray" dimColor>Use ← → to switch tabs</Text>
//         </Box>
//       ),
//     },
//     {
//       label: "Info",
//       badge: 3,
//       content: (
//         <Box flexDirection="column">
//           <Text color="blueBright">Some information here</Text>
//           <Text>Details about the app</Text>
//         </Box>
//       ),
//     },
//     {
//       label: "Warnings",
//       badge: 1,
//       content: (
//         <Box flexDirection="column">
//           <Text color="yellow">⚠ Warning message example</Text>
//         </Box>
//       ),
//     },
//     {
//       label: "Errors",
//       badge: 2,
//       content: (
//         <Box flexDirection="column">
//           <Text color="redBright">✕ Error occurred!</Text>
//         </Box>
//       ),
//     },
//     {
//       label: "Disabled",
//       disabled: true,
//       content: <Text>This should not be selectable</Text>,
//     },
//   ];

//   return (
//     <Box flexDirection="column" paddingX={2} paddingY={1}>
      
//       <Box marginBottom={1}>
//         <Text color="gray" dimColor>
//           ─── Tabs Demo ─────────────────────────────
//         </Text>
//       </Box>

//       <Tabs
//         tabs={tabs}
//         tabStyle="underline"
//         variant="default"
//         showInstructions
//       />

//       <Box marginTop={1}>
//         <Text color="gray" dimColor>
//           ← → switch tabs  ·  1–9 jump  ·  ctrl+c exit
//         </Text>
//       </Box>

//     </Box>
//   );
// }

// render(<App />);