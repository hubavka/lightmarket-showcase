"use client";

import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { sampleProducts, getProductsWithCurrentSatsPrice, type Product } from "@/lib/products";

export default function ProductsSection() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [products, setProducts] = useState<Product[]>(sampleProducts);
  const [isLoadingPrices, setIsLoadingPrices] = useState(true);
  const [priceError, setPriceError] = useState<string | null>(null);
  
  // Load products with current Bitcoin prices on mount
  useEffect(() => {
    const loadProductsWithCurrentPrices = async () => {
      try {
        setPriceError(null);
        const updatedProducts = await getProductsWithCurrentSatsPrice();
        setProducts(updatedProducts);
      } catch (error) {
        console.error('Failed to load current Bitcoin prices:', error);
        setPriceError(error instanceof Error ? error.message : 'Failed to load Bitcoin prices');
        // Keep the original products with 0 sats values - they won't be purchasable
      } finally {
        setIsLoadingPrices(false);
      }
    };

    loadProductsWithCurrentPrices();
  }, []);
  
  const categories = ["All", ...Array.from(new Set(products.map(p => p.category)))];
  
  const filteredProducts = selectedCategory === "All" 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <section id="products" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
            Digital Products Marketplace
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Discover premium digital assets and experience lightning-fast payments. 
            All purchases are instant and global.
            {isLoadingPrices && (
              <span className="block text-sm text-orange-600 mt-2">
                🔄 Loading current Bitcoin prices...
              </span>
            )}
            {priceError && (
              <span className="block text-sm text-red-600 mt-2">
                ⚠️ {priceError}
              </span>
            )}
          </p>
        </div>

        {/* Category filter */}
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                selectedCategory === category
                  ? "bg-orange-500 text-white shadow-md"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Products grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
