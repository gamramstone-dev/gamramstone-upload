import { createContext, ReactNode, useContext, useRef } from 'react'
import {
  AriaOverlayProps,
  FocusScope,
  OverlayContainer,
  useDialog,
  useModal,
  useOverlay,
  usePreventScroll,
} from 'react-aria'

import {
  AnimatePresence,
  motion,
  useReducedMotion,
  Variants,
} from 'framer-motion'
import Button, { ButtonTheme } from '../common/Button'
import { styled } from '../../structs/styles'

export interface ModalProps {
  open: boolean
  close?: () => void
}

const ModalBase = styled(motion.div, {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  zIndex: 100,
  display: 'flex',
  background: 'rgba(0,0,0,0.25)',
})

const ModalFrame = styled(motion.div, {
  margin: 'auto',

  '&:focus': {
    outline: 'none',
  },

  maxWidth: '80vw',
  maxHeight: '80vh',

  '@mobile': {
    width: '70vw',
    padding: '5vh 5vw',
  },

  willChange: 'transform, opacity',
  background: 'rgb(255, 255, 255)',
  boxShadow: '0px 0px 32px rgba(0, 0, 0, 0.25)',
  borderRadius: 8,
  zIndex: 101,
  padding: '2rem 3rem',
})

const ModalTitle = styled(motion.h3, {
  marginTop: 0,
})

const ModalActions = styled(motion.div, {
  display: 'flex',
  gap: 10,

  marginTop: '3vh',
  float: 'right',
})

const BackdropAnimate: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
}

const ModalAnimate: Variants = {
  initial: {
    opacity: 0,
    scale: 0.9,
  },
  animate: {
    opacity: 1,
    scale: 1,
  },
  exit: {
    opacity: 0,
    scale: 0.9,
  },

  reducedInitial: {
    opacity: 0,
    scale: 1,
  },
}

interface ModalRootProps {
  children?: ReactNode
  title?: string
}

const Base = ({
  children,
  title,
  ...props
}: AriaOverlayProps & ModalRootProps) => {
  const modalRef = useRef(null)
  const shouldReduceMotion = useReducedMotion()

  const { overlayProps, underlayProps } = useOverlay(props, modalRef)

  usePreventScroll()

  const { modalProps } = useModal()
  const { dialogProps, titleProps } = useDialog({}, modalRef)

  return (
    // @ts-ignore
    <ModalBase
      {...underlayProps}
      variants={BackdropAnimate}
      initial='initial'
      animate='animate'
      exit='exit'
      transition={
        shouldReduceMotion
          ? { duration: 0.2, ease: 'linear' }
          : { duration: 0.2 }
      }
    >
      <FocusScope>
        {
          // @ts-ignore
          <ModalFrame
            {...overlayProps}
            {...dialogProps}
            {...modalProps}
            ref={modalRef}
            variants={ModalAnimate}
            animate='animate'
            initial={shouldReduceMotion ? 'reducedInitial' : 'initial'}
            exit='exit'
            transition={
              shouldReduceMotion
                ? { duration: 0.2, ease: 'linear' }
                : { type: 'spring', stiffness: 500, damping: 30 }
            }
          >
            {
              // @ts-ignore
              <ModalTitle {...titleProps}>{title}</ModalTitle>
            }
            {children}
          </ModalFrame>
        }
      </FocusScope>
    </ModalBase>
  )
}

const ModalActionContext = createContext<(() => void) | undefined>(undefined)

const Root = ({ children, ...props }: AriaOverlayProps & ModalRootProps) => {
  return (
    <AnimatePresence>
      {props.isOpen ? (
        <ModalActionContext.Provider value={props.onClose ?? (() => {})}>
          <OverlayContainer>
            <Base {...props}>{children}</Base>
          </OverlayContainer>
        </ModalActionContext.Provider>
      ) : null}
    </AnimatePresence>
  )
}

const Actions = ({ children }: { children?: ReactNode }) => {
  return <ModalActions>{children}</ModalActions>
}

const CloseButton = ({
  children = '닫기',
  theme = 'secondary',
  isDisabled = false,
  autoFocus = true,
}: {
  children?: ReactNode
  theme?: ButtonTheme
  isDisabled?: boolean
  autoFocus?: boolean
}) => {
  const close = useContext(ModalActionContext)

  return (
    <Button
      onPress={close}
      autoFocus={autoFocus}
      theme={theme}
      isDisabled={isDisabled}
    >
      {children}
    </Button>
  )
}

const Modal = Object.assign(Root, { Actions, CloseButton })

export default Modal
