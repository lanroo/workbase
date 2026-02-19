import { useEffect, useRef, useId } from 'react'
import { Button } from './Button'

type ModalProps = {
  title: string
  onClose: () => void
  children: React.ReactNode
}

const FOCUSABLE_SELECTOR = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

function focusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (el) => !el.hasAttribute('disabled') && el.offsetParent !== null,
  )
}

export function Modal({ title, onClose, children }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    const previouslyFocused = document.activeElement as HTMLElement | null
    const focusables = focusableElements(dialog)
    const first = focusables[0]
    const last = focusables[focusables.length - 1]
    first?.focus()

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }
      if (e.key !== 'Tab' || focusables.length === 0) return
      const d = dialogRef.current
      if (!d) return
      const target = e.target as Node
      if (!d.contains(target)) return
      e.preventDefault()
      if (e.shiftKey) {
        if (document.activeElement === first) last?.focus()
        else focusables[focusables.indexOf(document.activeElement as HTMLElement) - 1]?.focus()
      } else {
        if (document.activeElement === last) first?.focus()
        else focusables[focusables.indexOf(document.activeElement as HTMLElement) + 1]?.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      previouslyFocused?.focus()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-black/50 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-full max-w-md rounded-2xl bg-[#1e1e24] border border-zinc-700/50 shadow-xl max-h-[90vh] overflow-y-auto my-auto mx-2 sm:mx-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-6 md:p-8">
          <h2 id={titleId} className="text-lg font-semibold text-white m-0 mb-6">
            {title}
          </h2>
          {children}
        </div>
      </div>
    </div>
  )
}

type ModalActionsProps = {
  onClose: () => void
  submitLabel: string
}

export function ModalActions({ onClose, submitLabel }: ModalActionsProps) {
  return (
    <div className="flex flex-col-reverse sm:flex-row gap-3 mt-6 pt-4 border-t border-zinc-700/50">
      <Button variant="ghost" onClick={onClose} className="max-sm:w-full max-sm:min-h-[48px] sm:mr-auto md:min-h-0">
        Cancel
      </Button>
      <Button type="submit" fullWidth className="max-sm:min-h-[48px] sm:w-auto md:min-h-0">
        {submitLabel}
      </Button>
    </div>
  )
}
