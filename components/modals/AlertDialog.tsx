import { ReactNode } from 'react'
import Modal, { ModalProps } from './base'

type AlertDialogProps = ModalProps & {
  title: string // 표시할 제목
  children: ReactNode // 표시할 내용
  closeText?: string // 닫기 버튼 텍스트
}

export const AlertDialog = ({
  open,
  close,
  title,
  children,
  closeText,
}: AlertDialogProps) => {
  return (
    <Modal isOpen={open} onClose={close} isDismissable title={title}>
      <div>{children}</div>
      <Modal.Actions>
        <Modal.CloseButton>{closeText}</Modal.CloseButton>
      </Modal.Actions>
    </Modal>
  )
}

export default AlertDialog
