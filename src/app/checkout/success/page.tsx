import Link from "next/link";
import { CheckCircle, ShoppingBag } from "lucide-react";

export default function CheckoutSuccessPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="mb-6">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
      </div>

      <h1 className="text-3xl font-bold mb-4">Order Placed Successfully!</h1>

      <p className="text-gray-600 mb-8">
        Thank you for your order. We have received your order and will process it shortly.
        You will receive a confirmation call/message soon.
      </p>

      <div className="space-y-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-amber-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-amber-700"
        >
          <ShoppingBag className="h-5 w-5" />
          Continue Shopping
        </Link>
      </div>

      <div className="mt-12 p-6 bg-gray-50 rounded-xl">
        <h2 className="font-semibold mb-2">What happens next?</h2>
        <ul className="text-left space-y-2 text-gray-600">
          <li>1. We will call you to confirm your order</li>
          <li>2. Your order will be prepared for shipping</li>
          <li>3. We will contact you for delivery</li>
          <li>4. Pay on delivery or via your chosen payment method</li>
        </ul>
      </div>
    </div>
  );
}
