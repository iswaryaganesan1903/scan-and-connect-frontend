
import { SHOP } from "../config.js";

const STEPS = ["Scan", "Details", "Payment", "Result"];

const STEP_INDEX = {
  welcome: 0,
  dashboard: 1,
  register: 1,
  payment: 2,
  result: 3,
};

export default function Header({ step }) {
  const current = STEP_INDEX[step] ?? 0;

  return (
    <header className="bg-[#174D38] text-white shadow-md">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-5 sm:flex-row sm:items-center sm:justify-between">

        {/* Brand */}
        <div className="flex shrink-0 items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-white text-sm font-extrabold text-[#174D38]">
            S&C
          </div>

          <div className="leading-tight">
            <h1 className="whitespace-nowrap text-lg font-bold tracking-tight">
              Scan & Connect
            </h1>
            <p className="mt-1 text-xs text-green-200">
              {SHOP.name}
            </p>
          </div>
        </div>

        {/* Transaction Progress */}
        <ol className="flex w-full max-w-[540px] items-center sm:w-auto">
          {STEPS.map((label, index) => {
            const completed = index < current;
            const active = index === current;

            return (
              <li
                key={label}
                className="flex flex-1 items-center last:flex-none"
                aria-current={active ? "step" : undefined}
              >
                <div className="flex min-w-0 flex-col items-center gap-2">
                  <span
                    className={`grid h-8 w-8 place-items-center rounded-full border-2 text-sm font-bold transition ${
                      completed
                        ? "border-white bg-white text-[#174D38]"
                        : active
                        ? "border-white bg-[#2D684F] text-white ring-4 ring-white/20"
                        : "border-green-300/50 bg-[#245D43] text-green-100"
                    }`}
                  >
                    {completed ? "✓" : index + 1}
                  </span>

                  <span
                    className={`whitespace-nowrap text-[11px] sm:text-xs ${
                      active
                        ? "font-bold text-white"
                        : completed
                        ? "font-semibold text-green-100"
                        : "text-green-200"
                    }`}
                  >
                    {label}
                  </span>
                </div>

                {index !== STEPS.length - 1 && (
                  <div
                    className={`mx-1 mb-5 h-[2px] flex-1 sm:mx-3 ${
                      completed ? "bg-white" : "bg-green-300/30"
                    }`}
                  />
                )}
              </li>
            );
          })}
        </ol>

      </div>
    </header>
  );
}
