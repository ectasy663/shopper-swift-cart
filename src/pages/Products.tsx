
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api, Product } from '@/services/api';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { SearchIcon, ShoppingCart } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
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

  const filteredProducts = products.filter(product => 
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatCategoryName = (category: string) => {
    return category
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (productsLoading) {
    return (
      <div className="page-container">
        <h1 className="text-3xl font-bold mb-6">Products</h1>
        <div className="flex flex-wrap gap-2 mb-6">
          {Array(5).fill(0).map((_, index) => (
            <Skeleton key={index} className="h-8 w-24" />
          ))}
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
    );
  }

  return (
    <div className="page-container">
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === '' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('')}
          >
            All
          </Button>
          
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category)}
            >
              {formatCategoryName(category)}
            </Button>
          ))}
        </div>
        
        <div className="relative w-full sm:w-auto sm:ml-auto">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500">No products found matching your criteria.</p>
        </div>
      ) : (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="product-card">
              <Link to={`/product/${product.id}`} className="product-image-container">
                <img src={product.image} alt={product.title} className="product-image" />
              </Link>
              <CardContent className="pt-6">
                <Link to={`/product/${product.id}`} className="no-underline">
                  <h3 className="text-lg font-medium line-clamp-2 mb-2 hover:text-accent">{product.title}</h3>
                </Link>
                <Badge variant="outline" className="mb-2">{formatCategoryName(product.category)}</Badge>
              </CardContent>
              <CardFooter className="flex justify-between mt-auto">
                <p className="text-lg font-bold">${product.price.toFixed(2)}</p>
                <Button 
                  onClick={() => addToCart(product)}
                  className="bg-accent hover:bg-accent/90 text-white"
                >
                  <ShoppingCart className="mr-2 h-4 w-4" /> Add
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
