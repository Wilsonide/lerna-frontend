"use client";

import { Card, CardContent } from "@/components/ui/card";

export default function OrdersPage() {
  const orders = [
    {
      id: 1,
      customer: "Wilson",
      total: 120,
      status: "Paid",
    },
    {
      id: 2,
      customer: "John",
      total: 80,
      status: "Pending",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Orders</h1>

        <p className="text-muted-foreground">Manage customer orders</p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <h2 className="font-semibold">Order #{order.id}</h2>

                <p className="text-sm text-muted-foreground">
                  {order.customer}
                </p>
              </div>

              <div className="text-right">
                <p className="font-bold">${order.total}</p>

                <p className="text-sm text-brand-orange">{order.status}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
