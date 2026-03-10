import { materialSymbolsIcons } from "@/utils/materialIcons";

interface MaterialIconProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: string;
  size?: number | string;
  variant?: "outlined" | "rounded" | "sharp"; // Optional if you want to support different styles
  fill?: number; // false = 0, true = 1, or a number from 0–1
}

export const MaterialIcon = ({
  name,
  size = 24,
  variant = "rounded",
  className = "",
  fill = 0,

  ...props
}: MaterialIconProps) => {
  const fontClass = {
    outlined: "material-symbols-outlined",
    rounded: "material-symbols-rounded",
    sharp: "material-symbols-sharp",
  }[variant];

  const safeName = materialSymbolsIcons.includes(name) ? name : "broken_image";

  return (
    <span
      style={{
        fontSize:
          typeof size === "number" ? `${size}px` : size ? size : undefined,
        fontVariationSettings: `"FILL" ${fill}, "wght" 400, "GRAD" 0, "opsz" 48`,
        transition: "font-variation-settings 0.3s ease",
      }}
      className={`${fontClass} ${className}  !block`}
      {...props}
    >
      {safeName}
    </span>
  );
};
