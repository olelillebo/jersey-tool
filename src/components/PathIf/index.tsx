export const PathIf = ({ d, fill }: { d: string; fill?: string }) =>
  fill ? <path d={d} fill={fill} /> : null;
