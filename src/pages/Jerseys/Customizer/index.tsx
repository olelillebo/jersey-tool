import { Sheet } from "react-modal-sheet";
import { Content } from "./Content";
import { Preview } from "./Preview";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { useJerseyColors } from "@/context/JerseyContext";

export function Customizer({
  variant = "football",
}: {
  variant?:
    | "football"
    | "basketball"
    | "hockey"
    | "american-football"
    | "formula-1"
    | "baseball"
    | "rugby"
    | "handball";
}) {
  const breakpoint = useBreakpoint();
  const { state, setSvgRef } = useJerseyColors();
  return breakpoint == "sm" ? (
    <>
      <Preview
        config={state}
        setSvgRef={setSvgRef}
        size="medium"
        variant={variant}
      />
      <Sheet
        isOpen={true}
        onClose={() => {}}
        snapPoints={[800, 600, 400, 200]}
        initialSnap={2}
        disableScrollLocking={true}
      >
        <Sheet.Container className="relative xl:shadow-lg!  sm:w-[420px]! xl:ml-4 sm:left-auto! sm:right-10! bg-[#edf3f7]! dark:bg-gray-900!">
          <Sheet.Header className=" rounded-t-lg h-11 shrink-0"></Sheet.Header>
          <Sheet.Content className=" flex flex-col">
            <Sheet.Scroller className=" flex flex-col gap-3 pt-0 mb-3 px-4 relative">
              <Content variant={variant} />
            </Sheet.Scroller>
          </Sheet.Content>
        </Sheet.Container>
      </Sheet>
    </>
  ) : (
    <div className="flex  flex-col gap-4">
      <div className="flex gap-4 pt-4 ">
        <div className="flex flex-col gap-4 w-sm pb-4">
          <Content variant={variant} />
        </div>
        <div className="w-auto flex-1">
          <div className="sticky top-16">
            <Preview
              config={state}
              setSvgRef={setSvgRef}
              size={breakpoint == "md" ? "medium" : "large"}
              variant={variant}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
