export const TestimonialsSection = {
  extends: 'Flex',
  flow: 'y',
  padding: 'H C',
  gap: 'F',
  background: 'surfaceBg',
  flexAlign: 'center center',

  Header: {
    extends: 'Flex',
    flow: 'y',
    flexAlign: 'center center',
    textAlign: 'center',
    gap: 'B',
    Label: { extends: 'Text', tag: 'span', text: 'TESTIMONIALS', color: 'brandLight', fontSize: '11px', fontWeight: '700', letterSpacing: '0.15em' },
    Title: { tag: 'h2', text: 'Loved by engineering teams', color: 'textPrimary', fontSize: '36px', fontWeight: '800', letterSpacing: '-0.02em' }
  },

  Grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 'B',
    width: '100%',
    maxWidth: '1000px',
    children: (el, s) => s.root.testimonials,
    childExtends: 'TestimonialCard',
    childrenAs: 'state'
  }
}

export const TestimonialCard = {
  extends: 'Flex',
  flow: 'y',
  gap: 'B',
  padding: 'C',
  background: 'cardBg',
  borderRadius: 'A',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'cardBorder',

  Stars: { extends: 'Text', tag: 'span', text: '★★★★★', color: 'brand', fontSize: 'Z1' },
  Quote: { tag: 'p', text: (el, s) => `"${s.text}"`, color: 'textSecondary', fontSize: 'Z1', lineHeight: '1.7', fontStyle: 'italic' },

  Author: {
    extends: 'Flex',
    flexAlign: 'center flex-start',
    gap: 'A',
    Avatar: {
      extends: 'Flex',
      flexAlign: 'center center',
      width: '40px', height: '40px',
      borderRadius: '50%',
      background: 'brand',
      flexShrink: '0',
      Initials: { extends: 'Text', tag: 'span', text: (el, s) => s.avatar, color: 'white', fontSize: 'Z1', fontWeight: '700' }
    },
    Info: {
      extends: 'Flex', flow: 'y', gap: 'X',
      Name: { extends: 'Text', tag: 'span', text: (el, s) => s.name, color: 'textPrimary', fontSize: 'Z1', fontWeight: '600' },
      Role: { extends: 'Text', tag: 'span', text: (el, s) => s.role, color: 'textMuted', fontSize: '11px' }
    }
  }
}
