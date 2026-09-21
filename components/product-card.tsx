"use client";

import * as React from "react";
import Image from "next/image";
import { Product } from "@/lib/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { cartActions } from "@/lib/store/cart-store";
import { Plus, Check, Star, Cpu, Server, HardDrive, Shield } from "lucide-react";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [justAdded, setJustAdded] = React.useState(false);

  const getCategoryIcon = (category: Product["category"]) => {
    switch (category) {
      case "compute":
        return <Cpu className="h-3 w-3" />;
      case "networking":
        return <Server className="h-3 w-3" />;
      case "storage":
        return <HardDrive className="h-3 w-3" />;
      case "security":
        return <Shield className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const handleAddToCart = () => {
    cartActions.addItem(product, 1);
    setJustAdded(true);
    toast.success(`Added ${product.name} to cart`, {
      description: `Unit price: ${formatCurrency(product.price)}`,
      action: {
        label: "View Cart",
        onClick: () => cartActions.setIsDrawerOpen(true),
      },
    });

    setTimeout(() => {
      setJustAdded(false);
    }, 1200);
  };

  return (
    <Card className="group flex flex-col justify-between overflow-hidden border-border/70 hover:border-primary/50 transition-all duration-300 hover:shadow-md bg-card">
      <div>
        {/* Product Image & Badges */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-2 left-2 flex gap-1.5 flex-wrap">
            <Badge
              variant="secondary"
              className="text-[10px] uppercase font-bold tracking-wider backdrop-blur-md bg-background/80 flex items-center gap-1"
            >
              {getCategoryIcon(product.category)}
              <span>{product.category}</span>
            </Badge>
            {product.badge && (
              <Badge variant="default" className="text-[10px] font-semibold">
                {product.badge}
              </Badge>
            )}
          </div>

          <div className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-md px-2 py-0.5 rounded-full text-[11px] font-medium flex items-center gap-1">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span>{product.rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Card Body */}
        <CardContent className="p-4 space-y-2.5">
          <div className="space-y-1">
            <h3 className="font-semibold text-sm leading-snug line-clamp-1 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Specs / Feature pills */}
          <div className="flex flex-wrap gap-1 pt-1">
            {product.features.slice(0, 3).map((f) => (
              <span
                key={f}
                className="text-[10px] bg-muted px-2 py-0.5 rounded text-muted-foreground font-mono"
              >
                {f}
              </span>
            ))}
          </div>
        </CardContent>
      </div>

      {/* Card Footer */}
      <CardFooter className="p-4 pt-0 flex items-center justify-between border-t border-border/40 mt-2 bg-muted/10">
        <div className="space-y-0.5">
          <span className="text-[10px] text-muted-foreground uppercase font-semibold">
            Price / Node
          </span>
          <p className="text-base font-bold font-mono text-foreground">
            {formatCurrency(product.price)}
          </p>
        </div>

        <Button
          size="sm"
          onClick={handleAddToCart}
          variant={justAdded ? "secondary" : "default"}
          className="h-8 gap-1.5 text-xs font-semibold"
          aria-label={`Add ${product.name} to provisioning cart`}
        >
          {justAdded ? (
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
