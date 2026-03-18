import { List, ListItem } from "../../src";
import { Section, PageTitle } from "./helpers";
import { Circle, Disc, MousePointerClick } from "lucide-react";

export default function ListPage() {
  return (
    <div className="space-y-8">
      <PageTitle>List</PageTitle>

      <div className="grid gap-8 sm:grid-cols-3">
        <Section title="Default">
          <List>
            <ListItem>
              <Circle className="text-primary-400" /> Alpha
            </ListItem>
            <ListItem>
              <Circle className="text-primary-400" /> Bravo
            </ListItem>
            <ListItem>
              <Circle className="text-primary-400" /> Charlie
            </ListItem>
          </List>
        </Section>

        <Section title="Bordered">
          <List intent="bordered">
            <ListItem>
              <Disc className="text-primary-400" /> Item A
            </ListItem>
            <ListItem>
              <Disc className="text-primary-400" /> Item B
            </ListItem>
            <ListItem>
              <Disc className="text-primary-400" /> Item C
            </ListItem>
          </List>
        </Section>

        <Section title="Hover">
          <List intent="hover">
            <ListItem>
              <MousePointerClick className="text-primary-400" /> Hoverable A
            </ListItem>
            <ListItem>
              <MousePointerClick className="text-primary-400" /> Hoverable B
            </ListItem>
            <ListItem>
              <MousePointerClick className="text-primary-400" /> Hoverable C
            </ListItem>
          </List>
        </Section>
      </div>
    </div>
  );
}
