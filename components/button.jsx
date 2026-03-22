import React from "react";
import { Text } from "ink";

export const Button = ({
  children,
  variant = "primary",
  isFocused = false,
  isActive = false,
  isDisabled = false
}) => {
  // Variant color
  const getColor = () => {
    if (isDisabled) return "gray";
    if (variant === "danger") return "red";
    if (variant === "secondary") return "gray";
    return "blue";
  };

  const color = getColor();

  // Visual state styling
  let textProps = {
    color,
    bold: true
  };

  if (isFocused) {
    textProps = {
      backgroundColor: color,
      color: "black",
      bold: true
    };
  }

  if (isDisabled) {
    textProps = {
      color: "gray",
      dimColor: true
    };
  }

  // Button label formatting
  const label = `▐  ${children}  ▌`;

  return <Text {...textProps}>{label}</Text>;
};