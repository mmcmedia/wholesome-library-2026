"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position="bottom-right"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-2xl group-[.toaster]:rounded-xl animate-slide-in-right",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-teal group-[.toast]:text-white group-[.toast]:hover:bg-teal/90",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          success: "group-[.toast]:border-teal/20 group-[.toast]:bg-teal/5",
          error: "group-[.toast]:border-red-200 group-[.toast]:bg-red-50",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
