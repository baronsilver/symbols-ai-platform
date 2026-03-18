export const Navbar = {
  extends: 'Flex',
  flexAlign: 'center space-between',
  padding: 'A C',
  position: 'sticky',
  top: '0',
  zIndex: '100',
  background: 'rgba(3,7,18,0.85)',
  backdropFilter: 'blur(12px)',
  borderBottomWidth: '1px',
  borderBottomStyle: 'solid',
  borderBottomColor: 'cardBorder',

  Logo: {
    extends: 'Flex',
    flexAlign: 'center center',
    gap: 'Z',
    cursor: 'pointer',
    LogoMark: {
      extends: 'Flex',
      flexAlign: 'center center',
      width: '28px', height: '28px',
      background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
      borderRadius: 'Z',
      Sym: { extends: 'Text', tag: 'span', text: '◈', color: 'white', fontSize: 'Z1', fontWeight: '900' }
    },
    LogoText: { extends: 'Text', tag: 'span', text: 'Launchpad', color: 'textPrimary', fontSize: 'B', fontWeight: '700' }
  },

  Nav: {
    extends: 'Flex',
    flexAlign: 'center center',
    gap: 'C',
    L1: { tag: 'a', text: 'Features', color: 'textSecondary', fontSize: 'Z1', cursor: 'pointer', ':hover': { color: 'white' } },
    L2: { tag: 'a', text: 'Pricing', color: 'textSecondary', fontSize: 'Z1', cursor: 'pointer', ':hover': { color: 'white' } },
    L3: { tag: 'a', text: 'Docs', color: 'textSecondary', fontSize: 'Z1', cursor: 'pointer', ':hover': { color: 'white' } },
    L4: { tag: 'a', text: 'Blog', color: 'textSecondary', fontSize: 'Z1', cursor: 'pointer', ':hover': { color: 'white' } }
  },

  Actions: {
    extends: 'Flex',
    flexAlign: 'center center',
    gap: 'A',
    SignIn: {
      tag: 'button', text: 'Sign in',
      background: 'transparent', color: 'textSecondary',
      border: 'none', fontSize: 'Z1', cursor: 'pointer',
      ':hover': { color: 'white' }
    },
    GetStarted: {
      tag: 'button', text: 'Get started →',
      background: 'brand', color: 'white',
      border: 'none', borderRadius: 'Z1',
      padding: 'Z B', fontSize: 'Z1', fontWeight: '600',
      cursor: 'pointer',
      ':hover': { background: 'brandDark' }
    }
  }
}
