export interface Template {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  tags: string[];
  previewImage: string;
  accentColor: string;
  bgColor: string;
  prompt: string;
}

export const TEMPLATES: Template[] = [
  {
    id: 'ecommerce',
    name: 'E-Commerce Store',
    tagline: 'Amazon-style shopping experience',
    description: 'Professional e-commerce store with sticky navbar, search with filtering, category tabs, product grid with ratings, slide-in cart modal, and full interactivity.',
    category: 'Commerce',
    tags: ['Shopping', 'Products', 'Cart', 'Dark'],
    previewImage: '/templates/ecommerce.svg',
    accentColor: '#6366f1',
    bgColor: '#0f172a',
    prompt: `Create a complete Symbols project for a professional Amazon-style e-commerce store with:

**NAVBAR (sticky, dark navy #131921):**
- Logo section: brand name with accent color suffix (e.g., "store.clone")
- Deliver to section: location icon + "Deliver to" label + "United States" value
- Search bar: category dropdown (gray bg) + wide input + orange search button with magnifying glass icon
- Right section: language selector (flag emoji + "EN"), Account & Lists dropdown, Returns & Orders, Cart icon with orange badge showing count

**SUB-NAVIGATION (dark navy lighter shade #232f3e):**
- Hamburger menu + "All" button
- Quick links: Today's Deals, Customer Service, Registry, Gift Cards, Sell
- Highlighted deal text in orange

**HERO BANNER:**
- Top announcement bar with sign-in prompt
- Gradient hero section with headline "Welcome to your" + bold "Holiday Deals HQ" + subtext + yellow "Shop deals" CTA button
- 4 category cards overlapping hero: Gaming accessories, Shop for your home, New arrivals in Toys, Deals in Fashion - each with image, title, "See more" link, and onClick to filter products

**CATEGORY TABS (dark bar):**
- "Shop by Category:" label in orange
- Tabs: All, Electronics, Books, Home & Kitchen, Fashion, Sports, Toys, Grocery
- Active tab has orange bottom border and orange text

**PRODUCT GRID (4 columns, light gray bg #eaeded):**
- ProductCard: white bg, image container with badge overlay (Best Seller/Sale/Deal/New/Popular), title (13px, 2-line clamp), star rating row (★★★★★ in orange + review count as link), Amazon-style price ($ superscript + main price + cents superscript + strikethrough original), "FREE delivery by Tomorrow" text, yellow rounded "Add to Cart" button

**CART MODAL (slide-in from right):**
- Dark header with "Shopping Cart" title and X close button
- Overlay backdrop that closes cart on click
- Empty state with cart emoji and "Your cart is empty" message
- Item count and "Clear cart" link when items exist
- Footer with subtotal calculation and yellow "Proceed to checkout" button

**FOOTER:**
- "Back to top" bar (clickable, scrolls to top)
- 4-column links: Get to Know Us, Make Money with Us, Payment Products, Let Us Help You
- Bottom bar with logo and copyright

**STATE:**
- cartCount: 0
- cartItems: [] (array of {title, price, image, quantity})
- showCart: false
- activeCategory: 'All'
- searchQuery: ''
- categories: ['All', 'Electronics', 'Books', 'Home & Kitchen', 'Fashion', 'Sports', 'Toys', 'Grocery']
- products: 8 items with id, title, price, originalPrice, rating, reviews, category, badge, image (use working Unsplash URLs like https://images.unsplash.com/photo-XXXXX?w=300&h=300&fit=crop)

**DESIGN SYSTEM (Amazon palette):**
- amazonNavy: #131921, amazonNavyLight: #232f3e, amazonOrange: #ff9900
- pageBg: #eaeded, cardBg: #ffffff
- textPrimary: #0f1111, textLink: #007185, textWhite: #ffffff
- btnYellow: #ffd814, btnYellowHover: #f7ca00
- dealRed: #cc0c39, starYellow: #ffa41c

**CRITICAL INTERACTIVITY:**
1. **Add to Cart**: \`onClick: (e, el, s) => { e.stopPropagation(); var items = s.root.cartItems.slice(); items.push({title, price, image, quantity: 1}); s.root.update({ cartItems: items, cartCount: s.root.cartCount + 1 }) }\`
2. **Cart Button**: \`onClick: (e, el, s) => { s.root.update({ showCart: !s.root.showCart }) }\`
3. **Category Tabs**: \`onClick: (e, el, s) => { s.root.update({ activeCategory: 'Electronics' }) }\`
4. **Product Filtering**: \`display: (el, s) => { var catMatch = s.root.activeCategory === 'All' || s.root.activeCategory === 'Electronics'; var searchMatch = !s.root.searchQuery || 'product title'.toLowerCase().includes(s.root.searchQuery.toLowerCase()); return catMatch && searchMatch ? 'flex' : 'none' }\`
5. **Search Input**: \`value: (el, s) => s.root.searchQuery, onInput: (e, el, s) => { s.root.update({ searchQuery: e.target.value }) }\`
6. **Logo Click**: \`onClick: (e, el, s) => { s.root.update({ activeCategory: 'All', searchQuery: '' }); window.scrollTo({ top: 0, behavior: 'smooth' }) }\`
7. **Hero Cards**: Each card onClick filters to its category
8. **NEVER use direct assignment** — always use \`s.root.update({ key: value })\`

**CRITICAL - config.js MUST have:**
\`\`\`js
export default { useReset: true, globalTheme: 'dark' }
\`\`\`

**CRITICAL - main.js MUST use actual components (NOT a default template):**
\`\`\`js
export const main = {
  extends: 'Flex',
  flexDirection: 'column',
  minHeight: '100vh',
  background: 'pageBg',
  Navbar: {},
  SubNav: {},
  HeroBanner: {},
  CategoryTabs: {},
  ProductGrid: {},
  CartModal: {},
  Footer: {}
}
\`\`\`

**FILES TO GENERATE:**
smbls/state.js, smbls/config.js (with globalTheme: 'dark'), smbls/designSystem/COLOR.js, smbls/designSystem/SPACING.js, smbls/designSystem/FONT.js, smbls/designSystem/TYPOGRAPHY.js, smbls/designSystem/THEME.js, smbls/designSystem/index.js, smbls/components/Navbar.js, smbls/components/SubNav.js, smbls/components/HeroBanner.js, smbls/components/CategoryTab.js, smbls/components/CategoryTabs.js, smbls/components/StarRating.js, smbls/components/ProductCard.js, smbls/components/ProductGrid.js, smbls/components/CartModal.js, smbls/components/Footer.js, smbls/components/index.js, smbls/pages/main.js (MUST use actual components), smbls/pages/index.js, smbls/index.js`,
  },
  {
    id: 'dashboard',
    name: 'Admin Dashboard',
    tagline: 'Analytics & data management panel',
    description: 'Professional dark admin panel with collapsible sidebar, stats cards, revenue bar chart, and a full orders data table with status badges.',
    category: 'Productivity',
    tags: ['Analytics', 'Charts', 'Tables', 'Dark'],
    previewImage: '/templates/dashboard.svg',
    accentColor: '#6366f1',
    bgColor: '#0f172a',
    prompt: `Create a complete Symbols project for a professional admin dashboard with:

**SIDEBAR (fixed left, 260px, #0f172a):**
- Logo: icon + "Dashboard" text
- Navigation sections with labels: MAIN (Overview, Analytics), MANAGEMENT (Orders, Customers, Products, Inventory), SETTINGS (Settings, Help)
- Each NavItem: icon (SVG) + label + optional badge count for notifications
- Active item: indigo bg (#6366f1), white text, left border accent
- User profile at bottom: avatar circle with initials, name, role, logout icon

**TOP BAR (sticky, #1e293b):**
- Left: page title + breadcrumb (Dashboard / Overview)
- Right: search input with icon, notification bell with red dot badge showing count, user avatar dropdown

**STATS ROW (4 cards):**
- Total Revenue: dollar icon, "$48,352", "+12.5% from last month" in green
- Active Users: users icon, "2,420", "+8.2%" in green  
- New Orders: shopping bag icon, "384", "-3.1%" in red
- Conversion Rate: chart icon, "3.24%", "+1.2%" in green
- Each card: dark bg (#1e293b), white value (28px bold), muted label, colored change indicator

**REVENUE CHART CARD:**
- Header: "Revenue Overview" title + period dropdown (Last 7 days/30 days/12 months)
- Bar chart: 7 bars for days of week, heights from chartData array, indigo color, hover shows tooltip
- Legend: "This week" vs "Last week" with colored dots

**RECENT ORDERS TABLE:**
- Header: "Recent Orders" + "View All" link
- Columns: Order ID (#ORD-001), Customer (avatar + name), Product, Amount ($), Status badge, Date
- Status badges: Completed (green), Processing (yellow), Pending (blue), Cancelled (red)
- 8 rows of realistic order data
- Hover row highlight

**STATE:**
- activePage: 'Overview'
- stats: { revenue: 48352, users: 2420, orders: 384, conversion: 3.24, revenueChange: 12.5, usersChange: 8.2, ordersChange: -3.1, conversionChange: 1.2 }
- chartData: [{day: 'Mon', value: 4200}, {day: 'Tue', value: 3800}, ...] (7 days)
- recentOrders: [{id: 'ORD-001', customer: 'John Smith', avatar: 'JS', product: 'MacBook Pro', amount: 1299, status: 'Completed', date: '2024-01-15'}, ...] (8 orders)
- notifications: [{id: 1, text: 'New order received', time: '5m ago', read: false}, ...] (5 items)
- showNotifications: false

**DESIGN SYSTEM:**
- pageBg: #0f172a, cardBg: #1e293b, sidebarBg: #0f172a
- accent: #6366f1, accentHover: #4f46e5
- success: #22c55e, warning: #eab308, error: #ef4444, info: #3b82f6
- textPrimary: #f8fafc, textSecondary: #94a3b8, textMuted: #64748b
- border: #334155

**CRITICAL INTERACTIVITY:**
1. **Sidebar Nav**: \`onClick: (e, el, s) => { s.root.update({ activePage: 'Analytics' }) }\`, active style: \`background: (el, s) => s.root.activePage === 'Overview' ? 'accent' : 'transparent'\`
2. **Notification Bell**: \`onClick: (e, el, s) => { s.root.update({ showNotifications: !s.root.showNotifications }) }\`, badge: \`text: (el, s) => s.root.notifications.filter(n => !n.read).length\`
3. **Chart Bars**: \`height: (el, s) => (s.root.chartData[0].value / 5000 * 100) + '%'\`, hover tooltip
4. **Status Badges**: \`background: (el, s) => order.status === 'Completed' ? 'success' : order.status === 'Processing' ? 'warning' : order.status === 'Pending' ? 'info' : 'error'\`
5. **Period Dropdown**: \`onClick: (e, el, s) => { s.root.update({ chartPeriod: '30days' }) }\`
6. **NEVER use direct assignment** — always use \`s.root.update({ key: value })\`

**CRITICAL - config.js MUST have:**
\`\`\`js
export default { useReset: true, globalTheme: 'dark' }
\`\`\`

**CRITICAL - main.js MUST use actual components (NOT a default template):**
\`\`\`js
export const main = {
  extends: 'Flex',
  minHeight: '100vh',
  background: 'pageBg',
  Sidebar: {},
  MainArea: {
    extends: 'Flex',
    flexDirection: 'column',
    flex: '1',
    marginLeft: '260px',
    TopBar: {},
    Content: {
      extends: 'Flex',
      flexDirection: 'column',
      padding: 'B',
      gap: 'B',
      StatsRow: { extends: 'Flex', gap: 'A', StatCard1: { extends: 'StatCard' }, StatCard2: { extends: 'StatCard' }, StatCard3: { extends: 'StatCard' }, StatCard4: { extends: 'StatCard' } },
      RevenueChart: {},
      OrdersTable: {}
    }
  }
}
\`\`\`

**FILES TO GENERATE:**
smbls/state.js, smbls/config.js (with globalTheme: 'dark'), smbls/designSystem/COLOR.js, smbls/designSystem/SPACING.js, smbls/designSystem/index.js, smbls/components/Sidebar.js, smbls/components/NavItem.js, smbls/components/TopBar.js, smbls/components/StatCard.js, smbls/components/RevenueChart.js, smbls/components/OrdersTable.js, smbls/components/StatusBadge.js, smbls/components/NotificationDropdown.js, smbls/components/index.js, smbls/pages/main.js (MUST use actual components), smbls/pages/index.js, smbls/index.js`,
  },
  {
    id: 'landing',
    name: 'SaaS Landing Page',
    tagline: 'Modern product marketing site',
    description: 'Dark glassmorphic landing page with animated hero, feature grid, social proof stats, testimonials carousel, and a 3-tier pricing section.',
    category: 'Marketing',
    tags: ['Landing', 'SaaS', 'Pricing', 'Dark'],
    previewImage: '/templates/landing.svg',
    accentColor: '#7c3aed',
    bgColor: '#030712',
    prompt: `Create a complete Symbols project for a stunning SaaS landing page with:

**NAVBAR (sticky, glassmorphic blur, border-bottom):**
- Logo: gradient icon + "Acme" brand name
- Nav links: Features, Pricing, Docs, Blog (hover underline effect)
- Right: "Sign in" text link + "Get started" purple filled button with arrow icon
- Mobile: hamburger menu icon

**HERO SECTION (centered, gradient mesh bg):**
- Announcement pill: purple bg, "✨ New in public beta" + arrow icon
- Headline: "Build faster with" + gradient text "AI-powered tools" (56px, -0.02em tracking)
- Subtitle: "The modern platform for developers..." (18px, muted color, max-width 600px)
- CTA row: "Start for free" purple button + "Watch demo" outlined button with play icon
- Social proof: 5 star icons + "Loved by 10,000+ developers" + avatar stack (5 overlapping circles)
- Background: radial gradient glows (purple top-left, cyan bottom-right)

**STATS BAR (dark card, flex row):**
- 4 stats with large value + label: "50M+" requests/day, "99.99%" uptime, "180+" countries, "12k+" companies
- Dividers between stats

**FEATURES GRID (3x2):**
- Section title: "Everything you need" + subtitle
- 6 FeatureCards: icon in colored circle, title (18px bold), description (14px muted)
- Features: Lightning Fast, Secure by Default, Auto Scaling, Real-time Analytics, Team Collaboration, 24/7 Support
- Card: dark bg (#111827), border, hover border-purple transition

**TESTIMONIALS (3 columns):**
- Section title: "Loved by developers"
- TestimonialCard: 5 stars, quote text (italic), author row (avatar initials circle + name + role/company)
- 3 realistic testimonials from CTOs, Lead Devs, Founders

**PRICING (3 columns):**
- Section title: "Simple, transparent pricing"
- Plans: Starter ($0/mo), Pro ($49/mo, "Most Popular" badge), Enterprise (Custom)
- Each PlanCard: name, price, description, feature list with checkmark icons (5-7 features), CTA button
- Pro card: purple border, slightly elevated, badge ribbon
- CTA: "Get started" for free/pro, "Contact sales" for enterprise

**FOOTER:**
- 4 columns: Product (Features, Pricing, Changelog), Resources (Docs, API, Status), Company (About, Blog, Careers), Legal (Privacy, Terms)
- Bottom: logo + copyright + social icons (Twitter, GitHub, Discord)

**STATE:**
- selectedPlan: null
- features: [{icon: '⚡', title: 'Lightning Fast', description: '...'}, ...] (6 items)
- plans: [{id: 'starter', name: 'Starter', price: 0, features: ['5 projects', '10GB storage', ...]}, ...] (3 plans)
- testimonials: [{quote: '...', author: 'Sarah Chen', role: 'CTO at TechCorp', rating: 5}, ...] (3 items)
- stats: [{value: '50M+', label: 'Requests/day'}, ...] (4 items)

**DESIGN SYSTEM:**
- pageBg: #030712, cardBg: #111827, cardBorder: #1f2937
- purple: #7c3aed, purpleHover: #6d28d9, cyan: #06b6d4
- textPrimary: #f9fafb, textSecondary: #9ca3af, textMuted: #6b7280
- gradient: linear-gradient(135deg, #7c3aed, #06b6d4)

**CRITICAL INTERACTIVITY:**
1. **Plan Selection**: \`onClick: (e, el, s) => { s.root.update({ selectedPlan: 'pro' }) }\`, border: \`borderColor: (el, s) => s.root.selectedPlan === 'pro' ? 'purple' : 'cardBorder'\`
2. **CTA Buttons**: \`onClick: (e, el, s) => { console.log('Get Started'); s.root.update({ selectedPlan: 'starter' }) }\`
3. **Feature Cards**: \`:hover\` with borderColor change and slight translateY
4. **Smooth Scroll**: Nav links scroll to sections
5. **NEVER use direct assignment** — always use \`s.root.update({ key: value })\`

**CRITICAL - config.js MUST have:**
\`\`\`js
export default { useReset: true, globalTheme: 'dark' }
\`\`\`

**CRITICAL - main.js MUST use actual components (NOT a default template):**
\`\`\`js
export const main = {
  extends: 'Flex',
  flexDirection: 'column',
  minHeight: '100vh',
  background: 'pageBg',
  Navbar: {},
  Hero: {},
  StatsBar: {},
  FeaturesGrid: {},
  Testimonials: {},
  Pricing: {},
  Footer: {}
}
\`\`\`

**FILES TO GENERATE:**
smbls/state.js, smbls/config.js (with globalTheme: 'dark'), smbls/designSystem/COLOR.js, smbls/designSystem/SPACING.js, smbls/designSystem/index.js, smbls/components/Navbar.js, smbls/components/Hero.js, smbls/components/StatsBar.js, smbls/components/FeaturesGrid.js, smbls/components/FeatureCard.js, smbls/components/Testimonials.js, smbls/components/TestimonialCard.js, smbls/components/Pricing.js, smbls/components/PlanCard.js, smbls/components/Footer.js, smbls/components/index.js, smbls/pages/main.js (MUST use actual components), smbls/pages/index.js, smbls/index.js`,
  },
  {
    id: 'portfolio',
    name: 'Designer Portfolio',
    tagline: 'Minimal creative showcase',
    description: 'Editorial-style portfolio with a bold typographic hero, filterable project grid with hover overlays, about section with skills, and contact area.',
    category: 'Portfolio',
    tags: ['Minimal', 'Creative', 'Grid', 'Black'],
    previewImage: '/templates/portfolio.svg',
    accentColor: '#d4ff00',
    bgColor: '#0a0a0a',
    prompt: `Create a complete Symbols project for a minimal designer portfolio with:

**NAVBAR (sticky, transparent, padding 24px 48px):**
- Left: name "Alex Chen" in bold 18px
- Center: nav links Work, About, Process (14px, letter-spacing 0.05em, hover lime underline)
- Right: "Say hello →" lime accent link

**HERO SECTION (full viewport height, pure black):**
- Top-left: green dot + "Available for freelance" (14px)
- Main headline: "Digital Designer" (96px, -0.04em tracking, font-weight 700)
- Second line: "& Creative Developer" (96px, lighter weight)
- Right column: bio text "I craft digital experiences..." (16px, max-width 400px, line-height 1.7)
- Bottom: scroll indicator arrow bouncing animation

**PROJECT GRID:**
- Filter row: "All Work" (active), "Product Design", "Branding", "Motion" - pills with lime bg when active
- 2-column grid with gap 24px
- ProjectCard: 
  - Image container (aspect-ratio 4/3, grayscale, hover full color)
  - Overlay on hover: "View Project →" centered, lime text
  - Below image: title (20px bold), year (muted), description (14px, 2 lines)
  - Tag pills: "UI/UX", "Mobile", "Branding" etc.

**ABOUT SECTION (two columns):**
- Left (60%): 
  - "About" heading (48px)
  - Bio paragraphs (16px, line-height 1.8)
  - Skills grid: Figma, Framer, React, After Effects, Blender, etc. (lime border pills)
- Right (40%):
  - "Connect" heading
  - Social links list: Twitter →, Dribbble →, LinkedIn →, Read.cv → (hover lime)

**CONTACT SECTION (centered):**
- "Let's work together" (64px)
- Email link: "hello@alexchen.design" (24px, lime, underline on hover)
- Footer: © 2024 Alex Chen

**STATE:**
- activeFilter: 'All Work'
- projects: [{id: 1, title: 'Fintech App Redesign', category: 'Product Design', year: '2024', description: 'Complete redesign of a banking app...', tags: ['UI/UX', 'Mobile'], image: 'https://images.unsplash.com/photo-XXX'}, ...] (6 projects)
- skills: ['Figma', 'Framer', 'React', 'TypeScript', 'After Effects', 'Blender', 'Three.js', 'Webflow']
- socials: [{name: 'Twitter', url: '#'}, {name: 'Dribbble', url: '#'}, {name: 'LinkedIn', url: '#'}, {name: 'Read.cv', url: '#'}]

**DESIGN SYSTEM:**
- pageBg: #0a0a0a, cardBg: #141414
- lime: #d4ff00, limeHover: #c4ef00
- textPrimary: #ffffff, textSecondary: #a3a3a3, textMuted: #737373
- border: #262626

**CRITICAL INTERACTIVITY:**
1. **Filter Buttons**: \`onClick: (e, el, s) => { s.root.update({ activeFilter: 'Branding' }) }\`, style: \`background: (el, s) => s.root.activeFilter === 'All Work' ? 'lime' : 'transparent', color: (el, s) => s.root.activeFilter === 'All Work' ? 'black' : 'white'\`
2. **Project Cards**: \`display: (el, s) => s.root.activeFilter === 'All Work' || s.root.activeFilter === 'Product Design' ? 'flex' : 'none'\`
3. **Project Hover**: \`:hover\` shows overlay, removes grayscale filter
4. **Social Links**: hover changes color to lime
5. **NEVER use direct assignment** — always use \`s.root.update({ key: value })\`

**CRITICAL - config.js MUST have:**
\`\`\`js
export default { useReset: true, globalTheme: 'dark' }
\`\`\`

**CRITICAL - main.js MUST use actual components (NOT a default template):**
\`\`\`js
export const main = {
  extends: 'Flex',
  flexDirection: 'column',
  minHeight: '100vh',
  background: 'pageBg',
  Navbar: {},
  Hero: {},
  ProjectGrid: {},
  About: {},
  Contact: {},
  Footer: {}
}
\`\`\`

**FILES TO GENERATE:**
smbls/state.js, smbls/config.js (with globalTheme: 'dark'), smbls/designSystem/COLOR.js, smbls/designSystem/SPACING.js, smbls/designSystem/index.js, smbls/components/Navbar.js, smbls/components/Hero.js, smbls/components/ProjectGrid.js, smbls/components/FilterButton.js, smbls/components/ProjectCard.js, smbls/components/About.js, smbls/components/SkillTag.js, smbls/components/Contact.js, smbls/components/Footer.js, smbls/components/index.js, smbls/pages/main.js (MUST use actual components), smbls/pages/index.js, smbls/index.js`,
  },
  {
    id: 'blog',
    name: 'Tech Blog',
    tagline: 'Modern publication platform',
    description: 'Clean reading-focused blog with featured article hero, category navigation, article cards grid, newsletter signup, and dark mode design.',
    category: 'Content',
    tags: ['Blog', 'Articles', 'Newsletter', 'Dark'],
    previewImage: '/templates/blog.svg',
    accentColor: '#10b981',
    bgColor: '#111827',
    prompt: `Create a complete Symbols project for a modern tech blog with:

**NAVBAR (sticky, #111827, border-bottom):**
- Left: logo icon + "TechPulse" brand (20px bold)
- Center: Home, Articles, Topics, About (14px, hover emerald)
- Right: search icon button, dark/light mode toggle (sun/moon icon), "Subscribe" emerald button

**FEATURED ARTICLE (hero section):**
- Large image (aspect-ratio 21/9, rounded-lg)
- Overlay gradient from bottom
- Category badge: "Technology" emerald pill
- Title: "The Future of AI in Software Development" (36px bold, white)
- Excerpt: 2 lines of preview text (16px, muted)
- Author row: avatar circle (40px) + "Sarah Chen" + "·" + "Jan 15, 2024" + "·" + "8 min read"

**CATEGORY PILLS (horizontal scroll on mobile):**
- Pills: All, Technology, Design, Development, AI, Startups, Product
- Active pill: emerald bg, white text
- Inactive: transparent bg, gray border, hover emerald border

**ARTICLES GRID (3 columns, gap 24px):**
- ArticleCard:
  - Image (aspect-ratio 16/9, rounded-t-lg)
  - Category badge overlay (top-left)
  - Content padding: title (18px bold, 2-line clamp), excerpt (14px, 3-line clamp)
  - Footer: author avatar (32px) + name + date + read time
  - Hover: slight lift shadow, image zoom

**NEWSLETTER SECTION (centered, max-width 600px):**
- Icon: envelope emoji or SVG
- Headline: "Stay in the loop" (32px bold)
- Subtitle: "Get the latest articles delivered to your inbox" (16px muted)
- Form row: email input (flex-1) + "Subscribe" emerald button
- Privacy text: "No spam. Unsubscribe anytime." (12px muted)

**FOOTER (dark, 4 columns):**
- Col 1: logo + tagline + social icons (Twitter, GitHub, LinkedIn)
- Col 2: Quick Links - Home, Articles, Topics, About
- Col 3: Categories - Technology, Design, Development, AI
- Col 4: Legal - Privacy, Terms, Contact
- Bottom: © 2024 TechPulse. All rights reserved.

**STATE:**
- activeCategory: 'All'
- searchQuery: ''
- showSearch: false
- articles: [{id: 1, title: 'The Future of AI...', excerpt: '...', category: 'Technology', author: {name: 'Sarah Chen', avatar: 'SC'}, date: 'Jan 15, 2024', readTime: '8 min', image: 'https://images.unsplash.com/photo-XXX', featured: true}, ...] (9 articles)
- categories: ['All', 'Technology', 'Design', 'Development', 'AI', 'Startups', 'Product']

**DESIGN SYSTEM:**
- pageBg: #111827, cardBg: #1f2937, cardBorder: #374151
- emerald: #10b981, emeraldHover: #059669
- textPrimary: #f9fafb, textSecondary: #9ca3af, textMuted: #6b7280
- inputBg: #374151, inputBorder: #4b5563

**CRITICAL INTERACTIVITY:**
1. **Category Pills**: \`onClick: (e, el, s) => { s.root.update({ activeCategory: 'Technology' }) }\`, style: \`background: (el, s) => s.root.activeCategory === 'All' ? 'emerald' : 'transparent'\`
2. **Article Cards**: \`display: (el, s) => s.root.activeCategory === 'All' || s.root.activeCategory === 'Technology' ? 'flex' : 'none'\`
3. **Search Toggle**: \`onClick: (e, el, s) => { s.root.update({ showSearch: !s.root.showSearch }) }\`
4. **Newsletter**: \`onClick: (e, el, s) => { console.log('Subscribed!'); alert('Thanks for subscribing!') }\`
5. **Article Click**: \`onClick: (e, el, s) => { s.root.update({ selectedArticle: article.id }) }\`
6. **NEVER use direct assignment** — always use \`s.root.update({ key: value })\`

**CRITICAL - config.js MUST have:**
\`\`\`js
export default { useReset: true, globalTheme: 'dark' }
\`\`\`

**CRITICAL - main.js MUST use actual components (NOT a default template):**
\`\`\`js
export const main = {
  extends: 'Flex',
  flexDirection: 'column',
  minHeight: '100vh',
  background: 'pageBg',
  Navbar: {},
  FeaturedArticle: {},
  CategoryPills: {},
  ArticleGrid: {},
  Newsletter: {},
  Footer: {}
}
\`\`\`

**FILES TO GENERATE:**
smbls/state.js, smbls/config.js (with globalTheme: 'dark'), smbls/designSystem/COLOR.js, smbls/designSystem/SPACING.js, smbls/designSystem/index.js, smbls/components/Navbar.js, smbls/components/FeaturedArticle.js, smbls/components/CategoryPills.js, smbls/components/ArticleGrid.js, smbls/components/ArticleCard.js, smbls/components/Newsletter.js, smbls/components/Footer.js, smbls/components/index.js, smbls/pages/main.js (MUST use actual components), smbls/pages/index.js, smbls/index.js`,
  },
  {
    id: 'restaurant',
    name: 'Restaurant & Menu',
    tagline: 'Elegant dining experience',
    description: 'Sophisticated restaurant site with hero image, menu categories with dish cards, reservation form, gallery grid, and warm color palette.',
    category: 'Food & Drink',
    tags: ['Restaurant', 'Menu', 'Reservation', 'Elegant'],
    previewImage: '/templates/restaurant.svg',
    accentColor: '#d97706',
    bgColor: '#1c1917',
    prompt: `Create a complete Symbols project for an elegant restaurant website with:

**NAVBAR (fixed, transparent initially, solid on scroll):**
- Left: "La Maison" in elegant serif (24px, cream color)
- Center: Menu, About, Reservations, Gallery (14px, letter-spacing 0.1em, uppercase)
- Right: "Book a Table" amber button with hover glow
- Mobile: hamburger menu

**HERO (100vh, parallax bg image):**
- Full-width food/restaurant image with dark overlay (rgba(0,0,0,0.5))
- Centered content: "Experience" (16px, uppercase, letter-spacing), "Culinary Excellence" (64px serif), tagline "Fine dining in the heart of the city" (18px)
- Two CTAs: "View Menu" outlined + "Reserve Table" amber filled
- Scroll indicator at bottom

**MENU SECTION:**
- Section title: "Our Menu" (48px serif) + decorative line
- Category tabs: Starters, Mains, Desserts, Drinks - underline style, amber when active
- Dish grid (2 columns):
  - DishCard: image (aspect 4/3), name (20px serif), description (14px, 2 lines), price ("$32"), dietary icons (V=Vegetarian, GF=Gluten Free, S=Spicy)
  - Hover: image zoom, slight shadow

**ABOUT SECTION (two columns):**
- Left: "Our Story" heading, 2-3 paragraphs about the restaurant, chef signature
- Right: chef portrait image (rounded corners), quote overlay

**RESERVATION FORM (amber accent section):**
- Heading: "Make a Reservation"
- Form grid: Date picker, Time dropdown (6pm-10pm), Party size (1-10), Name input, Phone input, Special requests textarea
- Submit button: "Book Now" amber, full width
- Note: "We'll confirm your reservation within 24 hours"

**GALLERY (masonry grid):**
- 6 images: food dishes, interior, bar, kitchen, ambiance
- Lightbox on click (optional)
- Hover: slight zoom

**FOOTER (dark, elegant):**
- 3 columns: Location (address, map link), Hours (Mon-Sun times), Contact (phone, email)
- Social icons: Instagram, Facebook, TripAdvisor
- Bottom: © 2024 La Maison. All rights reserved.

**STATE:**
- activeMenuCategory: 'Starters'
- menuItems: [{id: 1, name: 'Truffle Arancini', description: 'Crispy risotto balls with black truffle...', price: 18, category: 'Starters', dietary: ['V'], image: 'https://images.unsplash.com/photo-XXX'}, ...] (12 dishes)
- reservationForm: {date: '', time: '', partySize: 2, name: '', phone: '', notes: ''}
- galleryImages: [...] (6 images)

**DESIGN SYSTEM:**
- pageBg: #1c1917, cardBg: #292524, sectionAlt: #0c0a09
- amber: #d97706, amberHover: #b45309, amberLight: #fbbf24
- cream: #fef3c7, textPrimary: #fafaf9, textSecondary: #a8a29e, textMuted: #78716c
- serif: 'Playfair Display', sans: 'Inter'

**CRITICAL INTERACTIVITY:**
1. **Menu Tabs**: \`onClick: (e, el, s) => { s.root.update({ activeMenuCategory: 'Mains' }) }\`, style: \`borderBottomColor: (el, s) => s.root.activeMenuCategory === 'Starters' ? 'amber' : 'transparent'\`
2. **Dish Cards**: \`display: (el, s) => s.root.activeMenuCategory === 'Starters' ? 'flex' : 'none'\`
3. **Form Inputs**: \`onInput: (e, el, s) => { s.root.update({ reservationForm: { ...s.root.reservationForm, name: e.target.value } }) }\`
4. **Submit**: \`onClick: (e, el, s) => { e.preventDefault(); console.log('Reservation:', s.root.reservationForm); alert('Reservation submitted!') }\`
5. **Book a Table CTA**: scroll to reservation section
6. **NEVER use direct assignment** — always use \`s.root.update({ key: value })\`

**CRITICAL - config.js MUST have:**
\`\`\`js
export default { useReset: true, globalTheme: 'dark' }
\`\`\`

**CRITICAL - main.js MUST use actual components (NOT a default template):**
\`\`\`js
export const main = {
  extends: 'Flex',
  flexDirection: 'column',
  minHeight: '100vh',
  background: 'pageBg',
  Navbar: {},
  Hero: {},
  MenuSection: {},
  About: {},
  Reservation: {},
  Gallery: {},
  Footer: {}
}
\`\`\`

**FILES TO GENERATE:**
smbls/state.js, smbls/config.js (with globalTheme: 'dark'), smbls/designSystem/COLOR.js, smbls/designSystem/SPACING.js, smbls/designSystem/FONT.js, smbls/designSystem/index.js, smbls/components/Navbar.js, smbls/components/Hero.js, smbls/components/MenuSection.js, smbls/components/MenuTab.js, smbls/components/DishCard.js, smbls/components/About.js, smbls/components/Reservation.js, smbls/components/Gallery.js, smbls/components/Footer.js, smbls/components/index.js, smbls/pages/main.js (MUST use actual components), smbls/pages/index.js, smbls/index.js`,
  },
  {
    id: 'fitness',
    name: 'Fitness App',
    tagline: 'Workout tracking dashboard',
    description: 'Energetic fitness dashboard with workout stats, exercise library with filters, progress charts, and achievement badges.',
    category: 'Health',
    tags: ['Fitness', 'Workout', 'Progress', 'Dark'],
    previewImage: '/templates/fitness.svg',
    accentColor: '#ef4444',
    bgColor: '#0c0a09',
    prompt: `Create a complete Symbols project for a fitness tracking app dashboard with:

**SIDEBAR (fixed left, 280px, #0c0a09):**
- Logo: flame icon + "FitTrack" (20px bold, red gradient)
- Nav sections: MENU (Dashboard, Workouts, Exercises, Progress), ACCOUNT (Settings, Help)
- NavItem: icon + label, active has red left border + red bg tint
- User profile at bottom: avatar, "John Doe", "Pro Member" badge

**HEADER (sticky top):**
- Left: "Good morning, John! 💪" (24px), today's date "Monday, Jan 15"
- Right: streak badge "🔥 12 Day Streak", notification bell, profile avatar

**STATS ROW (4 cards, gradient borders):**
- Calories Burned: fire icon, "2,450", "kcal today", +15% indicator
- Workouts: dumbbell icon, "4", "this week", on track indicator
- Active Minutes: clock icon, "185", "min this week", +22% indicator
- Current Streak: flame icon, "12", "days", personal best badge

**TODAY'S WORKOUT CARD (featured, red gradient border):**
- Header: "Today's Workout" + difficulty badge "Intermediate"
- Workout name: "Full Body Strength" (24px bold)
- Meta row: 45 min duration, 8 exercises, 320 cal estimate
- Exercise preview list (3 items): icon + name + sets x reps
- "Start Workout" red button (full width), "Schedule for Later" text link

**EXERCISE LIBRARY:**
- Header: "Exercise Library" + search input
- Filter tabs: All, Strength, Cardio, Flexibility, HIIT
- Grid (3 columns): ExerciseCard with:
  - Image (aspect 16/9, muscle group overlay badge)
  - Name (16px bold), target muscles, difficulty dots (1-3)
  - "Add to Workout" button on hover

**PROGRESS CHART:**
- Header: "Weekly Activity" + period toggle (Week/Month)
- Bar chart: 7 days (Mon-Sun), height = minutes, red gradient bars
- Hover tooltip: "Tuesday: 45 min"
- Goal line at 30 min with label

**ACHIEVEMENTS (badge grid):**
- Header: "Achievements" + "4/12 Unlocked"
- 6 badges: First Workout, Week Warrior, Early Bird, Strength Master, Cardio King, Consistency
- Unlocked: full color + checkmark, Locked: grayscale + lock icon

**STATE:**
- activeView: 'Dashboard'
- activeExerciseFilter: 'All'
- isWorkoutActive: false
- stats: {calories: 2450, workouts: 4, activeMinutes: 185, streak: 12}
- todayWorkout: {name: 'Full Body Strength', duration: 45, exercises: [{name: 'Squats', sets: 3, reps: 12}, ...], difficulty: 'Intermediate'}
- exerciseLibrary: [{id: 1, name: 'Barbell Squat', type: 'Strength', muscles: 'Legs, Glutes', difficulty: 3, image: '...'}, ...] (12 exercises)
- weeklyProgress: [{day: 'Mon', minutes: 45}, {day: 'Tue', minutes: 30}, ...] (7 days)
- achievements: [{id: 1, name: 'First Workout', unlocked: true, icon: '🏋️'}, ...] (6 items)

**DESIGN SYSTEM:**
- pageBg: #0c0a09, cardBg: #1c1917, sidebarBg: #0c0a09
- red: #ef4444, redHover: #dc2626, redGradient: linear-gradient(135deg, #ef4444, #f97316)
- textPrimary: #fafaf9, textSecondary: #a8a29e, textMuted: #78716c
- success: #22c55e, border: #292524

**CRITICAL INTERACTIVITY:**
1. **Exercise Filters**: \`onClick: (e, el, s) => { s.root.update({ activeExerciseFilter: 'Strength' }) }\`, style: \`background: (el, s) => s.root.activeExerciseFilter === 'All' ? 'red' : 'transparent'\`
2. **Exercise Cards**: \`display: (el, s) => s.root.activeExerciseFilter === 'All' || s.root.activeExerciseFilter === 'Strength' ? 'flex' : 'none'\`
3. **Start Workout**: \`onClick: (e, el, s) => { s.root.update({ isWorkoutActive: true }); alert('Workout started!') }\`
4. **Sidebar Nav**: \`onClick: (e, el, s) => { s.root.update({ activeView: 'Workouts' }) }\`, active: \`background: (el, s) => s.root.activeView === 'Dashboard' ? 'rgba(239,68,68,0.1)' : 'transparent'\`
5. **Chart Bars**: \`height: (el, s) => (s.root.weeklyProgress[0].minutes / 60 * 100) + '%'\`
6. **NEVER use direct assignment** — always use \`s.root.update({ key: value })\`

**CRITICAL - config.js MUST have:**
\`\`\`js
export default { useReset: true, globalTheme: 'dark' }
\`\`\`

**CRITICAL - main.js MUST use actual components (NOT a default template):**
\`\`\`js
export const main = {
  extends: 'Flex',
  minHeight: '100vh',
  background: 'pageBg',
  Sidebar: {},
  MainArea: {
    extends: 'Flex',
    flexDirection: 'column',
    flex: '1',
    marginLeft: '280px',
    Header: {},
    Content: {
      extends: 'Flex',
      flexDirection: 'column',
      padding: 'B',
      gap: 'B',
      StatsRow: {},
      TodayWorkout: {},
      ExerciseLibrary: {},
      ProgressChart: {},
      Achievements: {}
    }
  }
}
\`\`\`

**FILES TO GENERATE:**
smbls/state.js, smbls/config.js (with globalTheme: 'dark'), smbls/designSystem/COLOR.js, smbls/designSystem/SPACING.js, smbls/designSystem/index.js, smbls/components/Sidebar.js, smbls/components/NavItem.js, smbls/components/Header.js, smbls/components/StatsRow.js, smbls/components/StatCard.js, smbls/components/TodayWorkout.js, smbls/components/ExerciseLibrary.js, smbls/components/ExerciseCard.js, smbls/components/ProgressChart.js, smbls/components/Achievements.js, smbls/components/index.js, smbls/pages/main.js (MUST use actual components), smbls/pages/index.js, smbls/index.js`,
  },
  {
    id: 'realestate',
    name: 'Real Estate',
    tagline: 'Property listing platform',
    description: 'Professional real estate site with property search, listing cards with image galleries, map placeholder, and agent contact forms.',
    category: 'Business',
    tags: ['Properties', 'Listings', 'Search', 'Light'],
    previewImage: '/templates/realestate.svg',
    accentColor: '#0ea5e9',
    bgColor: '#f8fafc',
    prompt: `Create a complete Symbols project for a real estate listing platform with:

**NAVBAR (sticky, white, shadow):**
- Left: house icon + "HomeFind" logo (20px bold, sky blue)
- Center: Buy, Rent, Sell, Agents (14px, hover sky blue)
- Right: location dropdown "New York, NY", heart icon (favorites count), "List Property" sky blue button

**HERO SEARCH (bg image with overlay):**
- Background: beautiful home exterior image
- Headline: "Find Your Dream Home" (48px bold, white)
- Subtitle: "Discover the perfect property from our extensive listings"
- Search card (white, shadow, rounded):
  - Location input with pin icon
  - Property type dropdown: Any, House, Apartment, Condo, Townhouse
  - Price range: Min/Max dropdowns
  - Beds dropdown: Any, 1+, 2+, 3+, 4+
  - "Search" sky blue button

**FILTER BAR:**
- Left: property type pills (All, House, Apartment, Condo, Townhouse)
- Right: "Sort by" dropdown (Price Low-High, Price High-Low, Newest), grid/list view toggle icons
- Results count: "127 properties found"

**PROPERTY GRID (3 columns):**
- PropertyCard (white, rounded, shadow):
  - Image (aspect 16/10) with carousel dots, "Featured" badge if featured
  - Heart button (top-right, toggle favorite)
  - Price: "$425,000" (24px bold)
  - Address: "123 Oak Street, Brooklyn, NY" (14px)
  - Meta row: 🛏 3 beds · 🛁 2 baths · 📐 1,850 sqft
  - Agent mini: avatar + name + "View Details" link
  - Hover: slight lift, shadow increase

**FEATURED AGENTS (4 cards):**
- Section title: "Top Agents" + "View All" link
- AgentCard: photo (80px circle), name (18px bold), title "Senior Agent", "★ 4.9 (127 reviews)", "45 Active Listings", "Contact" sky blue button

**STATS SECTION (4 columns, sky blue bg):**
- 2,500+ Properties Listed
- 1,200+ Happy Clients
- 50+ Cities Covered
- 15+ Years Experience

**FOOTER (dark #1e293b):**
- 4 columns: About (logo, description), Quick Links, Property Types, Contact Info
- Bottom: © 2024 HomeFind + social icons

**STATE:**
- activePropertyType: 'All'
- sortBy: 'newest'
- viewMode: 'grid'
- favorites: []
- searchFilters: {location: '', type: 'Any', priceMin: 0, priceMax: 0, beds: 'Any'}
- properties: [{id: 1, title: 'Modern Family Home', price: 425000, beds: 3, baths: 2, sqft: 1850, address: '123 Oak Street, Brooklyn, NY', type: 'House', featured: true, images: ['...'], agent: {name: 'Sarah Johnson', avatar: 'SJ'}}, ...] (9 properties)
- agents: [{id: 1, name: 'Sarah Johnson', photo: '...', title: 'Senior Agent', rating: 4.9, reviews: 127, listings: 45}, ...] (4 agents)

**DESIGN SYSTEM:**
- pageBg: #f8fafc, cardBg: #ffffff, navBg: #ffffff
- sky: #0ea5e9, skyHover: #0284c7, skyLight: #e0f2fe
- textPrimary: #0f172a, textSecondary: #475569, textMuted: #94a3b8
- border: #e2e8f0, shadow: 0 4px 6px -1px rgba(0,0,0,0.1)
- error: #ef4444 (for favorite heart)

**CRITICAL INTERACTIVITY:**
1. **Property Type Tabs**: \`onClick: (e, el, s) => { s.root.update({ activePropertyType: 'House' }) }\`, style: \`background: (el, s) => s.root.activePropertyType === 'All' ? 'sky' : 'transparent'\`
2. **Property Cards**: \`display: (el, s) => s.root.activePropertyType === 'All' || s.root.activePropertyType === 'House' ? 'flex' : 'none'\`
3. **Favorite Toggle**: \`onClick: (e, el, s) => { e.stopPropagation(); var favs = s.root.favorites.slice(); var idx = favs.indexOf(1); if (idx > -1) favs.splice(idx, 1); else favs.push(1); s.root.update({ favorites: favs }) }\`, color: \`color: (el, s) => s.root.favorites.includes(1) ? 'error' : 'textMuted'\`
4. **Sort Dropdown**: \`onChange: (e, el, s) => { s.root.update({ sortBy: e.target.value }) }\`
5. **View Toggle**: \`onClick: (e, el, s) => { s.root.update({ viewMode: 'list' }) }\`
6. **NEVER use direct assignment** — always use \`s.root.update({ key: value })\`

**CRITICAL - config.js MUST have:**
\`\`\`js
export default { useReset: true, globalTheme: 'light' }
\`\`\`
Note: Real Estate uses a LIGHT theme (white backgrounds) so globalTheme MUST be 'light'.

**CRITICAL - main.js MUST use actual components (NOT a default template):**
\`\`\`js
export const main = {
  extends: 'Flex',
  flexDirection: 'column',
  minHeight: '100vh',
  background: 'pageBg',
  Navbar: {},
  HeroSearch: {},
  FilterBar: {},
  PropertyGrid: {},
  AgentsSection: {},
  Stats: {},
  Footer: {}
}
\`\`\`

**FILES TO GENERATE:**
smbls/state.js, smbls/config.js (with globalTheme: 'light'), smbls/designSystem/COLOR.js, smbls/designSystem/SPACING.js, smbls/designSystem/index.js, smbls/components/Navbar.js, smbls/components/HeroSearch.js, smbls/components/FilterBar.js, smbls/components/PropertyGrid.js, smbls/components/PropertyCard.js, smbls/components/AgentsSection.js, smbls/components/AgentCard.js, smbls/components/Stats.js, smbls/components/Footer.js, smbls/components/index.js, smbls/pages/main.js (MUST use actual components), smbls/pages/index.js, smbls/index.js`,
  },
  {
    id: 'hotel',
    name: 'Hotel Booking',
    tagline: 'Luxury travel experience',
    description: 'Elegant hotel booking site with search form, room cards with amenities, date picker, guest reviews, and a sophisticated dark theme.',
    category: 'Travel',
    tags: ['Hotel', 'Booking', 'Travel', 'Luxury'],
    previewImage: '/templates/hotel.svg',
    accentColor: '#c084fc',
    bgColor: '#18181b',
    prompt: `Create a complete Symbols project for a luxury hotel booking website with:

**NAVBAR (fixed, transparent to solid on scroll):**
- Left: "The Grand" in elegant serif + gold star icon
- Center: Rooms, Dining, Spa, Events, Contact (14px, letter-spacing, uppercase)
- Right: globe icon + "EN" language, "Book Now" purple gradient button

**HERO (100vh, cinematic):**
- Full-width luxury hotel image with gradient overlay
- Centered: "Experience" (14px uppercase gold), "Timeless Luxury" (72px serif), "Where elegance meets comfort" (18px)
- Booking card (glassmorphic, centered bottom):
  - Check-in date picker, Check-out date picker
  - Guests dropdown (1-6 Adults, 0-4 Children)
  - Rooms dropdown (1-5)
  - "Check Availability" purple button

**ROOM CATEGORIES:**
- Section title: "Our Accommodations" (48px serif) + gold underline
- Filter tabs: All Rooms, Suites, Deluxe, Standard (underline active)
- Room grid (2 columns):
  - RoomCard: image gallery (dots), room name (24px serif), price "/night" (gold), bed type, max guests icon, amenity icons row (wifi/ac/tv/minibar/safe), "Book This Room" button
  - Hover: image zoom, button appears

**AMENITIES SECTION (dark bg):**
- Title: "Hotel Amenities"
- 6 large icons with labels: Infinity Pool, Luxury Spa, Fine Dining, Fitness Center, 24/7 Concierge, Valet Parking
- Each: icon (48px), name, brief description

**GUEST REVIEWS:**
- Title: "Guest Experiences" + average rating "4.9 ★"
- 4 ReviewCards: 5 stars, quote (italic serif), guest name, "Stayed in [Room Type], [Date]"
- Carousel dots or scroll

**FOOTER (dark, elegant):**
- 4 columns: The Grand (logo, tagline), Quick Links, Contact (address, phone, email), Newsletter signup
- Bottom: © 2024 + social icons (Instagram, Facebook, TripAdvisor)

**STATE:**
- roomFilter: 'All'
- selectedRoom: null
- showBookingModal: false
- bookingForm: {checkIn: '', checkOut: '', adults: 2, children: 0, rooms: 1}
- rooms: [{id: 1, name: 'Presidential Suite', type: 'Suites', price: 899, beds: 'King', maxGuests: 4, amenities: ['wifi', 'ac', 'minibar', 'jacuzzi'], images: ['...'], description: '...'}, ...] (8 rooms)
- amenities: [{icon: '🏊', name: 'Infinity Pool', description: 'Rooftop pool with city views'}, ...] (6 items)
- reviews: [{id: 1, rating: 5, quote: 'An unforgettable experience...', guest: 'Michael R.', room: 'Deluxe Suite', date: 'December 2023'}, ...] (4 reviews)

**DESIGN SYSTEM:**
- pageBg: #18181b, cardBg: #27272a, glassBg: rgba(39,39,42,0.8)
- purple: #c084fc, purpleHover: #a855f7, purpleGradient: linear-gradient(135deg, #c084fc, #818cf8)
- gold: #fbbf24, goldLight: #fde68a
- textPrimary: #fafafa, textSecondary: #a1a1aa, textMuted: #71717a
- serif: 'Playfair Display'

**CRITICAL INTERACTIVITY:**
1. **Room Filters**: \`onClick: (e, el, s) => { s.root.update({ roomFilter: 'Suites' }) }\`, style: \`borderBottomColor: (el, s) => s.root.roomFilter === 'All' ? 'gold' : 'transparent'\`
2. **Room Cards**: \`display: (el, s) => s.root.roomFilter === 'All' || s.root.roomFilter === 'Suites' ? 'flex' : 'none'\`
3. **Book Room**: \`onClick: (e, el, s) => { s.root.update({ selectedRoom: 1, showBookingModal: true }) }\`
4. **Date Inputs**: \`onChange: (e, el, s) => { s.root.update({ bookingForm: { ...s.root.bookingForm, checkIn: e.target.value } }) }\`
5. **Check Availability**: \`onClick: (e, el, s) => { console.log('Booking:', s.root.bookingForm); alert('Checking availability...') }\`
6. **NEVER use direct assignment** — always use \`s.root.update({ key: value })\`

**CRITICAL - config.js MUST have:**
\`\`\`js
export default { useReset: true, globalTheme: 'dark' }
\`\`\`

**CRITICAL - main.js MUST use actual components (NOT a default template):**
\`\`\`js
export const main = {
  extends: 'Flex',
  flexDirection: 'column',
  minHeight: '100vh',
  background: 'pageBg',
  Navbar: {},
  Hero: {},
  RoomSection: {},
  Amenities: {},
  Reviews: {},
  Footer: {}
}
\`\`\`

**FILES TO GENERATE:**
smbls/state.js, smbls/config.js (with globalTheme: 'dark'), smbls/designSystem/COLOR.js, smbls/designSystem/SPACING.js, smbls/designSystem/FONT.js, smbls/designSystem/index.js, smbls/components/Navbar.js, smbls/components/Hero.js, smbls/components/BookingCard.js, smbls/components/RoomSection.js, smbls/components/RoomCard.js, smbls/components/Amenities.js, smbls/components/Reviews.js, smbls/components/ReviewCard.js, smbls/components/Footer.js, smbls/components/index.js, smbls/pages/main.js (MUST use actual components), smbls/pages/index.js, smbls/index.js`,
  },
  {
    id: 'social',
    name: 'Social Media Feed',
    tagline: 'Twitter/X style platform',
    description: 'Social media app with post feed, compose box, like/retweet/comment actions, trending sidebar, and user profiles.',
    category: 'Social',
    tags: ['Social', 'Feed', 'Posts', 'Dark'],
    previewImage: '/templates/social.svg',
    accentColor: '#3b82f6',
    bgColor: '#000000',
    prompt: `Create a complete Symbols project for a Twitter/X style social media feed with:

**LEFT SIDEBAR (fixed, 275px, #000000):**
- Logo: X icon (24px)
- Nav items with icons: Home (bold if active), Explore, Notifications (badge count), Messages, Bookmarks, Lists, Profile, More
- "Post" blue button (full width, rounded-full)
- User profile at bottom: avatar (40px), name, @username, "..." menu

**MAIN FEED (flex-1, border-x):**
- Header: "Home" (20px bold) + sparkle icon for "For You/Following" toggle
- Compose box:
  - Current user avatar (48px)
  - "What is happening?!" placeholder input (grows on focus)
  - Toolbar: image icon, GIF icon, poll icon, emoji icon, schedule icon
  - Character count circle (blue progress), "Post" blue button (disabled if empty)
- Tab bar: "For You" | "Following" (underline active)
- Feed of posts (infinite scroll style)

**POST COMPONENT:**
- Row: avatar (48px) + content
- Header: display name (bold) + verified badge (optional) + @username (gray) + "·" + timestamp ("2h")
- Post text (15px, line-height 1.4, max 280 chars shown)
- Optional: image (rounded-xl, max-height 500px) or link preview card
- Action bar (spread): 💬 comment count, 🔁 retweet count (green if retweeted), ❤️ like count (red if liked), 📊 views, ↗️ share
- Hover: light bg highlight

**RIGHT SIDEBAR (350px):**
- Search bar: magnifying glass + "Search" input (rounded-full, #202327 bg)
- "Subscribe to Premium" card (optional)
- "What's happening" box:
  - 5 trending items: category label, #topic (bold), tweet count
  - "Show more" link
- "Who to follow" box:
  - 3 user suggestions: avatar, name, @username, "Follow" button (outline, toggles to "Following")
  - "Show more" link

**STATE:**
- activeTab: 'Home'
- feedTab: 'forYou'
- composeText: ''
- posts: [{id: 1, author: 'Elon Musk', username: 'elonmusk', avatar: 'EM', verified: true, text: 'The future is...', image: null, likes: 45200, retweets: 8300, comments: 2100, views: 1200000, isLiked: false, isRetweeted: false, timestamp: '2h'}, ...] (8 posts)
- trending: [{category: 'Technology', topic: 'OpenAI', tweets: '125K'}, ...] (5 items)
- suggestions: [{id: 1, name: 'Sam Altman', username: 'sama', avatar: 'SA', isFollowed: false}, ...] (3 users)
- currentUser: {name: 'John Doe', username: 'johndoe', avatar: 'JD'}

**DESIGN SYSTEM:**
- pageBg: #000000, cardBg: #16181c, hoverBg: rgba(255,255,255,0.03)
- blue: #1d9bf0, blueHover: #1a8cd8
- textPrimary: #e7e9ea, textSecondary: #71767b
- border: #2f3336
- red: #f91880 (likes), green: #00ba7c (retweets)

**CRITICAL INTERACTIVITY:**
1. **Like Button**: \`onClick: (e, el, s) => { e.stopPropagation(); var posts = s.root.posts.slice(); var p = posts[0]; p.isLiked = !p.isLiked; p.likes += p.isLiked ? 1 : -1; s.root.update({ posts: posts }) }\`, color: \`color: (el, s) => s.root.posts[0].isLiked ? 'red' : 'textSecondary'\`
2. **Retweet Button**: Same pattern, toggle isRetweeted, color green
3. **Follow Button**: \`onClick: (e, el, s) => { var sug = s.root.suggestions.slice(); sug[0].isFollowed = !sug[0].isFollowed; s.root.update({ suggestions: sug }) }\`, text: \`text: (el, s) => s.root.suggestions[0].isFollowed ? 'Following' : 'Follow'\`
4. **Compose Input**: \`onInput: (e, el, s) => { s.root.update({ composeText: e.target.value }) }\`
5. **Post Button**: \`onClick: (e, el, s) => { if (s.root.composeText) { console.log('Posted:', s.root.composeText); s.root.update({ composeText: '' }) } }\`
6. **Sidebar Nav**: \`onClick: (e, el, s) => { s.root.update({ activeTab: 'Explore' }) }\`
7. **NEVER use direct assignment** — always use \`s.root.update({ key: value })\`

**CRITICAL - config.js MUST have:**
\`\`\`js
export default { useReset: true, globalTheme: 'dark' }
\`\`\`

**CRITICAL - main.js MUST use actual components (NOT a default template):**
\`\`\`js
export const main = {
  extends: 'Flex',
  minHeight: '100vh',
  background: 'pageBg',
  Sidebar: {},
  Feed: {},
  RightSidebar: {}
}
\`\`\`

**FILES TO GENERATE:**
smbls/state.js, smbls/config.js (with globalTheme: 'dark'), smbls/designSystem/COLOR.js, smbls/designSystem/SPACING.js, smbls/designSystem/index.js, smbls/components/Sidebar.js, smbls/components/NavItem.js, smbls/components/ComposeBox.js, smbls/components/Post.js, smbls/components/ActionBar.js, smbls/components/Feed.js, smbls/components/RightSidebar.js, smbls/components/TrendingItem.js, smbls/components/UserSuggestion.js, smbls/components/index.js, smbls/pages/main.js (MUST use actual components), smbls/pages/index.js, smbls/index.js`,
  },
  {
    id: 'music',
    name: 'Music Streaming',
    tagline: 'Spotify-style player',
    description: 'Music streaming app with playlist sidebar, album grid, now playing bar, and playback controls.',
    category: 'Entertainment',
    tags: ['Music', 'Streaming', 'Player', 'Dark'],
    previewImage: '/templates/music.svg',
    accentColor: '#22c55e',
    bgColor: '#121212',
    prompt: `Create a complete Symbols project for a Spotify-style music streaming app with:

**LEFT SIDEBAR (fixed, 300px, #000000):**
- Top section:
  - Logo: Spotify-style icon + "Musicfy" (green)
  - Nav: Home icon + "Home", Search icon + "Search" (hover highlight)
- Library section:
  - Header: "Your Library" + grid/list toggle + "+" add button
  - Playlist list: cover (48px square) + name + "Playlist" label, hover bg
  - 6 playlists: Liked Songs (gradient heart), Daily Mix 1-3, Discover Weekly, Release Radar

**MAIN CONTENT (flex-1, #121212, scroll):**
- Header: "Good evening" (32px bold) based on time
- Recently Played (horizontal scroll):
  - 6 cards: square cover (180px), title, artist/description
  - Play button overlay (green circle) on hover
- Made For You section:
  - 4 playlist cards: cover, title, description
- Popular Artists (horizontal scroll):
  - 6 circular avatars (150px) + name below

**ALBUM/PLAYLIST CARD:**
- Cover image (rounded-md for playlists, square for albums)
- Title (16px bold, 1-line clamp)
- Description (14px gray, 2-line clamp)
- Green play button (56px circle) appears on hover, bottom-right

**NOW PLAYING BAR (fixed bottom, 90px, #181818):**
- Left (30%): album art (56px) + song title (14px white) + artist (12px gray, link style)
- Center (40%): 
  - Controls row: shuffle, prev, play/pause (white circle 32px), next, repeat
  - Progress: current time + progress bar (green fill) + total time
- Right (30%): 
  - Queue icon, devices icon, volume icon + slider, fullscreen icon

**RIGHT SIDEBAR (optional, 280px):**
- "Friend Activity" header
- 4 friends: avatar (32px) + name + listening to (song + artist) + album art mini

**STATE:**
- activeNav: 'Home'
- isPlaying: false
- isShuffleOn: false
- isRepeatOn: false
- volume: 75
- nowPlaying: {song: 'Blinding Lights', artist: 'The Weeknd', album: 'After Hours', cover: '...', duration: 203, progress: 45}
- playlists: [{id: 1, name: 'Liked Songs', cover: 'gradient', songCount: 342}, {id: 2, name: 'Daily Mix 1', cover: '...', description: 'Drake, Kendrick and more'}, ...] (6 items)
- recentlyPlayed: [{id: 1, title: 'After Hours', artist: 'The Weeknd', cover: '...'}, ...] (6 items)
- madeForYou: [{id: 1, title: 'Discover Weekly', description: 'Your weekly mixtape...', cover: '...'}, ...] (4 items)
- popularArtists: [{id: 1, name: 'The Weeknd', image: '...'}, ...] (6 artists)

**DESIGN SYSTEM:**
- pageBg: #121212, sidebarBg: #000000, cardBg: #181818, cardHover: #282828
- green: #1db954, greenHover: #1ed760
- textPrimary: #ffffff, textSecondary: #b3b3b3, textMuted: #6a6a6a
- progressBg: #4d4d4d, progressFill: #1db954

**CRITICAL INTERACTIVITY:**
1. **Play/Pause**: \`onClick: (e, el, s) => { s.root.update({ isPlaying: !s.root.isPlaying }) }\`, icon: \`text: (el, s) => s.root.isPlaying ? '⏸' : '▶'\`
2. **Shuffle**: \`onClick: (e, el, s) => { s.root.update({ isShuffleOn: !s.root.isShuffleOn }) }\`, color: \`color: (el, s) => s.root.isShuffleOn ? 'green' : 'textSecondary'\`
3. **Repeat**: \`onClick: (e, el, s) => { s.root.update({ isRepeatOn: !s.root.isRepeatOn }) }\`
4. **Card Play**: \`onClick: (e, el, s) => { s.root.update({ nowPlaying: { song: 'Blinding Lights', artist: 'The Weeknd', album: 'After Hours' }, isPlaying: true }) }\`
5. **Progress Bar**: \`width: (el, s) => (s.root.nowPlaying.progress / s.root.nowPlaying.duration * 100) + '%'\`
6. **Volume Slider**: \`onInput: (e, el, s) => { s.root.update({ volume: parseInt(e.target.value) }) }\`
7. **NEVER use direct assignment** — always use \`s.root.update({ key: value })\`

**CRITICAL - config.js MUST have:**
\`\`\`js
export default { useReset: true, globalTheme: 'dark' }
\`\`\`

**CRITICAL - main.js MUST use actual components (NOT a default template):**
\`\`\`js
export const main = {
  extends: 'Flex',
  minHeight: '100vh',
  background: 'pageBg',
  Sidebar: {},
  MainContent: {},
  NowPlayingBar: {}
}
\`\`\`

**FILES TO GENERATE:**
smbls/state.js, smbls/config.js (with globalTheme: 'dark'), smbls/designSystem/COLOR.js, smbls/designSystem/SPACING.js, smbls/designSystem/index.js, smbls/components/Sidebar.js, smbls/components/PlaylistItem.js, smbls/components/MainContent.js, smbls/components/AlbumCard.js, smbls/components/ArtistCard.js, smbls/components/NowPlayingBar.js, smbls/components/PlaybackControls.js, smbls/components/ProgressBar.js, smbls/components/index.js, smbls/pages/main.js (MUST use actual components), smbls/pages/index.js, smbls/index.js`,
  },
  {
    id: 'taskmanager',
    name: 'Task Manager',
    tagline: 'Kanban project board',
    description: 'Project management app with kanban columns, draggable task cards, labels, due dates, and team member avatars.',
    category: 'Productivity',
    tags: ['Tasks', 'Kanban', 'Projects', 'Dark'],
    previewImage: '/templates/taskmanager.svg',
    accentColor: '#8b5cf6',
    bgColor: '#0f0f23',
    prompt: `Create a complete Symbols project for a Kanban-style task manager with:

**TOP NAVBAR (sticky, #0f0f23, border-bottom):**
- Left: logo icon + "TaskFlow" (20px bold)
- Center: project dropdown "Marketing Campaign ▼" (shows project list)
- Right: search icon, notification bell (red dot badge), user avatar (36px) + dropdown

**LEFT SIDEBAR (fixed, 260px, #0a0a1a):**
- Workspace: "Acme Inc" + settings gear
- Projects section:
  - Header: "Projects" + "+" add button
  - Project list: colored dot + name + task count badge
  - 4 projects: Marketing Campaign (violet), Product Launch (blue), Website Redesign (green), Q1 Planning (orange)
  - Active project: violet bg tint, bold text
- Team section:
  - Header: "Team Members"
  - 5 members: avatar (32px) + name + online dot indicator

**KANBAN BOARD (flex-1, horizontal scroll):**
- 4 columns with gap 16px:
  - To Do (gray header): 4 tasks
  - In Progress (blue header): 3 tasks
  - Review (yellow header): 2 tasks
  - Done (green header): 3 tasks
- Column header: title + task count badge + "+" add button
- Column body: vertical stack of TaskCards, min-height for drop zone

**TASK CARD (white bg on dark, rounded-lg, shadow):**
- Cover image (optional, top, rounded-t)
- Labels row: colored pills (Bug=red, Feature=blue, Design=purple, Urgent=orange)
- Title (16px bold, 2-line clamp)
- Description preview (13px gray, 2 lines)
- Attachments: 📎 count if any
- Bottom row: due date (📅 Jan 20), assignee avatars (stacked, max 3 + "+2"), comment count (💬 5)
- Priority indicator: left border color (high=red, medium=yellow, low=green)
- Hover: slight lift, border highlight

**STATE:**
- activeProject: 1
- selectedTask: null
- showTaskModal: false
- searchQuery: ''
- projects: [{id: 1, name: 'Marketing Campaign', color: 'violet', taskCount: 12}, ...] (4 projects)
- columns: [
  {id: 'todo', title: 'To Do', color: 'gray', tasks: [{id: 1, title: 'Design landing page mockups', description: 'Create 3 variations...', labels: ['Design', 'Urgent'], dueDate: 'Jan 20', assignees: ['JD', 'SK'], priority: 'high', comments: 5, attachments: 2}, ...]},
  {id: 'progress', title: 'In Progress', color: 'blue', tasks: [...]},
  {id: 'review', title: 'Review', color: 'yellow', tasks: [...]},
  {id: 'done', title: 'Done', color: 'green', tasks: [...]}
] (12 total tasks)
- teamMembers: [{id: 1, name: 'John Doe', avatar: 'JD', online: true}, ...] (5 members)

**DESIGN SYSTEM:**
- pageBg: #0f0f23, sidebarBg: #0a0a1a, cardBg: #1a1a2e, columnBg: #12121f
- violet: #8b5cf6, violetHover: #7c3aed
- blue: #3b82f6, green: #22c55e, yellow: #eab308, red: #ef4444, orange: #f97316
- textPrimary: #f8fafc, textSecondary: #94a3b8, textMuted: #64748b
- border: #1e1e3f

**CRITICAL INTERACTIVITY:**
1. **Project Switch**: \`onClick: (e, el, s) => { s.root.update({ activeProject: 1 }) }\`, style: \`background: (el, s) => s.root.activeProject === 1 ? 'rgba(139,92,246,0.15)' : 'transparent'\`
2. **Add Task (+)**: \`onClick: (e, el, s) => { console.log('Add task to:', 'todo'); alert('Add task modal would open') }\`
3. **Task Card Click**: \`onClick: (e, el, s) => { s.root.update({ selectedTask: 1, showTaskModal: true }) }\`
4. **Column Count**: \`text: (el, s) => s.root.columns[0].tasks.length\`
5. **Priority Border**: \`borderLeftColor: (el, s) => task.priority === 'high' ? 'red' : task.priority === 'medium' ? 'yellow' : 'green'\`
6. **Search**: \`onInput: (e, el, s) => { s.root.update({ searchQuery: e.target.value }) }\`
7. **NEVER use direct assignment** — always use \`s.root.update({ key: value })\`

**CRITICAL - config.js MUST have:**
\`\`\`js
export default { useReset: true, globalTheme: 'dark' }
\`\`\`

**CRITICAL - main.js MUST use actual components (NOT a default template):**
\`\`\`js
export const main = {
  extends: 'Flex',
  minHeight: '100vh',
  background: 'pageBg',
  Sidebar: {},
  MainArea: {
    extends: 'Flex',
    flexDirection: 'column',
    flex: '1',
    marginLeft: '260px',
    Navbar: {},
    KanbanBoard: {}
  }
}
\`\`\`

**FILES TO GENERATE:**
smbls/state.js, smbls/config.js (with globalTheme: 'dark'), smbls/designSystem/COLOR.js, smbls/designSystem/SPACING.js, smbls/designSystem/index.js, smbls/components/Navbar.js, smbls/components/Sidebar.js, smbls/components/ProjectItem.js, smbls/components/TeamMember.js, smbls/components/KanbanBoard.js, smbls/components/Column.js, smbls/components/TaskCard.js, smbls/components/LabelPill.js, smbls/components/index.js, smbls/pages/main.js (MUST use actual components), smbls/pages/index.js, smbls/index.js`,
  },
  {
    id: 'airbnb',
    name: 'Airbnb Clone',
    tagline: 'Vacation rental marketplace',
    description: 'Full Airbnb-style vacation rental platform with search, category filters, listing cards with favorites, and booking functionality.',
    category: 'Travel',
    tags: ['Rental', 'Travel', 'Booking', 'Light'],
    previewImage: '/templates/airbnb.svg',
    accentColor: '#FF385C',
    bgColor: '#ffffff',
    prompt: `Create a complete Symbols project for an Airbnb-style vacation rental platform with:

**NAVBAR (fixed top, white, shadow, 80px height):**
- Left: Airbnb logo (coral #FF385C icon + "airbnb" text)
- Center: Search bar pill with "Anywhere | Any week | Add guests" + coral search button
- Right: "Airbnb your home" link, globe icon, menu button (hamburger + avatar circle)

**CATEGORY BAR (horizontal scroll, below navbar):**
- Category pills with emoji icons: All, Beachfront, Cabins, Trending, OMG!, Luxe, Countryside, Lakefront
- Active category: black bottom border, full opacity
- Inactive: transparent border, 70% opacity
- Each category onClick filters listings

**LISTINGS GRID (4 columns, max-width 1120px):**
- ListingCard:
  - Image (aspect 1/0.95, rounded-12px) with heart button (top-right, toggles favorite)
  - "Guest favourite" or "Superhost" badge (top-left, white bg)
  - Info section: location (bold), title, dates, price + "/night"
  - Rating row: star icon + rating number
  - Hover: slight shadow
  - onClick: opens booking modal (sets selectedListing and showBookingModal)

**STATE:**
- categoryFilter: 'All'
- selectedListing: null
- showBookingModal: false
- favorites: []
- searchForm: {location: '', checkIn: '', checkOut: '', guests: 1}
- listings: 8 items with id, title, type, location, price, rating, reviews, host, superhost, guests, bedrooms, beds, baths, amenities, images (Unsplash URLs), description
- categories: array of {key, icon, label} for each category

**DESIGN SYSTEM (Airbnb palette):**
- coral: #FF385C, coralHover: #E31C5F
- pageBg: #ffffff, cardBg: #ffffff
- gray50: #f7f7f7, gray100: #f1f1f1, gray200: #DDDDDD, gray400: #717171, gray600: #484848, gray800: #222222
- borderLight: #EBEBEB, borderMedium: #DDDDDD
- starYellow: #FFC107, success: #008A05
- globalTheme: 'light' (IMPORTANT - Airbnb uses light theme)

**CRITICAL INTERACTIVITY:**
1. **Category Filter**: \`onClick: (e, el, s) => { s.root.update({ categoryFilter: 'Beachfront' }) }\`, style: \`borderBottomColor: (el, s) => s.root.categoryFilter === 'All' ? 'gray800' : 'transparent'\`
2. **Listing Cards**: \`display: (el, s) => s.root.categoryFilter === 'All' || s.root.categoryFilter === 'Beachfront' ? 'flex' : 'none'\`
3. **Listing Click**: \`onClick: (e, el, s) => { s.root.update({ selectedListing: 1, showBookingModal: true }) }\`
4. **Favorite Heart**: \`onClick: (e, el, s) => { e.stopPropagation(); var favs = s.root.favorites.slice(); var idx = favs.indexOf(1); if (idx > -1) favs.splice(idx, 1); else favs.push(1); s.root.update({ favorites: favs }) }\`
5. **Search Form**: \`onChange: (e, el, s) => { s.root.update({ searchForm: { ...s.root.searchForm, location: e.target.value } }) }\`
6. **NEVER use direct assignment** — always use \`s.root.update({ key: value })\`
7. **config.js MUST have globalTheme: 'light'** — Airbnb uses a light theme

**IMPORTANT - main.js MUST use actual components:**
The main page MUST include: Navbar, CategoryBar, ListingsGrid - NOT a default template.
main.js should have: Navbar: {}, then MainContent with CategoryBar: {} and ListingsGrid: {}

**FILES TO GENERATE:**
smbls/state.js, smbls/config.js (with globalTheme: 'light'), smbls/designSystem/COLOR.js, smbls/designSystem/SPACING.js, smbls/designSystem/index.js, smbls/components/Navbar.js, smbls/components/CategoryBar.js, smbls/components/ListingCard.js, smbls/components/ListingsGrid.js, smbls/components/index.js, smbls/pages/main.js (MUST use Navbar, CategoryBar, ListingsGrid), smbls/pages/index.js, smbls/index.js`,
  },
];
