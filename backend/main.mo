import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Migration "migration";
import Nat "mo:core/Nat";
import Float "mo:core/Float";

(with migration = Migration.run)
actor {
  type InvoiceItem = {
    description : Text;
    quantity : Nat;
    unitPrice : Float;
    total : Float;
  };

  type Invoice = {
    invoiceNumber : Nat;
    date : Time.Time;
    customerName : Text;
    customerAddress : Text;
    customerPhone : Text;
    items : [InvoiceItem];
    subtotal : Float;
    total : Float;
    paid : Bool;
    paidAmount : Float;
    balanceAmount : Float;
  };

  type InvoiceDTO = {
    invoiceNumber : Nat;
    date : Time.Time;
    customerName : Text;
    customerAddress : Text;
    customerPhone : Text;
    items : [InvoiceItem];
    subtotal : Float;
    total : Float;
    paid : Bool;
    paidAmount : Float;
    balanceAmount : Float;
  };

  let invoices = Map.empty<Nat, Invoice>();
  var nextInvoiceNumber = 1;

  func convertInvoiceToDTO(invoice : Invoice) : InvoiceDTO {
    invoice;
  };

  public shared ({ caller }) func createInvoice(
    customerName : Text,
    customerAddress : Text,
    customerPhone : Text,
    items : [InvoiceItem],
    paidAmount : ?Float
  ) : async Nat {
    let subtotal = items.foldLeft(0.0, func(acc, item) { acc + item.total });
    let actualPaidAmount = switch (paidAmount) {
      case (null) { 0.0 };
      case (?amount) { amount };
    };

    let invoice : Invoice = {
      invoiceNumber = nextInvoiceNumber;
      date = Time.now();
      customerName;
      customerAddress;
      customerPhone;
      items;
      subtotal;
      total = subtotal;
      paid = false;
      paidAmount = actualPaidAmount;
      balanceAmount = subtotal - actualPaidAmount;
    };

    invoices.add(nextInvoiceNumber, invoice);
    nextInvoiceNumber += 1;
    invoice.invoiceNumber;
  };

  public query ({ caller }) func getInvoice(invoiceNumber : Nat) : async InvoiceDTO {
    switch (invoices.get(invoiceNumber)) {
      case (null) { Runtime.trap("Invoice not found") };
      case (?invoice) { convertInvoiceToDTO(invoice) };
    };
  };

  public query ({ caller }) func getAllInvoices() : async [InvoiceDTO] {
    invoices.values().toArray().map(
      convertInvoiceToDTO
    );
  };

  public shared ({ caller }) func markAsPaid(invoiceNumber : Nat) : async () {
    switch (invoices.get(invoiceNumber)) {
      case (null) { Runtime.trap("Invoice not found") };
      case (?invoice) {
        let updatedInvoice = { invoice with paid = true };
        invoices.add(invoiceNumber, updatedInvoice);
      };
    };
  };

  public shared ({ caller }) func markAsUnpaid(invoiceNumber : Nat) : async () {
    switch (invoices.get(invoiceNumber)) {
      case (null) { Runtime.trap("Invoice not found") };
      case (?invoice) {
        let updatedInvoice = { invoice with paid = false };
        invoices.add(invoiceNumber, updatedInvoice);
      };
    };
  };
};
