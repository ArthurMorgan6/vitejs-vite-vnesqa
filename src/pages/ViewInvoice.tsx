import React, { useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useReactToPrint } from "react-to-print";
import { Printer, ArrowLeft, FileEdit, Download, Scale } from "lucide-react";
import InvoicePreview from "../components/InvoicePreview";
import { useInvoices } from "../hooks/useInvoices";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
export default function ViewInvoice() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { invoices } = useInvoices();
  const invoice = invoices.find((inv) => inv.id === id);
  const previewRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => previewRef.current,
  });

  const handleDownload = async () => {
    const element = previewRef.current;
    if (element) {
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [1000, 500],
      });

      pdf.addImage(
        imgData,
        "PNG",
        0,
        0,
        canvas.width * 0.264583,
        canvas.height * 0.264583
      );
      pdf.save("invoice.pdf");
    }
  };

  if (!invoice) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Invoice not found</h2>
        <button
          onClick={() => navigate("/")}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to List
        </button>
        <div className="space-x-4">
          <button
            onClick={() => navigate(`/edit/${invoice.id}`)}
            className="inline-flex items-center p-2 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
            title="Edit Invoice"
          >
            <FileEdit className="h-5 w-5" />
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center p-2 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
            title="Print Invoice"
          >
            <Printer className="h-5 w-5" />
          </button>
          <button
            onClick={handleDownload}
            className="inline-flex items-center p-2 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            title="Download PDF"
          >
            <Download className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div ref={previewRef} id="invoicepreview">
        <InvoicePreview data={invoice} />
      </div>
    </motion.div>
  );
}
