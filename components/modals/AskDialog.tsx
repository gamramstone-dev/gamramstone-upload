import { ReactNode } from 'react'
import Button from '../common/Button'
import Modal, { ModalProps } from './base'

type AskDialogProps = ModalProps & {
  title: string // 표시할 제목
  children: ReactNode // 표시할 내용
  isDisabled?: boolean // 버튼들을 비활성화 할 것인지에 대한 여부
  dismiss: () => void // 취소 버튼을 눌렀을 때 실행할 함수
  dismissText?: string // 닫기 버튼 텍스트
  submitText?: string // 확인 버튼 텍스트
  submit: () => void // 확인 버튼 클릭 시 실행할 함수
}

export const AskDialog = ({
  open,
  title,
  isDisabled,
  children,
  dismiss,
  dismissText,
  submitText,
  submit,
}: AskDialogProps) => {
  return (
    <Modal isOpen={open} onClose={dismiss} isDismissable title={title}>
      <div>{children}</div>
      <Modal.Actions>
        <Button onPress={submit} isDisabled={isDisabled}>
          {submitText ?? '확인'}
        </Button>
        <Modal.CloseButton
          autoFocus={false}
          theme='secondary'
          isDisabled={isDisabled}
        >
          {dismissText ?? '닫기'}
        </Modal.CloseButton>
      </Modal.Actions>
    </Modal>
  )
}

export default AskDialog
