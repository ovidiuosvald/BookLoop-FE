export enum OrderStatus {
  Placed = 'PLACED',
  Processing = 'PROCESSING',
  Shipped = 'SHIPPED',
  Delivered = 'DELIVERED',
  Cancelled = 'CANCELLED',
}

export enum DeliveryMethod {
  Courier = 'COURIER',
  Pickup = 'PICKUP',
}

export enum PaymentMethod {
  CashOnDelivery = 'CASH_ON_DELIVERY',
  Card = 'CARD',
  BankTransfer = 'BANK_TRANSFER',
}

export enum BillingType {
  Individual = 'INDIVIDUAL',
  Company = 'COMPANY',
}
