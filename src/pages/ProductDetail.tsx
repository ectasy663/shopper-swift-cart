
import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Star, ChevronLeft, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

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

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      toast(`Added ${product.title.substring(0, 20)}... to cart`);
    }
  };

  if (isLoading) {
    return (
      <div className="page-container">
        <div className="mb-6">
          <Button variant="ghost" className="mb-6">
            <ChevronLeft size={16} className="mr-2" /> Back to Products
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
          <div className="bg-white rounded-xl p-6 flex items-center justify-center shadow-sm">
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
          <Button variant="ghost" className="group">
            <ChevronLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Products
          </Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
        <div className="bg-white rounded-xl p-8 flex items-center justify-center shadow-sm">
          <img 
            src={product.image} 
            alt={product.title} 
            className="max-h-[400px] max-w-full object-contain hover:scale-105 transition-transform"
          />
        </div>
        
        <div className="space-y-6">
          <Badge variant="outline" className="mb-2">{formatCategoryName(product.category)}</Badge>
          <h1 className="text-2xl md:text-3xl font-bold">{product.title}</h1>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-md">
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              <span className="ml-1 font-medium">{product.rating.rate}</span>
            </div>
            <span className="text-gray-400">|</span>
            <span className="text-gray-600">{product.rating.count} reviews</span>
          </div>
          
          <div className="text-3xl font-bold text-accent">${product.price.toFixed(2)}</div>
          
          <p className="text-gray-700 leading-relaxed">{product.description}</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg">
              <Truck className="h-5 w-5 text-gray-700" />
              <span className="text-sm font-medium">Free Shipping</span>
            </div>
            <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg">
              <ShieldCheck className="h-5 w-5 text-gray-700" />
              <span className="text-sm font-medium">Secure Payment</span>
            </div>
            <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg">
              <RotateCcw className="h-5 w-5 text-gray-700" />
              <span className="text-sm font-medium">30-Day Returns</span>
            </div>
          </div>
          
          <div className="pt-6">
            <Button 
              onClick={handleAddToCart}
              size="lg"
              className="bg-accent hover:bg-accent/90 w-full sm:w-auto btn-hover-effect"
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
