import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: LucideIcon;
  variant?: "default" | "critical" | "warning" | "success";
}

const variantStyles = {
  default: "bg-card border-border",
  critical: "bg-destructive/8 border-destructive/20",
  warning: "bg-accent/15 border-accent/25",
  success: "bg-primary/8 border-primary/20",
};

const iconStyles = {
  default: "text-muted-foreground bg-muted",
  critical: "text-destructive bg-destructive/10",
  warning: "text-accent-foreground bg-accent/20",
  success: "text-primary bg-primary/10",
};

export function MetricCard({ title, value, subtitle, icon: Icon, variant = "default" }: MetricCardProps) {
  return (
    <div className={cn("rounded-lg border p-5 transition-all hover:shadow-md", variantStyles[variant])}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-1 text-3xl font-bold tracking-tight">{value}</p>
          {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        <div className={cn("rounded-lg p-2.5", iconStyles[variant])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
