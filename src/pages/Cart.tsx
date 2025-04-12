import { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { MinusCircle, PlusCircle, Trash, ChevronLeft, ShoppingBag, CreditCard, CheckCircle, ShieldCheck, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';
import { formatINR } from '@/utils/formatCurrency';

const Cart = () => {
  const { items, removeFromCart, updateQuantity, clearCart, getTotal } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [processProgress, setProcessProgress] = useState(0);
  const [checkoutComplete, setCheckoutComplete] = useState(false);

  const handleCheckout = () => {
    setIsProcessing(true);
    setProcessProgress(0);
    
    const interval = setInterval(() => {
      setProcessProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 75);
    
    setTimeout(() => {
      setCheckoutComplete(true);
      clearInterval(interval);
      setProcessProgress(100);
      
      setTimeout(() => {
        toast.success("Order placed successfully!", {
          description: "Your items will be delivered soon.",
          duration: 4000
        });
        clearCart();
        setIsProcessing(false);
        setCheckoutComplete(false);
      }, 1000);
    }, 1500);
  };

  useEffect(() => {
    return () => {
      setIsProcessing(false);
      setCheckoutComplete(false);
    };
  }, []);

  if (items.length === 0) {
    return (
      <div className="page-container">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        <div className="text-center py-16 space-y-4 max-w-md mx-auto animate-fade-in">
          <div className="bg-gray-50 w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-4">
            <ShoppingBag className="h-12 w-12 text-gray-300" />
          </div>
          <h2 className="text-2xl font-medium text-gray-600">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Looks like you haven't added any products to your cart yet.</p>
          <Link to="/">
            <Button className="bg-accent hover:bg-accent/90 btn-hover-effect">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="mb-6">
        <Link to="/">
          <Button variant="ghost" className="group">
            <ChevronLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Continue Shopping
          </Button>
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item, index) => (
            <div 
              key={item.product.id} 
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <Link to={`/product/${item.product.id}`} className="shrink-0">
                <img 
                  src={item.product.image} 
                  alt={item.product.title} 
                  className="h-20 w-20 object-contain transition-transform hover:scale-110"
                />
              </Link>
              
              <div className="flex-grow min-w-0 space-y-1">
                <Link to={`/product/${item.product.id}`}>
                  <h3 className="font-medium line-clamp-2 hover:text-accent transition-colors">{item.product.title}</h3>
                </Link>
                <p className="text-sm text-gray-500">Price: {formatINR(item.product.price)}</p>
              </div>
              
              <div className="flex sm:flex-col items-center gap-4 sm:gap-2 ml-auto">
                <div className="flex items-center bg-gray-50 rounded-full p-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-full"
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                  >
                    <MinusCircle className="h-4 w-4" />
                  </Button>
                  
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-full"
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                  >
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="font-bold">{formatINR(item.product.price * item.quantity)}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-full"
                    onClick={() => removeFromCart(item.product.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="lg:col-span-1">
          <div className="border rounded-xl p-6 bg-white shadow-sm sticky top-20 animate-fade-in">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>{formatINR(getTotal())}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-accent text-xl">{formatINR(getTotal())}</span>
                </div>
              </div>
            </div>
            
            {isProcessing ? (
              <div className="space-y-4">
                <Progress value={processProgress} className="h-2 w-full" />
                <div className="text-center text-sm text-gray-600">
                  {checkoutComplete ? (
                    <div className="flex items-center justify-center gap-2 text-green-600">
                      <CheckCircle className="h-5 w-5" />
                      <span>Payment successful!</span>
                    </div>
                  ) : (
                    <span>Processing your order...</span>
                  )}
                </div>
              </div>
            ) : (
              <Button 
                className="w-full bg-accent hover:bg-accent/90 btn-hover-effect"
                onClick={handleCheckout}
                disabled={isProcessing}
              >
                <CreditCard className="mr-2" /> Checkout
              </Button>
            )}
            
            <div className="mt-4 pt-4 border-t text-xs text-gray-500">
              <p className="flex items-center gap-1 mb-2">
                <ShieldCheck className="h-4 w-4 text-green-500" /> 
                Secure checkout
              </p>
              <p className="flex items-center gap-1">
                <Truck className="h-4 w-4" /> 
                Free shipping on all orders
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
