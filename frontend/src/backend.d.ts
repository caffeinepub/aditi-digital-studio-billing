import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface InvoiceItem {
    total: number;
    description: string;
    quantity: bigint;
    unitPrice: number;
}
export interface InvoiceDTO {
    customerName: string;
    balanceAmount: number;
    total: number;
    customerPhone: string;
    date: Time;
    paid: boolean;
    invoiceNumber: bigint;
    customerAddress: string;
    items: Array<InvoiceItem>;
    paidAmount: number;
    subtotal: number;
}
export type Time = bigint;
export interface backendInterface {
    createInvoice(customerName: string, customerAddress: string, customerPhone: string, items: Array<InvoiceItem>, paidAmount: number | null): Promise<bigint>;
    getAllInvoices(): Promise<Array<InvoiceDTO>>;
    getInvoice(invoiceNumber: bigint): Promise<InvoiceDTO>;
    markAsPaid(invoiceNumber: bigint): Promise<void>;
    markAsUnpaid(invoiceNumber: bigint): Promise<void>;
}
