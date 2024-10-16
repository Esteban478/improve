import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ERROR_DISPLAY_TITLE } from "@/lib/constants";
import { AlertCircle } from "lucide-react";

interface ErrorDisplayProps {
  title?: string;
  message: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ 
  title = ERROR_DISPLAY_TITLE, 
  message 
}) => {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        {message}
      </AlertDescription>
    </Alert>
  );
};

export default ErrorDisplay;