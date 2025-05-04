import * as React from 'react';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import { cn } from '@/lib/fe/utils/cn';

const ScrollArea = React.forwardRef<
   React.ElementRef<typeof ScrollAreaPrimitive.Root>,
   React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => (
   <ScrollAreaPrimitive.Root ref={ref} className={cn('relative overflow-hidden', className)} {...props}>
      <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
         {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
   </ScrollAreaPrimitive.Root>
));
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

const ScrollBar = React.forwardRef<
   React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
   React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = 'vertical', ...props }, ref) => (
   <ScrollAreaPrimitive.ScrollAreaScrollbar
      ref={ref}
      orientation={orientation}
      className={cn(
         'flex touch-none select-none transition-colors',
         orientation === 'vertical' && 'h-full w-2.5 border-l border-l-transparent p-[1px]',
         orientation === 'horizontal' && 'h-2.5 border-t border-t-transparent p-[1px]',
         className,
      )}
      {...props}>
      <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-gray-300" />
   </ScrollAreaPrimitive.ScrollAreaScrollbar>
));
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

type ScrollAreaOnScrollProps = React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> & {
   onScrollCb?: (event: React.UIEvent<HTMLDivElement>) => void;
} & { scrollRef?: React.ForwardedRef<HTMLDivElement> };

const ScrollAreaOnScroll = React.forwardRef<React.ElementRef<typeof ScrollAreaPrimitive.Root>, ScrollAreaOnScrollProps>(
   ({ className, children, onScrollCb, scrollRef, ...props }, ref) => (
      <ScrollAreaPrimitive.Root ref={ref} className={cn('relative overflow-hidden', className)} {...props}>
         <ScrollAreaPrimitive.Viewport
            ref={scrollRef}
            onScroll={e => {
               onScrollCb?.(e);
            }}
            className="h-full w-full rounded-[inherit]">
            {children}
         </ScrollAreaPrimitive.Viewport>
         <ScrollBar />
         <ScrollAreaPrimitive.Corner />
      </ScrollAreaPrimitive.Root>
   ),
);

ScrollAreaOnScroll.displayName = 'ScrollAreaOnScroll';

export { ScrollArea, ScrollBar, ScrollAreaOnScroll };
