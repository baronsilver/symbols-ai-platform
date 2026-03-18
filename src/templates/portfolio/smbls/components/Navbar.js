export const Navbar = {
  extends: 'Flex',
  flexAlign: 'center space-between',
  padding: 'A C',
  position: 'sticky',
  top: '0',
  zIndex: '100',
  background: 'navBg',
  backdropFilter: 'blur(16px)',
  borderBottomWidth: '1px',
  borderBottomStyle: 'solid',
  borderBottomColor: 'cardBorder',

  Logo: {
    extends: 'Text',
    tag: 'span',
    text: 'Alex.',
    color: 'textPrimary',
    fontSize: 'B1',
    fontWeight: '700',
    cursor: 'pointer'
  },

  Nav: {
    extends: 'Flex',
    flexAlign: 'center center',
    gap: 'C',
    L1: { tag: 'a', text: 'Work', color: 'textSecondary', fontSize: 'Z1', cursor: 'pointer', ':hover': { color: 'textPrimary' } },
    L2: { tag: 'a', text: 'About', color: 'textSecondary', fontSize: 'Z1', cursor: 'pointer', ':hover': { color: 'textPrimary' } },
    L3: { tag: 'a', text: 'Process', color: 'textSecondary', fontSize: 'Z1', cursor: 'pointer', ':hover': { color: 'textPrimary' } }
  },

  ContactBtn: {
    tag: 'a',
    text: 'Say hello →',
    color: 'accent',
    fontSize: 'Z1',
    fontWeight: '600',
    cursor: 'pointer',
    ':hover': { color: 'accentDark' }
  }
}
