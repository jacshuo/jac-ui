import { useState } from "react";
import { TextBox } from "../../src";
import { Section, PageTitle } from "./helpers";

export default function TextBoxPage() {
  const [controlled, setControlled] = useState("Hello world, this is a controlled text box.");

  return (
    <div className="space-y-8">
      <PageTitle>TextBox</PageTitle>

      <div className="grid gap-8 lg:grid-cols-2">
        <Section title="Default">
          <TextBox placeholder="Type something…" showWordCount />
        </Section>

        <Section title="With max word limit (50 words)">
          <TextBox
            placeholder="Write up to 50 words…"
            maxWords={50}
            defaultValue="Lorem ipsum dolor sit amet consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
          />
        </Section>

        <Section title="Sizes">
          <div className="space-y-3">
            <TextBox size="sm" placeholder="Small" showWordCount />
            <TextBox size="md" placeholder="Medium (default)" showWordCount />
            <TextBox size="lg" placeholder="Large" showWordCount />
          </div>
        </Section>

        <Section title="Error state">
          <TextBox state="error" placeholder="Something went wrong…" showWordCount />
        </Section>

        <Section title="Disabled">
          <TextBox disabled defaultValue="This textarea is disabled." showWordCount />
        </Section>

        <Section title="Controlled">
          <TextBox
            value={controlled}
            onChange={(e) => setControlled(e.target.value)}
            showWordCount
          />
          <button
            type="button"
            onClick={() => setControlled("")}
            className="mt-2 rounded bg-primary-500 px-3 py-1.5 text-xs text-white hover:bg-primary-600"
          >
            Clear
          </button>
        </Section>
      </div>
    </div>
  );
}
