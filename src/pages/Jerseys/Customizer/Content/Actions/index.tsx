import { useJerseyColors } from "@/context/JerseyContext";
import {
  Badge,
  Button,
  ButtonGroup,
  Description,
  Dropdown,
  Label,
  Tooltip,
} from "@heroui/react";
import { MaterialIcon } from "@/components/MaterialIcon";
import { UploadJerseyConfigButton } from "@/pages/Jerseys/UploadJerseyConfigButton";
import { useLocation, useNavigate } from "react-router";
import { Preview } from "../../Preview";
import { useBreakpoint } from "@/hooks/useBreakpoint";

const SPORT_LABELS = {
  football: "Football",
  basketball: "Basketball",
  hockey: "Ice Hockey",
  "american-football": "American Football",
  "formula-1": "Formula 1",
  baseball: "Baseball",
  rugby: "Rugby",
  handball: "Handball",
} as const;

export function Actions({
  variant,
  isJerseyRoute,
}: {
  variant:
    | "football"
    | "basketball"
    | "hockey"
    | "american-football"
    | "formula-1"
    | "baseball"
    | "rugby"
    | "handball";
  isJerseyRoute: boolean;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const breakpoint = useBreakpoint();
  const {
    reset,
    downloadSvg,
    downloadJson,
    isConfigured,
    drafts,
    loadDraft,
    deleteDraft,
    clearAllDrafts,
  } = useJerseyColors();

  const onLoadDraft = (id: string) => {
    const draft = loadDraft(id);
    if (!draft) return;
    if (draft.sport !== variant) {
      navigate(`/${draft.sport}`, {
        state: {
          uploadedConfig: draft.config,
        },
      });
    }
  };

  const onReset = () => {
    reset();
    navigate(location.pathname + location.search + location.hash, {
      replace: true,
      state: null,
    });
  };

  return (
    <div className="flex gap-1 sm:gap-2 justify-end">
      {isJerseyRoute ? (
        <Tooltip>
          <Tooltip.Trigger>
            <Button
              onPress={onReset}
              isIconOnly
              isDisabled={!isConfigured}
              variant="ghost"
            >
              <MaterialIcon name="restart_alt" />
            </Button>
          </Tooltip.Trigger>
          <Tooltip.Content>
            <Tooltip.Arrow />
            Reset
          </Tooltip.Content>
        </Tooltip>
      ) : null}
      <Dropdown>
        <Dropdown>
          <Badge.Anchor>
            <Tooltip>
              <Tooltip.Trigger>
                <Button
                  isDisabled={!drafts.length}
                  isIconOnly
                  variant="ghost"
                  aria-label="Saved jerseys"
                >
                  <MaterialIcon name="work_history" />
                </Button>
                <Badge color="danger" size="sm" hidden={!drafts.length}>
                  {drafts.length}
                </Badge>
              </Tooltip.Trigger>
              <Tooltip.Content>
                <Tooltip.Arrow />
                Recent Jerseys
              </Tooltip.Content>
            </Tooltip>
          </Badge.Anchor>{" "}
        </Dropdown>
        <Dropdown.Popover className="min-w-[320px]" placement="bottom end">
          <Dropdown.Menu>
            {drafts.length ? (
              drafts.map((draft) => (
                <Dropdown.Item
                  className="flex items-between gap-2"
                  key={draft.id}
                  onPress={() => onLoadDraft(draft.id)}
                  textValue={draft.name}
                >
                  <Preview
                    config={draft.config}
                    size={"xsmall"}
                    variant={draft.sport}
                  />
                  <div className="flex flex-col items-start gap-1">
                    <Label>{draft.name}</Label>
                    <Description>{SPORT_LABELS[draft.sport]}</Description>
                  </div>
                  <div className="flex gap-1 ml-auto">
                    <Button
                      isIconOnly
                      size="sm"
                      variant="ghost"
                      aria-label={`Delete ${draft.name}`}
                      onPress={() => deleteDraft(draft.id)}
                    >
                      <MaterialIcon name="delete" />
                    </Button>
                  </div>
                </Dropdown.Item>
              ))
            ) : (
              <div className="px-2 py-3 text-sm text-gray-500 dark:text-gray-300">
                No saved jerseys yet.
              </div>
            )}
            {drafts.length ? (
              <Dropdown.Item
                className="flex justify-center  mt-1 pt-2"
                key="clear-all-drafts"
                textValue="Clear all drafts"
                onPress={() => clearAllDrafts()}
              >
                <Label className="text-danger">Clear All</Label>
              </Dropdown.Item>
            ) : null}
          </Dropdown.Menu>
        </Dropdown.Popover>
      </Dropdown>
      <UploadJerseyConfigButton
        variant={variant}
        requireSportSelection={!isJerseyRoute}
      />

      {isJerseyRoute ? (
        <ButtonGroup>
          {breakpoint === "sm" ? null : (
            <Button onPress={() => downloadSvg()}>
              <MaterialIcon name="download" />
              Get SVG
            </Button>
          )}
          <Dropdown>
            <Button isIconOnly aria-label="More options">
              <MaterialIcon
                name={breakpoint === "sm" ? "download" : "more_vert"}
              />
            </Button>
            <Dropdown.Popover className="max-w-[290px]" placement="bottom">
              <Dropdown.Menu>
                <Dropdown.Item
                  className="flex flex-col items-start gap-1"
                  id="merge"
                  textValue="Create a merge commit"
                  onPress={() => downloadSvg()}
                >
                  <div className="flex items-start gap-2">
                    <MaterialIcon name="image" size={18} />
                    <div className="flex flex-col items-start gap-1">
                      <Label>Download SVG</Label>
                    </div>
                  </div>
                </Dropdown.Item>
                <Dropdown.Item
                  className="flex flex-col items-start gap-1"
                  id="squash-and-merge"
                  textValue="Squash and merge"
                  onPress={() => downloadJson()}
                >
                  <div className="flex items-start gap-2">
                    <MaterialIcon name="file_json" size={18} />
                    <div className="flex flex-col items-start gap-1">
                      <Label>Download JSON</Label>
                    </div>
                  </div>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown.Popover>
          </Dropdown>
        </ButtonGroup>
      ) : null}
    </div>
  );
}
