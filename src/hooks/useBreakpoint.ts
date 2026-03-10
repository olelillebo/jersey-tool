import { useEffect, useState } from "react";

type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl";

export function useBreakpoint(): Breakpoint {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>(() => {
    if (typeof window === "undefined") return "sm";
    const width = window.innerWidth;
    if (width < 640) return "sm";
    if (width >= 640 && width < 1024) return "md";
    if (width >= 1024 && width < 1280) return "lg";
    return "xl";
  });

  useEffect(() => {
    const mqSm = window.matchMedia("(max-width: 639px)");
    const mqMd = window.matchMedia(
      "(min-width: 640px) and (max-width: 1023px)"
    );
    const mqLg = window.matchMedia(
      "(min-width: 1024px) and (max-width: 1279px)"
    );
    const mqXl = window.matchMedia("(min-width: 1280px)");

    const update = () => {
      if (mqSm.matches) setBreakpoint("sm");
      else if (mqMd.matches) setBreakpoint("md");
      else if (mqLg.matches) setBreakpoint("lg");
      else if (mqXl.matches) setBreakpoint("xl");
    };

    [mqSm, mqMd, mqLg, mqXl].forEach((mq) =>
      mq.addEventListener("change", update)
    );
    update();

    return () =>
      [mqSm, mqMd, mqLg, mqXl].forEach((mq) =>
        mq.removeEventListener("change", update)
      );
  }, []);

  return breakpoint;
}
