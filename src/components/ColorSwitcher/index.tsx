import { MaterialIcon } from "@/components/MaterialIcon";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import type { JerseyFieldKey } from "@/types/types";
import { Button } from "@heroui/react";

type ColorSwitcherProps = {
  primaryColor: {
    field: JerseyFieldKey | "primary" | "secondary";
    color?: string;
  };
  secondaryColor: {
    field: JerseyFieldKey | "primary" | "secondary";
    color?: string;
  };
  setColor?: (
    field: JerseyFieldKey | "primary" | "secondary",
    color: string,
  ) => void;
  linkedPrimaryFields?: Array<{
    field: JerseyFieldKey | "primary" | "secondary";
    color?: string;
  }>;
};

export const ColorSwitcher: React.FC<ColorSwitcherProps> = ({
  primaryColor,
  secondaryColor,
  setColor,
  linkedPrimaryFields,
}) => {
  const breakpoint = useBreakpoint();
  //create a function that switches the colors of the provided fields
  const switchColors = () => {
    if (!primaryColor.color || !secondaryColor.color || !setColor) return; //only support switching between two fields for now
    const nextPrimaryColor = secondaryColor.color;
    const nextSecondaryColor = primaryColor.color;

    setColor(primaryColor.field, nextPrimaryColor);
    setColor(secondaryColor.field, nextSecondaryColor);
    linkedPrimaryFields?.forEach((linkedField) => {
      if (linkedField.color === nextSecondaryColor) {
        setColor(linkedField.field, nextPrimaryColor);
      }
    });
  };

  return (
    <Button
      size="md"
      variant="ghost"
      className="px-0 relative"
      onPress={switchColors}
      isDisabled={!primaryColor.color && !secondaryColor.color}
      isIconOnly
    >
      {" "}
      <MaterialIcon
        name="swap_horiz"
        className={breakpoint == "sm" ? "rotate-90" : ""}
      />
    </Button>
  );
};
