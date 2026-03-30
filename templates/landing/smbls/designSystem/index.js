import color from './COLOR.js'
import spacing from './SPACING.js'

export default {
  color,
  spacing,
  theme: {
    document: {
      '@dark': { color: 'title', background: 'codGray' },
      '@light': { color: 'title', background: 'gray 1 +168' },
    },
    dialog: {
      '@dark': {
        color: 'title', background: 'gray 0.95 -68',
        backdropFilter: 'blur(3px)', borderColor: 'gray 0', outlineColor: 'blue',
      },
      '@light': {
        color: 'title', background: 'gray .95 +150',
        backdropFilter: 'blur(3px)', borderColor: 'gray 0', outlineColor: 'blue',
      },
    },
    'dialog-elevated': {
      '@dark': {
        color: 'title', background: 'gray 1 +68',
        borderColor: 'gray 0', outlineColor: 'blue', backgroundKey: 'caption',
      },
      '@light': {
        color: 'title', background: 'gray 0.95 +140',
        borderColor: 'gray 0', outlineColor: 'blue',
      },
    },
    field: {
      '@dark': {
        color: 'white', background: 'gray 0.95 -65',
        '::placeholder': { color: 'white 1 -78' },
      },
      '@light': {
        color: 'black',
        '::placeholder': { color: 'gray 1 -68' },
      },
    },
    'field-dialog': {
      '@dark': { background: 'gray 1 -16', color: 'title' },
      '@light': { color: 'title', background: 'gray 1 -96' },
    },
    primary: {
      '@dark': { background: 'blue', color: 'white' },
      '@light': { color: 'white', background: 'blue' },
    },
    warning: {
      '@dark': { background: 'red', color: 'white' },
      '@light': { color: 'white', background: 'red' },
    },
    success: {
      '@dark': { background: 'green', color: 'white' },
      '@light': { color: 'white', background: 'green' },
    },
    none: { color: 'none', background: 'none' },
    transparent: { color: 'currentColor', background: 'transparent' },
    bordered: {
      background: 'transparent',
      '@dark': { border: '1px solid #4e4e50' },
      '@light': { border: '1px solid #a3cdfd' },
    },
  },
  typography: {
    base: 16,
    ratio: 1.25,
    subSequence: true,
  },
  timing: {
    defaultBezier: 'cubic-bezier(.29, .67, .51, .97)',
  },
  animation: {
    fadeInUp: {
      from: { transform: 'translate3d(0, 12.5%, 1px)', opacity: 0 },
      to: { transform: 'translate3d(0, 0, 1px)', opacity: 1 },
    },
    fadeOutDown: {
      from: { transform: 'translate3d(0, 0, 1px)', opacity: 1 },
      to: { transform: 'translate3d(0, 12.5%, 1px)', opacity: 0 },
    },
  },
}