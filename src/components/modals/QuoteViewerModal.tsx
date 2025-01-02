import React, { useState, useEffect } from 'react';
import { X, Eye, Download, FileText } from 'lucide-react';
import StatusIndicator from '../StatusIndicator';
import { Quote } from '../../types';
import { useCustomerStore } from '../../store/customerStore';
import { useLogoStore } from '../../store/logoStore';
import { syncNotesToClient } from '../../utils/notes';
import { generateQuotePDF } from '../../utils/pdf';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  quote: Quote;
}

export default function QuoteViewerModal({ isOpen, onClose, quote }: Props) {
  const [showPreview, setShowPreview] = useState(false);
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [noteImportance, setNoteImportance] = useState<'low' | 'medium' | 'high'>('medium');
  const { customers } = useCustomerStore();
  const { logo } = useLogoStore(); 
  const [customer, setCustomer] = useState(customers.find(c => c.id === quote.customerId));
  
  const handleAddNote = () => {
    if (!newNote.trim() || !customer) return;

    // Sync note to client
    const newNoteObj = syncNotesToClient(customer.id, newNote, noteImportance);
    if (!newNoteObj) return;

    setNewNote('');
  };

  useEffect(() => {
    setCustomer(customers.find(c => c.id === quote.customerId));
  }, [customers, quote.customerId]);

  const handleDownloadPDF = () => {
    if (!customer) return;
    
    const pdfUrl = generateQuotePDF(quote, customer);
    
    // Create temporary link and trigger download
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `quote-${quote.id}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up URL object
    URL.revokeObjectURL(pdfUrl);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gray-900 rounded-xl shadow-lg w-full max-w-4xl relative text-white my-8">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{quote.title}</h2>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-2 text-gray-400 hover:text-white"
              >
                <Eye className="w-5 h-5" />
                {showPreview ? 'Edit' : 'PDF Preview'}
              </button>
              <button onClick={onClose}>
                <X className="w-6 h-6 text-gray-400 hover:text-white" />
              </button>
            </div>
          </div>
        </div>

        {showPreview ? (
          <div className="p-8 bg-white text-gray-900">
            {/* Quote Preview */}
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <div className="flex justify-between items-start mb-8">
                <div>
                  {logo ? (
                    <img src={logo} alt="Company Logo" className="h-16 object-contain" />
                  ) : (
                    <h1 className="text-2xl font-bold">True Blue Handyman</h1>
                  )}
                </div>
                <div className="text-right">
                  <h2 className="text-2xl font-bold mb-2">QUOTE</h2>
                  <p className="text-gray-600">Quote #: {quote.id}</p>
                  <p className="text-gray-600">
                    Date: {new Date(quote.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="font-bold mb-2">Quote For:</h3>
                  <p className="font-medium">{customer?.name}</p>
                  <p>{customer?.address}</p>
                  <p>{customer?.phone}</p>
                  <p>{customer?.email}</p>
                </div>
              </div>

              {/* Line Items */}
              <table className="w-full mb-8">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-2">Description</th>
                    <th className="text-right py-2">Qty</th>
                    <th className="text-right py-2">Rate</th>
                    <th className="text-right py-2">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {quote.lineItems.map((item) => (
                    <tr key={item.id} className="border-b border-gray-200">
                      <td className="py-2">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-gray-600">{item.description}</div>
                      </td>
                      <td className="text-right py-2">{item.quantity}</td>
                      <td className="text-right py-2">${item.unitPrice.toFixed(2)}</td>
                      <td className="text-right py-2">
                        ${(item.quantity * item.unitPrice).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div className="flex justify-end mb-8">
                <div className="w-64">
                  <div className="flex justify-between py-2">
                    <span>Subtotal:</span>
                    <span>${quote.subtotal.toFixed(2)}</span>
                  </div>
                  {quote.taxEnabled && (
                    <div className="flex justify-between py-2">
                      <span>Tax ({quote.tax}%):</span>
                      <span>${(quote.subtotal * (quote.tax / 100)).toFixed(2)}</span>
                    </div>
                  )}
                  {quote.discount > 0 && (
                    <div className="flex justify-between py-2 text-green-600">
                      <span>Discount:</span>
                      <span>-${quote.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-2 font-bold border-t border-gray-200">
                    <span>Total:</span>
                    <span>${quote.total.toFixed(2)}</span>
                  </div>
                  {quote.requiredDeposit > 0 && (
                    <div className="flex justify-between py-2 text-primary">
                      <span>Required Deposit:</span>
                      <span>${quote.requiredDeposit.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Message & Terms */}
              {quote.clientMessage && (
                <div className="mb-8">
                  <h3 className="font-bold mb-2">Message</h3>
                  <p className="text-gray-600">{quote.clientMessage}</p>
                </div>
              )}

              <div className="mb-8">
                <h3 className="font-bold mb-2">Terms & Conditions</h3>
                <p className="text-gray-600">{quote.disclaimer}</p>
              </div>

              {/* Download Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleDownloadPDF}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {/* Quote Details */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quote Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400">Status</label>
                  <StatusIndicator status={quote.status} />
                </div>
                <div>
                  <label className="block text-sm text-gray-400">Created</label>
                  <p className="text-white">
                    {new Date(quote.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm text-gray-400">Customer</label>
                  <p className="text-white">{customer?.name}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-400">Total</label>
                  <p className="text-white">${quote.total.toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Line Items */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Line Items</h3>
              <div className="space-y-4">
                {quote.lineItems.map((item) => (
                  <div key={item.id} className="bg-gray-800 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-gray-400">{item.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-400">
                          {item.quantity} × ${item.unitPrice.toFixed(2)}
                        </p>
                        <p className="font-medium">
                          ${(item.quantity * item.unitPrice).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Internal Notes */}
            {quote.internalNotes && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Internal Notes</h3>
                <div className="bg-gray-800 rounded-lg p-4">
                  <p className="text-gray-300 whitespace-pre-wrap">
                    {quote.internalNotes}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}