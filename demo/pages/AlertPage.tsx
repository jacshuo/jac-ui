import {
  Button,
  Alert, AlertTitle, AlertDescription,
  useAlert,
} from '../../src';
import { Section, PageTitle } from './helpers';
import { CheckCircle, AlertTriangle, XCircle, Info, Bell, Pin } from 'lucide-react';

export default function AlertPage() {
  const { addAlert } = useAlert();

  return (
    <div className="space-y-8">
      <PageTitle>Alert / Toast</PageTitle>

      <Section title="Static (inline) alerts">
        <div className="space-y-3">
          <Alert intent="success">
            <AlertTitle><CheckCircle /> Success</AlertTitle>
            <AlertDescription>Operation completed successfully.</AlertDescription>
          </Alert>
          <Alert intent="warning">
            <AlertTitle><AlertTriangle /> Warning</AlertTitle>
            <AlertDescription>Please check your input.</AlertDescription>
          </Alert>
          <Alert intent="error">
            <AlertTitle><XCircle /> Error</AlertTitle>
            <AlertDescription>Something went wrong.</AlertDescription>
          </Alert>
          <Alert intent="info">
            <AlertTitle><Info /> Info</AlertTitle>
            <AlertDescription>Here is some information.</AlertDescription>
          </Alert>
        </div>
      </Section>

      <Section title="Toast notifications (fly-in)">
        <div className="flex flex-wrap gap-3">
          <Button
            intent="primary"
            onClick={() =>
              addAlert({ intent: 'success', title: 'Saved', message: 'Changes saved.', position: 'top-right' })
            }
          >
            <Bell /> Toast top-right
          </Button>
          <Button
            intent="danger"
            onClick={() =>
              addAlert({ intent: 'error', title: 'Error', message: 'Something failed.', position: 'top-left' })
            }
          >
            <XCircle /> Toast top-left
          </Button>
          <Button
            intent="warning"
            onClick={() =>
              addAlert({ intent: 'warning', title: 'Warning', message: 'Check your input.', position: 'bottom-right' })
            }
          >
            <AlertTriangle /> Toast bottom-right
          </Button>
          <Button
            intent="outline"
            onClick={() =>
              addAlert({ intent: 'info', title: 'Info', message: 'For your information.', position: 'top-center' })
            }
          >
            <Info /> Toast top-center
          </Button>
          <Button
            intent="ghost"
            onClick={() =>
              addAlert({ intent: 'success', title: 'Persistent', message: 'This stays until dismissed.', duration: 0 })
            }
          >
            <Pin /> Persistent toast
          </Button>
        </div>
      </Section>
    </div>
  );
}
