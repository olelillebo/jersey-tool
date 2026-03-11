import type {
  CustomShapePreset,
  HorizontalStripePreset,
  JerseyFieldKey,
  SideStripePreset,
  StripePreset,
} from "@/types/types";

export type JerseyTemplateKey =
  | "vertical"
  | "horizontal"
  | "custom"
  | "sidestripe";

export const KEYS: JerseyFieldKey[] = [
  "baseColor",
  "leftSleeveColor",
  "rightSleeveColor",
  "leftSleeveDetailColor",
  "rightSleeveDetailColor",
  "neckCircleColor",
  "leftNeckCircleColor",
  "shoulderPanelColor",
  "stripePrimaryColor",
  "stripeSecondaryColor",
  "stripeTertiaryColor",
  "stripeQuaternaryColor",
  "sleeveStripePrimaryColor",
  "sleeveStripeSecondaryColor",
  "sleeveStripeTertiaryColor",
  "sideStripePrimaryColor",
  "sideStripeSecondaryColor",
];

export const verticalItems = [
  { id: "defaultVertical", name: "Default Vertical" },
  { id: "defaultVerticalCenterAlt", name: "Center Alt" },
  { id: "verticalThinFull", name: "Vertical Thin Full" },
  { id: "rightThinDouble_SP", name: "Right Thin Double SP" },
  { id: "rightThinDouble_PS", name: "Right Thin Double PS" },
  { id: "rightThinSingle_S", name: "Right Thin Single S" },
  { id: "verticalDoubleBand", name: "Vertical Double Band" },
  { id: "verticalTripleBand", name: "Vertical Triple Band" },
  { id: "verticalDoubleCenterSplit", name: "Vertical Double Center Split" },
];

export const horizontalItems = [
  { id: "regularQuadStripe", name: "Regular Quad Stripe" },
  { id: "regularTripleStripe", name: "Regular Triple Stripe" },
  { id: "twoColorDoubleStripe", name: "Two Color Double Stripe" },
  { id: "singleBand", name: "Single Band" },
  { id: "threeColorBand", name: "Three Color Band" },
];

export const basketballHorizontalItems = [
  ...horizontalItems,
  { id: "basketTopBand", name: "Top Band" },
];

export const hockeyHorizontalItems = [
  ...horizontalItems,
  { id: "hockeyTripleBottomStripe", name: "Triple Bottom Stripe" },
  {
    id: "hockeyTripleBottomStripeShade",
    name: "Triple Bottom Stripe Shade",
  },
  {
    id: "hockeyBottomStripeShade",
    name: "Bottom Stripe Shade",
  },
];

export const basketballSideStripeItems = [
  { id: "basketSideStripeToSleeve", name: "To Sleeve" },
  { id: "basketSideStripeFull", name: "Full Side Stripe" },
];

export const customItems = [
  { id: "diagonalLeft", name: "Diagonal Left" },
  { id: "diagonalRight", name: "Diagonal Right" },
  { id: "diagonalHalfHalf1", name: "Diagonal Half-Half 1" },
  { id: "diagonalHalfHalf2", name: "Diagonal Half-Half 2" },
  { id: "arrow", name: "Arrow" },
  { id: "cross", name: "Cross" },
  { id: "split", name: "Split" },
];

export const basketballCustomItems = customItems.filter(
  (item) => item.id !== "diagonalHalfHalf1" && item.id !== "diagonalHalfHalf2",
);

export const hockeyCustomItems = customItems
  .filter((item) => item.id !== "diagonalHalfHalf2")
  .concat({
    id: "hockeyThinArrowFill",
    name: "Thin Arrow Fill",
  });

