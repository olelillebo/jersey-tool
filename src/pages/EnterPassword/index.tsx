import { useNavigate, useSearchParams } from "react-router";
import { type FormEvent, useEffect, useState } from "react";
import { isRoutePasswordEnabled, markUnlocked } from "@/utils/middleware";
import { Button, Input, Label } from "@heroui/react";
//import AnimatedBaseTest from "@/components/AnimatedJersey";
import AnimatedSvgJersey from "@/components/AnimatedSvgJersey";

const ROUTE_PASSWORD = import.meta.env.VITE_APP_SECRET_PASSWORD as
  | string
  | undefined;

export default function EnterPassword() {
  const [error, setError] = useState<string | null>(null);
  const [sp] = useSearchParams();
  const nav = useNavigate();
  const redirectTo = sp.get("redirectTo") || "/locked";

  useEffect(() => {
    if (!isRoutePasswordEnabled()) {
      nav(redirectTo === "/locked" ? "/" : redirectTo, { replace: true });
    }
  }, [nav, redirectTo]);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const pw = String(form.get("pw") || "");
    if (pw === ROUTE_PASSWORD) {
      markUnlocked();
      nav(redirectTo, { replace: true });
    } else {
      setError("Wrong password");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center ">
      <form
        onSubmit={onSubmit}
        className="flex flex-col justify-center items-center gap-14 min-w-64 h-screen"
      >
        {/* <AnimatedBaseTest /> */}
        <AnimatedSvgJersey />
        <div className="flex flex-col items-center gap-4">
          <Label htmlFor="input-type-password">Password</Label>

          <Input
            id="input-type-password"
            name="pw"
            type="password"
            aria-label="Enter Password"
            autoFocus
          />
          {error && <div className="text-sm text-red-600">{error}</div>}
          <Button variant="primary" type="submit">
            Lets go
          </Button>
        </div>
      </form>

      <div className="flex gap-4 text-xs text-center w-full px-4 text-gray-500 dark:text-gray-300 justify-center pb-4">
        <div className=" text-xs text-center px-4 text-gray-500 dark:text-gray-300">
          © {new Date().getFullYear()} BetACME. All rights reserved.
        </div>
        <span>|</span>
        <a href="/policy" className="underline">
          Privacy Policy
        </a>
        <span>|</span>
        <a href="/terms" className="underline">
          Terms of Service
        </a>
      </div>
    </div>
  );
}
