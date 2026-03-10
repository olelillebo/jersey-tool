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
  const stripePrimary = effective("stripePrimaryColor");
  const stripeSecondary = effective("stripeSecondaryColor");
  const stripeTertiary = effective("stripeTertiaryColor");
  const sideStripePrimary = effective("sideStripePrimaryColor");
  const sideStripeSecondary = effective("sideStripeSecondaryColor");
  const radioList = itemsToUse?.map((item) => {
    return (
      <Item
        key={item?.id}
        props={{
          value: item?.id,
        }}
        stripePrimaryColor={stripePrimary}
        stripeSecondaryColor={stripeSecondary}
        stripeTertiaryColor={stripeTertiary}
        sideStripePrimaryColor={sideStripePrimary}
        sideStripeSecondaryColor={sideStripeSecondary}
        baseColor={state.baseColor?.value}
        type={type}
        variant={variant}
      ></Item>
    );
  });

  return (
    <RadioGroup
      aria-label="Select a preset"
      value={
        type === "horizontal"
          ? state.horizontalStripesPreset || ""
          : type === "vertical"
            ? state.stripesPreset || ""
            : type === "sidestripe"
              ? state.sideStripePreset || ""
              : type === "custom"
                ? state.customShapePreset || ""
                : ""
      }
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
