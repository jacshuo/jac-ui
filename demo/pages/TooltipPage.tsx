import { Button, Tooltip } from "../../src";
import { Section, PageTitle } from "./helpers";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Sun, HelpCircle } from "lucide-react";

export default function TooltipPage() {
  return (
    <div className="space-y-8">
      <PageTitle>Tooltip</PageTitle>

      <Section title="Positions">
        <div className="flex flex-wrap gap-4">
          <Tooltip content="Top tooltip" position="top">
            <Button intent="outline">
              <ArrowUp /> Top
            </Button>
          </Tooltip>
          <Tooltip content="Bottom tooltip" position="bottom">
            <Button intent="outline">
              <ArrowDown /> Bottom
            </Button>
          </Tooltip>
          <Tooltip content="Left tooltip" position="left">
            <Button intent="outline">
              <ArrowLeft /> Left
            </Button>
          </Tooltip>
          <Tooltip content="Right tooltip" position="right">
            <Button intent="outline">
              <ArrowRight /> Right
            </Button>
          </Tooltip>
        </div>
      </Section>

      <Section title="Light variant">
        <div className="flex flex-wrap gap-4">
          <Tooltip content="Light top" position="top" intent="light">
            <Button intent="ghost">
              <Sun /> Light (top)
            </Button>
          </Tooltip>
          <Tooltip content="Light right" position="right" intent="light">
            <Button intent="ghost">
              <HelpCircle /> Light (right)
            </Button>
          </Tooltip>
        </div>
      </Section>

      <Section title="Max width (wrapping)">
        <div className="flex flex-wrap gap-4">
          <Tooltip
            content="This is a long tooltip that wraps onto multiple lines when maxWidth is set — useful for longer explanatory text."
            maxWidth="14rem"
            position="top"
          >
            <Button intent="outline">Wrapping tooltip</Button>
          </Tooltip>
          <Tooltip
            content="Another multiline tooltip with a numeric pixel maxWidth for precise control."
            maxWidth={180}
            position="right"
          >
            <Button intent="outline">Numeric px</Button>
          </Tooltip>
        </div>
      </Section>
    </div>
  );
}
