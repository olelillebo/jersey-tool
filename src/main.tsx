import "./index.css";

import { createBrowserRouter, RouterProvider } from "react-router";
import ReactDOM from "react-dom/client";
import { Spinner, ToastProvider } from "@heroui/react";
import EnterPassword from "./pages/EnterPassword/index.tsx";
import { appMiddleware } from "./utils/middleware.ts";
import ErrorBoundary from "./utils/error.tsx";
import { ThemeProvider } from "./context/theme/ThemeContext.tsx";

const router = createBrowserRouter([
  { path: "/enter-password", element: <EnterPassword /> },
  {
    path: "/",
    async lazy() {
      const { Component } = await import("@/layouts/SiteLayout/index.tsx");
      return {
        Component,
      };
    },
    errorElement: <ErrorBoundary />,
    middleware: [appMiddleware],
    hydrateFallbackElement: (
      <div className="flex flex-col items-center justify-center pt-16">
        <Spinner size="lg" />
      </div>
    ),
    children: [
      {
        index: true,
        path: "/",
        async lazy() {
          const { Component } = await import("@/pages/Home/index.tsx");
          return {
            Component,
          };
        },
      },
      {
        path: "football",
        async lazy() {
          const { Component } = await import("@/pages/Jerseys/index.tsx");
          return {
            Component,
          };
        },
      },
      {
        path: "basketball",
        async lazy() {
          const { BasketballComponent } =
            await import("@/pages/Jerseys/index.tsx");
          return {
            Component: BasketballComponent,
          };
        },
      },
      {
        path: "hockey",
        async lazy() {
          const { HockeyComponent } = await import("@/pages/Jerseys/index.tsx");
          return {
            Component: HockeyComponent,
          };
        },
      },
      {
        path: "american-football",
        async lazy() {
          const { AmericanFootballComponent } =
            await import("@/pages/Jerseys/index.tsx");
          return {
            Component: AmericanFootballComponent,
          };
        },
      },
      {
        path: "formula-1",
        async lazy() {
          const { FormulaOneComponent } =
            await import("@/pages/Jerseys/index.tsx");
          return {
            Component: FormulaOneComponent,
          };
        },
      },
      {
        path: "baseball",
        async lazy() {
          const { BaseballComponent } =
            await import("@/pages/Jerseys/index.tsx");
          return {
            Component: BaseballComponent,
          };
        },
      },
      {
        path: "rugby",
        async lazy() {
          const { RugbyComponent } = await import("@/pages/Jerseys/index.tsx");
          return {
            Component: RugbyComponent,
          };
        },
      },
      {
        path: "handball",
        async lazy() {
          const { HandballComponent } =
            await import("@/pages/Jerseys/index.tsx");
          return {
            Component: HandballComponent,
          };
        },
      },
    ],
  },
]);

const root = document.getElementById("root")!;

ReactDOM.createRoot(root).render(
  <ThemeProvider>
    <ToastProvider />
    <RouterProvider router={router} />
  </ThemeProvider>,
);
