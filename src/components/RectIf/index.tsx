export const RectIf = ({
  x,
  y,
  width,
  height,
  fill,
  stroke,
  transform,
}: {
  x: string;
  y: string;
  width: string;
  height: string;
  fill?: string;
  stroke?: string;
  transform?: string;
}) =>
  fill ? (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      fill={fill}
      stroke={stroke}
      transform={transform}
    />
  ) : null;
