import { useJerseyColors } from "@/context/JerseyContext";
import type { JerseyFieldKey } from "@/types/types";
import type { JerseyTemplateKey } from "@/utils/config";
import { classNames } from "@/utils/utils";
import { Switch } from "@heroui/react";
import { useEffect, useState } from "react";

type SettingProps = {
  label: string;
  keys: JerseyFieldKey[];
  children?: React.ReactNode;
  templateKey?: JerseyTemplateKey;
  icon?: React.ReactNode;
  isDisabled?: boolean;
  isSelected?: boolean;
  onSelectedChange?: (selected: boolean) => void;
};

function Setting({
  label,
  keys,
  children,
  templateKey,
  icon,
  isDisabled,
  isSelected,
  onSelectedChange,
}: SettingProps) {
  const {
    state,
    setEnabled,
    setColor,
    clearTemplate,
    openTemplateSection,
    setOpenTemplateSection,
  } = useJerseyColors();
  // Active flags for the three mutually exclusive features
  const verticalActive = !!state?.stripesPreset;
  const horizontalActive = !!state?.horizontalStripesPreset;
  const customShapeActive = !!state?.customShapePreset;
  const sideStripeActive = !!state?.sideStripePreset;
  const isTemplate =
    templateKey === "vertical" ||
    templateKey === "horizontal" ||
    templateKey === "custom" ||
    templateKey === "sidestripe";
  // This row's feature active?
  const selfActive =
    templateKey === "vertical"
      ? verticalActive
      : templateKey === "horizontal"
        ? horizontalActive
        : templateKey === "sidestripe"
          ? sideStripeActive
          : templateKey === "custom"
            ? customShapeActive
            : false;
  const isControlled =
    typeof isSelected === "boolean" && typeof onSelectedChange === "function";

  // Any OTHER exclusive feature active?
  const otherActive =
    templateKey === "vertical"
      ? horizontalActive || customShapeActive
      : templateKey === "horizontal"
        ? verticalActive || customShapeActive || sideStripeActive
        : templateKey === "sidestripe"
          ? horizontalActive || customShapeActive
          : templateKey === "custom"
            ? verticalActive || horizontalActive || sideStripeActive
            : false;

  const anyKeysEnabled = keys.some((k) => !!state?.[k]?.enabled);

  // Initial: open if self is active or any keys enabled
  const [isOpen, setIsOpen] = useState<boolean>(() =>
    isControlled ? !!isSelected : selfActive || (anyKeysEnabled && !isTemplate),
  );

  const open = isControlled ? !!isSelected : isOpen;

  useEffect(() => {
    if (isControlled) return;
    if (!isTemplate) return;
    setIsOpen(openTemplateSection === templateKey || selfActive);
  }, [isControlled, isTemplate, openTemplateSection, selfActive, templateKey]);

  // Close when another exclusive feature becomes active
  useEffect(() => {
    if (isControlled) return;
    if (otherActive) setIsOpen(false);
  }, [isControlled, otherActive]);

  // Open when this feature becomes active
  useEffect(() => {
    if (isControlled) return;
    if (selfActive) setIsOpen(true);
  }, [isControlled, selfActive]);

  useEffect(() => {
    if (isControlled) return;
    if (anyKeysEnabled && !isTemplate) setIsOpen(true);
  }, [isControlled, anyKeysEnabled, isTemplate]);
  useEffect(() => {
    if (isControlled) return;
    if (!selfActive && !anyKeysEnabled) setIsOpen(false);
  }, [isControlled, selfActive, anyKeysEnabled]);

  const onToggle = (checked: boolean) => {
    if (isControlled) {
      onSelectedChange(checked);
      return;
    }
    setIsOpen(checked);
    // optional: sync enabled for controlled keys
    if (!checked) {
      if (templateKey) {
        clearTemplate(templateKey);
        if (openTemplateSection === templateKey) {
          setOpenTemplateSection(undefined);
        }
        keys.forEach((k) => setColor(k, undefined));
      } else {
        keys.forEach((k) => setEnabled(k, false));
      }
    } else {
      const accentPrimaryColor = state.baseColor.enabled
        ? state.theme.secondary ?? state.theme.primary
        : state.theme.primary;
      const accentSecondaryColor = state.baseColor.enabled
        ? state.theme.tertiary ??
          state.theme.secondary ??
          state.theme.primary
        : state.theme.secondary;
      const collarColor = accentPrimaryColor;
      const sleeveColor = accentPrimaryColor;
      const shoulderPanelColor = accentPrimaryColor;

      if (templateKey) {
        setOpenTemplateSection(templateKey);
      }
      if (templateKey === "vertical") {
        clearTemplate("horizontal");
        clearTemplate("custom");
      } else if (templateKey === "horizontal") {
        clearTemplate("vertical");
        clearTemplate("custom");
        clearTemplate("sidestripe");
      } else if (templateKey === "sidestripe") {
        clearTemplate("horizontal");
        clearTemplate("custom");
      } else if (templateKey === "custom") {
        clearTemplate("vertical");
        clearTemplate("horizontal");
        clearTemplate("sidestripe");
      }
      keys.forEach((k) => state[k].shouldToggle && setEnabled(k, true));
      if (
        (label === "Sleeves" || label === "Sleeve Detail") &&
        !templateKey &&
        sleeveColor
      ) {
        if (label === "Sleeve Detail" && state.sport === "hockey") {
          return;
        }
        keys.forEach((key) => {
          if (!state[key].enabled) {
            setColor(key, sleeveColor);
          }
        });
      }
      if (
        label === "Collar" &&
        !templateKey &&
        !state.neckCircleColor.enabled &&
        collarColor
      ) {
        setColor("neckCircleColor", collarColor);
      }
      if (
        label === "Shoulder Panel" &&
        !templateKey &&
        !state.shoulderPanelColor.enabled &&
        shoulderPanelColor
      ) {
        setColor("shoulderPanelColor", shoulderPanelColor);
      }
      if (
        (templateKey === "vertical" ||
          templateKey === "horizontal" ||
          templateKey === "custom") &&
        !state.stripePrimaryColor.enabled &&
        accentPrimaryColor
      ) {
        setColor("stripePrimaryColor", accentPrimaryColor);
      }
      if (
        (templateKey === "vertical" || templateKey === "horizontal") &&
        !state.stripeSecondaryColor.enabled &&
        accentSecondaryColor
      ) {
        setColor("stripeSecondaryColor", accentSecondaryColor);
      }
      if (
        templateKey === "horizontal" &&
        state.sport === "hockey" &&
        !state.stripeTertiaryColor.enabled &&
        accentPrimaryColor
      ) {
        setColor("stripeTertiaryColor", accentPrimaryColor);
      }
      if (
        templateKey === "sidestripe" &&
        accentPrimaryColor
      ) {
        if (!state.sideStripePrimaryColor.enabled) {
          setColor("sideStripePrimaryColor", accentPrimaryColor);
        }
        if (!state.sideStripeSecondaryColor.enabled) {
          setColor("sideStripeSecondaryColor", accentPrimaryColor);
        }
      }
    }
  };

  return (
    <div
      className={classNames(
        "flex gap-0 flex-col w-full rounded-xl px-3",
        "transition-colors duration-300 ease-out overflow-visible",
        open
          ? "bg-white dark:bg-gray-700 shadow-sm"
          : "bg-gray-50 dark:bg-gray-800",
        isDisabled ? "opacity-60" : "",
      )}
    >
      <div className="flex items-center justify-between w-full">
        <Switch
          isSelected={open}
          aria-label={`Toggle ${label}`}
          onChange={onToggle}
          isDisabled={isDisabled}
          className="custom-switch"
        >
          <Switch.Content>
            <div className="flex items-center overflow-visible gap-3">
              <div
                className={classNames(
                  "shrink-0 overflow-visible transition-[width,margin] duration-300 ease-out",
                  open ? "w-8 -ml-2" : "w-10 -ml-6",
                )}
                aria-hidden={!icon ? true : undefined}
              >
                <div
                  className={classNames(
                    "grid place-items-center rounded-full -mt-2 ",
                    "h-10 w-10",
                    "transition-transform duration-300 ease-out will-change-transform",
                    "transition-opacity",
                    open ? "scale-60 opacity-100" : "scale-100 opacity-100",
                  )}
                >
                  {icon}
                </div>
              </div>

              <div className="text-sm font-semibold py-3">{label}</div>
            </div>
          </Switch.Content>
          <Switch.Control>
            <Switch.Thumb />
          </Switch.Control>
        </Switch>
      </div>

      <div
        className={classNames(
          "grid transition-[grid-template-rows] duration-300 ease-out w-full",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <div
            className={classNames(
              "w-full text-left justify-start items-start transition-[transform,opacity] duration-300 ease-out",
              open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1",
            )}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Setting;