export const jerseyParts = [
  {
    label: "Solid Color",
    hasColorSwitcher: false,
    keys: ["baseColor", "baseColor"] as JerseyFieldKey[],
    baseProps: {
      baseColor: "#000",
    },
    primaryKey: {
      field: "baseColor" as JerseyFieldKey,
      label: "Fill",
    },
  },
  {
    label: "Sleeves",
    hasColorSwitcher: true,
    keys: ["leftSleeveColor", "rightSleeveColor"] as JerseyFieldKey[],
    baseProps: {
      baseColor: "#FFFFFF",
      leftSleeveColor: "#000",
      rightSleeveColor: "#000",
    },
    primaryKey: {
      field: "leftSleeveColor" as JerseyFieldKey,
      label: "Left",
    },
    secondaryKey: {
      field: "rightSleeveColor" as JerseyFieldKey,
      label: "Right",
    },
  },
  {
    label: "Sleeve Detail",
    hasColorSwitcher: true,
    keys: [
      "leftSleeveDetailColor",
      "rightSleeveDetailColor",
    ] as JerseyFieldKey[],
    baseProps: {
      baseColor: "#FFFFFF",
      leftSleeveDetailColor: "#000",
      rightSleeveDetailColor: "#000",
    },
    primaryKey: {
      field: "leftSleeveDetailColor" as JerseyFieldKey,
      label: "Left",
    },
    secondaryKey: {
      field: "rightSleeveDetailColor" as JerseyFieldKey,
      label: "Right",
    },
  },
  {
    label: "Shoulder Panel",
    hasColorSwitcher: false,
    keys: ["shoulderPanelColor"] as JerseyFieldKey[],
    baseProps: {
      baseColor: "#FFFFFF",
      shoulderPanelColor: "#000",
    },
    primaryKey: {
      field: "shoulderPanelColor" as JerseyFieldKey,
      label: "Fill",
    },
  },
  {
    label: "Collar",
    hasColorSwitcher: true,
    keys: ["neckCircleColor", "leftNeckCircleColor"] as JerseyFieldKey[],
    baseProps: {
      baseColor: "#FFFFFF",
      neckCircleColor: "#000",
    },
    primaryKey: {
      field: "neckCircleColor" as JerseyFieldKey,
      label: "Full",
    },
    secondaryKey: {
      field: "leftNeckCircleColor" as JerseyFieldKey,
      label: "Left",
    },
  },
  {
    label: "Vertical Stripes",
    templateKey: "vertical" as JerseyTemplateKey,
    hasColorSwitcher: true,
    keys: ["stripePrimaryColor", "stripeSecondaryColor"] as JerseyFieldKey[],
    baseProps: {
      baseColor: "#FFFFFF",
      stripePrimaryColor: "#000",
      stripesPreset: "defaultVertical" as StripePreset,
    },
    primaryKey: {
      field: "stripePrimaryColor" as JerseyFieldKey,
      label: "Primary",
    },
    secondaryKey: {
      field: "stripeSecondaryColor" as JerseyFieldKey,
      label: "Secondary",
    },
  },
  {
    label: "Horizontal Stripes",
    templateKey: "horizontal" as JerseyTemplateKey,
    hasColorSwitcher: true,
    keys: ["stripePrimaryColor", "stripeSecondaryColor"] as JerseyFieldKey[],
    baseProps: {
      baseColor: "#FFFFFF",
      stripePrimaryColor: "#000",
      horizontalStripesPreset: "regularQuadStripe" as HorizontalStripePreset,
    },
    primaryKey: {
      field: "stripePrimaryColor" as JerseyFieldKey,
      label: "Primary",
    },
    secondaryKey: {
      field: "stripeSecondaryColor" as JerseyFieldKey,
      label: "Secondary",
    },
  },
  {
    label: "Custom Shape",
    templateKey: "custom" as JerseyTemplateKey,
    hasColorSwitcher: false,
    keys: ["stripePrimaryColor"] as JerseyFieldKey[],
    baseProps: {
      baseColor: "#FFFFFF",
      stripePrimaryColor: "#000",
      customShapePreset: "diagonalLeft" as CustomShapePreset,
    },
    primaryKey: {
      field: "stripePrimaryColor" as JerseyFieldKey,
      label: "Fill",
    },
  },
];

const clonePart = <T extends (typeof jerseyParts)[number]>(part: T): T => ({
  ...part,
  keys: [...part.keys] as T["keys"],
  baseProps: { ...part.baseProps },
  primaryKey: part.primaryKey ? { ...part.primaryKey } : part.primaryKey,
  secondaryKey: part.secondaryKey
    ? { ...part.secondaryKey }
    : part.secondaryKey,
  ...("tertiaryKey" in part && part.tertiaryKey
    ? { tertiaryKey: { ...part.tertiaryKey } }
    : {}),
  ...("quaternaryKey" in part && part.quaternaryKey
    ? { quaternaryKey: { ...part.quaternaryKey } }
    : {}),
});

export const footballJerseyParts = jerseyParts.map((part) => clonePart(part));

export const basketballJerseyParts = [
  ...jerseyParts.filter(
    (part) =>
      part.label !== "Sleeves" &&
      part.label !== "Sleeve Detail" &&
      part.label !== "Shoulder Panel",
  ),
  {
    label: "Side Stripe",
    templateKey: "sidestripe" as JerseyTemplateKey,
    hasColorSwitcher: true,
    keys: [
      "sideStripePrimaryColor",
      "sideStripeSecondaryColor",
    ] as JerseyFieldKey[],
    baseProps: {
      baseColor: "#FFFFFF",
      sideStripePrimaryColor: "#000",
      sideStripeSecondaryColor: "#000",
      sideStripePreset: "basketSideStripeToSleeve" as SideStripePreset,
    },
    primaryKey: {
      field: "sideStripePrimaryColor" as JerseyFieldKey,
      label: "Left",
    },
    secondaryKey: {
      field: "sideStripeSecondaryColor" as JerseyFieldKey,
      label: "Right",
    },
  },
];

