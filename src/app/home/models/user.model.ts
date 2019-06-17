export class User{
    id:number;
    first_name:string;
    last_name:string;
    avatar?:string;
    email:string;
    phone: string;
    user_type: string = null;
    created?:string;
    status?:number = null;
    social_type?:string;
    addresses?:Address[];
    about?:string;
    primary_addres?:Address = new Address();
}

export class User_login{
    name:string;
    token:string;
    user_id:number;
    user_type:number;
    email:string;
    image:string;
    location_id: number;
    terminal_id: number;
    logo?: string;
}

export class Address{
    type:string;
    address_line1: string;
    city?:string;
    state?:string;
    phone?: string;
    mobile?: string;
    zipcode?:number;
    country?:string;
    is_primary?:boolean | number;
}

export class UserServiceConfig {
    settings: any;
}

export class UserSearch{
    name:string;
    email:string;
    user_type_id:number= null;
    phone:string;
    social_type:string = null;
    status:number = null;
    created:string;
}

export class UserSignUp {
    first_name:string;
    last_name: string;
    email:string;
    password:string;
    user_type_id: any = 3;
    send_email: boolean;
}
