export type SportVariant =
  | "football"
  | "basketball"
  | "hockey"
  | "american-football"
  | "formula-1"
  | "baseball"
  | "rugby"
  | "handball";

const COMMON = `You are generating a jersey config JSON for my app.
Return valid JSON only. No markdown, no comments, no prose.

Input:
- team_name: "{{TEAM_NAME}}"
- context: "{{LEAGUE_OR_COUNTRY}}"
- design_brief: "{{DESIGN_BRIEF}}"
- include_player_text: {{INCLUDE_PLAYER_TEXT}}

Global output rules:
- Output exactly one JSON object.
- Use uppercase #RRGGBB for every non-empty color field.
- Any intentionally unused field must be "".
- primary and secondary must represent the two main club or shirt colors.
- tertiary is the accent / trim team color.
- Do not replace primary or secondary with an accent color just to make shapes visible.
- If baseColor is used, the app usually shifts contrast/details away from the base:
  - single-color details usually default to secondary
  - two-color pattern/details usually default to secondary + tertiary
- Text and numbers follow the same idea: with baseColor enabled, prefer secondary or tertiary over repeating the base color.
- Include all required top-level keys:
name, sport, primary, secondary, tertiary, stripesPreset, horizontalStripesPreset, customShapePreset, sideStripePreset, baseColor, leftSleeveColor, rightSleeveColor, leftSleeveDetailColor, rightSleeveDetailColor, neckCircleColor, leftNeckCircleColor, shoulderPanelColor, stripePrimaryColor, stripeSecondaryColor, stripeTertiaryColor, stripeQuaternaryColor, sleeveStripePrimaryColor, sleeveStripeSecondaryColor, sleeveStripeTertiaryColor, sideStripePrimaryColor, sideStripeSecondaryColor, footballBackEnabled, footballBackName, footballBackNumber, footballBackFontFamily, footballBackFontWeight, footballBackTextColor, footballBackTextOutlineEnabled, footballBackTextOutlineColor, footballBackTextOutlineWidth, footballBackNameCurveAmount, footballBackNameSize, footballBackNumberSize, footballBackNameY, footballBackNumberY, state
- Include state keys:
baseColor, leftSleeveColor, rightSleeveColor, leftSleeveDetailColor, rightSleeveDetailColor, neckCircleColor, leftNeckCircleColor, shoulderPanelColor, stripePrimaryColor, stripeSecondaryColor, stripeTertiaryColor, stripeQuaternaryColor, sleeveStripePrimaryColor, sleeveStripeSecondaryColor, sleeveStripeTertiaryColor, sideStripePrimaryColor, sideStripeSecondaryColor, footballBackEnabled, footballBackName, footballBackNumber, footballBackFontFamily, footballBackFontWeight, footballBackTextColor, footballBackTextOutlineEnabled, footballBackTextOutlineColor, footballBackTextOutlineWidth, footballBackNameCurveAmount, footballBackNameSize, footballBackNumberSize, footballBackNameY, footballBackNumberY
- Top-level color fields and state color fields must match exactly.
`;

const FOOTBALL_LIKE = `- Default preference: keep designs simple and common. Use vertical stripes first for classic clubs unless design_brief explicitly asks otherwise.
- Allowed vertical presets: defaultVertical, defaultVerticalCenterAlt, verticalThinFull, rightThinDouble_SP, rightThinDouble_PS, rightThinSingle_S, verticalDoubleBand, verticalTripleBand, verticalDoubleCenterSplit
- Allowed horizontal presets: regularQuadStripe, regularTripleStripe, twoColorDoubleStripe, singleBand, threeColorBand
- Allowed custom presets: diagonalLeft, diagonalRight, diagonalHalfHalf1, diagonalHalfHalf2, arrow, cross, split
- sideStripePreset, sideStripePrimaryColor, sideStripeSecondaryColor, sleeveStripePrimaryColor, sleeveStripeSecondaryColor, sleeveStripeTertiaryColor, stripeQuaternaryColor must be "".
- Exactly one of vertical/horizontal/custom OR none should be active.
- Collar defaults: use only neckCircleColor and keep leftNeckCircleColor="".
- Only set leftNeckCircleColor when design_brief explicitly requests split/asymmetric collar.
- Prefer defaultVertical or defaultVerticalCenterAlt before detailed variants unless explicitly requested.
- baseColor should usually be primary.
- If baseColor is enabled, stripePrimaryColor should usually be secondary.
- If a second stripe color is needed with baseColor enabled, use tertiary before repeating the base color.
- For split custom: stripePrimaryColor is the right split panel and baseColor is the left/background torso.
`;

