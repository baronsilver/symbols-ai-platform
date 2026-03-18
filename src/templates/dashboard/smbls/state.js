export default {
  activePage: 'overview',
  sidebarCollapsed: false,
  stats: [
    { label: 'Total Revenue', value: '$84,325', change: '+12.5%', up: true, icon: '💰' },
    { label: 'Active Users', value: '24,521', change: '+8.2%', up: true, icon: '👥' },
    { label: 'New Orders', value: '1,893', change: '+3.1%', up: true, icon: '📦' },
    { label: 'Churn Rate', value: '2.4%', change: '-0.8%', up: false, icon: '📉' }
  ],
  recentOrders: [
    { id: '#ORD-001', customer: 'Alice Johnson', product: 'Pro Plan', amount: '$299', status: 'completed', date: 'Mar 8' },
    { id: '#ORD-002', customer: 'Bob Smith', product: 'Starter Plan', amount: '$49', status: 'pending', date: 'Mar 8' },
    { id: '#ORD-003', customer: 'Carol White', product: 'Enterprise Plan', amount: '$999', status: 'completed', date: 'Mar 7' },
    { id: '#ORD-004', customer: 'Dan Brown', product: 'Pro Plan', amount: '$299', status: 'failed', date: 'Mar 7' },
    { id: '#ORD-005', customer: 'Eve Davis', product: 'Pro Plan', amount: '$299', status: 'completed', date: 'Mar 6' },
    { id: '#ORD-006', customer: 'Frank Miller', product: 'Starter Plan', amount: '$49', status: 'pending', date: 'Mar 6' }
  ],
  chartData: [
    { month: 'Oct', revenue: 42000, users: 18000 },
    { month: 'Nov', revenue: 55000, users: 20500 },
    { month: 'Dec', revenue: 61000, users: 21000 },
    { month: 'Jan', revenue: 53000, users: 22000 },
    { month: 'Feb', revenue: 74000, users: 23400 },
    { month: 'Mar', revenue: 84325, users: 24521 }
  ],
  navItems: [
    { id: 'overview', label: 'Overview', icon: '◈' },
    { id: 'analytics', label: 'Analytics', icon: '📊' },
    { id: 'orders', label: 'Orders', icon: '📦' },
    { id: 'customers', label: 'Customers', icon: '👥' },
    { id: 'products', label: 'Products', icon: '🏷️' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ],
  user: { name: 'Sarah Chen', role: 'Admin', avatar: 'SC' }
}
