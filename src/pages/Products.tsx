import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api, Product } from '@/services/api';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { SearchIcon, ShoppingCart, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { formatINR } from '@/utils/formatCurrency';

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const { addToCart } = useCart();

  const { 
    data: categories = [], 
    isLoading: categoriesLoading 
  } = useQuery({
    queryKey: ['categories'],
    queryFn: api.getCategories
  });

  const { 
    data: products = [], 
    isLoading: productsLoading 
  } = useQuery({
    queryKey: ['products', selectedCategory],
    queryFn: () => selectedCategory 
      ? api.getProductsByCategory(selectedCategory) 
      : api.getProducts()
  });

  useEffect(() => {
    if (!productsLoading && products.length > 0) {
      const timer = setTimeout(() => {
        setIsLoaded(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [productsLoading, products]);

  const filteredProducts = products.filter(product => 
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatCategoryName = (category: string) => {
    return category
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast(`Added ${product.title.substring(0, 20)}... to cart`);
  };

  if (productsLoading) {
    return (
      <div className="page-container">
        <div className="space-y-8 animate-fade-in">
          <h1 className="text-3xl font-bold mb-6">Discover Products</h1>
          <div className="flex flex-wrap gap-2 mb-6">
            {Array(5).fill(0).map((_, index) => (
              <Skeleton key={index} className="h-10 w-24 rounded-full" />
            ))}
          </div>
          <div className="relative w-full max-w-xs mb-8">
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="product-grid">
            {Array(8).fill(0).map((_, index) => (
              <Card key={index} className="product-card">
                <Skeleton className="h-48 w-full" />
                <CardContent className="pt-6">
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-10 w-28" />
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="space-y-8 animate-fade-in">
        <h1 className="text-3xl font-bold">Discover Products</h1>
        
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === '' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('')}
              className="rounded-full px-5 transition-all hover:scale-105"
            >
              All
            </Button>
            
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
                className="rounded-full px-5 transition-all hover:scale-105"
              >
                {formatCategoryName(category)}
              </Button>
            ))}
          </div>
          
          <div className="relative w-full lg:w-auto lg:min-w-[300px]">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-full"
            />
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">No products found matching your criteria.</p>
          </div>
        ) : (
          <div className="product-grid">
            {filteredProducts.map((product, index) => (
              <Card 
                key={product.id} 
                className={`product-card ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`} 
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <Link to={`/product/${product.id}`} className="product-image-container group">
                  <img 
                    src={product.image} 
                    alt={product.title} 
                    className="product-image transition-transform group-hover:scale-110" 
                  />
                </Link>
                <CardContent className="pt-6 flex flex-col gap-2">
                  <div className="flex items-center mb-1">
                    <div className="flex items-center mr-2">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="ml-1 text-sm text-gray-700">{product.rating.rate}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">{formatCategoryName(product.category)}</Badge>
                  </div>
                  <Link to={`/product/${product.id}`} className="no-underline">
                    <h3 className="text-lg font-medium line-clamp-2 hover:text-accent transition-colors">{product.title}</h3>
                  </Link>
                </CardContent>
                <CardFooter className="flex justify-between mt-auto">
                  <p className="text-xl font-bold text-gray-900">{formatINR(product.price)}</p>
                  <Button 
                    onClick={() => handleAddToCart(product)}
                    className="bg-accent hover:bg-accent/90 text-white btn-hover-effect"
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" /> Add
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
