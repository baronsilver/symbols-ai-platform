export const Navbar = {
  extends: 'Flex',
  background: 'navBg',
  padding: 'A C',
  flexAlign: 'center space-between',
  position: 'sticky',
  top: '0',
  zIndex: '100',
  boxShadow: '0 1px 3px rgba(0,0,0,0.3)',

  Left: {
    extends: 'Flex',
    flexAlign: 'center center',
    gap: 'Z',
    Logo: {
      extends: 'Text',
      tag: 'span',
      text: 'STORE',
      color: 'white',
      fontSize: 'B1',
      fontWeight: '800',
      letterSpacing: '0.1em'
    },
    Dot: { extends: 'Text', tag: 'span', text: '·', color: 'brand', fontSize: 'C', fontWeight: '900' }
  },

  Center: {
    extends: 'Flex',
    flex: '1',
    maxWidth: '500px',
    margin: '0 C',
    SearchWrap: {
      extends: 'Flex',
      flex: '1',
      background: 'gray800',
      borderRadius: 'B',
      padding: 'Z A',
      flexAlign: 'center center',
      gap: 'Z',
      SearchIcon: {
        extends: 'Text',
        tag: 'span',
        text: '⌕',
        color: 'gray400',
        fontSize: 'B1'
      },
      SearchInput: {
        tag: 'input',
        type: 'text',
        placeholder: 'Search products...',
        background: 'transparent',
        border: 'none',
        outline: 'none',
        color: 'white',
        fontSize: 'Z1',
        flex: '1',
        '::placeholder': { color: 'gray500' }
      }
    }
  },

  Right: {
    extends: 'Flex',
    flexAlign: 'center center',
    gap: 'A',
    CartBtn: {
      extends: 'Flex',
      tag: 'button',
      flexAlign: 'center center',
      gap: 'Z',
      background: 'brand',
      border: 'none',
      borderRadius: 'Z1',
      padding: 'Z B',
      cursor: 'pointer',
      ':hover': { background: 'brandDark' },
      CartIcon: { extends: 'Text', tag: 'span', text: '🛒', fontSize: 'B' },
      CartLabel: {
        extends: 'Text',
        tag: 'span',
        text: (el, s) => `Cart (${s.root.cartCount})`,
        color: 'white',
        fontSize: 'Z1',
        fontWeight: '600'
      }
    }
  }
}
