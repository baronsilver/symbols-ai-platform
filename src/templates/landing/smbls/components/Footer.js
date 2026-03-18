export const Footer = {
  extends: 'Flex',
  flexAlign: 'center space-between',
  padding: 'C',
  borderTopWidth: '1px',
  borderTopStyle: 'solid',
  borderTopColor: 'cardBorder',
  background: 'pageBg',

  Left: { extends: 'Text', tag: 'span', text: '© 2025 Launchpad, Inc.', color: 'textMuted', fontSize: 'Z1' },
  Right: {
    extends: 'Flex',
    flexAlign: 'center center',
    gap: 'C',
    L1: { tag: 'a', text: 'Privacy', color: 'textMuted', fontSize: 'Z1', cursor: 'pointer', ':hover': { color: 'white' } },
    L2: { tag: 'a', text: 'Terms', color: 'textMuted', fontSize: 'Z1', cursor: 'pointer', ':hover': { color: 'white' } },
    L3: { tag: 'a', text: 'Status', color: 'textMuted', fontSize: 'Z1', cursor: 'pointer', ':hover': { color: 'white' } }
  }
}
