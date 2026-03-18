export const main = {
  extends: 'Page',
  background: 'pageBg',
  flow: 'y',
  minHeight: '100vh',

  Navbar: {},

  HeroBanner: {},

  CategoryTabs: {},

  ProductsSection: {
    extends: 'Flex',
    flow: 'y',
    padding: 'D C',
    gap: 'C',

    SectionHeader: {
      extends: 'Flex',
      flexAlign: 'center space-between',
      Title: {
        tag: 'h2',
        text: 'Featured Products',
        fontSize: 'C',
        fontWeight: '700',
        color: 'textPrimary'
      },
      Count: {
        tag: 'span',
        text: (el, s) => `${s.root.products.length} products`,
        color: 'textSecondary',
        fontSize: 'Z1'
      }
    },

    ProductsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 'B',
      children: (el, s) => s.root.activeCategory === 'all'
        ? s.root.products
        : s.root.products.filter(p => p.category === s.root.activeCategory),
      childExtends: 'ProductCard',
      childrenAs: 'state'
    }
  },

  Footer: {}
}
