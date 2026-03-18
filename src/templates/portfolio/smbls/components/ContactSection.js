export const ContactSection = {
  extends: 'Flex',
  flow: 'y',
  flexAlign: 'center center',
  textAlign: 'center',
  padding: 'H C',
  gap: 'C',
  background: 'surfaceBg',
  borderTopWidth: '1px',
  borderTopStyle: 'solid',
  borderTopColor: 'divider',

  Label: { extends: 'Text', tag: 'span', text: 'GET IN TOUCH', color: 'textMuted', fontSize: '11px', fontWeight: '700', letterSpacing: '0.15em' },
  Headline: { tag: 'h2', text: 'Let\'s make something\ngreat together.', color: 'textPrimary', fontSize: '48px', fontWeight: '700', lineHeight: '1.1', letterSpacing: '-0.03em', whiteSpace: 'pre-line' },
  Sub: { tag: 'p', text: 'Open for freelance work, full-time roles, and interesting collaborations.', color: 'textSecondary', fontSize: 'B', maxWidth: '400px', lineHeight: '1.7' },

  EmailBtn: {
    tag: 'a',
    text: 'hello@alex.design',
    color: 'accent',
    fontSize: 'C',
    fontWeight: '600',
    cursor: 'pointer',
    borderBottomWidth: '2px',
    borderBottomStyle: 'solid',
    borderBottomColor: 'accent',
    paddingBottom: 'X',
    ':hover': { color: 'accentDark', borderBottomColor: 'accentDark' }
  },

  Footer: {
    extends: 'Flex',
    flexAlign: 'center space-between',
    width: '100%',
    maxWidth: '600px',
    paddingTop: 'C',
    marginTop: 'D',
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: 'divider',
    Copy: { extends: 'Text', tag: 'span', text: '© 2025 Alex Designer', color: 'textMuted', fontSize: '11px' },
    BackTop: {
      tag: 'button', text: '↑ Back to top',
      background: 'transparent', color: 'textMuted',
      border: 'none', fontSize: '11px', cursor: 'pointer',
      ':hover': { color: 'textPrimary' }
    }
  }
}
