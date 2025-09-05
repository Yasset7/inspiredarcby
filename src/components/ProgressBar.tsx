import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  variant?: 'default' | 'success' | 'warning' | 'ml' | 'aws' | 'terraform';
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const progressVariants = {
  default: 'bg-gradient-primary',
  success: 'bg-gradient-success', 
  warning: 'bg-warning',
  ml: 'bg-gradient-ml',
  aws: 'bg-gradient-aws',
  terraform: 'bg-gradient-terraform'
};

const sizeVariants = {
  sm: 'h-2',
  md: 'h-3',
  lg: 'h-4'
};

export const ProgressBar = ({ 
  value, 
  max, 
  label, 
  variant = 'default',
  showText = true,
  size = 'md'
}: ProgressBarProps) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  return (
    <div className="space-y-2">
      {label && showText && (
        <div className="flex justify-between items-center text-sm">
          <span className="font-medium text-foreground">{label}</span>
          <span className="text-muted-foreground">
            {value} / {max} ({Math.round(percentage)}%)
          </span>
        </div>
      )}
      <div className={cn(
        "w-full bg-muted rounded-full overflow-hidden",
        sizeVariants[size]
      )}>
        <div 
          className={cn(
            "h-full transition-all duration-500 ease-out rounded-full",
            progressVariants[variant]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};