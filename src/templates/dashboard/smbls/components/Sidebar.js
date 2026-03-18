export const Sidebar = {
  extends: 'Flex',
  flow: 'y',
  width: '240px',
  minHeight: '100vh',
  background: 'sidebarBg',
  borderRightWidth: '1px',
  borderRightStyle: 'solid',
  borderRightColor: 'cardBorder',
  padding: 'C Z1',
  gap: 'X',
  flexShrink: '0',

  Logo: {
    extends: 'Flex',
    flexAlign: 'center flex-start',
    gap: 'Z1',
    padding: 'Z A',
    marginBottom: 'A',
    LogoIcon: {
      extends: 'Flex',
      flexAlign: 'center center',
      width: '32px',
      height: '32px',
      background: 'brand',
      borderRadius: 'Z',
      Sym: { extends: 'Text', tag: 'span', text: '◈', color: 'white', fontSize: 'B' }
    },
    LogoText: { extends: 'Text', tag: 'span', text: 'Dashify', color: 'textPrimary', fontSize: 'B', fontWeight: '700' }
  },

  NavSection: {
    extends: 'Flex',
    flow: 'y',
    gap: 'X',
    flex: '1',
    children: (el, s) => s.root.navItems,
    childExtends: 'NavItem',
    childrenAs: 'state'
  },

  UserSection: {
    extends: 'Flex',
    flexAlign: 'center flex-start',
    gap: 'A',
    padding: 'A',
    borderRadius: 'Z1',
    marginTop: 'A',
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: 'cardBorder',
    paddingTop: 'B',
    Avatar: {
      extends: 'Flex',
      flexAlign: 'center center',
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      background: 'brand',
      flexShrink: '0',
      AvatarText: {
        extends: 'Text', tag: 'span',
        text: (el, s) => s.root.user.avatar,
        color: 'white', fontSize: 'Z1', fontWeight: '700'
      }
    },
    UserInfo: {
      extends: 'Flex', flow: 'y', gap: 'X',
      Name: { extends: 'Text', tag: 'span', text: (el, s) => s.root.user.name, color: 'textPrimary', fontSize: 'Z1', fontWeight: '600' },
      Role: { extends: 'Text', tag: 'span', text: (el, s) => s.root.user.role, color: 'textSecondary', fontSize: '11px' }
    }
  }
}

export const NavItem = {
  extends: 'Flex',
  flexAlign: 'center flex-start',
  gap: 'A',
  padding: 'Z1 A',
  borderRadius: 'Z1',
  cursor: 'pointer',
  transition: 'background 0.15s',
  background: (el, s) => s.root.activePage === s.id ? 'navActive' : 'transparent',
  ':hover': { background: (el, s) => s.root.activePage === s.id ? 'navActive' : 'navHover' },
  onClick: (e, el, s) => { s.root.activePage = s.id },

  Icon: { extends: 'Text', tag: 'span', text: (el, s) => s.icon, fontSize: 'B' },
  Label: {
    extends: 'Text', tag: 'span',
    text: (el, s) => s.label,
    color: (el, s) => s.root.activePage === s.id ? 'white' : 'textSecondary',
    fontSize: 'Z1',
    fontWeight: (el, s) => s.root.activePage === s.id ? '600' : '400'
  }
}
