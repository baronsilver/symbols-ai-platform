export const Hero = {
  extends: 'Flex',
  flow: 'y',
  flexAlign: 'center center',
  padding: 'H C',
  textAlign: 'center',
  position: 'relative',
  overflow: 'hidden',

  GlowLeft: {
    position: 'absolute',
    top: '-100px', left: '-100px',
    width: '500px', height: '500px',
    background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)',
    pointerEvents: 'none'
  },

  GlowRight: {
    position: 'absolute',
    bottom: '-100px', right: '-100px',
    width: '500px', height: '500px',
    background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)',
    pointerEvents: 'none'
  },

  Badge: {
    extends: 'Flex',
    flexAlign: 'center center',
    gap: 'Z',
    background: 'rgba(124,58,237,0.15)',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'rgba(124,58,237,0.4)',
    borderRadius: 'D',
    padding: 'X B',
    marginBottom: 'C',
    zIndex: '1',
    Dot: { width: '6px', height: '6px', background: 'brand', borderRadius: '50%' },
    BadgeText: { extends: 'Text', tag: 'span', text: 'Now in public beta', color: 'brandLight', fontSize: '11px', fontWeight: '600' }
  },

  Headline: {
    tag: 'h1',
    text: 'The infrastructure platform\nfor ambitious teams',
    color: 'textPrimary',
    fontSize: '56px',
    fontWeight: '800',
    lineHeight: '1.1',
    letterSpacing: '-0.03em',
    maxWidth: '700px',
    whiteSpace: 'pre-line',
    zIndex: '1',
    marginBottom: 'C'
  },

  Sub: {
    tag: 'p',
    text: 'Launchpad handles your infrastructure so you can focus on building. Deploy globally in seconds, scale automatically, and sleep well knowing your app is always up.',
    color: 'textSecondary',
    fontSize: 'B',
    lineHeight: '1.7',
    maxWidth: '560px',
    zIndex: '1',
    marginBottom: 'D'
  },

  CTAs: {
    extends: 'Flex',
    flexAlign: 'center center',
    gap: 'A',
    zIndex: '1',
    Primary: {
      tag: 'button',
      text: 'Start building for free →',
      background: 'brand',
      color: 'white',
      border: 'none',
      borderRadius: 'Z1',
      padding: 'A D',
      fontSize: 'B',
      fontWeight: '700',
      cursor: 'pointer',
      boxShadow: '0 0 32px rgba(124,58,237,0.4)',
      ':hover': { background: 'brandDark' }
    },
    Secondary: {
      tag: 'button',
      text: '▷  Watch demo',
      background: 'transparent',
      color: 'textSecondary',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'cardBorder',
      borderRadius: 'Z1',
      padding: 'A D',
      fontSize: 'B',
      fontWeight: '600',
      cursor: 'pointer',
      ':hover': { borderColor: 'textSecondary', color: 'textPrimary' }
    }
  },

  SocialProof: {
    extends: 'Flex',
    flexAlign: 'center center',
    gap: 'Z',
    marginTop: 'C',
    zIndex: '1',
    ProofText: {
      extends: 'Text', tag: 'span',
      text: '★★★★★  Trusted by 12,000+ companies worldwide',
      color: 'textMuted', fontSize: 'Z1'
    }
  }
}
