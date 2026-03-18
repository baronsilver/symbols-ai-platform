export const OrdersTable = {
  extends: 'Flex',
  flow: 'y',
  background: 'cardBg',
  borderRadius: 'A',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'cardBorder',
  overflow: 'hidden',

  TableHeader: {
    extends: 'Flex',
    flexAlign: 'center space-between',
    padding: 'B C',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: 'cardBorder',
    Title: { tag: 'h3', text: 'Recent Orders', color: 'textPrimary', fontSize: 'B', fontWeight: '600' },
    ViewAll: { tag: 'a', text: 'View all →', color: 'brandLight', fontSize: 'Z1', cursor: 'pointer' }
  },

  ColHeaders: {
    extends: 'Flex',
    flexAlign: 'center flex-start',
    padding: 'Z1 C',
    background: 'pageBg',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: 'cardBorder',
    IdCol: { extends: 'Text', tag: 'span', text: 'ORDER', color: 'textMuted', fontSize: '11px', fontWeight: '700', letterSpacing: '0.05em', flex: '1' },
    CustCol: { extends: 'Text', tag: 'span', text: 'CUSTOMER', color: 'textMuted', fontSize: '11px', fontWeight: '700', letterSpacing: '0.05em', flex: '2' },
    ProdCol: { extends: 'Text', tag: 'span', text: 'PRODUCT', color: 'textMuted', fontSize: '11px', fontWeight: '700', letterSpacing: '0.05em', flex: '2' },
    AmtCol: { extends: 'Text', tag: 'span', text: 'AMOUNT', color: 'textMuted', fontSize: '11px', fontWeight: '700', letterSpacing: '0.05em', flex: '1' },
    StatusCol: { extends: 'Text', tag: 'span', text: 'STATUS', color: 'textMuted', fontSize: '11px', fontWeight: '700', letterSpacing: '0.05em', flex: '1' },
    DateCol: { extends: 'Text', tag: 'span', text: 'DATE', color: 'textMuted', fontSize: '11px', fontWeight: '700', letterSpacing: '0.05em', flex: '1' }
  },

  Rows: {
    extends: 'Flex',
    flow: 'y',
    children: (el, s) => s.root.recentOrders,
    childExtends: 'OrderRow',
    childrenAs: 'state'
  }
}

export const OrderRow = {
  extends: 'Flex',
  flexAlign: 'center flex-start',
  padding: 'A C',
  borderBottomWidth: '1px',
  borderBottomStyle: 'solid',
  borderBottomColor: 'cardBorder',
  ':hover': { background: 'navHover' },
  transition: 'background 0.1s',

  IdCol: { extends: 'Text', tag: 'span', text: (el, s) => s.id, color: 'brandLight', fontSize: 'Z1', fontWeight: '600', flex: '1' },
  CustCol: { extends: 'Text', tag: 'span', text: (el, s) => s.customer, color: 'textPrimary', fontSize: 'Z1', flex: '2' },
  ProdCol: { extends: 'Text', tag: 'span', text: (el, s) => s.product, color: 'textSecondary', fontSize: 'Z1', flex: '2' },
  AmtCol: { extends: 'Text', tag: 'span', text: (el, s) => s.amount, color: 'textPrimary', fontSize: 'Z1', fontWeight: '600', flex: '1' },
  StatusCol: {
    flex: '1',
    StatusBadge: {
      display: 'inline-flex',
      padding: 'X Z',
      borderRadius: 'X',
      background: (el, s) => s.status === 'completed' ? 'statusComplete' : s.status === 'pending' ? 'statusPending' : 'statusFailed',
      color: (el, s) => s.status === 'completed' ? 'statusCompleteText' : s.status === 'pending' ? 'statusPendingText' : 'statusFailedText',
      fontSize: '11px',
      fontWeight: '700',
      text: (el, s) => s.status
    }
  },
  DateCol: { extends: 'Text', tag: 'span', text: (el, s) => s.date, color: 'textMuted', fontSize: 'Z1', flex: '1' }
}
