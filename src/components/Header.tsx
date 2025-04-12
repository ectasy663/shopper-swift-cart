
import { Link } from 'react-router-dom';
import { ShoppingCart, LogOut, Menu, X, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';

const Header = () => {
  const { logout } = useAuth();
  const { itemCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-10 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-white'}`}>
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="text-xl font-bold text-accent flex items-center gap-2 transition-transform hover:scale-105">
          <ShoppingBag className="h-6 w-6" />
          <span className="hidden sm:inline">Swift Cart</span>
          <span className="sm:hidden">SC</span>
        </Link>

        {/* Mobile menu button */}
        <button
          className="md:hidden flex items-center"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="font-medium hover:text-accent transition-colors">
            Home
          </Link>
          <div className="flex items-center">
            <Link to="/cart" className="relative group">
              <Button variant="ghost" className="font-medium hover:text-accent p-0 group-hover:bg-muted/50 transition-all">
                <ShoppingCart className="mr-2 transition-transform group-hover:scale-110" /> Cart
                {itemCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-accent animate-scale-in">
                    {itemCount}
                  </Badge>
                )}
              </Button>
            </Link>
          </div>
          <Button 
            variant="ghost" 
            onClick={logout} 
            className="font-medium hover:text-accent p-0 transition-all hover:bg-muted/50"
          >
            <LogOut className="mr-2" /> Logout
          </Button>
        </nav>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-white/95 backdrop-blur-md border-b shadow-lg md:hidden z-20 animate-fade-in">
            <div className="flex flex-col p-4 space-y-4">
              <Link 
                to="/" 
                className="p-2 hover:bg-muted/50 rounded-lg transition-colors flex items-center" 
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/cart" 
                className="p-2 hover:bg-muted/50 rounded-lg transition-colors flex items-center justify-between" 
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center">
                  <ShoppingCart className="mr-2" /> Cart
                </div>
                {itemCount > 0 && (
                  <Badge className="bg-accent">{itemCount}</Badge>
                )}
              </Link>
              <Button 
                variant="ghost" 
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }} 
                className="p-2 hover:bg-muted/50 rounded-lg transition-colors justify-start"
              >
                <LogOut className="mr-2" /> Logout
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
