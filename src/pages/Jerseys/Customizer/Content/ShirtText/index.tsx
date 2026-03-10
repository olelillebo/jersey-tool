import { useJerseyColors } from "@/context/JerseyContext";

import ColorPickerComponent from "@/components/ColorPicker";

import {
  Accordion,
  Input,
  Label,
  ListBox,
  NumberField,
  Select,
  Slider,
  Switch,
} from "@heroui/react";
import { type Key } from "react";

const FOOTBALL_BACK_FONT_OPTIONS = [
  "Barlow Condensed",
  "Saira Condensed",
  "Oswald",
  "Anton",
  "Bebas Neue",
  "Exo 2",
  "Jersey 10",
];

const DEFAULT_NAME_SIZE = 4;
const DEFAULT_NUMBER_SIZE = 16;
const DEFAULT_CURVE_AMOUNT = 0;
const MAX_CURVE_AMOUNT = 8;

const normalizeBackTextColor = (value: string | undefined) => {
  const raw = String(value ?? "").trim();
  if (!raw) return "";
  const withHash = raw.startsWith("#") ? raw : `#${raw}`;
  const upper = withHash.toUpperCase();
  if (/^#[0-9A-F]{6}$/.test(upper)) return upper;
  if (/^#[0-9A-F]{8}$/.test(upper)) return upper.slice(0, 7);
  if (/^#[0-9A-F]{3}$/.test(upper)) {
    return `#${upper[1]}${upper[1]}${upper[2]}${upper[2]}${upper[3]}${upper[3]}`;
  }
  return "";
};

const toPercent = (value: number, baseline: number) =>
  Math.round((value / baseline) * 100);

const formatOffset = (value: number) => {
  if (Math.abs(value) < 0.05) return "0";
  const rounded = Math.round(value * 10) / 10;
  const output = Number.isInteger(rounded) ? `${rounded}` : rounded.toFixed(1);
  return rounded > 0 ? `+${output}` : output;
};

export function ShirtText({
  variant = "football",
}: {
  variant?:
    | "football"
    | "basketball"
    | "hockey"
    | "american-football"
    | "formula-1"
    | "baseball"
    | "rugby"
    | "handball";
}) {
  const { state, effective, setFootballBack } = useJerseyColors();
  const defaultNameY = variant === "basketball" ? 13.5 : 11;
  const defaultNumberY = variant === "basketball" ? 25.5 : 21;
  const backTextSeedColor =
    state.theme.secondary ??
    effective("baseColor") ??
    state.theme.primary ??
    "";
  const resolvedBackTextPickerColor =
    state.footballBackTextColor ||
    normalizeBackTextColor(backTextSeedColor) ||
    "#FFFFFF";
  return (
    <div className="grid grid-cols-1 gap-3 pb-3">
      <Accordion
        allowsMultipleExpanded
        className="w-full max-w-md"
        defaultExpandedKeys={["fontColor", "labelsAndPosition"]}
      >
        <Accordion.Item id="labelsAndPosition">
          <Accordion.Heading>
            <Accordion.Trigger className="px-0">
              Labels & Position
              <Accordion.Indicator />
            </Accordion.Trigger>
          </Accordion.Heading>
          <Accordion.Panel>
            <Accordion.Body className="grid grid-cols-2 gap-3 divide-gray-300 divide-x-1 px-1 text-foreground">
              <div className="flex flex-col gap-3 pr-3">
                <div className="flex flex-col gap-1">
                  <Label>Name</Label>
                  <Input
                    aria-label="Player name"
                    placeholder={
                      variant === "basketball"
                        ? "e.g. JAMES"
                        : variant === "hockey"
                          ? "e.g. MCDAVID"
                          : "e.g. RONALDO"
                    }
                    value={state.footballBackName}
                    onChange={(event) =>
                      setFootballBack(true, {
                        name: event.target.value.toUpperCase().slice(0, 14),
                      })
                    }
                    variant="primary"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Slider
                    minValue={1.8}
                    maxValue={5.5}
                    step={0.1}
                    value={state.footballBackNameSize}
                    onChange={(value) =>
                      setFootballBack(true, {
                        nameSize: Array.isArray(value) ? value[0] : value,
                      })
                    }
                  >
                    <Label>Size</Label>
                    <Slider.Output>
                      {toPercent(state.footballBackNameSize, DEFAULT_NAME_SIZE)}
                      %
                    </Slider.Output>
                    <Slider.Track>
                      <Slider.Fill />
                      <Slider.Thumb />
                    </Slider.Track>
                  </Slider>
                </div>
                <div className="flex flex-col gap-1">
                  <Slider
                    minValue={7}
                    maxValue={18}
                    step={0.1}
                    value={state.footballBackNameY}
                    onChange={(value) =>
                      setFootballBack(true, {
                        nameY: Array.isArray(value) ? value[0] : value,
                      })
                    }
                  >
                    <Label>Vertical Position</Label>
                    <Slider.Output>
                      {formatOffset(state.footballBackNameY - defaultNameY)}
                    </Slider.Output>
                    <Slider.Track>
                      <Slider.Fill />
                      <Slider.Thumb />
                    </Slider.Track>
                  </Slider>
                </div>
                <div className="flex flex-col gap-1">
                  <Slider
                    className="h-full"
                    minValue={DEFAULT_CURVE_AMOUNT}
                    maxValue={MAX_CURVE_AMOUNT}
                    step={0.1}
                    value={state.footballBackNameCurveAmount}
                    onChange={(event) =>
                      setFootballBack(true, {
                        nameCurveAmount: Array.isArray(event)
                          ? event[0]
                          : event,
                      })
                    }
                  >
                    <Label>Curve ratio</Label>
                    <Slider.Output>
                      {toPercent(
                        state.footballBackNameCurveAmount,
                        MAX_CURVE_AMOUNT,
                      )}
                      %
                    </Slider.Output>
                    <Slider.Track>
                      <Slider.Fill />
                      <Slider.Thumb />
                    </Slider.Track>
                  </Slider>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <Label>Number</Label>
                  <Input
                    aria-label="Player number"
                    placeholder={variant === "basketball" ? "23" : "7"}
                    value={state.footballBackNumber}
                    onChange={(event) =>
                      setFootballBack(true, {
                        number: event.target.value
                          .replace(/[^0-9]/g, "")
                          .slice(0, 3),
                      })
                    }
                    variant="primary"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Slider
                    minValue={6}
                    maxValue={24}
                    step={0.1}
                    value={state.footballBackNumberSize}
                    onChange={(value) =>
                      setFootballBack(true, {
                        numberSize: Array.isArray(value) ? value[0] : value,
                      })
                    }
                  >
                    <Label>Size</Label>
                    <Slider.Output>
                      {toPercent(
                        state.footballBackNumberSize,
                        DEFAULT_NUMBER_SIZE,
                      )}
                      %
                    </Slider.Output>
                    <Slider.Track>
                      <Slider.Fill />
                      <Slider.Thumb />
                    </Slider.Track>
                  </Slider>
                </div>

                <div className="flex flex-col gap-1">
                  <Slider
                    minValue={15}
                    maxValue={33}
                    step={0.1}
                    value={state.footballBackNumberY}
                    onChange={(value) =>
                      setFootballBack(true, {
                        numberY: Array.isArray(value) ? value[0] : value,
                      })
                    }
                  >
                    <Label>Vertical Position</Label>
                    <Slider.Output>
                      {formatOffset(state.footballBackNumberY - defaultNumberY)}
                    </Slider.Output>
                    <Slider.Track>
                      <Slider.Fill />
                      <Slider.Thumb />
                    </Slider.Track>
                  </Slider>
                </div>
              </div>
            </Accordion.Body>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item id="fontColor">
          <Accordion.Heading>
            <Accordion.Trigger className="px-0">
              Font & Color
              <Accordion.Indicator />
            </Accordion.Trigger>
          </Accordion.Heading>
          <Accordion.Panel>
            <Accordion.Body className="flex flex-col gap-3 text-foreground px-1">
              <div className="flex gap-3">
                <Select
                  placeholder="Select font"
                  value={state.footballBackFontFamily}
                  onChange={(id: Key | null) =>
                    setFootballBack(true, {
                      fontFamily: id ? String(id) : undefined,
                    })
                  }
                  selectionMode="single"
                  className="w-full whitespace-nowrap truncate p-1"
                >
                  <Label>Font</Label>
                  <Select.Trigger>
                    <span className="pointer-events-none">
                      {state.footballBackFontFamily
                        ? state.footballBackFontFamily
                        : "Select font"}
                    </span>
                    <Select.Indicator />
                  </Select.Trigger>
                  <Select.Popover>
                    <ListBox aria-label="Font">
                      {FOOTBALL_BACK_FONT_OPTIONS.map((font) => (
                        <ListBox.Item key={font} id={font} textValue={font}>
                          <Label>{font}</Label>
                          <ListBox.ItemIndicator />
                        </ListBox.Item>
                      ))}
                    </ListBox>
                  </Select.Popover>
                </Select>
                <div className="flex flex-col gap-1 p-1">
                  <NumberField
                    name="width"
                    minValue={400}
                    maxValue={900}
                    step={100}
                    value={state.footballBackFontWeight}
                    onChange={(value) =>
                      setFootballBack(true, {
                        fontWeight: Array.isArray(value) ? value[0] : value,
                      })
                    }
                  >
                    <Label>Weight</Label>
                    <NumberField.Group>
                      <NumberField.DecrementButton />
                      <NumberField.Input className="w-[50px]" />
                      <NumberField.IncrementButton />
                    </NumberField.Group>
                  </NumberField>
                </div>
              </div>
              <ColorPickerComponent
                field="footballBackTextColor"
                label="Text Color"
                value={resolvedBackTextPickerColor || undefined}
                defaultColors={{
                  primary: state.theme.primary,
                  secondary: state.theme.secondary,
                }}
                setColor={(_, color) =>
                  setFootballBack(true, {
                    textColor: normalizeBackTextColor(color),
                  })
                }
              />
            </Accordion.Body>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item id="textOutline">
          <Accordion.Heading>
            <Accordion.Trigger className="px-0">
              Text Outline
              <Accordion.Indicator />
            </Accordion.Trigger>
          </Accordion.Heading>
          <Accordion.Panel>
            <Accordion.Body className="text-foreground px-0">
              <Switch
                isSelected={state.footballBackTextOutlineEnabled}
                aria-label="Toggle text outline"
                onChange={(checked) =>
                  setFootballBack(true, {
                    textOutlineEnabled: checked,
                  })
                }
              >
                <Switch.Control>
                  <Switch.Thumb />
                </Switch.Control>
                <Switch.Content>
                  <Label className="text-sm">Enabled</Label>
                </Switch.Content>
              </Switch>
              {state.footballBackTextOutlineEnabled ? (
                <div className="flex gap-3">
                  <ColorPickerComponent
                    field="footballBackTextOutlineColor"
                    label="Color"
                    value={state.footballBackTextOutlineColor || "#000000"}
                    defaultColors={{
                      primary: state.theme.primary,
                      secondary: state.theme.secondary,
                    }}
                    setColor={(_, color) =>
                      setFootballBack(true, {
                        textOutlineColor:
                          normalizeBackTextColor(color) || "#000000",
                      })
                    }
                  />
                  <NumberField
                    name="width"
                    minValue={1}
                    maxValue={8}
                    step={1}
                    value={state.footballBackTextOutlineWidth}
                    onChange={(value) =>
                      setFootballBack(true, {
                        textOutlineWidth: Array.isArray(value)
                          ? value[0]
                          : value,
                      })
                    }
                  >
                    <Label>Width</Label>
                    <NumberField.Group>
                      <NumberField.DecrementButton />
                      <NumberField.Input className="w-[50px]" />
                      <NumberField.IncrementButton />
                    </NumberField.Group>
                  </NumberField>
                </div>
              ) : null}
            </Accordion.Body>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </div>
  );
}
