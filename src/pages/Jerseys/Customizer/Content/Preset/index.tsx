import { useJerseyColors } from "@/context/JerseyContext";
import { RadioGroup } from "@heroui/react";
import Item from "./Item";
import {
  basketballCustomItems,
  basketballHorizontalItems,
  basketballSideStripeItems,
  hockeyCustomItems,
  hockeyHorizontalItems,
  horizontalItems,
  verticalItems,
  customItems,
  type JerseyTemplateKey,
} from "@/utils/config";

type StripesTemplateSelectorProps = {
  type: JerseyTemplateKey;
  variant?:
    | "football"
    | "basketball"
    | "hockey"
    | "american-football"
    | "formula-1"
    | "baseball"
    | "rugby"
    | "handball";
};

export const Preset: React.FC<StripesTemplateSelectorProps> = ({
  type,
  variant = "football",
}) => {
  const {
    setStripeTemplate,
    setHorizontalStripeTemplate,
    setCustomShapeTemplate,
    setSideStripeTemplate,
    effective,
    state,
  } = useJerseyColors();

  const itemsToUse =
    type === "sidestripe"
      ? basketballSideStripeItems
      : type === "horizontal"
        ? variant === "basketball"
          ? basketballHorizontalItems
          : variant === "hockey"
            ? hockeyHorizontalItems
            : horizontalItems
        : type === "vertical"
          ? verticalItems
          : type === "custom"
            ? variant === "basketball"
              ? basketballCustomItems
              : variant === "hockey"
                ? hockeyCustomItems
                : customItems
            : [];
  const baseColor = effective("baseColor");
  const themePrimary = state.theme.primary;
  const themeSecondary = state.theme.secondary;
  const stripePrimary = effective("stripePrimaryColor");
  const stripeSecondary = effective("stripeSecondaryColor");
  const stripeTertiary = effective("stripeTertiaryColor");
  const stripeQuaternary = effective("stripeQuaternaryColor");
  const sideStripePrimary = effective("sideStripePrimaryColor");
  const sideStripeSecondary = effective("sideStripeSecondaryColor");
  const selectedValue =
    type === "horizontal"
      ? state.horizontalStripesPreset || ""
      : type === "vertical"
        ? state.stripesPreset || ""
        : type === "sidestripe"
          ? state.sideStripePreset || ""
          : type === "custom"
            ? state.customShapePreset || ""
            : "";
  const radioList = itemsToUse?.map((item) => {
    const isSelectedItem = item.id === selectedValue;
    return (
      <Item
        key={item?.id}
        props={{
          value: item?.id,
        }}
        baseColor={baseColor}
        themePrimary={themePrimary}
        themeSecondary={themeSecondary}
        stripePrimaryColor={stripePrimary}
        stripeSecondaryColor={stripeSecondary}
        stripeTertiaryColor={isSelectedItem ? stripeTertiary : undefined}
        stripeQuaternaryColor={isSelectedItem ? stripeQuaternary : undefined}
        sideStripePrimaryColor={sideStripePrimary}
        sideStripeSecondaryColor={sideStripeSecondary}
        type={type}
        variant={variant}
      ></Item>
    );
  });

  return (
    <RadioGroup
      aria-label="Select a preset"
      value={selectedValue}
      onChange={(value) => {
        if (type === "horizontal") {
          setHorizontalStripeTemplate(value);
        } else if (type === "vertical") {
          setStripeTemplate(value);
        } else if (type === "sidestripe") {
          setSideStripeTemplate(value);
        } else if (type === "custom") {
          setCustomShapeTemplate(value);
        }
      }}
      orientation="horizontal"
      className="py-4 items-center justify-center"
    >
      {radioList}
    </RadioGroup>
  );
};
