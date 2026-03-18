export const StatCard = {
  extends: 'Flex',
  flow: 'y',
  background: 'cardBg',
  borderRadius: 'A',
  padding: 'B',
  gap: 'A',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'cardBorder',

  Top: {
    extends: 'Flex',
    flexAlign: 'center space-between',
    Label: {
      extends: 'Text', tag: 'span',
      text: (el, s) => s.label,
      color: 'textSecondary', fontSize: 'Z1'
    },
    IconWrap: {
      extends: 'Flex',
      flexAlign: 'center center',
      width: '36px', height: '36px',
      background: 'navActive',
      borderRadius: 'Z1',
      Icon: { extends: 'Text', tag: 'span', text: (el, s) => s.icon, fontSize: 'B1' }
    }
  },

  Value: {
    extends: 'Text', tag: 'span',
    text: (el, s) => s.value,
    color: 'textPrimary', fontSize: '28px', fontWeight: '700', lineHeight: '1'
  },

  Change: {
    extends: 'Flex',
    flexAlign: 'center flex-start',
    gap: 'X',
    Arrow: {
      extends: 'Text', tag: 'span',
      text: (el, s) => s.up ? '↑' : '↓',
      color: (el, s) => s.up ? 'success' : 'error',
      fontSize: 'Z1', fontWeight: '700'
    },
    ChangeVal: {
      extends: 'Text', tag: 'span',
      text: (el, s) => `${s.change} vs last month`,
      color: 'textSecondary', fontSize: '11px'
    }
  }
}
