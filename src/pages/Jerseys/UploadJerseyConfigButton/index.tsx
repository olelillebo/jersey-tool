import {
  Button,
  ButtonGroup,
  Dropdown,
  ListBox,
  Label,
  Modal,
  Input,
  Select,
  Switch,
  toast,
  TextArea,
} from "@heroui/react";
import { type Key, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useJerseyColors } from "@/context/JerseyContext";
import { MaterialIcon } from "@/components/MaterialIcon";
import { configToState } from "@/utils/utils";
import { parseJerseyConfig, type JerseyConfig } from "@/utils/jerseyConfig";
import {
  getReadyPromptForSport,
  type SportVariant,
} from "@/utils/aiPromptTemplates";
import { useBreakpoint } from "@/hooks/useBreakpoint";

type UploadJerseyConfigButtonProps = {
  variant?: SportVariant;
  requireSportSelection?: boolean;
};

const SPORT_PLACEHOLDERS: Record<
  SportVariant,
  {
    team: string;
    context: string;
    brief: string;
  }
> = {
  football: {
    team: "FC Barcelona",
    context: "La Liga, Spain",
    brief: "Away jersey, modern look, subtle striping",
  },
  basketball: {
    team: "Chicago Bulls",
    context: "NBA, USA",
    brief: "City edition style, clean side stripes",
  },
  hockey: {
    team: "Toronto Maple Leafs",
    context: "NHL, Canada",
    brief: "Home jersey, bottom stripes + sleeve bands",
  },
  "american-football": {
    team: "New England Patriots",
    context: "NFL, USA",
    brief: "Home jersey colors, high-contrast collar",
  },
  "formula-1": {
    team: "McLaren",
    context: "Formula 1",
    brief: "Racing-inspired visor contrast",
  },
  baseball: {
    team: "New York Yankees",
    context: "MLB, USA",
    brief: "Home jersey, clean stripes, classic look",
  },
  rugby: {
    team: "All Blacks",
    context: "International Rugby",
    brief: "Home colors, bold striping",
  },
  handball: {
    team: "THW Kiel",
    context: "Bundesliga, Germany",
    brief: "Modern match kit, high contrast details",
  },
};
const SPORT_OPTIONS: SportVariant[] = [
  "football",
  "basketball",
  "hockey",
  "baseball",
  "rugby",
  "handball",
];
const SPORT_LABELS: Record<SportVariant, string> = {
  football: "Football",
  basketball: "Basketball",
  hockey: "Ice Hockey",
  "american-football": "American Football",
  "formula-1": "Formula 1",
  baseball: "Baseball",
  rugby: "Rugby",
  handball: "Handball",
};

const supportsAiGeneration = (sport?: SportVariant) =>
  sport === "football" ||
  sport === "basketball" ||
  sport === "hockey" ||
  sport === "baseball" ||
  sport === "rugby" ||
  sport === "handball";

const defaultIncludePlayerText = (sport?: SportVariant) => sport === "basketball";

