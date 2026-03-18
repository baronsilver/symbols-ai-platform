export const AboutSection = {
  extends: 'Flex',
  padding: 'H C',
  gap: 'G',
  borderTopWidth: '1px',
  borderTopStyle: 'solid',
  borderTopColor: 'divider',

  Left: {
    extends: 'Flex',
    flow: 'y',
    gap: 'C',
    flex: '1',
    Label: { extends: 'Text', tag: 'span', text: 'ABOUT', color: 'textMuted', fontSize: '11px', fontWeight: '700', letterSpacing: '0.15em' },
    Bio1: { tag: 'p', text: 'I\'m Alex — a product designer based in Berlin with 6 years of experience building interfaces for SaaS products, consumer apps, and brand identities.', color: 'textPrimary', fontSize: 'B1', lineHeight: '1.7', fontWeight: '400' },
    Bio2: { tag: 'p', text: 'Previously at Figma, Notion, and various early-stage startups. I work at the intersection of design systems, motion, and product strategy.', color: 'textSecondary', fontSize: 'B', lineHeight: '1.7' },

    SkillsWrap: {
      extends: 'Flex',
      flow: 'y',
      gap: 'A',
      marginTop: 'B',
      SkillsLabel: { extends: 'Text', tag: 'span', text: 'SKILLS', color: 'textMuted', fontSize: '11px', fontWeight: '700', letterSpacing: '0.15em' },
      SkillTags: {
        extends: 'Flex',
        flexWrap: 'wrap',
        gap: 'Z',
        children: (el, s) => s.root.skills.map(sk => ({ label: sk })),
        childExtends: 'SkillTag',
        childrenAs: 'state'
      }
    }
  },

  Right: {
    extends: 'Flex',
    flow: 'y',
    gap: 'C',
    width: '280px',
    flexShrink: '0',
    Label: { extends: 'Text', tag: 'span', text: 'FIND ME ON', color: 'textMuted', fontSize: '11px', fontWeight: '700', letterSpacing: '0.15em' },
    SocialLinks: {
      extends: 'Flex',
      flow: 'y',
      gap: 'A',
      children: (el, s) => s.root.socials,
      childExtends: 'SocialLink',
      childrenAs: 'state'
    }
  }
}

export const SkillTag = {
  tag: 'span',
  text: (el, s) => s.label,
  background: 'tagBg',
  color: 'tagText',
  padding: 'Y Z',
  borderRadius: 'X',
  fontSize: '11px',
  fontWeight: '500',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'cardBorder'
}

export const SocialLink = {
  extends: 'Flex',
  flexAlign: 'center space-between',
  padding: 'A 0',
  borderBottomWidth: '1px',
  borderBottomStyle: 'solid',
  borderBottomColor: 'divider',
  cursor: 'pointer',
  ':hover': { opacity: '0.7' },

  Platform: { extends: 'Text', tag: 'span', text: (el, s) => s.label, color: 'textSecondary', fontSize: 'Z1' },
  Handle: {
    extends: 'Flex',
    flexAlign: 'center center',
    gap: 'X',
    HandleText: { extends: 'Text', tag: 'span', text: (el, s) => s.handle, color: 'textPrimary', fontSize: 'Z1', fontWeight: '500' },
    Arr: { extends: 'Text', tag: 'span', text: '↗', color: 'accent', fontSize: 'Z1' }
  }
}
