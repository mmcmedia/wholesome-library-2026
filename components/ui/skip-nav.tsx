/**
 * Skip Navigation Link
 * Provides keyboard users a way to skip repetitive navigation
 * Visible only when focused (Tab key)
 */

export default function SkipNav() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-teal focus:text-white focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-teal focus:ring-offset-2"
    >
      Skip to main content
    </a>
  )
}
