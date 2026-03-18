export const HeroBanner = {
  extends: 'Flex',
  background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)',
  padding: 'G C',
  flexAlign: 'center space-between',
  overflow: 'hidden',
  position: 'relative',

  Left: {
    extends: 'Flex',
    flow: 'y',
    gap: 'B',
    maxWidth: '520px',
    zIndex: '1',

    Eyebrow: {
      tag: 'span',
      text: 'NEW COLLECTION 2025',
      color: 'brandLight',
      fontSize: '11px',
      fontWeight: '700',
      letterSpacing: '0.15em'
    },

    Headline: {
      tag: 'h1',
      text: 'Discover Products You\'ll Love',
      color: 'white',
      fontSize: '40px',
      fontWeight: '800',
      lineHeight: '1.15'
    },

    Sub: {
      tag: 'p',
      text: 'Curated selection of premium products across electronics, fashion, home & more. Free shipping on orders over $50.',
      color: '#94a3b8',
      fontSize: 'Z1',
      lineHeight: '1.7'
    },

    Actions: {
      extends: 'Flex',
      gap: 'A',
      marginTop: 'Y',
      ShopBtn: {
        tag: 'button',
        text: 'Shop Now →',
        background: 'brand',
        color: 'white',
        border: 'none',
        borderRadius: 'Z1',
        padding: 'A C',
        fontSize: 'Z1',
        fontWeight: '700',
        cursor: 'pointer',
        ':hover': { background: 'brandDark' }
      },
      LearnBtn: {
        tag: 'button',
        text: 'Learn More',
        background: 'transparent',
        color: 'white',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: '#475569',
        borderRadius: 'Z1',
        padding: 'A C',
        fontSize: 'Z1',
        fontWeight: '600',
        cursor: 'pointer',
        ':hover': { borderColor: 'white' }
      }
    }
  },

  Right: {
    extends: 'Flex',
    flexAlign: 'center center',
    position: 'relative',
    HeroImg: {
      tag: 'img',
      src: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600',
      alt: 'Store',
      width: '500px',
      height: '360px',
      objectFit: 'cover',
      borderRadius: 'B',
      boxShadow: '0 32px 64px rgba(0,0,0,0.4)',
      opacity: '0.9'
    }
  }
}
