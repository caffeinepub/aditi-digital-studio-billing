import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { InvoiceDTO, InvoiceItem } from '../backend';

export const INVOICES_KEY = 'invoices';
export const INVOICE_KEY = 'invoice';

export function useGetAllInvoices() {
  const { actor, isFetching } = useActor();

  return useQuery<InvoiceDTO[]>({
    queryKey: [INVOICES_KEY],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllInvoices();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetInvoice(invoiceNumber: bigint | null) {
  const { actor, isFetching } = useActor();

  return useQuery<InvoiceDTO>({
    queryKey: [INVOICE_KEY, invoiceNumber?.toString()],
    queryFn: async () => {
      if (!actor || invoiceNumber === null) throw new Error('No invoice number');
      return actor.getInvoice(invoiceNumber);
    },
    enabled: !!actor && !isFetching && invoiceNumber !== null,
  });
}

export function useCreateInvoice() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      customerName,
      customerAddress,
      customerPhone,
      items,
      paidAmount,
    }: {
      customerName: string;
      customerAddress: string;
      customerPhone: string;
      items: InvoiceItem[];
      paidAmount?: number;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.createInvoice(
        customerName,
        customerAddress,
        customerPhone,
        items,
        paidAmount !== undefined ? paidAmount : null
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [INVOICES_KEY] });
    },
  });
}

export function useMarkAsPaid() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (invoiceNumber: bigint) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.markAsPaid(invoiceNumber);
    },
    onSuccess: (_, invoiceNumber) => {
      queryClient.invalidateQueries({ queryKey: [INVOICES_KEY] });
      queryClient.invalidateQueries({ queryKey: [INVOICE_KEY, invoiceNumber.toString()] });
    },
  });
}

export function useMarkAsUnpaid() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (invoiceNumber: bigint) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.markAsUnpaid(invoiceNumber);
    },
    onSuccess: (_, invoiceNumber) => {
      queryClient.invalidateQueries({ queryKey: [INVOICES_KEY] });
      queryClient.invalidateQueries({ queryKey: [INVOICE_KEY, invoiceNumber.toString()] });
    },
  });
}
