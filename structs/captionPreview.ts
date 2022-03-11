import { atom, selector } from 'recoil'

export const openCaptionPreviewAtom = atom({
  key: 'openCaptionPreview',
  default: false,
})

export const captionPreviewDetailsAtom = atom({
  key: 'captionPreviewDetails',
  default: {
    title: '',
    video: '',
    file: '',
    lang: ''
  },
})

export const captionPreviewSelector = selector({
  key: 'captionPreview',
  get: ({ get }) => {
    return {
      open: get(openCaptionPreviewAtom),
      details: get(captionPreviewDetailsAtom),
    }
  },
})
