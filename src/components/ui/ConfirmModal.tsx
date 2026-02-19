import { Modal } from './Modal'
import { Button } from './Button'

type Props = {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: React.ReactNode
  confirmLabel: string
  cancelLabel?: string
  confirmVariant?: 'danger' | 'primary'
}

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel,
  cancelLabel = 'Cancel',
  confirmVariant = 'danger',
}: Props) {
  if (!open) return null

  return (
    <Modal title={title} onClose={onClose}>
      <div className="text-zinc-300 text-sm mb-6">{message}</div>
      <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-zinc-700/50">
        <Button
          variant="ghost"
          onClick={onClose}
          className="max-sm:w-full max-sm:min-h-[48px] sm:mr-auto md:min-h-0"
        >
          {cancelLabel}
        </Button>
        <Button
          variant={confirmVariant}
          onClick={onConfirm}
          className="max-sm:w-full max-sm:min-h-[48px] sm:w-auto md:min-h-0"
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  )
}
