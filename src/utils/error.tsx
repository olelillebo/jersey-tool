import { Button } from "@heroui/react";
import { useRouteError, useAsyncError, useNavigate } from "react-router";
import { classNames } from "./utils";

type ErrorBoundaryProps = {
  isTransparent?: boolean;
};

const ErrorBoundary = ({ isTransparent = false }: ErrorBoundaryProps) => {
  const navigate = useNavigate();
  const error: unknown = useRouteError();
  const error2: unknown = useAsyncError();
  console.log("ErrorBoundary caught an error:", error ?? error2);
  const errorToDisplay = error ?? error2;
  const statusCode = (errorToDisplay as { status?: unknown })?.status as number;
  const statusText = (errorToDisplay as { statusText?: unknown })
    ?.statusText as string;

  function getErrorText(statusCode: unknown) {
    if (statusCode === 404) {
      return "Page not found";
    } else if (statusCode === 401) {
      return "You aren't authorized to see this";
    } else if (statusCode === 503) {
      return "Looks like our API is down";
    } else if (statusCode === 418) {
      return "🫖";
    } else {
      return "An error occurred";
    }
  }
  const errorText = getErrorText(statusCode);

  return (
    <div
      className={classNames(
        isTransparent
          ? ""
          : "bg-linear-to-br from-gradient_right to-gradient_left",
        "flex h-full min-h-screen w-full items-center justify-center text-black flex-col space-y-8 ",
      )}
    >
      <span className="text-4xl font-semibold font-Satoshi">
        {statusCode ?? "🥹"}
      </span>
      <span className="text-xl ">{statusText ? statusText : errorText}</span>
      <div className="flex gap-2">
        <Button
          size="md"
          variant="secondary"
          onPress={() => window.location.reload()}
          className="w-fit"
        >
          {"Refresh"}
        </Button>
        <Button
          size="md"
          onPress={() => {
            navigate("/");
          }}
          className="w-fit bg-black text-white"
        >
          {"Return Home"}
        </Button>
      </div>
    </div>
  );
};

export default ErrorBoundary;
