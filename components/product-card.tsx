"use client";

import * as React from "react";
import Image from "next/image";
import { Product } from "@/lib/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { cartActions } from "@/lib/store/cart-store";
import { Plus, Check, Star } from "lucide-react";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [added, setAdded] = React.useState(false);

  const handleAddToCart = () => {
    cartActions.addItem(product, 1);
    setAdded(true);
    toast.success(`Added ${product.name} to cart!`);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <Card className="flex flex-col justify-between overflow-hidden border transition-all duration-200 hover:shadow-md bg-card">
      <div>
        {/* Product Image */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-2 right-2 bg-background/90 px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1 shadow-xs">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span>{product.rating}</span>
          </div>
        </div>

        {/* Product Details */}
        <CardContent className="p-4 space-y-1.5">
          <span className="text-[10px] uppercase font-bold tracking-wider text-primary">
            {product.category}
          </span>
          <h3 className="font-semibold text-sm leading-snug line-clamp-1">
            {product.name}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </CardContent>
      </div>

      {/* Footer with Price and Add Button */}
      <CardFooter className="p-4 pt-0 flex items-center justify-between border-t mt-3 bg-muted/10">
        <div>
          <span className="text-[10px] text-muted-foreground block">Price</span>
          <span className="text-base font-bold text-foreground">
            {formatCurrency(product.price)}
          </span>
        </div>

        <Button
          size="sm"
          onClick={handleAddToCart}
          variant={added ? "secondary" : "default"}
          className="h-8 gap-1.5 text-xs font-medium"
        >
          {added ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-500" />
              <span>Added</span>
            </>
          ) : (
            <>
              <Plus className="h-3.5 w-3.5" />
              <span>Add to Cart</span>
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
