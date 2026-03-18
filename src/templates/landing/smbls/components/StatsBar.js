export const StatsBar = {
  extends: 'Flex',
  flexAlign: 'center center',
  padding: 'E C',
  gap: 'G',
  borderTopWidth: '1px',
  borderTopStyle: 'solid',
  borderTopColor: 'cardBorder',
  borderBottomWidth: '1px',
  borderBottomStyle: 'solid',
  borderBottomColor: 'cardBorder',

  children: (el, s) => s.root.stats,
  childExtends: 'StatItem',
  childrenAs: 'state'
}

export const StatItem = {
  extends: 'Flex',
  flow: 'y',
  flexAlign: 'center center',
  textAlign: 'center',
  gap: 'X',
  Value: { tag: 'span', text: (el, s) => s.value, color: 'textPrimary', fontSize: '32px', fontWeight: '800', letterSpacing: '-0.02em' },
  Label: { tag: 'span', text: (el, s) => s.label, color: 'textSecondary', fontSize: 'Z1' }
}
