export default {
  cartCount: 0,
  activeView: 'home',
  selectedProduct: null,
  searchQuery: '',
  activeCategory: 'all',
  products: [
    { id: 1, title: 'Wireless Noise-Cancelling Headphones', price: 279.99, originalPrice: 349.99, rating: 4.8, reviews: 2341, category: 'electronics', badge: 'Best Seller', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400' },
    { id: 2, title: 'Minimalist Leather Watch', price: 189.00, originalPrice: null, rating: 4.9, reviews: 876, category: 'fashion', badge: 'New', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400' },
    { id: 3, title: 'Ultra-Slim Laptop Stand', price: 49.99, originalPrice: 69.99, rating: 4.7, reviews: 1204, category: 'electronics', badge: 'Sale', image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400' },
    { id: 4, title: 'Ceramic Pour-Over Coffee Set', price: 64.00, originalPrice: null, rating: 4.6, reviews: 543, category: 'home', badge: null, image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400' },
    { id: 5, title: 'Premium Yoga Mat Pro', price: 88.00, originalPrice: 120.00, rating: 4.8, reviews: 3102, category: 'sports', badge: 'Popular', image: 'https://images.unsplash.com/photo-1601925228518-3c4f2e9c4b2e?w=400' },
    { id: 6, title: 'Smart Home Air Purifier', price: 199.00, originalPrice: 249.00, rating: 4.5, reviews: 921, category: 'home', badge: 'Sale', image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400' },
    { id: 7, title: 'Running Shoes Ultra Boost', price: 159.99, originalPrice: null, rating: 4.7, reviews: 4521, category: 'sports', badge: 'Best Seller', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400' },
    { id: 8, title: 'Structured Tote Bag', price: 95.00, originalPrice: null, rating: 4.8, reviews: 672, category: 'fashion', badge: 'New', image: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=400' }
  ],
  categories: [
    { id: 'all', label: 'All Products' },
    { id: 'electronics', label: 'Electronics' },
    { id: 'fashion', label: 'Fashion' },
    { id: 'home', label: 'Home' },
    { id: 'sports', label: 'Sports' }
  ],
  cartItems: []
}
