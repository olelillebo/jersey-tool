import { useBreakpoint } from "@/hooks/useBreakpoint";
import Base from "@/components/Jersey/base";
import { classNames } from "@/utils/utils";
import { darken, getContrastingShade } from "@/utils/colorFunctions";
import { Radio, type RadioProps } from "@heroui/react";
import type {
  StripePreset,
  HorizontalStripePreset,
  CustomShapePreset,
  SideStripePreset,
} from "@/types/types";

interface ItemInterface {
  props: RadioProps;
  label?: string | undefined;
  title?: string | undefined;
  baseColor?: string | undefined;
  themePrimary?: string | undefined;
  themeSecondary?: string | undefined;
  stripePrimaryColor?: string | undefined;
  stripeSecondaryColor?: string | undefined;
  stripeTertiaryColor?: string | undefined;
  stripeQuaternaryColor?: string | undefined;
  sideStripePrimaryColor?: string | undefined;
  sideStripeSecondaryColor?: string | undefined;
  type: "vertical" | "horizontal" | "custom" | "sidestripe";
  variant?:
    | "football"
    | "basketball"
    | "hockey"
    | "american-football"
    | "formula-1"
    | "baseball"
    | "rugby"
    | "handball";
}

const Item: React.FC<ItemInterface> = ({
  props,
  label,
  title,
  baseColor,
  themePrimary,
  themeSecondary,
  stripePrimaryColor,
  stripeSecondaryColor,
  stripeTertiaryColor,
  stripeQuaternaryColor,
  sideStripePrimaryColor,
  sideStripeSecondaryColor,
  type,
  variant = "football",
}) => {
  const breakpoint = useBreakpoint();
  const { value } = props;
  const previewBaseColor =
    baseColor ?? (variant === "hockey" ? "#F3F4F6" : "#FFFFFF");
  const previewPrimary =
    stripePrimaryColor ?? themePrimary ?? themeSecondary ?? "#303030";
  const previewSecondary =
    stripeSecondaryColor ?? themeSecondary ?? themePrimary ?? "#FFFFFF";
  const previewBaseShade = getContrastingShade(previewBaseColor, 0.2);
  const previewTertiary =
    variant === "hockey" && type === "custom" && value === "hockeyThinArrowFill"
      ? stripeTertiaryColor ?? previewBaseShade
      : stripeTertiaryColor ?? previewPrimary;
  const previewQuaternary =
    variant === "hockey" &&
    type === "horizontal" &&
    (value === "hockeyTripleBottomStripeShade" ||
      value === "hockeyBottomStripeShade")
      ? stripeQuaternaryColor ?? previewBaseShade
      : stripeQuaternaryColor ?? darken(previewPrimary, 0.2);
  const previewSidePrimary = sideStripePrimaryColor ?? previewPrimary;
  const previewSideSecondary =
    sideStripeSecondaryColor ?? themeSecondary ?? previewSidePrimary;

  return (
    <Radio
      value={value}
      aria-label={label || title}
      className={classNames(
        "flex  rounded-lg h-fit w-fit",
        "border-gray-200 dark:border-slate-500 data-[selected=true]:shadow-xl data-[selected=true]:border-black dark:data-[selected=true]:border-white items-center",
        " border-2 px-2 py-2 ",
      )}
    >
      <Radio.Content>
        <Base
          baseColor={previewBaseColor}
          stripesPreset={
            type === "vertical" ? (value as StripePreset) : undefined
          }
          horizontalStripesPreset={
            type === "horizontal"
              ? (value as HorizontalStripePreset)
              : undefined
          }
          customShapePreset={
            type === "custom" ? (value as CustomShapePreset) : undefined
          }
          sideStripePreset={
            type === "sidestripe" ? (value as SideStripePreset) : undefined
          }
          stripePrimaryColor={previewPrimary}
          stripeSecondaryColor={previewSecondary}
          stripeTertiaryColor={previewTertiary}
          stripeQuaternaryColor={previewQuaternary}
          sideStripePrimaryColor={previewSidePrimary}
          sideStripeSecondaryColor={previewSideSecondary}
          size={breakpoint == "sm" ? "xsmall" : "small"}
          variant={variant}
        />
        {label || title ? (
          <div className={classNames("flex flex-col w-full gap-y-0.5 ")}>
            {title && <span className="text-sm font-semibold">{title}</span>}
            {label && (
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {label}
              </span>
            )}
          </div>
        ) : null}
      </Radio.Content>
    </Radio>
  );
};

export default Item;
