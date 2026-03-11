import {
  Button,
  ColorArea,
  ColorField,
  ColorPicker,
  ColorSlider,
  ColorSwatch,
  ColorSwatchPicker,
  Label,
} from "@heroui/react";
import { useEffect, useRef, useState } from "react";
import { MaterialIcon } from "../MaterialIcon";

type ColorPickerProps = {
  field: string;
  label: string;
  value?: string;
  defaultColors?: {
    primary?: string;
    secondary?: string;
    tertiary?: string;
  };
  setColor?: (label: string, color: string | undefined) => void;
  onlyPicker?: boolean;
  commitMode?: "debounced" | "immediate";
};

const colorPresets = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#f43f5e",
];

const DRAG_COMMIT_DELAY_MS = 150;

const normalizeHex = (input: string) => {
  const trimmed = input.trim();
  if (!trimmed) return undefined;

  const withHash = trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
  if (/^#[\da-f]{3}$/i.test(withHash)) {
    const c = withHash.toUpperCase();
    return `#${c[1]}${c[1]}${c[2]}${c[2]}${c[3]}${c[3]}`;
  }
  if (/^#[\da-f]{6}$/i.test(withHash)) return withHash.toUpperCase();
  if (/^#[\da-f]{8}$/i.test(withHash))
    return withHash.slice(0, 7).toUpperCase();
  return undefined;
};

const normalizeHexForTyping = (input: string) => {
  const trimmed = input.trim();
  if (!trimmed) return undefined;
  const withHash = trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
  if (/^#[\da-f]{6}$/i.test(withHash)) return withHash.toUpperCase();
  if (/^#[\da-f]{8}$/i.test(withHash))
    return withHash.slice(0, 7).toUpperCase();
  return undefined;
};

const ColorPickerComponent: React.FC<ColorPickerProps> = ({
  field,
  label,
  value,
  defaultColors,
  setColor,
  onlyPicker = false,
  commitMode = "debounced",
}) => {
  const [inputValue, setInputValue] = useState(value ?? "");
  const [isOpen, setIsOpen] = useState(false);
  const [draftColor, setDraftColor] = useState<string>();
  const commitTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    setInputValue(value ?? "");
  }, [value]);

  const controlledValue = value ?? "";
  const pickerValue =
    normalizeHex(controlledValue) ??
    normalizeHex(defaultColors?.tertiary ?? "") ??
    normalizeHex(defaultColors?.primary ?? "") ??
    normalizeHex(defaultColors?.secondary ?? "") ??
    "#D13DD9";
  const activePickerValue = isOpen ? (draftColor ?? pickerValue) : pickerValue;

  const presets = [
    defaultColors?.primary,
    defaultColors?.secondary,
    defaultColors?.tertiary,
    ...colorPresets,
  ].filter(
    (preset, index, all): preset is string =>
      !!preset && all.indexOf(preset) === index,
  );

  useEffect(() => {
    if (!isOpen) {
      setDraftColor(undefined);
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (commitTimeoutRef.current !== null) {
        window.clearTimeout(commitTimeoutRef.current);
      }
    };
  }, []);

  const clearCommitTimeout = () => {
    if (commitTimeoutRef.current !== null) {
      window.clearTimeout(commitTimeoutRef.current);
      commitTimeoutRef.current = null;
    }
  };

  const commitColor = (nextColor: string) => {
    clearCommitTimeout();
    setColor?.(field, nextColor);
  };

  const scheduleCommit = (nextColor: string) => {
    if (commitMode === "immediate") {
      commitColor(nextColor);
      return;
    }
    clearCommitTimeout();
    commitTimeoutRef.current = window.setTimeout(() => {
      setColor?.(field, nextColor);
      commitTimeoutRef.current = null;
    }, DRAG_COMMIT_DELAY_MS);
  };

  return (
    <div className="flex items-center gap-1 w-full">
      <ColorPicker
        value={activePickerValue}
        aria-label={`${label} hex value`}
        onChange={(e) => {
          const nextColor = e.toString("hex");
          setInputValue(nextColor);
          setDraftColor(nextColor);
          scheduleCommit(nextColor);
        }}
      >
        <ColorPicker.Trigger
          onClick={() => {
            setDraftColor(pickerValue);
            setIsOpen((o) => !o);
          }}
        >
          {onlyPicker ? (
            <MaterialIcon name="colorize" />
          ) : (
            <>
              <ColorSwatch size="sm" color={controlledValue || undefined} />
              <div className="flex flex-col items-start">
                <Label className="text-xs font-semibold">{label}</Label>
                <Label className="text-xs text-gray-500 dark:text-gray-300">
                  {pickerValue}
                </Label>
              </div>
            </>
          )}
        </ColorPicker.Trigger>
        <ColorPicker.Popover
          className="gap-2"
          isOpen={isOpen}
          onOpenChange={(nextOpen) => {
            if (!nextOpen && draftColor && draftColor !== controlledValue) {
              commitColor(draftColor);
            }
            if (nextOpen) {
              setDraftColor(pickerValue);
            }
            setIsOpen(nextOpen);
          }}
        >
          {onlyPicker ? null : (
            <ColorSwatchPicker
              className="justify-center pt-2"
              size="xs"
              aria-label={`${label} hex value`}
            >
              {presets.map((preset) => (
                <ColorSwatchPicker.Item key={preset} color={preset}>
                  <ColorSwatchPicker.Swatch />
                </ColorSwatchPicker.Item>
              ))}
            </ColorSwatchPicker>
          )}
          <ColorArea
            aria-label="Color area"
            className="max-w-full"
            colorSpace="hsb"
            xChannel="saturation"
            yChannel="brightness"
          >
            <ColorArea.Thumb />
          </ColorArea>
          <div className="flex items-center gap-2 px-1">
            <ColorSlider
              aria-label="Hue slider"
              channel="hue"
              className="flex-1"
              colorSpace="hsb"
            >
              <ColorSlider.Track>
                <ColorSlider.Thumb />
              </ColorSlider.Track>
            </ColorSlider>
          </div>
          {!onlyPicker && (
            <ColorField
              aria-label="Color field"
              value={normalizeHex(inputValue) ?? pickerValue}
              onChange={(e) => {
                const nextColor = e?.toString("hex");
                if (!nextColor) return;
                setInputValue(nextColor);
                setDraftColor(nextColor);
                commitColor(nextColor);
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
                  onChange={(e) => {
                    const nextValue = e.target.value;
                    setInputValue(nextValue);
                    const normalized = normalizeHexForTyping(nextValue);
                    if (normalized) {
                      setDraftColor(normalized);
                      commitColor(normalized);
                    }
                  }}
                />
              </ColorField.Group>
            </ColorField>
          )}
          <Button
            fullWidth
            variant="secondary"
            onPress={() => setIsOpen(false)}
          >
            Close
          </Button>
        </ColorPicker.Popover>
      </ColorPicker>
    </div>
  );
};

export default ColorPickerComponent;
