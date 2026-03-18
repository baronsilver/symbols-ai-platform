export const TopBar = {
  extends: 'Flex',
  flexAlign: 'center space-between',
  padding: 'A C',
  background: 'headerBg',
  borderBottomWidth: '1px',
  borderBottomStyle: 'solid',
  borderBottomColor: 'cardBorder',

  PageTitle: {
    extends: 'Flex',
    flow: 'y',
    gap: 'X',
    Title: {
      tag: 'h1',
      text: (el, s) => {
        const nav = s.root.navItems?.find(n => n.id === s.root.activePage)
        return nav?.label || 'Overview'
      },
      color: 'textPrimary',
      fontSize: 'C',
      fontWeight: '700'
    },
    Breadcrumb: {
      tag: 'span',
      text: (el, s) => `Dashboard / ${s.root.navItems?.find(n => n.id === s.root.activePage)?.label || 'Overview'}`,
      color: 'textMuted',
      fontSize: '11px'
    }
  },

  Actions: {
    extends: 'Flex',
    flexAlign: 'center center',
    gap: 'A',

    SearchBtn: {
      extends: 'Flex',
      flexAlign: 'center center',
      gap: 'Z',
      background: 'sidebarBg',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'cardBorder',
      borderRadius: 'Z1',
      padding: 'Z A',
      cursor: 'pointer',
      SearchIco: { extends: 'Text', tag: 'span', text: '⌕', color: 'textSecondary', fontSize: 'B' },
      SearchLabel: { extends: 'Text', tag: 'span', text: 'Search...', color: 'textMuted', fontSize: 'Z1' }
    },

    NotifBtn: {
      extends: 'Flex',
      flexAlign: 'center center',
      position: 'relative',
      width: '36px', height: '36px',
      background: 'sidebarBg',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'cardBorder',
      borderRadius: 'Z1',
      cursor: 'pointer',
      Ico: { extends: 'Text', tag: 'span', text: '🔔', fontSize: 'A1' },
      Dot: {
        position: 'absolute',
        top: '6px', right: '6px',
        width: '8px', height: '8px',
        background: 'brand',
        borderRadius: '50%'
      }
    }
  }
}
