import { Badge } from "../../src";
import { Section, PageTitle } from "./helpers";
import { CheckCircle, AlertTriangle, XCircle, Info, Star } from "lucide-react";

export default function BadgePage() {
  return (
    <div className="space-y-8">
      <PageTitle>Badge</PageTitle>

      <Section title="Intents">
        <div className="flex flex-wrap gap-3">
          <Badge intent="success">
            <CheckCircle /> Success
          </Badge>
          <Badge intent="warning">
            <AlertTriangle /> Warning
          </Badge>
          <Badge intent="error">
            <XCircle /> Error
          </Badge>
          <Badge intent="info">
            <Info /> Info
          </Badge>
          <Badge intent="primary">
            <Star /> Primary
          </Badge>
        </div>
      </Section>
    </div>
  );
}
