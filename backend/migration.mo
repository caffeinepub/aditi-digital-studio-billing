import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Float "mo:core/Float";

module {
  type OldInvoiceItem = {
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
    items : [OldInvoiceItem];
    subtotal : Float;
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
    items : [OldInvoiceItem];
    subtotal : Float;
    total : Float;
    paid : Bool;
    paidAmount : Float;
    balanceAmount : Float;
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
          paidAmount = 0.0;
          balanceAmount = oldInvoice.total;
        };
      }
    );
    { old with invoices = newInvoices };
  };
};
