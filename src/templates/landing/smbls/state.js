export default {
  activePlan: 'pro',
  features: [
    { icon: '⚡', title: 'Lightning Fast', desc: 'Deploy in seconds with our global edge network. Zero cold starts, sub-10ms latency worldwide.' },
    { icon: '🔒', title: 'Enterprise Security', desc: 'SOC2 Type II certified. End-to-end encryption, SSO, audit logs, and role-based access control.' },
    { icon: '📊', title: 'Advanced Analytics', desc: 'Real-time dashboards, custom funnels, and AI-powered insights to grow your business faster.' },
    { icon: '🤝', title: 'Team Collaboration', desc: 'Built for teams. Share workspaces, leave comments, assign tasks, and ship together.' },
    { icon: '🔗', title: '200+ Integrations', desc: 'Connect your existing tools. Slack, GitHub, Jira, Salesforce, and hundreds more.' },
    { icon: '🌍', title: 'Global Scale', desc: 'Auto-scaling infrastructure that handles millions of users without breaking a sweat.' }
  ],
  plans: [
    { id: 'starter', name: 'Starter', price: '$0', period: '/month', desc: 'Perfect for side projects', features: ['5 projects', '10GB storage', 'Community support', 'Basic analytics'], cta: 'Start free' },
    { id: 'pro', name: 'Pro', price: '$49', period: '/month', desc: 'For growing teams', features: ['Unlimited projects', '100GB storage', 'Priority support', 'Advanced analytics', 'Custom domains', 'SSO'], cta: 'Start free trial', popular: true },
    { id: 'enterprise', name: 'Enterprise', price: 'Custom', period: '', desc: 'For large organizations', features: ['Everything in Pro', 'Dedicated infrastructure', 'SLA guarantee', '24/7 support', 'Custom contracts', 'Audit logs'], cta: 'Contact sales' }
  ],
  testimonials: [
    { name: 'Sarah Chen', role: 'CTO at Vercel', text: 'Switched our entire infrastructure in a week. The DX is unmatched — our team ships 3x faster now.', avatar: 'SC' },
    { name: 'Marcus Williams', role: 'Founder at Linear', text: 'The best developer tool we\'ve adopted this year. Pricing is fair, support is incredible.', avatar: 'MW' },
    { name: 'Priya Patel', role: 'VP Eng at Stripe', text: 'Handles our 50M req/day without a hiccup. Migrated from AWS and never looked back.', avatar: 'PP' }
  ],
  stats: [
    { value: '50M+', label: 'Requests per day' },
    { value: '99.99%', label: 'Uptime SLA' },
    { value: '180+', label: 'Countries' },
    { value: '12k+', label: 'Companies' }
  ]
}
