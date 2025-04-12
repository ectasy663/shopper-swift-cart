
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="text-center">
        <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-accent" />
        <h1 className="text-5xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-6">
          Oops! The page you're looking for doesn't exist.
        </p>
        <Link to="/">
          <Button className="bg-accent hover:bg-accent/90">
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
