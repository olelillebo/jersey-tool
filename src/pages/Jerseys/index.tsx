import { Customizer } from "./Customizer";

type JerseysPageProps = {
  variant?:
    | "football"
    | "basketball"
    | "hockey"
    | "american-football"
    | "formula-1"
    | "baseball"
    | "rugby"
    | "handball";
};

function JerseysPage({ variant = "football" }: JerseysPageProps) {
  return (
    <div className="flex flex-col gap-4 max-w-5xl mx-auto px-3 lg:px-0 relative">
      <Customizer variant={variant} />
    </div>
  );
}

export function Component() {
  return <JerseysPage variant="football" />;
}

export function BasketballComponent() {
  return <JerseysPage variant="basketball" />;
}

export function HockeyComponent() {
  return <JerseysPage variant="hockey" />;
}

export function AmericanFootballComponent() {
  return <JerseysPage variant="american-football" />;
}

export function FormulaOneComponent() {
  return <JerseysPage variant="formula-1" />;
}

export function BaseballComponent() {
  return <JerseysPage variant="baseball" />;
}

export function RugbyComponent() {
  return <JerseysPage variant="rugby" />;
}

export function HandballComponent() {
  return <JerseysPage variant="handball" />;
}
