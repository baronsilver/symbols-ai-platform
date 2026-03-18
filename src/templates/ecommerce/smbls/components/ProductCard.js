export const ProductCard = {
  extends: 'Flex',
  flow: 'y',
  background: 'cardBg',
  borderRadius: 'A',
  overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  cursor: 'pointer',
  transition: 'transform 0.2s, box-shadow 0.2s',
  ':hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 24px rgba(0,0,0,0.12)'
  },

  ImageWrap: {
    position: 'relative',
    height: '220px',
    overflow: 'hidden',
    background: 'gray100',
    ProductImg: {
      tag: 'img',
      src: (el, s) => s.image || '',
      alt: (el, s) => s.title || '',
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    },
    Badge: {
      if: (el, s) => s.badge,
      position: 'absolute',
      top: 'Z1',
      left: 'Z1',
      background: (el, s) => s.badge === 'Sale' ? 'badgeSale' : s.badge === 'New' ? 'badgeNew' : 'badgePop',
      color: (el, s) => s.badge === 'Sale' ? 'badgeSaleText' : s.badge === 'New' ? 'badgeNewText' : 'badgePopText',
      padding: 'X Z',
      borderRadius: 'X',
      fontSize: '11px',
      fontWeight: '700',
      text: (el, s) => s.badge
    }
  },

  Info: {
    extends: 'Flex',
    flow: 'y',
    padding: 'A',
    gap: 'Z',
    flex: '1',

    Title: {
      tag: 'p',
      text: (el, s) => s.title || '',
      fontSize: 'Z1',
      fontWeight: '600',
      color: 'textPrimary',
      lineHeight: '1.4',
      overflow: 'hidden',
      display: '-webkit-box',
      '-webkit-line-clamp': '2',
      '-webkit-box-orient': 'vertical'
    },

    Stars: {
      extends: 'Flex',
      flexAlign: 'center flex-start',
      gap: 'X',
      StarsVal: {
        extends: 'Text', tag: 'span',
        text: (el, s) => '★'.repeat(Math.floor(s.rating || 0)),
        color: 'accent', fontSize: 'Z'
      },
      ReviewCount: {
        extends: 'Text', tag: 'span',
        text: (el, s) => `(${s.reviews || 0})`,
        color: 'textSecondary', fontSize: '11px'
      }
    },

    PriceRow: {
      extends: 'Flex',
      flexAlign: 'center space-between',
      marginTop: 'Y',
      Prices: {
        extends: 'Flex',
        flexAlign: 'center flex-start',
        gap: 'Z',
        Current: {
          extends: 'Text', tag: 'span',
          text: (el, s) => `$${s.price}`,
          color: 'brand', fontSize: 'B', fontWeight: '700'
        },
        Original: {
          if: (el, s) => s.originalPrice,
          extends: 'Text', tag: 'span',
          text: (el, s) => `$${s.originalPrice}`,
          color: 'textSecondary', fontSize: 'Z1',
          textDecoration: 'line-through'
        }
      },
      AddBtn: {
        tag: 'button',
        text: '+',
        background: 'brand',
        color: 'white',
        border: 'none',
        borderRadius: 'Z',
        width: '28px',
        height: '28px',
        fontSize: 'B1',
        fontWeight: '700',
        cursor: 'pointer',
        ':hover': { background: 'brandDark' }
      }
    }
  }
}
