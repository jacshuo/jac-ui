import { useState } from "react";
import { Indicator, Button, Badge } from "../../src";
import { Section, PageTitle } from "./helpers";
import { Bell, Mail, ShoppingCart, User } from "lucide-react";

function Avatar({ label }: { label: string }) {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-200 text-sm font-medium text-primary-700 dark:bg-primary-700 dark:text-primary-200">
      {label}
    </div>
  );
}

export default function IndicatorPage() {
  const [show, setShow] = useState(true);
  const [count, setCount] = useState(5);

  return (
    <div className="space-y-8">
      <PageTitle>Indicator</PageTitle>

      <Section title="Intents">
        <div className="flex flex-wrap items-center gap-8">
          <Indicator intent="danger" content={3}>
            <Avatar label="D" />
          </Indicator>
          <Indicator intent="success" content={7}>
            <Avatar label="S" />
          </Indicator>
          <Indicator intent="warning" content={12}>
            <Avatar label="W" />
          </Indicator>
          <Indicator intent="info" content={2}>
            <Avatar label="I" />
          </Indicator>
          <Indicator intent="primary" content={99}>
            <Avatar label="P" />
          </Indicator>
        </div>
      </Section>

      <Section title="Dot only">
        <div className="flex flex-wrap items-center gap-8">
          <Indicator dot intent="danger">
            <Button size="sm">
              <Bell className="h-4 w-4" /> Alerts
            </Button>
          </Indicator>
          <Indicator dot intent="success">
            <Avatar label="G" />
          </Indicator>
          <Indicator dot intent="warning">
            <Avatar label="W" />
          </Indicator>
          <Indicator dot intent="info">
            <Avatar label="I" />
          </Indicator>
        </div>
      </Section>

      <Section title="Large numbers (capped at 99+)">
        <div className="flex flex-wrap items-center gap-8">
          <Indicator content={100}>
            <Button>
              <Mail className="h-4 w-4" /> Inbox
            </Button>
          </Indicator>
          <Indicator content={999} intent="warning">
            <Button intent="outline">
              <ShoppingCart className="h-4 w-4" /> Cart
            </Button>
          </Indicator>
          <Indicator content={0} intent="success">
            <Avatar label="0" />
          </Indicator>
        </div>
      </Section>

      <Section title="Sizes">
        <div className="flex flex-wrap items-center gap-10">
          <div className="flex flex-col items-center gap-2">
            <Indicator size="sm" content={3}>
              <Avatar label="S" />
            </Indicator>
            <span className="text-xs text-primary-500">sm</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Indicator size="md" content={3}>
              <Avatar label="M" />
            </Indicator>
            <span className="text-xs text-primary-500">md (default)</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Indicator size="lg" content={3}>
              <Avatar label="L" />
            </Indicator>
            <span className="text-xs text-primary-500">lg</span>
          </div>
        </div>
      </Section>

      <Section title="Placements">
        <div className="flex flex-wrap items-center gap-10">
          {(["top-right", "top-left", "bottom-right", "bottom-left"] as const).map((placement) => (
            <div key={placement} className="flex flex-col items-center gap-2">
              <Indicator placement={placement} content={1}>
                <Avatar label="P" />
              </Indicator>
              <span className="text-xs text-primary-500">{placement}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Pulse animation">
        <div className="flex flex-wrap items-center gap-8">
          <Indicator dot pulse intent="danger">
            <Button>
              <Bell className="h-4 w-4" /> Live alerts
            </Button>
          </Indicator>
          <Indicator dot pulse intent="success">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400">
              <User className="h-5 w-5" />
            </div>
          </Indicator>
          <Indicator pulse content={4} intent="danger">
            <Button intent="outline">
              <Mail className="h-4 w-4" /> Messages
            </Button>
          </Indicator>
        </div>
      </Section>

      <Section title="Show / hide">
        <div className="flex flex-wrap items-center gap-6">
          <Button size="sm" intent="outline" onClick={() => setShow((v) => !v)}>
            {show ? "Hide" : "Show"} indicator
          </Button>
          <Button size="sm" intent="ghost" onClick={() => setCount((v) => v + 1)}>
            Count: {count}
          </Button>
          <Indicator show={show} content={count} intent="danger">
            <Button>
              <Bell className="h-4 w-4" /> Notifications
            </Button>
          </Indicator>
        </div>
      </Section>

      <Section title="On various elements">
        <div className="flex flex-wrap items-center gap-8">
          <Indicator content={3}>
            <Badge intent="info">Info badge</Badge>
          </Indicator>
          <Indicator dot intent="success" placement="bottom-right">
            <div className="h-12 w-12 rounded-lg bg-primary-100 dark:bg-primary-800" />
          </Indicator>
          <Indicator content={21} intent="warning" size="sm">
            <Button size="sm" intent="ghost">
              <ShoppingCart className="h-4 w-4" /> Cart
            </Button>
          </Indicator>
        </div>
      </Section>
    </div>
  );
}
