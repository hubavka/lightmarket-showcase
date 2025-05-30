"use client";

import { useState } from "react";
import { Zap, Download, Star, Tag } from "lucide-react";
import { Product } from "@/lib/products";
import { formatPrice, formatSats } from "@/lib/utils";
import PaymentButton from "./PaymentButton";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {

  return (
    <div className="group relative overflow-hidden rounded-xl bg-white shadow-sm border border-gray-200 transition-all hover:shadow-lg hover:-translate-y-1">
      {/* Featured badge */}
      {product.featured && (
        <div className="absolute top-3 left-3 z-10 flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
          <Star className="mr-1 h-3 w-3 fill-current" />
          Featured
        </div>
      )}
      
      {/* Product image */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <img 
          src={product.image} 
          alt={product.name}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Product info */}
      <div className="p-6">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-500">{product.category}</span>
          <div className="flex items-center text-orange-600">
            <Zap className="mr-1 h-3 w-3" />
            <span className="text-xs font-medium">{formatSats(product.priceInSats)} sats</span>
          </div>
        </div>
        
        <h3 className="mb-2 text-lg font-semibold text-gray-900">
          {product.name}
        </h3>
        
        <p className="mb-4 text-sm text-gray-600">
          {product.description}
        </p>
        
        {/* Tags */}
        <div className="mb-4 flex flex-wrap gap-1">
          {product.tags?.slice(0, 3).map((tag) => (
            <span key={tag} className="inline-flex items-center rounded bg-gray-100 px-2 py-1 text-xs text-gray-700">
              <Tag className="mr-1 h-3 w-3" />
              {tag}
            </span>
          ))}
        </div>
        
        {/* Price and purchase button */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</span>
            <span className="text-xs text-gray-500">≈ {formatSats(product.priceInSats)} sats</span>
          </div>
          
          <PaymentButton product={product} />
        </div>
      </div>
    </div>
  );
}
