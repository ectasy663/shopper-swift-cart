
import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Star, ChevronLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const { 
    data: product, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['product', id],
    queryFn: () => api.getProduct(Number(id)),
    enabled: !!id
  });

  useEffect(() => {
    if (error) {
      navigate('/');
    }
  }, [error, navigate]);

  if (isLoading) {
    return (
      <div className="page-container">
        <div className="mb-6">
          <Button variant="ghost" className="mb-6">
            <ChevronLeft size={16} className="mr-2" /> Back to Products
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg p-6 flex items-center justify-center">
            <Skeleton className="h-[300px] w-full" />
          </div>
          
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <div className="flex items-center space-x-2">
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-32 w-full" />
            <div className="pt-4">
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const formatCategoryName = (category: string) => {
    return category
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="page-container">
      <div className="mb-6">
        <Link to="/">
          <Button variant="ghost">
            <ChevronLeft size={16} className="mr-2" /> Back to Products
          </Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg p-6 flex items-center justify-center">
          <img 
            src={product.image} 
            alt={product.title} 
            className="max-h-[400px] max-w-full object-contain"
          />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-2xl md:text-3xl font-bold">{product.title}</h1>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              <span className="ml-1 font-medium">{product.rating.rate}</span>
            </div>
            <span className="text-gray-400">|</span>
            <span className="text-gray-600">{product.rating.count} reviews</span>
            <Badge variant="outline">{formatCategoryName(product.category)}</Badge>
          </div>
          
          <div className="text-2xl font-bold text-accent">${product.price.toFixed(2)}</div>
          
          <p className="text-gray-700">{product.description}</p>
          
          <div className="pt-4">
            <Button 
              onClick={() => addToCart(product)}
              size="lg"
              className="bg-accent hover:bg-accent/90"
            >
              <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
