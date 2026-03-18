import { Tabs, TabList, TabTrigger, TabPanels, TabContent } from "../../src";
import { Section, PageTitle } from "./helpers";
import {
  LayoutDashboard,
  Sparkles,
  History,
  ListFilter,
  Zap,
  Archive,
  Settings,
  Users,
  Shield,
} from "lucide-react";

export default function TabsPage() {
  return (
    <div className="space-y-8">
      <PageTitle>Tabs</PageTitle>

      <Section title="Line — sliding panels">
        <Tabs defaultValue="tab1">
          <TabList>
            <TabTrigger value="tab1">
              <LayoutDashboard /> Overview
            </TabTrigger>
            <TabTrigger value="tab2">
              <Sparkles /> Features
            </TabTrigger>
            <TabTrigger value="tab3">
              <History /> Changelog
            </TabTrigger>
          </TabList>
          <TabPanels>
            <TabContent value="tab1">
              <p className="text-primary-700 dark:text-primary-300">
                Overview content goes here. Click the other tabs to see the smooth sliding
                transition.
              </p>
            </TabContent>
            <TabContent value="tab2">
              <p className="text-primary-700 dark:text-primary-300">
                Feature list and descriptions. Notice how the panel slides left and right.
              </p>
            </TabContent>
            <TabContent value="tab3">
              <p className="text-primary-700 dark:text-primary-300">
                Version history and release notes. The indicator bar follows along smoothly.
              </p>
            </TabContent>
          </TabPanels>
        </Tabs>
      </Section>

      <Section title="Pills — sliding panels">
        <Tabs defaultValue="p1" intent="pills">
          <TabList>
            <TabTrigger value="p1">
              <ListFilter /> All
            </TabTrigger>
            <TabTrigger value="p2">
              <Zap /> Active
            </TabTrigger>
            <TabTrigger value="p3">
              <Archive /> Archived
            </TabTrigger>
          </TabList>
          <TabPanels>
            <TabContent value="p1">Showing all items.</TabContent>
            <TabContent value="p2">Showing active items only.</TabContent>
            <TabContent value="p3">Showing archived items.</TabContent>
          </TabPanels>
        </Tabs>
      </Section>

      <Section title="Underline — sliding panels">
        <Tabs defaultValue="s1" intent="underline">
          <TabList>
            <TabTrigger value="s1">
              <Settings /> General
            </TabTrigger>
            <TabTrigger value="s2">
              <Users /> Team
            </TabTrigger>
            <TabTrigger value="s3">
              <Shield /> Security
            </TabTrigger>
          </TabList>
          <TabPanels>
            <TabContent value="s1">General settings and preferences.</TabContent>
            <TabContent value="s2">Team members and roles management.</TabContent>
            <TabContent value="s3">Security configuration and audit logs.</TabContent>
          </TabPanels>
        </Tabs>
      </Section>

      <Section title="Without TabPanels (instant switch)">
        <Tabs defaultValue="n1">
          <TabList>
            <TabTrigger value="n1">Tab A</TabTrigger>
            <TabTrigger value="n2">Tab B</TabTrigger>
          </TabList>
          <TabContent value="n1">Instant switch — no sliding animation.</TabContent>
          <TabContent value="n2">
            TabContent works standalone for backward compatibility.
          </TabContent>
        </Tabs>
      </Section>
    </div>
  );
}
