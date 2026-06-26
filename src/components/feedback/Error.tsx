import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorProps {
  message?: string;
  onRetry?: () => void;
}

const Error = ({ message = "Something went wrong.", onRetry }: ErrorProps) => {
  return (
    <div className="flex min-h-87.5 mt-40 flex-col items-center justify-center gap-5 rounded-xl border border-red-200 bg-red-50 p-8 text-center">
      <div className="rounded-full bg-red-100 p-4">
        <AlertTriangle size={45} className="text-red-600" />
      </div>

      <div>
        <h2 className="text-xl font-semibold text-red-700">Oops!</h2>

        <p className="mt-2 max-w-md text-gray-600">{message}</p>
      </div>

      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2 text-white transition hover:bg-red-700"
        >
          <RefreshCw size={18} />
          Try Again
        </button>
      )}
    </div>
  );
};

export default Error;
