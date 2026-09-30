"use client";

import * as React from "react";
import Image from "next/image";
import { Product } from "@/lib/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { cartActions } from "@/lib/store/cart-store";
import {
  Plus,
  Minus,
  Check,
  Star,
  Cpu,
  Server,
  HardDrive,
  Shield,
  Layers,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [quantity, setQuantity] = React.useState(1);
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
        return <Layers className="h-3 w-3" />;
    }
  };

  const handleAddToCart = () => {
    cartActions.addItem(product, quantity);
    setJustAdded(true);
    toast.success(`Allocated ${quantity}x ${product.name} to requisition cart`, {
      description: `Total: ${formatCurrency(product.price * quantity)} • ${product.datacenter || "Ashburn DC"}`,
      action: {
        label: "View Cart",
        onClick: () => cartActions.setIsDrawerOpen(true),
      },
    });

    setTimeout(() => {
      setJustAdded(false);
      setQuantity(1);
    }, 1200);
  };

  return (
    <Card className="group flex flex-col justify-between overflow-hidden border-border/70 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all duration-200 hover:shadow-sm bg-card">
      <div>
        {/* Hardware Image & Datacenter Tag */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted/40 border-b">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Form factor & Category Pill */}
          <div className="absolute top-2.5 left-2.5 flex gap-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-zinc-900/85 text-zinc-100 backdrop-blur-sm">
              {getCategoryIcon(product.category)}
              <span className="capitalize">{product.category}</span>
            </span>
            {product.formFactor && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-900/85 text-zinc-300 backdrop-blur-sm">
                {product.formFactor}
              </span>
            )}
          </div>

          {/* Availability Badge */}
          <div className="absolute bottom-2.5 left-2.5 bg-background/90 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-medium flex items-center gap-1 border shadow-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="text-foreground">{product.stock} available</span>
            <span className="text-muted-foreground">• {product.leadTime || "Ships 24h"}</span>
          </div>

          {/* Rating */}
          <div className="absolute top-2.5 right-2.5 bg-background/90 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] font-medium flex items-center gap-1 border">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span>{product.rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Card Body */}
        <CardContent className="p-4 space-y-3">
          <div>
            <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono mb-1">
              <span>{product.sku || `SKU-${product.id}`}</span>
              <span className="flex items-center gap-1 text-[10px]">
                <MapPin className="h-3 w-3" />
                {product.datacenter?.split("(")[0].trim() || "US-East"}
              </span>
            </div>
            <h3 className="font-semibold text-sm leading-snug group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mt-1">
              {product.description}
            </p>
          </div>

          {/* Key Engineering Specs */}
          <div className="space-y-1.5 pt-1 border-t border-border/40">
            <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">
              Node Architecture Specs
            </span>
            <div className="grid grid-cols-2 gap-1 text-[11px] font-mono text-zinc-700 dark:text-zinc-300">
              {product.features.map((feat) => (
                <div
                  key={feat}
                  className="bg-muted/50 px-2 py-1 rounded truncate border border-border/40"
                  title={feat}
                >
                  {feat}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </div>

      {/* Card Footer: Pricing & Quantity Actions */}
      <CardFooter className="p-4 pt-3 flex flex-col gap-2.5 border-t border-border/50 bg-muted/15">
        <div className="flex items-baseline justify-between w-full">
          <div>
            <span className="text-[10px] text-muted-foreground uppercase font-medium">
              Enterprise Unit Price
            </span>
            <div className="text-base font-bold font-mono text-foreground">
              {formatCurrency(product.price)}
            </div>
          </div>

          {/* Quantity Stepper */}
          <div className="flex items-center border rounded-md bg-background">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-1 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="px-2 text-xs font-mono font-medium">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              className="p-1 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
        </div>

        <Button
          size="sm"
          onClick={handleAddToCart}
          variant={justAdded ? "secondary" : "default"}
          className="w-full h-8 text-xs font-semibold gap-1.5"
        >
          {justAdded ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-500" />
              <span>Allocated to Requisition</span>
            </>
          ) : (
            <>
              <Plus className="h-3.5 w-3.5" />
              <span>Add to Requisition ({quantity})</span>
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
