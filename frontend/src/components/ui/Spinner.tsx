import { Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

type SpinnerProps = {
  label?: string;
  className?: string;
  size?: number;
};

export const Spinner = ({ label = "Đang tải...", className, size = 16 }: SpinnerProps) => {
  return (
    <span className={cn("inline-flex items-center gap-2 text-sm text-slate-500", className)}>
      <Loader2 className="animate-spin" size={size} />
      <span>{label}</span>
    </span>
  );
};
