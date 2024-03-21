import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("tailwind.config.tsborder-b", className)}
    {...props}
  />
))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="tailwind.config.tsflex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "tailwind.config.tsflex tailwind.config.tsflex-1 tailwind.config.tsitems-center tailwind.config.tsjustify-between tailwind.config.tspy-4 tailwind.config.tsfont-medium tailwind.config.tstransition-all hover:tailwind.config.tsunderline [&[data-state=open]>svg]:tailwind.config.tsrotate-180",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="tailwind.config.tsh-4 tailwind.config.tsw-4 tailwind.config.tsshrink-0 tailwind.config.tstransition-transform tailwind.config.tsduration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="tailwind.config.tsoverflow-hidden tailwind.config.tstext-sm tailwind.config.tstransition-all data-[state=closed]:tailwind.config.tsanimate-accordion-up data-[state=open]:tailwind.config.tsanimate-accordion-down"
    {...props}
  >
    <div className={cn("tailwind.config.tspb-4 tailwind.config.tspt-0", className)}>{children}</div>
  </AccordionPrimitive.Content>
))

AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
