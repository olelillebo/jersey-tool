import AnimatedSvgJersey from "@/components/AnimatedSvgJersey";
import type { Preset } from "@/types/types";
import {
  AMERICAN_FOOTBALL_PRESET,
  BASEBALL_PRESET,
  BASKETBALL_PRESET,
  FOOTBALL_PRESET,
  FORMULA_1_PRESET,
  HANDBALL_PRESET,
  HOCKEY_PRESET,
  RUGBY_PRESET,
} from "@/utils/sportSvgList";
import { Link } from "react-router";

type SportCard = {
  title: string;
  href: string;
  preset: Preset[];
};

const sportCards: SportCard[] = [
  {
    title: "Football",
    href: "/football",
    preset: FOOTBALL_PRESET,
  },
  {
    title: "Basketball",
    href: "/basketball",
    preset: BASKETBALL_PRESET,
  },
  {
    title: "Hockey",
    href: "/hockey",
    preset: HOCKEY_PRESET,
  },

  {
    title: "Baseball",
    href: "/baseball",
    preset: BASEBALL_PRESET,
  },
  {
    title: "Rugby",
    href: "/rugby",
    preset: RUGBY_PRESET,
  },
  {
    title: "Handball",
    href: "/handball",
    preset: HANDBALL_PRESET,
  },
  {
    title: "American Football",
    href: "/american-football",
    preset: AMERICAN_FOOTBALL_PRESET,
  },
  {
    title: "Formula 1",
    href: "/formula-1",
    preset: FORMULA_1_PRESET,
  },
];

export function Component() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-0">
      <div className="grid gap-4 sm:gap-6 grid-cols-2 sm:grid-cols-3 ">
        {sportCards.map((card) => (
          <Link
            key={card.href}
            to={card.href}
            state={{ resetOnEntry: true }}
            className="flex flex-col items-center gap-2 py-2  transition-all group relative   w-full perspective-distant cursor-pointer "
          >
            <div className="grid grid-rows-1 grid-cols-1 ">
              <div className="scale-[1] group-hover:scale-[0.85] row-start-1 col-start-1  rounded-xl transform-gpu transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)]  "></div>

              <div
                className=" row-start-1 col-start-1 
                          w-32 h-32 
                          transform-gpu transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)]
                          scale-[0.75]
                          group-hover:scale-[1] group-hover:-rotate-3 group-hover:-translate-y-2.5
                          backface-hidden transform-3d
                        "
              >
                <AnimatedSvgJersey
                  autoPlay={false}
                  width={130}
                  height={150}
                  preset={card.preset}
                />
              </div>
            </div>

            <span className="font-BarlowCondensed text-2xl font-semibold leading-none">
              {card.title}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