const PLAYER_TEXT_FOOTBALL_LIKE = `- Player text:
  - If include_player_text=true: set footballBackEnabled=true and include backside player text.
  - footballBackName and footballBackNumber should be realistic placeholders.
  - If baseColor is enabled, footballBackTextColor should usually come from secondary or tertiary.
  - Defaults: footballBackFontFamily="Barlow Condensed", footballBackFontWeight=700, footballBackTextColor="", footballBackTextOutlineEnabled=false, footballBackTextOutlineColor="#000000", footballBackTextOutlineWidth=2, footballBackNameCurveAmount=0, footballBackNameSize=4, footballBackNumberSize=16, footballBackNameY=11, footballBackNumberY=21.
  - If include_player_text=false: footballBackEnabled=false and footballBackName/footballBackNumber="" (keep other player text defaults valid).
`;

const SPORT_RULES: Record<SportVariant, string> = {
  football: `Sport target: football
- sport must be "football".
${FOOTBALL_LIKE}
- For vertical presets, both sleeves should usually stay the same as the base unless design_brief explicitly asks for contrast sleeves.
${PLAYER_TEXT_FOOTBALL_LIKE}`,

  basketball: `Sport target: basketball
- sport must be "basketball".
- Allowed vertical presets: defaultVertical, defaultVerticalCenterAlt, verticalThinFull, rightThinDouble_SP, rightThinDouble_PS, rightThinSingle_S, verticalDoubleBand, verticalTripleBand, verticalDoubleCenterSplit
- Allowed horizontal presets: regularQuadStripe, regularTripleStripe, twoColorDoubleStripe, singleBand, threeColorBand, basketTopBand
- Allowed custom presets: diagonalLeft, diagonalRight, arrow, cross, split
- Allowed sideStripePreset: basketSideStripeToSleeve, basketSideStripeFull, or "".
- Must be "": leftSleeveColor, rightSleeveColor, leftSleeveDetailColor, rightSleeveDetailColor, sleeveStripePrimaryColor, sleeveStripeSecondaryColor, sleeveStripeTertiaryColor, shoulderPanelColor, stripeQuaternaryColor
- Side stripe can be used alone or with vertical; avoid combining side stripe with horizontal/custom.
- Side stripe defaults should be symmetric: use the same color for left and right unless design_brief explicitly requests asymmetry.
- Side stripe colors must come from primary, secondary, tertiary, or baseColor.
- If baseColor is enabled, basket side stripes should usually use secondary on both sides.
- Keep visible contrast by swapping layer assignment, not by changing the club palette.
- Collar supports full ring plus optional left-half accent.
- Player text:
  - If include_player_text=true: set footballBackEnabled=true and include front player text.
  - If baseColor is enabled, footballBackTextColor should usually come from secondary or tertiary.
  - Defaults: footballBackFontFamily="Barlow Condensed", footballBackFontWeight=700, footballBackTextColor="", footballBackTextOutlineEnabled=false, footballBackTextOutlineColor="#000000", footballBackTextOutlineWidth=2, footballBackNameCurveAmount=0, footballBackNameSize=4, footballBackNumberSize=16, footballBackNameY=13.5, footballBackNumberY=25.5.
  - If include_player_text=false: footballBackEnabled=false and footballBackName/footballBackNumber="" (keep other player text defaults valid).
`,

  hockey: `Sport target: hockey
- sport must be "hockey".
- Allowed vertical presets: defaultVertical, defaultVerticalCenterAlt, verticalThinFull, rightThinDouble_SP, rightThinDouble_PS, rightThinSingle_S, verticalDoubleBand, verticalTripleBand, verticalDoubleCenterSplit
- Allowed horizontal presets: regularQuadStripe, regularTripleStripe, twoColorDoubleStripe, singleBand, threeColorBand, hockeyTripleBottomStripe, hockeyTripleBottomStripeShade, hockeyBottomStripeShade
- Allowed custom presets: diagonalLeft, diagonalRight, diagonalHalfHalf1, arrow, cross, split, hockeyThinArrowFill
- sideStripePreset, sideStripePrimaryColor, sideStripeSecondaryColor must be "".
- leftNeckCircleColor must be "".
- shoulderPanelColor must be "".
- In most cases, prefer hockey-specific horizontal bottom stripe presets over generic horizontal presets.
- Default preference order for horizontal stripes: hockeyTripleBottomStripeShade, hockeyTripleBottomStripe, hockeyBottomStripeShade.
- If baseColor is enabled, hockey contrast colors should usually shift to secondary / tertiary instead of repeating the base color.
- Hockey sleeve detail blocks are allowed and usually behave like a darker/contrasting version of the base.
- Hockey sleeve stripes use:
  - sleeveStripePrimaryColor = bottom stripe
  - sleeveStripeSecondaryColor = center stripe
  - sleeveStripeTertiaryColor = top stripe
  - top and bottom usually match
- Hockey horizontal stripe field mapping:
  - hockeyTripleBottomStripe: stripePrimaryColor=bottom, stripeSecondaryColor=center, stripeTertiaryColor=top
  - hockeyTripleBottomStripeShade: stripePrimaryColor=bottom, stripeSecondaryColor=center, stripeTertiaryColor=top, stripeQuaternaryColor=bottom shirt shade
  - hockeyBottomStripeShade: stripePrimaryColor=stripe, stripeQuaternaryColor=bottom shirt shade
- Hockey custom shape field mapping:
  - hockeyThinArrowFill: stripePrimaryColor=main fill, stripeTertiaryColor=bottom fill
- For shaded hockey presets and hockeyThinArrowFill, the darkened part should visually behave like a darker shade of the base area, not a random unrelated accent.
- Only set stripeQuaternaryColor or stripeTertiaryColor to an explicit override shade when design_brief clearly needs it; otherwise they may be left "" to let the app derive the shade.
- In most cases, include sleeve stripe colors as part of the hockey look.
- Player text:
  - If include_player_text=true: set footballBackEnabled=true and include backside player text.
  - If baseColor is enabled, footballBackTextColor should usually come from secondary or tertiary.
  - Defaults: footballBackFontFamily="Barlow Condensed", footballBackFontWeight=700, footballBackTextColor="", footballBackTextOutlineEnabled=false, footballBackTextOutlineColor="#000000", footballBackTextOutlineWidth=2, footballBackNameCurveAmount=0, footballBackNameSize=4, footballBackNumberSize=16, footballBackNameY=11, footballBackNumberY=21.
  - If include_player_text=false: footballBackEnabled=false and footballBackName/footballBackNumber="" (keep other player text defaults valid).
`,

  "american-football": `Sport target: american-football
- sport must be "american-football".
- Renderer supports only baseColor and neckCircleColor.
- Must be "": stripesPreset, horizontalStripesPreset, customShapePreset, sideStripePreset, leftNeckCircleColor, leftSleeveColor, rightSleeveColor, leftSleeveDetailColor, rightSleeveDetailColor, shoulderPanelColor, stripePrimaryColor, stripeSecondaryColor, stripeTertiaryColor, stripeQuaternaryColor, sleeveStripePrimaryColor, sleeveStripeSecondaryColor, sleeveStripeTertiaryColor, sideStripePrimaryColor, sideStripeSecondaryColor
- Keep design team-appropriate by selecting strong baseColor and complementary neckCircleColor.
`,

  "formula-1": `Sport target: formula-1
- sport must be "formula-1".
- Renderer supports only baseColor and neckCircleColor (visor).
- Must be "": stripesPreset, horizontalStripesPreset, customShapePreset, sideStripePreset, leftNeckCircleColor, leftSleeveColor, rightSleeveColor, leftSleeveDetailColor, rightSleeveDetailColor, shoulderPanelColor, stripePrimaryColor, stripeSecondaryColor, stripeTertiaryColor, stripeQuaternaryColor, sleeveStripePrimaryColor, sleeveStripeSecondaryColor, sleeveStripeTertiaryColor, sideStripePrimaryColor, sideStripeSecondaryColor
- Keep design team-appropriate with racing-inspired contrast between body and visor.
`,

  baseball: `Sport target: baseball
- sport must be "baseball".
- Treat baseball exactly like football for now.
${FOOTBALL_LIKE}
${PLAYER_TEXT_FOOTBALL_LIKE}`,

  rugby: `Sport target: rugby
- sport must be "rugby".
- Treat rugby exactly like football for now.
${FOOTBALL_LIKE}
${PLAYER_TEXT_FOOTBALL_LIKE}`,

  handball: `Sport target: handball
- sport must be "handball".
- Treat handball exactly like football for now.
${FOOTBALL_LIKE}
${PLAYER_TEXT_FOOTBALL_LIKE}`,
};

export function getPromptTemplateForSport(sport: SportVariant) {
  return `${COMMON}
${SPORT_RULES[sport]}

Self-check before final output:
- sport matches the target sport exactly
- enums are valid for that sport
- non-applicable fields are ""
- all non-empty colors are uppercase #RRGGBB
- top-level color fields equal state color fields
- required keys exist, no extra keys exist
- output is exactly one JSON object`;
}

export function getReadyPromptForSport(
  sport: SportVariant,
  teamName: string,
  leagueOrCountry: string,
  designBrief?: string,
  includePlayerText = false,
) {
  return getPromptTemplateForSport(sport)
    .replace("{{TEAM_NAME}}", teamName)
    .replace("{{LEAGUE_OR_COUNTRY}}", leagueOrCountry)
    .replace("{{DESIGN_BRIEF}}", designBrief || "")
    .replace("{{INCLUDE_PLAYER_TEXT}}", includePlayerText ? "true" : "false");
}
