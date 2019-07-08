export class PurchaseModel {
    medicine_id: number;
    medicine_name: string;
    company_id: number;
    company_name: string;
    batch_no: string;
    invoice: string;
    company_invoice: string;
    exp_date: string;
}

export class AccountReport {
    account_status: number = null;
    account_type: number = null;
    date_start: string;
    date_end: string;
}
