import { toast } from "sonner";

const API_URL = 'https://fakestoreapi.com';

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export interface Category {
  id: number;
  name: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface CartItem {
  id: number;
  productId: number;
  product: Product;
  quantity: number;
}

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Something went wrong');
  }
  return response.json();
};

export const api = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please check your credentials.');
      throw error;
    }
  },

  getProducts: async (): Promise<Product[]> => {
    try {
      const response = await fetch(`${API_URL}/products`);
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products. Please try again.');
      throw error;
    }
  },

  getProductsByCategory: async (category: string): Promise<Product[]> => {
    try {
      const response = await fetch(`${API_URL}/products/category/${category}`);
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching products by category:', error);
      toast.error('Failed to load category products. Please try again.');
      throw error;
    }
  },

  getProduct: async (id: number): Promise<Product> => {
    try {
      const response = await fetch(`${API_URL}/products/${id}`);
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to load product details. Please try again.');
      throw error;
    }
  },

  getCategories: async (): Promise<string[]> => {
    try {
      const response = await fetch(`${API_URL}/products/categories`);
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories. Please try again.');
      throw error;
    }
  },
};
