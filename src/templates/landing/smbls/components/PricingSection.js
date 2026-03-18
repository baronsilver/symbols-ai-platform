export const PricingSection = {
  extends: 'Flex',
  flow: 'y',
  padding: 'H C',
  gap: 'F',
  flexAlign: 'center center',

  Header: {
    extends: 'Flex',
    flow: 'y',
    flexAlign: 'center center',
    textAlign: 'center',
    gap: 'B',
    Label: { extends: 'Text', tag: 'span', text: 'PRICING', color: 'brandLight', fontSize: '11px', fontWeight: '700', letterSpacing: '0.15em' },
    Title: { tag: 'h2', text: 'Simple, transparent pricing', color: 'textPrimary', fontSize: '36px', fontWeight: '800', letterSpacing: '-0.02em' },
    Sub: { tag: 'p', text: 'No hidden fees. Cancel anytime. Start free, upgrade when you\'re ready.', color: 'textSecondary', fontSize: 'B', lineHeight: '1.7' }
  },

  PlansRow: {
    extends: 'Flex',
    flexAlign: 'flex-start center',
    gap: 'B',
    width: '100%',
    maxWidth: '1000px',
    children: (el, s) => s.root.plans,
    childExtends: 'PlanCard',
    childrenAs: 'state'
  }
}

export const PlanCard = {
  extends: 'Flex',
  flow: 'y',
  flex: '1',
  padding: 'C',
  background: 'planBg',
  borderRadius: 'B',
  borderWidth: '2px',
  borderStyle: 'solid',
  borderColor: (el, s) => s.popular ? 'planActiveBorder' : 'planBorder',
  position: 'relative',
  gap: 'A',

  PopularBadge: {
    if: (el, s) => s.popular,
    position: 'absolute',
    top: '-12px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'brand',
    color: 'white',
    padding: 'X A',
    borderRadius: 'D',
    fontSize: '11px',
    fontWeight: '700',
    whiteSpace: 'nowrap',
    text: 'MOST POPULAR'
  },

  PlanName: { tag: 'h3', text: (el, s) => s.name, color: 'textPrimary', fontSize: 'B1', fontWeight: '700' },
  PlanDesc: { tag: 'p', text: (el, s) => s.desc, color: 'textSecondary', fontSize: 'Z1' },

  PriceRow: {
    extends: 'Flex',
    flexAlign: 'flex-end flex-start',
    gap: 'X',
    marginTop: 'Z',
    Price: { tag: 'span', text: (el, s) => s.price, color: 'textPrimary', fontSize: '36px', fontWeight: '800', lineHeight: '1' },
    Period: { tag: 'span', text: (el, s) => s.period, color: 'textSecondary', fontSize: 'Z1', paddingBottom: 'Y' }
  },

  Divider: { height: '1px', background: 'cardBorder', margin: 'Z 0' },

  FeaturesList: {
    extends: 'Flex',
    flow: 'y',
    gap: 'Z1',
    children: (el, s) => (s.features || []).map(f => ({ text: f })),
    childExtends: 'PlanFeatureItem',
    childrenAs: 'state'
  },

  CTABtn: {
    tag: 'button',
    text: (el, s) => s.cta,
    marginTop: 'A',
    background: (el, s) => s.popular ? 'brand' : 'transparent',
    color: (el, s) => s.popular ? 'white' : 'textSecondary',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: (el, s) => s.popular ? 'brand' : 'cardBorder',
    borderRadius: 'Z1',
    padding: 'A',
    width: '100%',
    fontSize: 'Z1',
    fontWeight: '700',
    cursor: 'pointer',
    ':hover': { background: (el, s) => s.popular ? 'brandDark' : 'cardBorder' }
  }
}

export const PlanFeatureItem = {
  extends: 'Flex',
  flexAlign: 'center flex-start',
  gap: 'Z',
  Check: { extends: 'Text', tag: 'span', text: '✓', color: 'accent', fontSize: 'Z1', fontWeight: '700' },
  Label: { extends: 'Text', tag: 'span', text: (el, s) => s.text, color: 'textSecondary', fontSize: 'Z1' }
}
