export const HeroSection = {
  extends: 'Flex',
  flow: 'y',
  padding: 'H C',
  gap: 'C',
  borderBottomWidth: '1px',
  borderBottomStyle: 'solid',
  borderBottomColor: 'divider',

  Eyebrow: {
    extends: 'Flex',
    flexAlign: 'center flex-start',
    gap: 'A',
    AvailDot: { width: '8px', height: '8px', borderRadius: '50%', background: 'accent', flexShrink: '0' },
    AvailText: { extends: 'Text', tag: 'span', text: 'Available for projects — 2025', color: 'textSecondary', fontSize: 'Z1' }
  },

  Headline: {
    tag: 'h1',
    text: 'Product designer\ncrafting digital\nexperiences.',
    color: 'textPrimary',
    fontSize: '72px',
    fontWeight: '700',
    lineHeight: '1.0',
    letterSpacing: '-0.04em',
    whiteSpace: 'pre-line',
    maxWidth: '900px'
  },

  BottomRow: {
    extends: 'Flex',
    flexAlign: 'flex-end space-between',
    marginTop: 'B',

    Bio: {
      tag: 'p',
      text: '6 years crafting interfaces for startups and Fortune 500s. I turn complex problems into elegant, human-centered design.',
      color: 'textSecondary',
      fontSize: 'B',
      lineHeight: '1.7',
      maxWidth: '420px'
    },

    ScrollHint: {
      extends: 'Flex',
      flow: 'y',
      flexAlign: 'center center',
      gap: 'Z',
      Arr: { extends: 'Text', tag: 'span', text: '↓', color: 'textMuted', fontSize: 'C' },
      Lbl: { extends: 'Text', tag: 'span', text: 'scroll', color: 'textMuted', fontSize: '11px', letterSpacing: '0.1em' }
    }
  }
}
