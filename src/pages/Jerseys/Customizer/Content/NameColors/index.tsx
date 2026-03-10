import { useJerseyColors } from "@/context/JerseyContext";
import { ColorSwitcher } from "@/components/ColorSwitcher";
import ColorPickerComponent from "@/components/ColorPicker";
import type { Theme } from "@/types/types";
import ColorSelect from "@/components/ColorSelect";
import { Input } from "@heroui/react";
import { classNames } from "@/utils/utils";

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
  const { state, setThemeColor, setName, setNameEditing, flushDraftSave } =
    useJerseyColors();

  const setThemeColorCallback = (label: string, color: string | undefined) => {
    setThemeColor(label as keyof Theme, color);
  };

  const needsMainColors =
    variant === "formula-1"
      ? !state.theme.primary
      : !(state.theme.primary && state.theme.secondary);
  // True once both colors are entered — collapse to compact view
  const hasMainColors = !needsMainColors;

  return (
    <div className="flex flex-col bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
      <div className="flex w-full justify-between items-center">
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
      </div>

      <div
        className="grid transition-all duration-500 ease-in-out"
        style={{
          gridTemplateRows: needsMainColors ? "1fr" : "0fr",
          opacity: needsMainColors ? 1 : 0,
        }}
      >
        <div className="overflow-hidden">
          <div className="flex gap-4 pt-5">
            <ColorSelect
              field="primary"
              label="Primary"
              setColor={setThemeColorCallback}
              value={state.theme.primary}
              needsMainColors={needsMainColors}
            />
            {variant !== "formula-1" ? (
              <ColorSelect
                field="secondary"
                label="Secondary"
                setColor={setThemeColorCallback}
                value={state.theme.secondary}
                needsMainColors={needsMainColors}
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
            />
            {variant !== "formula-1" ? (
              <div className="self-center hidden sm:flex">
                <ColorSwitcher
                  primaryColor={{
                    field: "primary",
                    color: state.theme.primary,
                  }}
                  secondaryColor={{
                    field: "secondary",
                    color: state.theme.secondary,
                  }}
                  setColor={setThemeColorCallback}
                />
              </div>
            ) : null}
            {variant !== "formula-1" ? (
              <ColorPickerComponent
                field="secondary"
                label="Secondary"
                setColor={setThemeColorCallback}
                value={state.theme.secondary}
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
