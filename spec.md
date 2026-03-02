# Specification

## Summary
**Goal:** Remove all GST/tax fields, calculations, and references from the Aditi Digital Studio Billing application across both frontend and backend.

**Planned changes:**
- Remove tax rate input, tax amount line, and all GST-related fields from the Create Invoice form; invoice total equals subtotal only
- Remove GST/tax rows and placeholders from the Invoice Detail page and InvoicePrintHeader component
- Update the backend Motoko actor to remove the tax/GST field from the Invoice data model; store total as subtotal
- Remove any tax-related stat cards or revenue calculations from the Dashboard page

**User-visible outcome:** Invoices are created, displayed, and printed without any GST or tax fields. All totals reflect the subtotal of line items only, and the dashboard revenue stats contain no tax component.
