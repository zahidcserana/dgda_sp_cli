export class CartServiceConfig {
    settings: any;
}

export class CartItem {
    id: number;
    token: number;
    product_id: number;
    price: number;
    quantity: number;
    rent_start: string;
    rental_duration: number;
    rental_type: string;
    term: number;
    sales_tax: number;
    deposit_amount: number;
    delivery_tax?: any;
    deposite_tax: string;
    driving_license_required: boolean = false;
    variants_products_id: number;
    location: number;
}

export class CheckOut {
    first_name: string;
    last_name: string;
    mobile: string;
    email: string;
    company_name: string;
    address_line1: string;
    city: string;
    state_id: string;
    zipcode: string;
    alt_phone: number;
    event_location: string;
    special_instructions: string;
    special_requests: string;
    delivery_charge: number;
    token: number;
    type: number = 1;
    salesman: number;
    driving_license: string = null;
    driving_license_required: boolean = false;
    shipping_first_name: string;
    shipping_last_name: string;
    shipping_mobile: string;
    shipping_address1: string;
    shipping_address2: string;
    shipping_city: string;
    shipping_state: string;
    shipping_zipcode: string;
    pickup: number;
}

export class Coupon {
    code: string;
    set_coupon?: boolean;
}

export interface ShippingMethod {
    id: number;
    shipping_location: string;
    shipping_cost: number;
    selected?: boolean;
    change?: boolean;
}
