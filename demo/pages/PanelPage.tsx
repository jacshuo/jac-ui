import { Panel, PanelHeader, PanelContent } from '../../src';
import { Section, PageTitle } from './helpers';
import { Layout, Layers, ArrowUpCircle } from 'lucide-react';

export default function PanelPage() {
  return (
    <div className="space-y-8">
      <PageTitle>Panel</PageTitle>

      <Section title="Default">
        <Panel>
          <PanelHeader><Layout /> Default Panel</PanelHeader>
          <PanelContent>Panel body content goes here.</PanelContent>
        </Panel>
      </Section>

      <Section title="Inset">
        <Panel intent="inset">
          <PanelHeader><Layers /> Inset Panel</PanelHeader>
          <PanelContent>Subtle background, no border.</PanelContent>
        </Panel>
      </Section>

      <Section title="Elevated">
        <Panel intent="elevated">
          <PanelHeader><ArrowUpCircle /> Elevated Panel</PanelHeader>
          <PanelContent>Shadow-based prominence.</PanelContent>
        </Panel>
      </Section>
    </div>
  );
}
