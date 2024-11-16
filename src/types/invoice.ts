export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

export interface InvoiceData {
  id: string;
  invoiceNumber: string;
  subject: string;
  date: string;
  dueDate: string;
  companyName: string;
  companyAddress: string;
  clientName: string;
  clientAddress: string;
  items: InvoiceItem[];
  taxRate: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
}