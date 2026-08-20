export default function StepProgress({ currentStep, steps }) {
  const percent = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="mb-8">
      <div className="mb-3 flex items-center justify-between text-sm">
        <span className="font-black text-cyan-300">
          مرحله {currentStep + 1} از {steps.length}
        </span>
        <span className="text-slate-400">{steps[currentStep]}</span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-cyan-400 transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
