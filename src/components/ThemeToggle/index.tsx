import { Label, ListBox, Select } from "@heroui/react";
import { type Key } from "react";
import { MaterialIcon } from "../MaterialIcon";
import { useTheme } from "@/context/theme";

export function ThemeToggle({ iconOnly = false }: { iconOnly?: boolean }) {
  const { theme, setTheme } = useTheme();

  const handleChange = (id: Key | null) => {
    const value = id as "light" | "dark" | "system";
    //TODO: Remove when heroui beta bug is fixed
    setTimeout(() => setTheme(value), 150);
  };

  const options = [
    { id: "light", label: "Light", icon: "light_mode" },
    { id: "dark", label: "Dark", icon: "dark_mode" },
    { id: "system", label: "System", icon: "computer" },
  ];

  const selectedItem = options.find((option) => option.id === theme);

  return (
    <Select
      className={iconOnly ? "w-12" : "w-[256px]"}
      placeholder={"Select theme"}
      value={theme}
      variant={iconOnly ? "secondary" : "primary"}
      selectionMode="single"
      onChange={handleChange}
      aria-label={iconOnly ? "Theme" : undefined}
    >
      {iconOnly ? null : <Label>Theme</Label>}
      <Select.Trigger className={iconOnly ? "bg-transparent" : undefined}>
        <div className="flex items-center gap-2 pointer-events-none ">
          <MaterialIcon name={selectedItem?.icon || "computer"} />
          {iconOnly ? null : <span>{selectedItem?.label}</span>}
        </div>
        {iconOnly ? null : <Select.Indicator />}
      </Select.Trigger>
      <Select.Popover>
        <ListBox aria-label={iconOnly ? "Theme" : undefined}>
          {options.map((option) => (
            <ListBox.Item
              key={option.id}
              id={option.id}
              textValue={option.label}
              className="data-[selected=true]:bg-neutral-200 dark:data-[selected=true]:bg-neutral-800"
            >
              <MaterialIcon name={option.icon} />
              {iconOnly ? null : <Label>{option.label}</Label>}
              {iconOnly ? null : <ListBox.ItemIndicator />}
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  );
}
