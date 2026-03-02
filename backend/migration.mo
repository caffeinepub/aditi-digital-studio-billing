import Map "mo:core/Map";
import Nat "mo:core/Nat";

module {
  type InvoiceItem = {
    description : Text;
    quantity : Nat;
    unitPrice : Float;
    total : Float;
  };

  type OldInvoice = {
    invoiceNumber : Nat;
    date : Int;
    customerName : Text;
    customerAddress : Text;
    customerPhone : Text;
    items : [InvoiceItem];
    subtotal : Float;
    taxAmount : Float;
    total : Float;
    paid : Bool;
  };

  type OldActor = {
    invoices : Map.Map<Nat, OldInvoice>;
    nextInvoiceNumber : Nat;
  };

  type NewInvoice = {
    invoiceNumber : Nat;
    date : Int;
    customerName : Text;
    customerAddress : Text;
    customerPhone : Text;
    items : [InvoiceItem];
    subtotal : Float;
    total : Float;
    paid : Bool;
  };

  type NewActor = {
    invoices : Map.Map<Nat, NewInvoice>;
    nextInvoiceNumber : Nat;
  };

  public func run(old : OldActor) : NewActor {
    let newInvoices = old.invoices.map<Nat, OldInvoice, NewInvoice>(
      func(_id, oldInvoice) {
        {
          oldInvoice with
          total = oldInvoice.subtotal;
        };
      }
    );
    {
      old with
      invoices = newInvoices;
    };
  };
};
