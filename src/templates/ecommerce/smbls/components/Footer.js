export const Footer = {
  extends: 'Flex',
  background: 'navBg',
  padding: 'D C',
  flexAlign: 'flex-start space-between',
  flexWrap: 'wrap',
  gap: 'D',
  marginTop: 'auto',

  Brand: {
    extends: 'Flex',
    flow: 'y',
    gap: 'A',
    maxWidth: '240px',
    BrandName: { tag: 'span', text: 'STORE·', color: 'white', fontSize: 'B1', fontWeight: '800' },
    BrandDesc: { tag: 'p', text: 'Premium products, curated for modern life.', color: 'gray400', fontSize: 'Z1', lineHeight: '1.6' }
  },

  Links: {
    extends: 'Flex',
    gap: 'D',
    Col1: {
      extends: 'Flex', flow: 'y', gap: 'Z1',
      Title: { tag: 'span', text: 'SHOP', color: 'gray300', fontSize: '11px', fontWeight: '700', letterSpacing: '0.1em', marginBottom: 'Z' },
      L1: { tag: 'a', text: 'Electronics', color: 'gray400', fontSize: 'Z1', cursor: 'pointer', ':hover': { color: 'white' } },
      L2: { tag: 'a', text: 'Fashion', color: 'gray400', fontSize: 'Z1', cursor: 'pointer', ':hover': { color: 'white' } },
      L3: { tag: 'a', text: 'Home & Living', color: 'gray400', fontSize: 'Z1', cursor: 'pointer', ':hover': { color: 'white' } },
      L4: { tag: 'a', text: 'Sports', color: 'gray400', fontSize: 'Z1', cursor: 'pointer', ':hover': { color: 'white' } }
    },
    Col2: {
      extends: 'Flex', flow: 'y', gap: 'Z1',
      Title: { tag: 'span', text: 'SUPPORT', color: 'gray300', fontSize: '11px', fontWeight: '700', letterSpacing: '0.1em', marginBottom: 'Z' },
      L1: { tag: 'a', text: 'Help Center', color: 'gray400', fontSize: 'Z1', cursor: 'pointer', ':hover': { color: 'white' } },
      L2: { tag: 'a', text: 'Shipping Info', color: 'gray400', fontSize: 'Z1', cursor: 'pointer', ':hover': { color: 'white' } },
      L3: { tag: 'a', text: 'Returns', color: 'gray400', fontSize: 'Z1', cursor: 'pointer', ':hover': { color: 'white' } }
    }
  },

  Bottom: {
    width: '100%',
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: 'gray800',
    paddingTop: 'A',
    extends: 'Flex',
    flexAlign: 'center space-between',
    Copy: { tag: 'span', text: '© 2025 Store. All rights reserved.', color: 'gray500', fontSize: '11px' }
  }
}
