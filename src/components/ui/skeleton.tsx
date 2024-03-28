import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("tailwind.config.tsanimate-pulse tailwind.config.tsrounded-md tailwind.config.tsbg-muted", className)}
      {...props}
    />
  )
}

export { Skeleton }
