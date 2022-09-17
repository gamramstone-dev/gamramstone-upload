import styles from '../styles/components/ProcessPopup.module.scss'

import create from 'zustand'

export const useSignInAsk = create<{
  open: boolean
  setOpen: (open: boolean) => void
  elevated: boolean
  setElevated: (elevated: boolean) => void
}>(set => ({
  open: false,
  setOpen: (open: boolean) => set({ open }),

  elevated: false,
  setElevated: (elevated: boolean) => set({ elevated })
}))

import { AnimatePresence, motion, Variants } from 'framer-motion'
import { useCallback, useState } from 'react'
import { useBodyLock } from '../hooks/styles'
import { PopupTab } from './ProcessPopup'
import { Button } from './Button'
import { useTranslation } from 'react-i18next'
import { classes } from '../utils/string'
import { signIn } from 'next-auth/react'

const backgroundVariants: Variants = {
  initial: {
    opacity: 0,
    pointerEvents: 'none'
  },
  visible: {
    opacity: 1,
    pointerEvents: 'auto'
  }
}

const popupVariants: Variants = {
  initial: {
    opacity: 0,
    translateY: 25
  },
  visible: {
    opacity: 1,
    translateY: 0
  }
}

export const SignInAskModalWrapper = () => {
  const store = useSignInAsk()

  return (
    <AnimatePresence>
      {store.open && <SignInAskModal></SignInAskModal>}
    </AnimatePresence>
  )
}

export const SignInAskModal = () => {
  const store = useSignInAsk()
  const { t } = useTranslation()

  const [closing, setClosing] = useState(false)
  useBodyLock(!closing && true)

  const localCloseHandler = useCallback(() => {
    if (!close) {
      return
    }

    setClosing(true)

    store.setElevated(false)
    store.setOpen(false)
  }, [close])

  const goSignIn = useCallback(
    (manual: boolean) => {
      const options: Record<string, string> = {
        scope: 'openid profile'
      }

      if (manual) {
        options.prompt = 'select_account'
      }

      if (store.elevated) {
        options.scope += ' https://www.googleapis.com/auth/youtube.force-ssl'
      }

      signIn('google', undefined, options)
    },
    [store.elevated]
  )

  const Ask = (
    <PopupTab
      className={classes(styles.tab, styles.statusTab)}
      key='tab-ask'
      custom={0}
    >
      <div className={styles.center}>
        <h1 className={styles.title}>
          {t(
            store.elevated
              ? 'popup.sign_in_title_elevated'
              : 'popup.sign_in_title'
          )}
        </h1>
        <p className={styles.description}>{t('popup.sign_in_description')}</p>
      </div>

      <div className={styles.actions}>
        <Button theme='secondary' icon='close-line' onClick={localCloseHandler}>
          {t('close')}
        </Button>
        <Button theme='primary' onClick={() => goSignIn(false)}>
          {t('auto_select')}
        </Button>
        <Button theme='primary' onClick={() => goSignIn(true)}>
          {t('manual_select')}
        </Button>
      </div>
      <div className={styles.warn}>{t('popup.bottom_warning')}</div>
    </PopupTab>
  )

  return (
    <div
      className={classes(styles.popupWrapper, styles.signInWrapper)}
      data-closing={closing}
    >
      <motion.div
        className={styles.background}
        initial='initial'
        animate='visible'
        exit='initial'
        variants={backgroundVariants}
        transition={{
          type: 'spring',
          stiffness: 100,
          damping: 10
        }}
        onClick={ev => {
          ev.stopPropagation()
        }}
      ></motion.div>
      <motion.div
        className={styles.popup}
        initial='initial'
        animate='visible'
        exit='initial'
        variants={popupVariants}
        transition={{
          type: 'spring',
          duration: 0.45
        }}
      >
        {Ask}
      </motion.div>
    </div>
  )
}

export default SignInAskModal
