
import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { MinusCircle, PlusCircle, Trash, ChevronLeft, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const Cart = () => {
  const { items, removeFromCart, updateQuantity, clearCart, getTotal } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = () => {
    setIsProcessing(true);
    
    // Simulate processing time
    setTimeout(() => {
      toast.success("Order placed successfully!");
      clearCart();
      setIsProcessing(false);
    }, 1500);
  };

  if (items.length === 0) {
    return (
      <div className="page-container">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        <div className="text-center py-16 space-y-4">
          <ShoppingBag className="h-16 w-16 mx-auto text-gray-300" />
          <h2 className="text-2xl font-medium text-gray-600">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Looks like you haven't added any products to your cart yet.</p>
          <Link to="/">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="mb-6">
        <Link to="/">
          <Button variant="ghost">
            <ChevronLeft size={16} className="mr-2" /> Continue Shopping
          </Button>
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.product.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border rounded-lg bg-white">
              <Link to={`/product/${item.product.id}`} className="shrink-0">
                <img 
                  src={item.product.image} 
                  alt={item.product.title} 
                  className="h-20 w-20 object-contain"
                />
              </Link>
              
              <div className="flex-grow min-w-0 space-y-1">
                <Link to={`/product/${item.product.id}`}>
                  <h3 className="font-medium line-clamp-2 hover:text-accent">{item.product.title}</h3>
                </Link>
                <p className="text-sm text-gray-500">Price: ${item.product.price.toFixed(2)}</p>
              </div>
              
              <div className="flex sm:flex-col items-center gap-4 sm:gap-2 ml-auto">
                <div className="flex items-center">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                  >
                    <MinusCircle className="h-4 w-4" />
                  </Button>
                  
                  <span className="w-8 text-center">{item.quantity}</span>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                  >
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="font-bold">${(item.product.price * item.quantity).toFixed(2)}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-red-500"
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
          <div className="border rounded-lg p-6 bg-white sticky top-4">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>${getTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${getTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <Button 
              className="w-full bg-accent hover:bg-accent/90"
              onClick={handleCheckout}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Checkout'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
