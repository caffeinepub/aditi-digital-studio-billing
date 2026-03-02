# Specification

## Summary
**Goal:** Add "Paid Amount" and "Balance Due" fields to invoices across the backend data model, invoice creation form, invoice detail/print view, invoice list, and dashboard.

**Planned changes:**
- Update the backend Motoko invoice data model to include `paidAmount` (optional input, defaults to 0) and `balanceAmount` (stored as total − paidAmount); update all retrieval functions to return these fields
- Add a "Paid Amount" numeric input and a read-only "Balance Due" field (auto-calculated as total − paid amount) to the Create Invoice form totals section
- Display "Paid Amount" and "Balance Due" rows in the Invoice Detail page totals section and in the printable invoice layout
- Add a "Balance Due" or "Paid Amount" column/indicator to the Invoice List table
- Ensure Dashboard stats handle the new fields gracefully with fallback to 0 for older invoices

**User-visible outcome:** Users can enter a paid amount when creating an invoice and see the automatically calculated balance due on the invoice form, detail page, printed output, invoice list, and dashboard without any broken or NaN values.
