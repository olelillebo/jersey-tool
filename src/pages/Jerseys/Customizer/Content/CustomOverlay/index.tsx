import { useJerseyColors } from "@/context/JerseyContext";

import { Button, Label, Slider, toast } from "@heroui/react";
import { useRef } from "react";

const toPercent = (value: number) => `${Math.round(value * 100)}%`;
const toSignedPercent = (value: number, maxAbs: number) => {
  const pct = Math.round((value / maxAbs) * 100);
  return pct > 0 ? `+${pct}%` : `${pct}%`;
};
const toSignedValue = (value: number) => {
  if (Math.abs(value) < 0.001) return "0";
  const rounded = Math.round(value * 10) / 10;
  const rendered = Number.isInteger(rounded)
    ? `${rounded}`
    : rounded.toFixed(1);
  return rounded > 0 ? `+${rendered}` : rendered;
};

function extractSvgOverlay(svgText: string) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgText, "image/svg+xml");
  const svg = doc.querySelector("svg");
  if (!svg) {
    throw new Error("File does not contain a valid SVG root.");
  }

  doc
    .querySelectorAll("script, foreignObject")
    .forEach((node) => node.remove());

  doc.querySelectorAll("*").forEach((el) => {
    [...el.attributes].forEach((attr) => {
      const name = attr.name.toLowerCase();
      const value = attr.value.toLowerCase();
      if (name.startsWith("on")) {
        el.removeAttribute(attr.name);
        return;
      }
      if (
        (name === "href" || name === "xlink:href") &&
        value.startsWith("javascript:")
      ) {
        el.removeAttribute(attr.name);
      }
    });
  });

  const viewBoxRaw = svg.getAttribute("viewBox");
  if (viewBoxRaw) {
    const parts = viewBoxRaw.trim().split(/\s+/).map(Number);
    if (parts.length === 4 && parts.every((p) => Number.isFinite(p))) {
      return { content: svg.innerHTML, viewBox: parts.join(" ") };
    }
  }

  const width = Number.parseFloat(svg.getAttribute("width") || "");
  const height = Number.parseFloat(svg.getAttribute("height") || "");
  const safeWidth = Number.isFinite(width) && width > 0 ? width : 100;
  const safeHeight = Number.isFinite(height) && height > 0 ? height : 100;

  return {
    content: svg.innerHTML,
    viewBox: `0 0 ${safeWidth} ${safeHeight}`,
  };
}
export function CustomOverlay() {
  const { state, setCustomOverlay, setCustomOverlayTransform } =
    useJerseyColors();
  const overlayInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col gap-4 px-1">
      <input
        ref={overlayInputRef}
        type="file"
        accept=".svg,image/svg+xml"
        className="hidden"
        onChange={async (event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (!file) return;
          try {
            const text = await file.text();
            const extracted = extractSvgOverlay(text);
            setCustomOverlay(true, extracted.content, extracted.viewBox);
            toast("Custom overlay uploaded", {
              description: file.name,
            });
          } catch (error) {
            toast.danger(
              error instanceof Error ? error.message : "Invalid SVG file",
            );
          }
        }}
      />
      {state.customOverlaySvg ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <Slider
              minValue={-12}
              maxValue={12}
              step={0.5}
              value={state.customOverlayX}
              onChange={(value) =>
                setCustomOverlayTransform({
                  x: Array.isArray(value) ? value[0] : value,
                })
              }
            >
              <Label>X Offset</Label>
              <Slider.Output>
                {toSignedValue(state.customOverlayX)}
              </Slider.Output>
              <Slider.Track>
                <Slider.Fill />
                <Slider.Thumb />
              </Slider.Track>
            </Slider>
          </div>
          <div className="flex flex-col gap-1">
            <Slider
              minValue={-12}
              maxValue={12}
              step={0.5}
              value={state.customOverlayY}
              onChange={(value) =>
                setCustomOverlayTransform({
                  y: Array.isArray(value) ? value[0] : value,
                })
              }
            >
              <Label>Y Offset</Label>
              <Slider.Output>
                {toSignedValue(state.customOverlayY)}
              </Slider.Output>
              <Slider.Track>
                <Slider.Fill />
                <Slider.Thumb />
              </Slider.Track>
            </Slider>
          </div>
          <div className="flex flex-col gap-1">
            <Slider
              minValue={0.25}
              maxValue={2.5}
              step={0.01}
              value={state.customOverlayScale}
              onChange={(value) =>
                setCustomOverlayTransform({
                  scale: Array.isArray(value) ? value[0] : value,
                })
              }
            >
              <Label>Scale</Label>
              <Slider.Output>
                {toPercent(state.customOverlayScale)}
              </Slider.Output>
              <Slider.Track>
                <Slider.Fill />
                <Slider.Thumb />
              </Slider.Track>
            </Slider>
          </div>
          <div className="flex flex-col gap-1">
            <Slider
              minValue={-180}
              maxValue={180}
              step={1}
              value={state.customOverlayRotation}
              onChange={(value) =>
                setCustomOverlayTransform({
                  rotation: Array.isArray(value) ? value[0] : value,
                })
              }
            >
              <Label>Rotation</Label>
              <Slider.Output>
                {toSignedPercent(state.customOverlayRotation, 180)}
              </Slider.Output>
              <Slider.Track>
                <Slider.Fill />
                <Slider.Thumb />
              </Slider.Track>
            </Slider>
          </div>
        </div>
      ) : (
        <div className="py-3  flex items-center flex-col">
          <span className="pb-3  w-44 text-center text-xs text-gray-600 dark:text-gray-400">
            Upload SVG text, logos, or shapes that should sit on the jersey
            body.
          </span>
        </div>
      )}
      <div
        className="flex justify-end gap-2 pb-3"
        onClick={(event) => event.stopPropagation()}
        onPointerDown={(event) => event.stopPropagation()}
      >
        {" "}
        {state.customOverlaySvg ? (
          <Button
            variant="ghost"
            onClick={(event) => event.stopPropagation()}
            onPress={() => setCustomOverlay(true, undefined, undefined)}
          >
            Clear
          </Button>
        ) : null}
        <Button
          variant="primary"
          onClick={(event) => event.stopPropagation()}
          onPress={() => overlayInputRef.current?.click()}
        >
          {state.customOverlaySvg ? "Replace SVG" : "Upload SVG"}
        </Button>
      </div>
    </div>
  );
}
