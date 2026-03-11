import Base from "@/components/Jersey/base";
import { useJerseyColors } from "@/context/JerseyContext";
import Setting from "./Setting";
import { Preset } from "../Preset";
import { ColorSwitcher } from "@/components/ColorSwitcher";
import ColorPickerComponent from "@/components/ColorPicker";
import { Label, Switch } from "@heroui/react";
import {
  basketballJerseyParts,
  footballJerseyParts,
  formulaOneParts,
  hockeyJerseyParts,
} from "@/utils/config";
import type { JerseyFieldKey } from "@/types/types";
import { darken, getContrastingShade } from "@/utils/colorFunctions";

export function Settings({
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
  const { state, effective, setColor, setEnabled } = useJerseyColors();

  const setColorCallback = (label: string, color: string | undefined) => {
    setColor(label as JerseyFieldKey, color);
  };
  const derivedHockeyShadeColor = () =>
    getContrastingShade(effective("baseColor") ?? "#FFFFFF", 0.2);
  const effectiveColor = (field: JerseyFieldKey) => {
    if (
      variant === "hockey" &&
      field === "stripeTertiaryColor" &&
      state.customShapePreset === "hockeyThinArrowFill" &&
      state[field].enabled
    ) {
      return state[field].value ?? derivedHockeyShadeColor();
    }

    if (
      variant === "hockey" &&
      field === "stripeQuaternaryColor" &&
      (state.horizontalStripesPreset === "hockeyTripleBottomStripeShade" ||
        state.horizontalStripesPreset === "hockeyBottomStripeShade") &&
      state[field].enabled
    ) {
      return state[field].value ?? derivedHockeyShadeColor();
    }

    if (
      variant === "hockey" &&
      (field === "leftSleeveColor" || field === "rightSleeveColor") &&
      state[field].enabled
    ) {
      return (
        state[field].value ??
        darken(effective("baseColor") ?? state.theme.primary ?? "#FFFFFF", 0.2)
      );
    }

    if (
      variant === "hockey" &&
      (field === "leftSleeveDetailColor" ||
        field === "rightSleeveDetailColor") &&
      state[field].enabled
    ) {
      return state[field].value ?? derivedHockeyShadeColor();
    }

    if (
      variant === "formula-1" &&
      field === "neckCircleColor" &&
      state[field].enabled
    ) {
      return (
        state[field].value ??
        darken(effective("baseColor") ?? state.theme.primary ?? "#FFFFFF", 0.2)
      );
    }

    return effective(field);
  };

  const parts =
    variant === "basketball"
      ? basketballJerseyParts
      : variant === "hockey"
        ? hockeyJerseyParts
        : variant === "american-football"
          ? []
          : variant === "formula-1"
            ? formulaOneParts
            : footballJerseyParts;

  const needsMainColors =
    variant === "formula-1"
      ? !state.theme.primary
      : !(state.theme.primary && state.theme.secondary && state.theme.tertiary);

  const getVisibleFields = (part: (typeof parts)[number]) => {
    const allFields = [
      part.primaryKey?.field,
      part.secondaryKey?.field,
      "tertiaryKey" in part ? part.tertiaryKey?.field : undefined,
      "quaternaryKey" in part ? part.quaternaryKey?.field : undefined,
    ].filter(Boolean) as JerseyFieldKey[];

    if (!part.templateKey) return new Set(allFields);

    if (part.templateKey === "vertical") {
      if (!state.stripesPreset) return new Set<JerseyFieldKey>();
      switch (state.stripesPreset) {
        case "defaultVertical":
        case "verticalThinFull":
          return new Set<JerseyFieldKey>(["stripePrimaryColor"]);
        case "rightThinSingle_S":
          return new Set<JerseyFieldKey>(["stripeSecondaryColor"]);
        case "defaultVerticalCenterAlt":
        case "rightThinDouble_SP":
        case "rightThinDouble_PS":
        case "verticalDoubleBand":
        case "verticalTripleBand":
        case "verticalDoubleCenterSplit":
          return new Set<JerseyFieldKey>([
            "stripePrimaryColor",
            "stripeSecondaryColor",
          ]);
        default:
          return new Set(allFields);
      }
    }

    if (part.templateKey === "horizontal") {
      if (!state.horizontalStripesPreset) return new Set<JerseyFieldKey>();
      switch (state.horizontalStripesPreset) {
        case "regularQuadStripe":
        case "regularTripleStripe":
        case "singleBand":
          return new Set<JerseyFieldKey>(["stripePrimaryColor"]);
        case "twoColorDoubleStripe":
        case "threeColorBand":
        case "basketTopBand":
          return new Set<JerseyFieldKey>([
            "stripePrimaryColor",
            "stripeSecondaryColor",
          ]);
        case "hockeyTripleBottomStripe":
          return new Set<JerseyFieldKey>([
            "stripePrimaryColor",
            "stripeSecondaryColor",
            "stripeTertiaryColor",
          ]);
        case "hockeyTripleBottomStripeShade":
          return new Set<JerseyFieldKey>([
            "stripePrimaryColor",
            "stripeSecondaryColor",
            "stripeTertiaryColor",
          ]);
        case "hockeyBottomStripeShade":
          return new Set<JerseyFieldKey>(["stripePrimaryColor"]);
        default:
          return new Set(allFields);
      }
    }

    if (part.templateKey === "custom") {
      if (!state.customShapePreset) return new Set<JerseyFieldKey>();
      switch (state.customShapePreset) {
        case "hockeyThinArrowFill":
          return new Set<JerseyFieldKey>([
            "stripePrimaryColor",
            "stripeTertiaryColor",
          ]);
        case "diagonalLeft":
        case "diagonalRight":
        case "diagonalHalfHalf1":
        case "diagonalHalfHalf2":
        case "arrow":
        case "cross":
        case "split":
          return new Set<JerseyFieldKey>(["stripePrimaryColor"]);
        default:
          return new Set(allFields);
      }
    }

    if (part.templateKey === "sidestripe" && !state.sideStripePreset) {
      return new Set<JerseyFieldKey>();
    }

    return new Set(allFields);
  };

  const getLabelForField = (
    part: (typeof parts)[number],
    field: JerseyFieldKey,
    fallback: string,
  ) => {
    if (variant === "hockey" && part.label === "Sleeve Stripes") {
      if (field === "sleeveStripePrimaryColor") return "Bottom Stripe";
      if (field === "sleeveStripeSecondaryColor") return "Center Stripe";
      if (field === "sleeveStripeTertiaryColor") return "Top Stripe";
    }

    if (variant === "hockey" && part.templateKey === "horizontal") {
      switch (state.horizontalStripesPreset) {
        case "hockeyTripleBottomStripe":
        case "hockeyTripleBottomStripeShade":
          if (field === "stripePrimaryColor") return "Bottom Stripe";
          if (field === "stripeSecondaryColor") return "Center Stripe";
          if (field === "stripeTertiaryColor") return "Top Stripe";
          if (field === "stripeQuaternaryColor") return "Bottom Shirt";
          break;
        case "hockeyBottomStripeShade":
          if (field === "stripePrimaryColor") return "Stripe";
          if (field === "stripeQuaternaryColor") return "Bottom Shirt";
          break;
        default:
          break;
      }
    }

    return fallback;
  };

  const getLinkedPrimaryFields = (part: (typeof parts)[number]) => {
    if (
      variant === "hockey" &&
      part.label === "Sleeve Stripes" &&
      part.primaryKey &&
      "tertiaryKey" in part &&
      !!part.tertiaryKey
    ) {
      return [
        {
          field: part.tertiaryKey.field,
          color: effectiveColor(part.tertiaryKey.field),
        },
      ];
    }

    if (
      variant === "hockey" &&
      part.templateKey === "horizontal" &&
      (state.horizontalStripesPreset === "hockeyTripleBottomStripe" ||
        state.horizontalStripesPreset === "hockeyTripleBottomStripeShade")
    ) {
      return [
        {
          field: "stripeTertiaryColor" as JerseyFieldKey,
          color: effectiveColor("stripeTertiaryColor"),
        },
      ];
    }

    return undefined;
  };

  return parts.map((part) => {
    const visibleFields = getVisibleFields(part);
    const showPrimary =
      !!part.primaryKey && visibleFields.has(part.primaryKey.field);
    const showSecondary =
      !!part.secondaryKey && visibleFields.has(part.secondaryKey.field);
    const showTertiary =
      "tertiaryKey" in part &&
      !!part.tertiaryKey &&
      visibleFields.has(part.tertiaryKey.field);
    const showQuaternary =
      "quaternaryKey" in part &&
      !!part.quaternaryKey &&
      visibleFields.has(part.quaternaryKey.field);
    const showShadeOverrideToggle =
      variant === "hockey" &&
      part.templateKey === "horizontal" &&
      (state.horizontalStripesPreset === "hockeyTripleBottomStripeShade" ||
        state.horizontalStripesPreset === "hockeyBottomStripeShade") &&
      "quaternaryKey" in part &&
      !!part.quaternaryKey;
    const showCustomShadeOverrideToggle =
      variant === "hockey" &&
      part.templateKey === "custom" &&
      state.customShapePreset === "hockeyThinArrowFill" &&
      "tertiaryKey" in part &&
      !!part.tertiaryKey;
    const isHockeyOuterStripeLayout =
      variant === "hockey" &&
      ((part.templateKey === "horizontal" &&
        (state.horizontalStripesPreset === "hockeyTripleBottomStripe" ||
          state.horizontalStripesPreset === "hockeyTripleBottomStripeShade")) ||
        part.label === "Sleeve Stripes") &&
      showPrimary &&
      showSecondary &&
      showTertiary &&
      part.primaryKey &&
      part.secondaryKey &&
      "tertiaryKey" in part &&
      !!part.tertiaryKey;
    const isCollarSplitOverride =
      part.label === "Collar" &&
      part.secondaryKey?.field === "leftNeckCircleColor" &&
      showPrimary;
    const isHockeySleeveDetailOverride =
      variant === "hockey" &&
      part.label === "Sleeve Detail" &&
      part.primaryKey &&
      part.secondaryKey &&
      showPrimary &&
      showSecondary;
    const hockeySleeveDetailOverrideEnabled = !!(
      state.leftSleeveDetailColor.value || state.rightSleeveDetailColor.value
    );

    return (
      <Setting
        key={part.label}
        label={part.label}
        keys={part.keys}
        isDisabled={needsMainColors}
        templateKey={part.templateKey}
        icon={<Base {...part.baseProps} size="xsmall" variant={variant} />}
      >
        {part.templateKey ? (
          <Preset type={part.templateKey} variant={variant} />
        ) : null}
        <div className="flex w-full">
          {isHockeyOuterStripeLayout ? (
            <div className="flex flex-col pb-2 w-full gap-2">
              <div className="w-full sm:hidden">
                <ColorPickerComponent
                  key={part.tertiaryKey.field}
                  field={part.tertiaryKey.field}
                  label={getLabelForField(
                    part,
                    part.tertiaryKey.field,
                    part.tertiaryKey.label,
                  )}
                  setColor={setColorCallback}
                  value={effectiveColor(part.tertiaryKey.field)}
                  defaultColors={{
                    primary: state.theme.primary,
                    secondary: state.theme.secondary,
                    tertiary: state.theme.tertiary,
                  }}
                />
              </div>

              <div className="hidden sm:grid sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:grid-rows-2 sm:gap-x-2 sm:gap-y-2 sm:items-center">
                <div className="row-start-1 col-start-1">
                  <ColorPickerComponent
                    key={part.tertiaryKey.field}
                    field={part.tertiaryKey.field}
                    label={getLabelForField(
                      part,
                      part.tertiaryKey.field,
                      part.tertiaryKey.label,
                    )}
                    setColor={setColorCallback}
                    value={effectiveColor(part.tertiaryKey.field)}
                    defaultColors={{
                      primary: state.theme.primary,
                      secondary: state.theme.secondary,
                      tertiary: state.theme.tertiary,
                    }}
                  />
                </div>

                <div className="row-start-2 col-start-1">
                  <ColorPickerComponent
                    key={part.primaryKey.field}
                    field={part.primaryKey.field}
                    label={getLabelForField(
                      part,
                      part.primaryKey.field,
                      part.primaryKey.label,
                    )}
                    setColor={setColorCallback}
                    value={effectiveColor(part.primaryKey.field)}
                    defaultColors={{
                      primary: state.theme.primary,
                      secondary: state.theme.secondary,
                      tertiary: state.theme.tertiary,
                    }}
                  />
                </div>

                <div className="row-start-1 row-span-2 col-start-2 self-center">
                  <ColorSwitcher
                    primaryColor={{
                      field: part.primaryKey.field,
                      color: effectiveColor(part.primaryKey.field),
                    }}
                    secondaryColor={{
                      field: part.secondaryKey.field,
                      color: effectiveColor(part.secondaryKey.field),
                    }}
                    setColor={setColorCallback}
                    linkedPrimaryFields={getLinkedPrimaryFields(part)}
                  />
                </div>

                <div className="row-start-1 row-span-2 col-start-3 self-center">
                  <ColorPickerComponent
                    key={part.secondaryKey.field}
                    field={part.secondaryKey.field}
                    label={getLabelForField(
                      part,
                      part.secondaryKey.field,
                      part.secondaryKey.label,
                    )}
                    setColor={setColorCallback}
                    value={effectiveColor(part.secondaryKey.field)}
                    defaultColors={{
                      primary: state.theme.primary,
                      secondary: state.theme.secondary,
                      tertiary: state.theme.tertiary,
                    }}
                  />
                </div>
              </div>

              <div className="flex flex-col sm:hidden w-full gap-2">
                <ColorPickerComponent
                  key={part.primaryKey.field}
                  field={part.primaryKey.field}
                  label={getLabelForField(
                    part,
                    part.primaryKey.field,
                    part.primaryKey.label,
                  )}
                  setColor={setColorCallback}
                  value={effectiveColor(part.primaryKey.field)}
                  defaultColors={{
                    primary: state.theme.primary,
                    secondary: state.theme.secondary,
                    tertiary: state.theme.tertiary,
                  }}
                />

                <ColorPickerComponent
                  key={part.secondaryKey.field}
                  field={part.secondaryKey.field}
                  label={getLabelForField(
                    part,
                    part.secondaryKey.field,
                    part.secondaryKey.label,
                  )}
                  setColor={setColorCallback}
                  value={effectiveColor(part.secondaryKey.field)}
                  defaultColors={{
                    primary: state.theme.primary,
                    secondary: state.theme.secondary,
                    tertiary: state.theme.tertiary,
                  }}
                />
              </div>

              {showQuaternary &&
              "quaternaryKey" in part &&
              part.quaternaryKey &&
              !showShadeOverrideToggle ? (
                <div className="w-full items-center">
                  <ColorPickerComponent
                    key={part.quaternaryKey.field}
                    field={part.quaternaryKey.field}
                    label={getLabelForField(
                      part,
                      part.quaternaryKey.field,
                      part.quaternaryKey.label,
                    )}
                    setColor={setColorCallback}
                    value={effectiveColor(part.quaternaryKey.field)}
                    defaultColors={{
                      primary: state.theme.primary,
                      secondary: state.theme.secondary,
                      tertiary: state.theme.tertiary,
                    }}
                  />
                </div>
              ) : null}

              {showShadeOverrideToggle &&
              "quaternaryKey" in part &&
              part.quaternaryKey ? (
                <div className="flex flex-col gap-2">
                  <Switch
                    aria-label="Custom shade"
                    isSelected={state[part.quaternaryKey.field].enabled}
                    onChange={(selected: boolean) => {
                      if (selected) {
                        setColor(
                          part.quaternaryKey.field,
                          effectiveColor(part.primaryKey.field),
                        );
                        return;
                      }
                      setColor(part.quaternaryKey.field, undefined);
                    }}
                  >
                    <Switch.Content>
                      <Label>Custom shade</Label>
                    </Switch.Content>
                    <Switch.Control>
                      <Switch.Thumb />
                    </Switch.Control>
                  </Switch>

                  {state[part.quaternaryKey.field].enabled ? (
                    <div className="w-full items-center">
                      <ColorPickerComponent
                        key={part.quaternaryKey.field}
                        field={part.quaternaryKey.field}
                        label={getLabelForField(
                          part,
                          part.quaternaryKey.field,
                          part.quaternaryKey.label,
                        )}
                        setColor={setColorCallback}
                        value={effectiveColor(part.quaternaryKey.field)}
                        defaultColors={{
                          primary: state.theme.primary,
                          secondary: state.theme.secondary,
                          tertiary: state.theme.tertiary,
                        }}
                      />
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          ) : (
            (showPrimary || showSecondary || showTertiary || showQuaternary) &&
            part.primaryKey && (
              <div className="flex flex-col pb-2 w-full gap-2">
                <div className="flex flex-col sm:flex-row w-full gap-2">
                  {showPrimary ? (
                    isHockeySleeveDetailOverride ? null : (
                      <ColorPickerComponent
                        key={part.primaryKey.field}
                        field={part.primaryKey.field}
                        label={getLabelForField(
                          part,
                          part.primaryKey.field,
                          part.primaryKey.label,
                        )}
                        setColor={setColorCallback}
                        value={effectiveColor(part.primaryKey.field)}
                        defaultColors={{
                          primary: state.theme.primary,
                          secondary: state.theme.secondary,
                          tertiary: state.theme.tertiary,
                        }}
                      />
                    )
                  ) : null}

                  {part.hasColorSwitcher &&
                  part.primaryKey &&
                  part.secondaryKey &&
                  !isCollarSplitOverride &&
                  !isHockeySleeveDetailOverride &&
                  showPrimary &&
                  showSecondary ? (
                    <div className="self-center hidden sm:flex">
                      <ColorSwitcher
                        primaryColor={{
                          field: part.primaryKey.field,
                          color: effectiveColor(part.primaryKey.field),
                        }}
                        secondaryColor={{
                          field: part.secondaryKey.field,
                          color: effectiveColor(part.secondaryKey.field),
                        }}
                        setColor={setColorCallback}
                        linkedPrimaryFields={getLinkedPrimaryFields(part)}
                      />
                    </div>
                  ) : null}

                  {showSecondary && part.secondaryKey ? (
                    isCollarSplitOverride ||
                    isHockeySleeveDetailOverride ? null : (
                      <ColorPickerComponent
                        key={part.secondaryKey.field}
                        field={part.secondaryKey.field}
                        label={getLabelForField(
                          part,
                          part.secondaryKey.field,
                          part.secondaryKey.label,
                        )}
                        setColor={setColorCallback}
                        value={effectiveColor(part.secondaryKey.field)}
                        defaultColors={{
                          primary: state.theme.primary,
                          secondary: state.theme.secondary,
                          tertiary: state.theme.tertiary,
                        }}
                      />
                    )
                  ) : null}
                </div>

                {isHockeySleeveDetailOverride ? (
                  <div className="flex flex-col gap-2 w-full">
                    <Switch
                      aria-label="Override sleeve detail"
                      isSelected={hockeySleeveDetailOverrideEnabled}
                      onChange={(selected: boolean) => {
                        if (selected) {
                          const defaultShade = derivedHockeyShadeColor();
                          setColor("leftSleeveDetailColor", defaultShade);
                          setColor("rightSleeveDetailColor", defaultShade);
                          return;
                        }
                        setColor("leftSleeveDetailColor", undefined);
                        setColor("rightSleeveDetailColor", undefined);
                        setEnabled("leftSleeveDetailColor", true);
                        setEnabled("rightSleeveDetailColor", true);
                      }}
                    >
                      <Switch.Content>
                        <Label>Custom shade</Label>
                      </Switch.Content>
                      <Switch.Control>
                        <Switch.Thumb />
                      </Switch.Control>
                    </Switch>

                    {hockeySleeveDetailOverrideEnabled ? (
                      <div className="flex flex-col sm:flex-row w-full gap-2">
                        <ColorPickerComponent
                          key={part.primaryKey.field}
                          field={part.primaryKey.field}
                          label={getLabelForField(
                            part,
                            part.primaryKey.field,
                            part.primaryKey.label,
                          )}
                          setColor={setColorCallback}
                          value={effectiveColor(part.primaryKey.field)}
                          defaultColors={{
                            primary: state.theme.primary,
                            secondary: state.theme.secondary,
                            tertiary: state.theme.tertiary,
                          }}
                        />
                        <ColorPickerComponent
                          key={part.secondaryKey.field}
                          field={part.secondaryKey.field}
                          label={getLabelForField(
                            part,
                            part.secondaryKey.field,
                            part.secondaryKey.label,
                          )}
                          setColor={setColorCallback}
                          value={effectiveColor(part.secondaryKey.field)}
                          defaultColors={{
                            primary: state.theme.primary,
                            secondary: state.theme.secondary,
                            tertiary: state.theme.tertiary,
                          }}
                        />
                      </div>
                    ) : null}
                  </div>
                ) : null}

                {showSecondary && part.secondaryKey && isCollarSplitOverride ? (
                  <div className="flex flex-col gap-2 w-full">
                    <Switch
                      aria-label="Split color"
                      isSelected={state[part.secondaryKey.field].enabled}
                      onChange={(selected: boolean) => {
                        if (selected) {
                          setColor(
                            part.secondaryKey.field,
                            effectiveColor(part.primaryKey.field),
                          );
                          return;
                        }
                        setColor(part.secondaryKey.field, undefined);
                      }}
                    >
                      <Switch.Content>
                        <Label>Split color</Label>
                      </Switch.Content>
                      <Switch.Control>
                        <Switch.Thumb />
                      </Switch.Control>
                    </Switch>

                    {state[part.secondaryKey.field].enabled ? (
                      <ColorPickerComponent
                        key={part.secondaryKey.field}
                        field={part.secondaryKey.field}
                        label={getLabelForField(
                          part,
                          part.secondaryKey.field,
                          part.secondaryKey.label,
                        )}
                        setColor={setColorCallback}
                        value={effectiveColor(part.secondaryKey.field)}
                        defaultColors={{
                          primary: state.theme.primary,
                          secondary: state.theme.secondary,
                          tertiary: state.theme.tertiary,
                        }}
                      />
                    ) : null}
                  </div>
                ) : null}

                {showTertiary &&
                "tertiaryKey" in part &&
                part.tertiaryKey &&
                !showCustomShadeOverrideToggle ? (
                  <div className="w-full items-center">
                    <ColorPickerComponent
                      key={part.tertiaryKey.field}
                      field={part.tertiaryKey.field}
                      label={getLabelForField(
                        part,
                        part.tertiaryKey.field,
                        part.tertiaryKey.label,
                      )}
                      setColor={setColorCallback}
                      value={effectiveColor(part.tertiaryKey.field)}
                      defaultColors={{
                        primary: state.theme.primary,
                        secondary: state.theme.secondary,
                        tertiary: state.theme.tertiary,
                      }}
                    />
                  </div>
                ) : null}

                {showCustomShadeOverrideToggle &&
                "tertiaryKey" in part &&
                part.tertiaryKey ? (
                  <div className="flex flex-col gap-2">
                    <Switch
                      aria-label="Custom shade"
                      isSelected={state[part.tertiaryKey.field].enabled}
                      onChange={(selected: boolean) => {
                        if (selected) {
                          setColor(
                            part.tertiaryKey.field,
                            effectiveColor(part.primaryKey.field),
                          );
                          return;
                        }
                        setColor(part.tertiaryKey.field, undefined);
                      }}
                    >
                      <Switch.Content>
                        <Label> Custom shade</Label>
                      </Switch.Content>
                      <Switch.Control>
                        <Switch.Thumb />
                      </Switch.Control>
                    </Switch>

                    {state[part.tertiaryKey.field].enabled ? (
                      <div className="w-full items-center">
                        <ColorPickerComponent
                          key={part.tertiaryKey.field}
                          field={part.tertiaryKey.field}
                          label={getLabelForField(
                            part,
                            part.tertiaryKey.field,
                            part.tertiaryKey.label,
                          )}
                          setColor={setColorCallback}
                          value={effectiveColor(part.tertiaryKey.field)}
                          defaultColors={{
                            primary: state.theme.primary,
                            secondary: state.theme.secondary,
                            tertiary: state.theme.tertiary,
                          }}
                        />
                      </div>
                    ) : null}
                  </div>
                ) : null}

                {showQuaternary &&
                "quaternaryKey" in part &&
                part.quaternaryKey &&
                !showShadeOverrideToggle ? (
                  <div className="w-full items-center">
                    <ColorPickerComponent
                      key={part.quaternaryKey.field}
                      field={part.quaternaryKey.field}
                      label={getLabelForField(
                        part,
                        part.quaternaryKey.field,
                        part.quaternaryKey.label,
                      )}
                      setColor={setColorCallback}
                      value={effectiveColor(part.quaternaryKey.field)}
                      defaultColors={{
                        primary: state.theme.primary,
                        secondary: state.theme.secondary,
                        tertiary: state.theme.tertiary,
                      }}
                    />
                  </div>
                ) : null}

                {showShadeOverrideToggle &&
                "quaternaryKey" in part &&
                part.quaternaryKey ? (
                  <div className="flex flex-col gap-2">
                    <Switch
                      aria-label="Custom shade"
                      isSelected={state[part.quaternaryKey.field].enabled}
                      onChange={(selected: boolean) => {
                        if (selected) {
                          setColor(
                            part.quaternaryKey.field,
                            effectiveColor(part.primaryKey.field),
                          );
                          return;
                        }
                        setColor(part.quaternaryKey.field, undefined);
                      }}
                    >
                      <Switch.Content>
                        <Label> Custom shade</Label>
                      </Switch.Content>
                      <Switch.Control>
                        <Switch.Thumb />
                      </Switch.Control>
                    </Switch>

                    {state[part.quaternaryKey.field].enabled ? (
                      <div className="w-full items-center">
                        <ColorPickerComponent
                          key={part.quaternaryKey.field}
                          field={part.quaternaryKey.field}
                          label={getLabelForField(
                            part,
                            part.quaternaryKey.field,
                            part.quaternaryKey.label,
                          )}
                          setColor={setColorCallback}
                          value={effectiveColor(part.quaternaryKey.field)}
                          defaultColors={{
                            primary: state.theme.primary,
                            secondary: state.theme.secondary,
                            tertiary: state.theme.tertiary,
                          }}
                        />
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            )
          )}

          {part.hasColorSwitcher &&
          part.primaryKey &&
          part.secondaryKey &&
          !isCollarSplitOverride &&
          !isHockeySleeveDetailOverride &&
          !isHockeyOuterStripeLayout &&
          showPrimary &&
          showSecondary ? (
            <div className="self-center flex sm:hidden">
              <ColorSwitcher
                primaryColor={{
                  field: part.primaryKey.field,
                  color: effectiveColor(part.primaryKey.field),
                }}
                secondaryColor={{
                  field: part.secondaryKey.field,
                  color: effectiveColor(part.secondaryKey.field),
                }}
                setColor={setColorCallback}
                linkedPrimaryFields={getLinkedPrimaryFields(part)}
              />
            </div>
          ) : null}
          {isHockeyOuterStripeLayout ? (
            <div className="self-center flex sm:hidden">
              <ColorSwitcher
                primaryColor={{
                  field: part.primaryKey.field,
                  color: effectiveColor(part.primaryKey.field),
                }}
                secondaryColor={{
                  field: part.secondaryKey.field,
                  color: effectiveColor(part.secondaryKey.field),
                }}
                setColor={setColorCallback}
                linkedPrimaryFields={getLinkedPrimaryFields(part)}
              />
            </div>
          ) : null}
        </div>
      </Setting>
    );
  });
}
