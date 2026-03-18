export const FeaturesGrid = {
  extends: 'Flex',
  flow: 'y',
  padding: 'H C',
  gap: 'F',
  background: 'surfaceBg',

  Header: {
    extends: 'Flex',
    flow: 'y',
    flexAlign: 'center center',
    textAlign: 'center',
    gap: 'B',
    Label: { extends: 'Text', tag: 'span', text: 'FEATURES', color: 'brandLight', fontSize: '11px', fontWeight: '700', letterSpacing: '0.15em' },
    Title: { tag: 'h2', text: 'Everything you need to ship', color: 'textPrimary', fontSize: '36px', fontWeight: '800', letterSpacing: '-0.02em' },
    Sub: { tag: 'p', text: 'No more duct-taping dozens of tools together. Launchpad gives you the full stack in one place.', color: 'textSecondary', fontSize: 'B', maxWidth: '480px', lineHeight: '1.7' }
  },

  Grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 'B',
    children: (el, s) => s.root.features,
    childExtends: 'FeatureCard',
    childrenAs: 'state'
  }
}

export const FeatureCard = {
  extends: 'Flex',
  flow: 'y',
  gap: 'A',
  padding: 'C',
  background: 'cardBg',
  borderRadius: 'A',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'cardBorder',
  transition: 'border-color 0.2s',
  ':hover': { borderColor: 'brand' },

  IconWrap: {
    extends: 'Flex',
    flexAlign: 'center center',
    width: '44px', height: '44px',
    background: 'rgba(124,58,237,0.15)',
    borderRadius: 'A',
    Icon: { extends: 'Text', tag: 'span', text: (el, s) => s.icon, fontSize: 'C' }
  },
  Title: { tag: 'h3', text: (el, s) => s.title, color: 'textPrimary', fontSize: 'B', fontWeight: '600' },
  Desc: { tag: 'p', text: (el, s) => s.desc, color: 'textSecondary', fontSize: 'Z1', lineHeight: '1.6' }
}