const hockeySleeveStripePart = {
  label: "Sleeve Stripes",
  templateKey: undefined,
  hasColorSwitcher: true,
  keys: [
    "sleeveStripePrimaryColor",
    "sleeveStripeSecondaryColor",
    "sleeveStripeTertiaryColor",
  ] as JerseyFieldKey[],
  baseProps: {
    baseColor: "#FFFFFF",
    sleeveStripePrimaryColor: "#000000",
    sleeveStripeSecondaryColor: "#FFFFFF",
    sleeveStripeTertiaryColor: "#000000",
  },
  primaryKey: {
    field: "sleeveStripePrimaryColor" as JerseyFieldKey,
    label: "Top",
  },
  secondaryKey: {
    field: "sleeveStripeSecondaryColor" as JerseyFieldKey,
    label: "Middle",
  },
  tertiaryKey: {
    field: "sleeveStripeTertiaryColor" as JerseyFieldKey,
    label: "Bottom",
  },
};

export const hockeyJerseyParts = [
  ...jerseyParts.filter((part) => part.label === "Solid Color"),
  ...jerseyParts.filter((part) => part.label === "Sleeves"),
  ...jerseyParts.filter((part) => part.label === "Sleeve Detail"),
  hockeySleeveStripePart,
  ...jerseyParts.filter((part) => part.label === "Collar"),
  ...jerseyParts.filter((part) => part.label === "Vertical Stripes"),
  ...jerseyParts.filter((part) => part.label === "Horizontal Stripes"),
  ...jerseyParts.filter((part) => part.label === "Custom Shape"),
].map((part) =>
  part.label === "Sleeves"
    ? {
        ...part,
        baseProps: {
          ...part.baseProps,
          leftSleeveColor: "#000000",
          rightSleeveColor: "#000000",
        },
      }
    : part.label === "Collar"
      ? {
          ...part,
          keys: ["neckCircleColor"] as JerseyFieldKey[],
          baseProps: {
            ...part.baseProps,
            leftNeckCircleColor: undefined,
          },
          secondaryKey: undefined,
        }
      : part.label === "Vertical Stripes"
        ? {
            ...part,
            baseProps: {
              ...part.baseProps,
              stripesPreset: "verticalTripleBand" as StripePreset,
            },
          }
        : part.label === "Horizontal Stripes"
          ? {
              ...part,
              keys: [
                "stripePrimaryColor",
                "stripeSecondaryColor",
                "stripeTertiaryColor",
                "stripeQuaternaryColor",
              ] as JerseyFieldKey[],
              primaryKey: {
                field: "stripePrimaryColor" as JerseyFieldKey,
                label: "Bottom Stripe",
              },
              secondaryKey: {
                field: "stripeSecondaryColor" as JerseyFieldKey,
                label: "Center Stripe",
              },
              baseProps: {
                ...part.baseProps,
                horizontalStripesPreset:
                  "hockeyTripleBottomStripe" as HorizontalStripePreset,
                stripeTertiaryColor: "#1C3997",
                stripeQuaternaryColor: "#1C3997",
              },
              tertiaryKey: {
                field: "stripeTertiaryColor" as JerseyFieldKey,
                label: "Top Stripe",
              },
              quaternaryKey: {
                field: "stripeQuaternaryColor" as JerseyFieldKey,
                label: "Bottom Shirt",
              },
            }
          : part.label === "Custom Shape"
            ? {
                ...part,
                keys: [
                  "stripePrimaryColor",
                  "stripeTertiaryColor",
                ] as JerseyFieldKey[],
                baseProps: {
                  ...part.baseProps,
                  stripeTertiaryColor: "#1C3997",
                },
                tertiaryKey: {
                  field: "stripeTertiaryColor" as JerseyFieldKey,
                  label: "Bottom Fill",
                },
              }
            : part,
);

export const formulaOneParts = [
  {
    label: "Visor",
    templateKey: undefined,
    hasColorSwitcher: false,
    keys: ["neckCircleColor"] as JerseyFieldKey[],
    baseProps: {
      baseColor: "#ffffff",
      neckCircleColor: "#1A1A1A",
    },
    primaryKey: {
      field: "neckCircleColor" as JerseyFieldKey,
      label: "Color",
    },
    secondaryKey: undefined,
  },
];
