import { usdToSats } from './utils';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  priceInSats: number;
  category: string;
  image: string;
  downloadUrl?: string;
  featured?: boolean;
  tags: string[];
}

/**
 * Updates all products with current Bitcoin price for accurate sats conversion
 */
export async function getProductsWithCurrentSatsPrice(): Promise<Product[]> {
  const updatedProducts = await Promise.all(
    sampleProducts.map(async (product) => ({
      ...product,
      priceInSats: await usdToSats(product.price)
    }))
  );
  
  return updatedProducts;
}

/**
 * Updates a single product with current Bitcoin price for accurate sats conversion
 */
export async function getProductWithCurrentSatsPrice(productId: string): Promise<Product | null> {
  const product = sampleProducts.find(p => p.id === productId);
  if (!product) return null;
  
  return {
    ...product,
    priceInSats: await usdToSats(product.price)
  };
}

export const sampleProducts: Product[] = [
  {
    id: "ui-kit-1",
    name: "Modern Dashboard UI Kit",
    description: "Complete dashboard UI components with 50+ screens and dark/light themes.",
    price: 1.99,
    priceInSats: 0, // Will be calculated dynamically
    category: "UI Kits",
    image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop&auto=format",
    featured: true,
    tags: ["dashboard", "admin", "react", "figma"]
  },
  {
    id: "icon-pack-1",
    name: "Lightning Icon Pack",
    description: "500+ premium icons optimized for web and mobile applications.",
    price: 0.99,
    priceInSats: 0, // Will be calculated dynamically
    category: "Icons",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop&auto=format",
    tags: ["icons", "svg", "web", "mobile"]
  },
  {
    id: "photo-1",
    name: "Workspace Stock Photo",
    description: "High-resolution workspace photo perfect for landing pages and presentations.",
    price: 0.50,
    priceInSats: 0, // Will be calculated dynamically
    category: "Photos",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop&auto=format",
    tags: ["workspace", "office", "business", "stock"]
  },
  {
    id: "font-1",
    name: "Geometric Sans Font Family",
    description: "Modern geometric font family with 8 weights and italic variants.",
    price: 1.50,
    priceInSats: 0, // Will be calculated dynamically
    category: "Fonts",
    image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop&auto=format",
    featured: true,
    tags: ["typography", "geometric", "modern", "family"]
  },
  {
    id: "template-1",
    name: "Landing Page Template",
    description: "Conversion-optimized landing page template built with React and Tailwind.",
    price: 1.25,
    priceInSats: 0, // Will be calculated dynamically
    category: "Templates",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop&auto=format",
    tags: ["landing", "react", "tailwind", "conversion"]
  },
  {
    id: "micro-1",
    name: "Coffee Tip",
    description: "Support the development with a small tip - like buying me a coffee!",
    price: 0.25,
    priceInSats: 0, // Will be calculated dynamically
    category: "Tips",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop&auto=format",
    tags: ["tip", "support", "coffee", "micro"]
  }
];
