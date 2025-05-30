"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";
import { sampleProducts, Product } from "@/lib/products";

export default function ProductsSection() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  const categories = ["All", ...Array.from(new Set(sampleProducts.map(p => p.category)))];
  
  const filteredProducts = selectedCategory === "All" 
    ? sampleProducts 
    : sampleProducts.filter(p => p.category === selectedCategory);

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
