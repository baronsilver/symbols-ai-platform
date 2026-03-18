export const main = {
  extends: 'Page',
  background: 'pageBg',
  flow: 'x',
  minHeight: '100vh',

  Sidebar: {},

  Main: {
    extends: 'Flex',
    flow: 'y',
    flex: '1',
    overflow: 'hidden',

    TopBar: {},

    Content: {
      extends: 'Flex',
      flow: 'y',
      flex: '1',
      padding: 'C',
      gap: 'C',
      overflowY: 'auto',

      StatsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 'B',
        children: (el, s) => s.root.stats,
        childExtends: 'StatCard',
        childrenAs: 'state'
      },

      BottomRow: {
        extends: 'Flex',
        gap: 'C',

        ChartCard: {
          extends: 'Flex',
          flow: 'y',
          flex: '2',
          background: 'cardBg',
          borderRadius: 'A',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'cardBorder',
          padding: 'B C',
          gap: 'B',

          ChartHeader: {
            extends: 'Flex',
            flexAlign: 'center space-between',
            ChartTitle: { tag: 'h3', text: 'Revenue Overview', color: 'textPrimary', fontSize: 'B', fontWeight: '600' },
            ChartBadge: {
              tag: 'span',
              text: 'Last 6 months',
              background: 'navActive',
              color: 'brandLight',
              padding: 'X Z',
              borderRadius: 'X',
              fontSize: '11px'
            }
          },

          ChartBars: {
            extends: 'Flex',
            flexAlign: 'flex-end flex-start',
            gap: 'B',
            height: '160px',
            paddingTop: 'A',
            children: (el, s) => s.root.chartData,
            childExtends: 'ChartBar',
            childrenAs: 'state'
          }
        },

        OrdersTable: {
          flex: '3'
        }
      }
    }
  }
}

export const ChartBar = {
  extends: 'Flex',
  flow: 'y',
  flexAlign: 'flex-end center',
  flex: '1',
  gap: 'Z',

  Bar: {
    width: '100%',
    background: 'brand',
    borderRadius: 'X X 0 0',
    height: (el, s) => `${Math.round((s.revenue / 90000) * 140)}px`,
    transition: 'height 0.3s',
    ':hover': { background: 'brandLight' }
  },
  MonthLabel: {
    extends: 'Text', tag: 'span',
    text: (el, s) => s.month,
    color: 'textMuted',
    fontSize: '11px',
    textAlign: 'center'
  }
}
