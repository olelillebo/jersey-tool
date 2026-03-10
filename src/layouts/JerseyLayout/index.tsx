import { Outlet } from "react-router";

export const Component = () => {
  return (
    <div className="flex flex-col gap-4 max-w-5xl mx-auto px-3 lg:px-0">
      <Outlet />
    </div>
  );
};
