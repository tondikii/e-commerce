import "midtrans-client";

declare module "midtrans-client" {
  interface SnapTransactionParameters {
    item_details?: {
      id: string;
      price: number;
      quantity: number;
      name: string;
    }[];
    customer_details?: {
      first_name?: string;
      last_name?: string;
      email?: string;
      phone?: string;
      shipping_address?: {
        first_name?: string;
        phone?: string;
        address?: string;
        city?: string;
        postal_code?: string;
        country_code?: string;
      };
    };
    callbacks?: {
      finish?: string;
      error?: string;
      pending?: string;
    };
  }
}
