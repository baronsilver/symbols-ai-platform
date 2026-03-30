export default {
  // Surface themes
  document: {
    '@dark': { background: 'codGray', color: 'title' },
    '@light': { background: 'gray 1 +168', color: 'title' },
  },
  dialog: {
    '@dark': {
      background: 'gray 0.95 -68', color: 'title',
      backdropFilter: 'blur(3px)', borderColor: 'gray 0', outlineColor: 'blue',
    },
    '@light': {
      background: 'gray .95 +150', color: 'title',
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
  card: {
    '@dark': { background: 'gray 0.95 +80', color: 'title', borderColor: 'gray 0' },
    '@light': { background: 'white', color: 'title', borderColor: 'line' },
  },

  // Priority/action themes
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

  // Utility themes
  none: { color: 'none', background: 'none' },
  transparent: { color: 'currentColor', background: 'transparent' },
  bordered: {
    background: 'transparent',
    '@dark': { border: '1px solid #4e4e50' },
    '@light': { border: '1px solid #a3cdfd' },
  },
}
