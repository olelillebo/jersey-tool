import {
  ColorField,
  ColorSwatch,
  ColorSwatchPicker,
  Label,
} from "@heroui/react";
import { useEffect, useState } from "react";
import ColorPickerComponent from "../ColorPicker";

type ColorPickerProps = {
  field: string;
  label: string;
  value?: string;
  defaultColors?: {
    primary?: string;
    secondary?: string;
  };
  setColor?: (label: string, color: string | undefined) => void;
  needsMainColors?: boolean;
};

const colorPresets = [
  "#000000",
  "#FFFFFF",
  "#C8102E",
  "#003087",
  "#FFC72C",
  "#007A33",
  "#002244",
  "#FF6900",
  "#862633",
  "#0C2340",
  "#B3995D",
  "#CE1141",
  "#006BB6",
  "#552583",
  "#00471B",
];

const normalizeHex = (input: string) => {
  const trimmed = input.trim();
  if (!trimmed) return undefined;
  const withHash = trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
  return /^#([\da-f]{3}|[\da-f]{6})$/i.test(withHash) ? withHash : undefined;
};

const ColorSelect: React.FC<ColorPickerProps> = ({
  field,
  label,
  value,
  defaultColors,
  setColor,
  needsMainColors,
}) => {
  const [inputValue, setInputValue] = useState(value ?? "");

  useEffect(() => {
    setInputValue(value ?? "");
  }, [value]);

  const presets =
    defaultColors?.primary && defaultColors?.secondary
      ? [defaultColors.primary, defaultColors.secondary, ...colorPresets]
      : defaultColors?.primary
        ? [defaultColors.primary, ...colorPresets]
        : defaultColors?.secondary
          ? [defaultColors.secondary, ...colorPresets]
          : colorPresets;

  // Always a string so ColorSwatchPicker and ColorField stay controlled
  const controlledValue = value ?? "";
  const pickerValue =
    normalizeHex(controlledValue) ??
    normalizeHex(defaultColors?.primary ?? "") ??
    normalizeHex(defaultColors?.secondary ?? "") ??
    "#D13DD9";

  const isWhite = (color: string) =>
    normalizeHex(color)?.toLowerCase() === "#ffffff";
  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <Label id={`${field}-label`}>{label}</Label>
      <ColorSwatchPicker
        aria-labelledby={`${field}-label`}
        className="justify-center pt-2 grid grid-cols-5 gap-2"
        size="sm"
        value={pickerValue}
        onChange={(e) => {
          const nextColor = e.toString("hex");
          setInputValue(nextColor);
          setColor?.(field, nextColor);
        }}
      >
        {presets.map((preset) => (
          <ColorSwatchPicker.Item
            key={preset}
            color={preset}
            className={
              isWhite(preset)
                ? "[&[data-selected]]:border-gray-600 border-2 border-gray-200"
                : undefined
            }
          >
            <ColorSwatchPicker.Swatch
              className={isWhite(preset) ? "border-gray-200" : undefined}
            />
          </ColorSwatchPicker.Item>
        ))}
      </ColorSwatchPicker>

      <div className="flex gap-1">
        <ColorField
          aria-label={`${label} hex value`}
          value={normalizeHex(inputValue) ?? pickerValue}
          className="w-[120px]"
          onChange={(e) => {
            const nextColor = e?.toString("hex");
            if (!nextColor) return;
            setInputValue(nextColor);
            setColor?.(field, nextColor);
          }}
        >
          <ColorField.Group variant="secondary">
            <ColorField.Prefix>
              <ColorSwatch
                size="xs"
                color={normalizeHex(inputValue) ?? pickerValue}
              />
            </ColorField.Prefix>
            <ColorField.Input
              value={inputValue}
              placeholder="#000000"
              onChange={(e) => {
                const nextValue = e.target.value;
                setInputValue(nextValue);
                const normalized = normalizeHex(nextValue);
                if (normalized) {
                  setColor?.(field, normalized);
                }
              }}
            />
          </ColorField.Group>
        </ColorField>
        {needsMainColors ? (
          <ColorPickerComponent
            field={field}
            label={label}
            setColor={setColor}
            value={value}
            onlyPicker={true}
          />
        ) : null}
      </div>
    </div>
  );
};

export default ColorSelect;
