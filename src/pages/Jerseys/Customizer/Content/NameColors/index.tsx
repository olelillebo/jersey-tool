import { useJerseyColors } from "@/context/JerseyContext";
import ColorPickerComponent from "@/components/ColorPicker";
import type { Theme } from "@/types/types";
import ColorSelect from "@/components/ColorSelect";
import { Button, Input } from "@heroui/react";
import { classNames } from "@/utils/utils";
import { MaterialIcon } from "@/components/MaterialIcon";

export function NameColors({
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
  const {
    state,
    setThemeColor,
    setName,
    setNameEditing,
    flushDraftSave,
    reset,
  } = useJerseyColors();

  const setThemeColorCallback = (label: string, color: string | undefined) => {
    setThemeColor(label as keyof Theme, color);
  };

  const needsMainColors =
    variant === "formula-1"
      ? !state.theme.primary
      : !(state.theme.primary && state.theme.secondary && state.theme.tertiary);
  // True once both colors are entered — collapse to compact view
  const hasMainColors = !needsMainColors;
  const clearThemeAndReset = () => {
    reset();
    setThemeColor("primary", undefined);
    setThemeColor("secondary", undefined);
    setThemeColor("tertiary", undefined);
  };

  return (
    <div className="flex flex-col bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
      <div className="flex w-full justify-between items-center gap-2">
        <Input
          aria-label="Jersey name"
          placeholder={"Jersey name"}
          value={state.name}
          onChange={(event) => setName(event.target.value)}
          onFocus={() => setNameEditing(true)}
          onBlur={() => {
            setNameEditing(false);
            flushDraftSave();
          }}
          variant="secondary"
          fullWidth
          className={classNames(
            state.name ? "" : "border-b-2 border-gray-300 dark:border-gray-500",
            "text-3xl font-semibold truncate font-BarlowCondensed bg-transparent rounded-none ",
          )}
        />

        <Button onPress={clearThemeAndReset} isIconOnly variant="ghost">
          <MaterialIcon name="restart_alt" />
        </Button>
      </div>

      <div
        className="grid transition-all duration-500 ease-in-out"
        style={{
          gridTemplateRows: needsMainColors ? "1fr" : "0fr",
          opacity: needsMainColors ? 1 : 0,
        }}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-4 pt-5">
            <ColorSelect
              field="primary"
              label="Primary"
              setColor={setThemeColorCallback}
              value={state.theme.primary}
              needsMainColors={needsMainColors}
            />
            {variant !== "formula-1" && variant !== "american-football" ? (
              <ColorSelect
                field="secondary"
                label="Secondary"
                setColor={setThemeColorCallback}
                value={state.theme.secondary}
                needsMainColors={needsMainColors}
              />
            ) : null}
            {variant !== "formula-1" && variant !== "american-football" ? (
              <ColorSelect
                field="tertiary"
                label="Tertiary"
                setColor={setThemeColorCallback}
                value={state.theme.tertiary}
                needsMainColors={needsMainColors}
                defaultColors={{
                  primary: state.theme.primary,
                  secondary: state.theme.secondary,
                }}
              />
            ) : null}
          </div>
        </div>
      </div>

      <div
        className="grid transition-all duration-500 ease-in-out"
        style={{
          gridTemplateRows: hasMainColors ? "1fr" : "0fr",
          opacity: hasMainColors ? 1 : 0,
        }}
      >
        <div className="overflow-hidden">
          <div className="flex gap-2 pt-3">
            <ColorPickerComponent
              field="primary"
              label="Primary"
              setColor={setThemeColorCallback}
              value={state.theme.primary}
              defaultColors={{
                secondary: state.theme.secondary,
                tertiary: state.theme.tertiary,
              }}
            />

            {variant !== "formula-1" && variant !== "american-football" ? (
              <ColorPickerComponent
                field="secondary"
                label="Secondary"
                setColor={setThemeColorCallback}
                value={state.theme.secondary}
                defaultColors={{
                  primary: state.theme.primary,
                  secondary: state.theme.tertiary,
                }}
              />
            ) : null}
            {variant !== "formula-1" && variant !== "american-football" ? (
              <ColorPickerComponent
                field="tertiary"
                label="Tertiary"
                setColor={setThemeColorCallback}
                value={state.theme.tertiary}
                defaultColors={{
                  primary: state.theme.primary,
                  secondary: state.theme.secondary,
                }}
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