export function UploadJerseyConfigButton({
  variant = "football",
  requireSportSelection = false,
}: UploadJerseyConfigButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const breakpoint = useBreakpoint();
  const navigate = useNavigate();
  const { hydrateFromConfig } = useJerseyColors();
  const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isCopyPromptModalOpen, setIsCopyPromptModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [pastedJson, setPastedJson] = useState("");
  const [teamName, setTeamName] = useState("");
  const [leagueOrCountry, setLeagueOrCountry] = useState("");
  const [designBrief, setDesignBrief] = useState("");
  const [selectedSport, setSelectedSport] = useState<SportVariant | undefined>(
    requireSportSelection ? undefined : variant,
  );
  const [includePlayerText, setIncludePlayerText] = useState(false);

  const endpoint =
    import.meta.env.VITE_AI_PROXY_URL || "/.netlify/functions/generate-jersey";
  const activeSport = requireSportSelection ? selectedSport : variant;
  const aiAvailable = requireSportSelection || supportsAiGeneration(activeSport);
  const placeholders = SPORT_PLACEHOLDERS[activeSport ?? "football"];

  useEffect(() => {
    if (!requireSportSelection) {
      setSelectedSport(variant);
    }
  }, [requireSportSelection, variant]);

  useEffect(() => {
    setIncludePlayerText(defaultIncludePlayerText(activeSport));
  }, [activeSport]);

  const requireSelectedSport = () => {
    if (activeSport) return true;
    toast.danger("Select a sport first");
    return false;
  };
  const onSportChange = (id: Key | null) => {
    const value = id as SportVariant | null;
    if (!value) return;
    // TODO: Remove when heroui beta bug is fixed
    setTimeout(() => setSelectedSport(value), 150);
  };

  const renderSportSelect = () => (
    <Select
      placeholder="Select sport"
      value={selectedSport}
      selectionMode="single"
      onChange={onSportChange}
    >
      <Label>Sport</Label>
      <Select.Trigger>
        <span className="pointer-events-none">
          {selectedSport ? SPORT_LABELS[selectedSport] : "Select sport"}
        </span>
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover>
        <ListBox aria-label="Sport">
          {SPORT_OPTIONS.map((sport) => (
            <ListBox.Item
              key={sport}
              id={sport}
              textValue={SPORT_LABELS[sport]}
            >
              <Label>{SPORT_LABELS[sport]}</Label>
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  );

  const applyConfig = (config: JerseyConfig, sourceDescription?: string) => {
    const resolvedSport = config.sport ?? activeSport;
    if (!resolvedSport) {
      toast.danger("Config missing sport. Select a sport first.");
      return;
    }
    const resolvedConfig = {
      ...config,
      sport: resolvedSport,
    };

    if (
      requireSportSelection ||
      resolvedSport !== variant ||
      resolvedSport !== config.sport
    ) {
      navigate(`/${resolvedSport}`, {
        state: {
          uploadedConfig: resolvedConfig,
        },
      });
      toast("Redirected to matching sport editor", {
        description: `Config: ${resolvedSport}`,
      });
      return;
    }
    hydrateFromConfig(
      configToState(
        resolvedConfig,
        variant,
        resolvedConfig.name ?? null,
        null,
        null,
      ),
    );
    toast("Jersey config loaded", {
      description: sourceDescription,
    });
  };

  const parseAndApplyConfigText = (
    contents: string,
    sourceDescription?: string,
  ) => {
    const parsed = JSON.parse(contents) as unknown;
    const config = parseJerseyConfig(parsed);
    applyConfig(config, sourceDescription);
  };

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    try {
      const contents = await file.text();
      parseAndApplyConfigText(contents, file.name);
    } catch {
      toast.danger("Invalid jersey config JSON");
    }
  };

  const onPasteJson = () => {
    try {
      parseAndApplyConfigText(pastedJson, "Pasted JSON");
      setIsPasteModalOpen(false);
      setPastedJson("");
    } catch {
      toast.danger("Invalid jersey config JSON");
    }
  };

  const copyCurrentSportPrompt = async () => {
    if (!requireSelectedSport()) return;
    if (!supportsAiGeneration(activeSport)) {
      toast.danger("AI prompt is not available for this sport");
      return;
    }
    if (!teamName.trim() || !leagueOrCountry.trim()) {
      toast.danger("Team name and country/league are required");
      return;
    }
    try {
      await navigator.clipboard.writeText(
        getReadyPromptForSport(
          activeSport!,
          teamName.trim(),
          leagueOrCountry.trim(),
          designBrief.trim(),
          includePlayerText,
        ),
      );
      toast("Prompt copied", {
        description: `${activeSport} prompt copied to clipboard`,
      });
      setIsCopyPromptModalOpen(false);
    } catch {
      toast.danger("Could not copy prompt");
    }
  };

  const onGenerate = async () => {
    if (!requireSelectedSport()) return;
    if (!supportsAiGeneration(activeSport)) {
      toast.danger("AI generation is not available for this sport");
      return;
    }
    if (!teamName.trim() || !leagueOrCountry.trim()) {
      toast.danger("Team name and country/league are required");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          sport: activeSport,
          teamName: teamName.trim(),
          leagueOrCountry: leagueOrCountry.trim(),
          designBrief: designBrief.trim(),
          styleNotes: designBrief.trim(),
          includePlayerText,
        }),
      });

      const payload = (await response.json()) as {
        config?: unknown;
        error?: string;
      };

      if (!response.ok || payload.error) {
        throw new Error(payload.error || "Failed to generate jersey");
      }

      const config = parseJerseyConfig(payload.config);
      applyConfig(config, "Generated with Gemini");
      setIsAiModalOpen(false);
      setTeamName("");
      setLeagueOrCountry("");
      setDesignBrief("");
      setIncludePlayerText(defaultIncludePlayerText(activeSport));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to generate jersey";
      toast.danger(message);
    } finally {
      setIsGenerating(false);
    }
  };

  const openPasteModal = () => {
    requestAnimationFrame(() => setIsPasteModalOpen(true));
  };

  const openAiModal = () => {
    requestAnimationFrame(() => setIsAiModalOpen(true));
  };

  const openCopyPromptModal = () => {
    requestAnimationFrame(() => setIsCopyPromptModalOpen(true));
  };

  return (
    <div className="flex">
      <input
        ref={inputRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={onFileChange}
      />
      <ButtonGroup className="w-full sm:w-fit">
        {breakpoint === "sm" ? null : (
          <Button onPress={() => inputRef.current?.click()} variant="tertiary">
            <MaterialIcon name="upload" />
            Upload
          </Button>
        )}
        <Dropdown>
          <Button
            isIconOnly
            aria-label="More upload options"
            variant={breakpoint === "sm" ? "ghost" : "tertiary"}
          >
            <MaterialIcon name={breakpoint === "sm" ? "upload" : "more_vert"} />
          </Button>
          <Dropdown.Popover className="max-w-[290px]" placement="bottom end">
            <Dropdown.Menu>
              <Dropdown.Item
                id="upload-file"
                textValue="Upload JSON file"
                onPress={() => inputRef.current?.click()}
              >
                <div className="flex items-start gap-2">
                  <MaterialIcon name="upload" size={18} />
                  <div className="flex flex-col items-start gap-1">
                    <Label>Upload JSON</Label>
                  </div>
                </div>
              </Dropdown.Item>
              <Dropdown.Item
                id="paste-json"
                textValue="Paste JSON"
                onPress={openPasteModal}
              >
                <div className="flex items-start gap-2">
                  <MaterialIcon name="file_json" size={18} />
                  <div className="flex flex-col items-start gap-1">
                    <Label>Paste JSON</Label>
                  </div>
                </div>
              </Dropdown.Item>
              {aiAvailable ? (
                <Dropdown.Item
                  id="ai-generate"
                  textValue={`AI generate ${activeSport ?? "sport"}`}
                  onPress={openAiModal}
                >
                  <div className="flex items-start gap-2">
                    <MaterialIcon name="smart_toy" size={18} />
                    <div className="flex flex-col items-start gap-1">
                      <Label>Generate with AI</Label>
                    </div>
                  </div>
                </Dropdown.Item>
              ) : null}
              {aiAvailable ? (
                <Dropdown.Item
                  id="copy-current-sport-prompt"
                  textValue={`Create AI Prompt`}
                  onPress={openCopyPromptModal}
                >
                  <div className="flex items-start gap-2">
                    <MaterialIcon name="content_copy" size={18} />
                    <div className="flex flex-col items-start gap-1">
                      <Label>Copy AI prompt</Label>
                    </div>
                  </div>
                </Dropdown.Item>
              ) : null}
            </Dropdown.Menu>
          </Dropdown.Popover>
        </Dropdown>
      </ButtonGroup>

      <Modal isOpen={isPasteModalOpen} onOpenChange={setIsPasteModalOpen}>
        <Modal.Trigger>
          <button
            type="button"
            aria-hidden
            tabIndex={0}
            className="sr-only h-px w-px overflow-hidden p-0 m-0 border-0"
          >
            Open paste modal
          </button>
        </Modal.Trigger>
        <Modal.Backdrop>
          <Modal.Container size="lg">
            <Modal.Dialog>
              <Modal.Header className="pb-2">
                <Modal.Heading>Paste jersey JSON</Modal.Heading>
              </Modal.Header>
              <Modal.Body>
                <textarea
                  className="w-full min-h-56 rounded-lg border border-default-200 bg-transparent p-3 text-sm font-mono"
                  value={pastedJson}
                  onChange={(event) => setPastedJson(event.target.value)}
                  placeholder='{"name":"...","sport":"..."}'
                />
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="ghost"
                  onPress={() => {
                    setIsPasteModalOpen(false);
                    setPastedJson("");
                  }}
                >
                  Cancel
                </Button>
                <Button variant="primary" onPress={onPasteJson}>
                  Import JSON
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>

      <Modal isOpen={isAiModalOpen} onOpenChange={setIsAiModalOpen}>
        <Modal.Trigger>
          <button
            type="button"
            aria-hidden
            tabIndex={0}
            className="sr-only h-px w-px overflow-hidden p-0 m-0 border-0"
          >
            Open AI modal
          </button>
        </Modal.Trigger>
        <Modal.Backdrop>
          <Modal.Container size="lg">
            <Modal.Dialog>
              <Modal.Header className="pb-2">
                <Modal.Heading>Generate With AI</Modal.Heading>
              </Modal.Header>
              <Modal.Body className="text-foreground">
                <div className="flex flex-col gap-3 px-1">
                  {requireSportSelection ? (
                    <div className="flex flex-col gap-1">
                      {renderSportSelect()}
                    </div>
                  ) : null}
                  <Label>Team name</Label>
                  <Input
                    value={teamName}
                    onChange={(event) => setTeamName(event.target.value)}
                    placeholder={placeholders.team}
                    fullWidth
                  />
                  <Label>Country or league</Label>
                  <Input
                    value={leagueOrCountry}
                    onChange={(event) => setLeagueOrCountry(event.target.value)}
                    placeholder={placeholders.context}
                    fullWidth
                  />
                  <div className="flex flex-col gap-1">
                    <Label>Design brief (optional)</Label>
                    <TextArea
                      className="w-full min-h-28 rounded-lg border border-default-200 bg-transparent p-3 text-sm"
                      value={designBrief}
                      onChange={(event) => setDesignBrief(event.target.value)}
                      placeholder={placeholders.brief}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Switch
                      isSelected={includePlayerText}
                      onChange={setIncludePlayerText}
                      aria-label="Include player text"
                    >
                      <Switch.Control>
                        <Switch.Thumb />
                      </Switch.Control>
                      <Switch.Content>
                        <Label className="text-sm">
                          Include player name/number
                        </Label>
                      </Switch.Content>
                    </Switch>
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="ghost"
                  onPress={() => {
                    setIsAiModalOpen(false);
                    setTeamName("");
                    setLeagueOrCountry("");
                    setDesignBrief("");
                    setIncludePlayerText(defaultIncludePlayerText(activeSport));
                  }}
                  isDisabled={isGenerating}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onPress={onGenerate}
                  isDisabled={isGenerating}
                >
                  {isGenerating ? "Generating..." : "Generate"}
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>

      <Modal
        isOpen={isCopyPromptModalOpen}
        onOpenChange={setIsCopyPromptModalOpen}
      >
        <Modal.Trigger>
          <button
            type="button"
            aria-hidden
            tabIndex={0}
            className="sr-only h-px w-px overflow-hidden p-0 m-0 border-0"
          >
            Open copy prompt modal
          </button>
        </Modal.Trigger>
        <Modal.Backdrop>
          <Modal.Container size="lg">
            <Modal.Dialog>
              <Modal.Header className="pb-2">
                <Modal.Heading>Copy AI prompt</Modal.Heading>
              </Modal.Header>
              <Modal.Body className="text-foreground">
                <div className="flex flex-col gap-3 px-1">
                  {requireSportSelection ? (
                    <div className="flex flex-col gap-1">
                      {renderSportSelect()}
                    </div>
                  ) : null}
                  <Label>Team name</Label>
                  <Input
                    value={teamName}
                    onChange={(event) => setTeamName(event.target.value)}
                    placeholder={placeholders.team}
                    fullWidth
                  />
                  <Label>Country or league</Label>
                  <Input
                    value={leagueOrCountry}
                    onChange={(event) => setLeagueOrCountry(event.target.value)}
                    placeholder={placeholders.context}
                    fullWidth
                  />
                  <div className="flex flex-col gap-1">
                    <Label>Design brief (optional)</Label>
                    <TextArea
                      className="w-full min-h-28 rounded-lg border border-default-200 bg-transparent p-3 text-sm"
                      value={designBrief}
                      onChange={(event) => setDesignBrief(event.target.value)}
                      placeholder={placeholders.brief}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Switch
                      isSelected={includePlayerText}
                      onChange={setIncludePlayerText}
                      aria-label="Include player text in prompt"
                    >
                      <Switch.Control>
                        <Switch.Thumb />
                      </Switch.Control>
                      <Switch.Content>
                        <Label className="text-sm">
                          Include player name/number
                        </Label>
                      </Switch.Content>
                    </Switch>
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="ghost"
                  onPress={() => setIsCopyPromptModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button variant="primary" onPress={copyCurrentSportPrompt}>
                  Copy prompt
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </div>
  );
}
