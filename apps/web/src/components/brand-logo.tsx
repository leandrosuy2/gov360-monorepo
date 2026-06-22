import { cn } from "@gov360/utils";

const LOGO_WIDTH = 1297;
const LOGO_HEIGHT = 311;

interface BrandLogoProps {
  className?: string;
  priority?: boolean;
}

export function BrandLogo({ className, priority = false }: BrandLogoProps) {
  return (
    <div className={cn("mx-auto w-full max-w-[132px] sm:max-w-[148px]", className)}>
      <img
        src="/logo.png"
        alt="Gov360"
        width={LOGO_WIDTH}
        height={LOGO_HEIGHT}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className="block h-auto w-full object-contain"
        style={{ aspectRatio: `${LOGO_WIDTH} / ${LOGO_HEIGHT}` }}
      />
    </div>
  );
}
