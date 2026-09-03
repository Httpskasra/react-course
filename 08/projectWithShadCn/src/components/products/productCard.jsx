import { Link } from "react-router-dom"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function ProductCard({ product }) {
  return (
    <Card className="relative mx-auto w-full max-w-sm pt-0">
      <div className="absolute inset-0 z-30 aspect-video bg-black/35" />

      <img
        src={product.image}
        alt={product.title}
        className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
      />

      <CardHeader>
        <CardAction>
          <Badge variant="default">
            {product.category}
          </Badge>
        </CardAction>

        <CardTitle>
          {product.title}
        </CardTitle>

        <CardDescription>
          {product.description}
        </CardDescription>
      </CardHeader>

      <CardFooter className="flex-col gap-3">
        <div className="w-full text-lg font-bold">
          {product.price} تومان
        </div>

        <Button asChild className="w-full">
          <Link to={`/products/${product.id}`}>
            مشاهده محصول
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}