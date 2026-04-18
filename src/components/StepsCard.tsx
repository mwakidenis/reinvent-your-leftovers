import { useState } from "react";
import { ChevronLeft, ChevronRight, Check, RotateCcw } from "lucide-react";

interface Step {
  step: number;
  instruction: string;
  meta?: string[];
}
interface RecipeInstructionsFlowProps {
  steps: Step[];
}
export default function RecipeInstructionsFlow({
  steps,
}: RecipeInstructionsFlowProps) {
  const [current, setCurrent] = useState(0);
  const [done, setDone] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  const total = steps.length;
  const isLast = current === total - 1;

  const jumpTo = (i: number) => {
    if (done) return;
    setCurrent(i);
    setAnimKey((k) => k + 1);
  };

  const goNext = () => {
    if (isLast) {
      setDone(true);
      return;
    }
    setCurrent((c) => c + 1);
    setAnimKey((k) => k + 1);
  };

  const goPrev = () => {
    if (current === 0) return;
    setCurrent((c) => c - 1);
    setAnimKey((k) => k + 1);
  };

  const restart = () => {
    setDone(false);
    setCurrent(0);
    setAnimKey((k) => k + 1);
  };

  const progressPercent = done ? 100 : (current / (total - 1)) * 100;

  return (
    <div className="flex items-center justify-center  bg-muted/30 p-6">
      <div className="w-full max-w-md">
        {/* Progress Dots */}
        <div className="relative flex items-center mb-8">
          {/* Track */}
          <div className="absolute inset-y-1/2 left-0 right-0 h-px bg-border -translate-y-1/2" />
          {/* Fill */}
          <div
            className="absolute inset-y-1/2 left-0 h-px bg-primary -translate-y-1/2 transition-all duration-500 ease-in-out"
            style={{ width: `${progressPercent}%` }}
          />

          {steps.map((s, i) => {
            const isDone = done || i < current;
            const isActive = !done && i === current;
            return (
              <div
                key={s.step}
                className="relative z-10 flex items-center flex-1 last:flex-none"
              >
                <button
                  onClick={() => jumpTo(i)}
                  className={[
                    "w-7 h-7 rounded-full border flex items-center justify-center text-xs font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    isActive
                      ? "bg-primary border-primary text-primary-foreground scale-110 shadow-sm"
                      : isDone
                        ? "bg-primary/10 border-primary text-primary"
                        : "bg-background border-border text-muted-foreground hover:border-foreground/40",
                  ].join(" ")}
                >
                  {isDone ? (
                    <Check className="w-3 h-3" strokeWidth={2.5} />
                  ) : (
                    i + 1
                  )}
                </button>
                {i < total - 1 && <div className="flex-1" />}
              </div>
            );
          })}
        </div>

        {/* Stage Card */}
        {!done ? (
          <div className="bg-background border border-border rounded-2xl overflow-hidden shadow-sm">
            {/* Top accent line */}
            <div className="h-0.5 bg-primary w-full" />

            <div className="p-6 min-h-[160px] relative">
              {/* Ghost step number */}
              <span className="absolute right-6 top-5 text-5xl font-semibold text-border select-none leading-none pointer-events-none">
                {String(steps[current].step).padStart(2, "0")}
              </span>

              {/* Step label */}
              <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-3">
                Step {steps[current].step} of {total}
              </p>

              {/* Instruction text — re-keyed to trigger CSS animation */}
              <p
                key={animKey}
                className="text-lg font-medium text-foreground leading-relaxed max-w-[320px] pr-8 animate-in fade-in slide-in-from-bottom-2 duration-200"
              >
                {steps[current].instruction}
              </p>

              {/* Meta chips */}
              {steps[current].meta?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-border">
                  {steps[current].meta.map((m) => (
                    <span
                      key={m}
                      className="text-xs text-muted-foreground bg-muted border border-border rounded-full px-3 py-0.5"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Done State */
          <div className="bg-background border border-border rounded-2xl p-8 text-center shadow-sm">
            <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-4">
              <Check
                className="w-5 h-5 text-green-600 dark:text-green-400"
                strokeWidth={2.5}
              />
            </div>
            <h3 className="text-base font-semibold text-foreground mb-1">
              Ready to serve!
            </h3>
            <p className="text-sm text-muted-foreground">
              Garlic Butter Veggie Rice Stir-Fry is done.
            </p>
            <button
              onClick={restart}
              className="mt-5 inline-flex items-center gap-2 text-sm text-foreground border border-border rounded-lg px-4 py-2 hover:bg-muted transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Start over
            </button>
          </div>
        )}

        {/* Navigation */}
        {!done && (
          <div className="flex items-center justify-between mt-4 gap-3">
            <button
              onClick={goPrev}
              disabled={current === 0}
              className="flex items-center gap-1.5 text-sm border border-border rounded-lg px-4 py-2 text-foreground bg-background hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <button
              onClick={goNext}
              className={[
                "flex items-center gap-1.5 text-sm rounded-lg px-4 py-2 font-medium transition-colors",
                isLast
                  ? "bg-green-500/10 border border-green-500/30 text-green-700 dark:text-green-400 hover:bg-green-500/20"
                  : "bg-primary text-primary-foreground hover:bg-primary/90 border border-transparent",
              ].join(" ")}
            >
              {isLast ? (
                <>
                  Done
                  <Check className="w-4 h-4" strokeWidth={2.5} />
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
