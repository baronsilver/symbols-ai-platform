export const CategoryTabs = {
  extends: 'Flex',
  flexAlign: 'center flex-start',
  gap: 'Z',
  padding: 'A C',
  overflowX: 'auto',
  background: 'white',
  borderBottomWidth: '1px',
  borderBottomStyle: 'solid',
  borderBottomColor: 'divider',

  children: (el, s) => s.root.categories,
  childExtends: 'CategoryTab',
  childrenAs: 'state'
}

export const CategoryTab = {
  tag: 'button',
  padding: 'Z B',
  borderRadius: 'B',
  border: 'none',
  cursor: 'pointer',
  fontSize: 'Z1',
  fontWeight: '600',
  transition: 'all 0.15s',
  background: (el, s) => s.root.activeCategory === s.id ? 'brand' : 'gray100',
  color: (el, s) => s.root.activeCategory === s.id ? 'white' : 'gray600',
  text: (el, s) => s.label,
  ':hover': { background: (el, s) => s.root.activeCategory === s.id ? 'brand' : 'gray200' },
  onClick: (e, el, s) => { s.root.activeCategory = s.id }
}
