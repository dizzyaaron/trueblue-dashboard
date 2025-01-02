import React, { useState } from 'react';
import { X, Eye, Camera, Star, Plus, Save, ChevronDown, ChevronUp } from 'lucide-react';
import { ClipboardList } from 'lucide-react';
import { useCustomerStore } from '../../store/customerStore'; 
import { useRequestStore } from '../../store/requestStore';
import { useLineItemStore } from '../../store/lineItemStore';
import { useQuoteStore } from '../../store/quoteStore';
import { syncNotesToClient } from '../../utils/notes';
import RequestDetailsSidebar from '../quotes/RequestDetailsSidebar';
import SuccessCheckmark from '../animations/SuccessCheckmark';
import type { SavedLineItem } from '../../store/lineItemStore';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (quoteId: string) => void;
}

interface LineItem {
  id: string;
  name: string;
  savedItemId?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  image?: string;
  isExpanded?: boolean;
}

interface QuoteFormData {
  title: string;
  customerId: string;
  lineItems: LineItem[];
  clientMessage: string;
  disclaimer: string;
  internalNotes: string;
  opportunity: number;
  requiredDeposit: number;
  tax: number;
  discount: number;
  attachments: File[];
  linkTo: {
    jobs: boolean;
    invoices: boolean;
  };
}

export default function NewQuoteModal({ isOpen, onClose, onSave }: Props) {
  const { customers } = useCustomerStore();
  const { requests } = useRequestStore();
  const { savedItems, addItem } = useLineItemStore();
  const { addQuote } = useQuoteStore();
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState<QuoteFormData>({
    title: '',
    customerId: '',
    lineItems: [{
      id: '1',
      name: '',
      description: '',
      isExpanded: true,
      quantity: 1,
      unitPrice: 0
    }],
    clientMessage: '',
    disclaimer: 'This quote is valid for the next 30 days, after which values may be subject to change.',
    internalNotes: '',
    opportunity: 0,
    requiredDeposit: 0,
    tax: 0,
    taxEnabled: false,
    discount: 0,
    attachments: [],
    linkTo: {
      jobs: true,
      invoices: true
    }
  });

  const [showSaveItemModal, setShowSaveItemModal] = useState(false);
  const [selectedItemToSave, setSelectedItemToSave] = useState<LineItem | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [suggestions, setSuggestions] = useState<SavedLineItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
  const [showRequestDetails, setShowRequestDetails] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);

  const handleAddLineItem = () => {
    setFormData(prev => ({
      ...prev,
      lineItems: [
        {
          id: Date.now().toString(),
          name: '',
          description: '',
          isExpanded: true,
          quantity: 1,
          unitPrice: 0
        },
        ...prev.lineItems.map(item => ({ ...item, isExpanded: false }))
      ]
    }));
  };

  const handleSaveLineItem = (item: LineItem) => {
    addItem({
      name: item.name,
      description: item.description,
      defaultQuantity: item.quantity,
      defaultPrice: item.unitPrice
    });
    setShowSaveItemModal(false);
    setSelectedItemToSave(null);
  };

  const toggleItemExpansion = (id: string) => {
    setFormData(prev => ({
      ...prev,
      lineItems: prev.lineItems.map(item =>
        item.id === id ? { ...item, isExpanded: !item.isExpanded } : item
      )
    }));
  };

  const handleLineItemChange = (id: string, field: keyof LineItem, value: any) => {
    setFormData(prev => ({
      ...prev,
      lineItems: prev.lineItems.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleItemNameChange = (id: string, value: string) => {
    handleLineItemChange(id, 'name', value);
    
    // Show suggestions as user types
    const query = value.toLowerCase();
    if (query.length >= 2) {
      const matches = savedItems.filter(saved => 
        saved.name.toLowerCase().includes(query)
      );
      setSuggestions(matches);
      setShowSuggestions(matches.length > 0);
      setActiveSuggestionIndex(0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionSelect = (id: string, suggestion: SavedLineItem) => {
    handleLineItemChange(id, 'name', suggestion.name);
    handleLineItemChange(id, 'description', suggestion.description);
    handleLineItemChange(id, 'quantity', suggestion.defaultQuantity);
    handleLineItemChange(id, 'unitPrice', suggestion.defaultPrice);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const calculateSubtotal = () => {
    return formData.lineItems.reduce((sum, item) => 
      sum + (item.quantity * item.unitPrice), 0
    );
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const withDiscount = subtotal - formData.discount;
    const withTax = formData.taxEnabled ? withDiscount * 1.045 : withDiscount; // SD tax rate is 4.5%
    return withTax;
  };

  const handleCustomerSelect = (customerId: string) => {
    setFormData(prev => ({ ...prev, customerId }));
    const customerRequest = requests.find(r => r.clientId === customerId);
    if (customerRequest) {
      setSelectedRequest(customerRequest);
    }
  };

  const handleUseRequest = () => {
    if (!selectedRequest) return;
    
    setFormData(prev => ({
      ...prev,
      title: selectedRequest.title,
      clientMessage: selectedRequest.details,
    }));
    setShowRequestDetails(false);
  };

  const handleSave = async (asDraft: boolean = false) => {
    if (!formData.customerId) return;

    // Sync internal notes to client if any
    if (formData.internalNotes.trim()) {
      syncNotesToClient(formData.customerId, formData.internalNotes, 'medium');
    }

    const quoteData = {
      customerId: formData.customerId,
      title: formData.title,
      status: asDraft ? 'draft' : 'sent',
      lineItems: formData.lineItems,
      subtotal: calculateSubtotal(),
      tax: formData.taxEnabled ? 4.5 : 0,
      taxEnabled: formData.taxEnabled,
      discount: formData.discount,
      total: calculateTotal(),
      requiredDeposit: formData.requiredDeposit,
      clientMessage: formData.clientMessage,
      disclaimer: formData.disclaimer,
      internalNotes: formData.internalNotes
    };

    const quoteId = addQuote(quoteData);
    setShowSuccess(true);
    setSuccessMessage(asDraft ? 'Quote saved as draft!' : 'Quote created successfully!');
    
    setTimeout(() => {
      setShowSuccess(false);
      onSave?.(quoteId);
      onClose();
    }, 1500);
  };
  if (!isOpen) return null;

  const selectedCustomer = customers.find(c => c.id === formData.customerId);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gray-900 rounded-xl shadow-lg w-full max-w-5xl relative text-white my-8">
        {showSuccess && <SuccessCheckmark message={successMessage} />}

        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              Quote for {selectedCustomer?.name || 'New Customer'}
            </h2>
            {selectedRequest && (
              <button
                onClick={() => setShowRequestDetails(true)}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark flex items-center gap-2"
              >
                <ClipboardList className="w-4 h-4" />
                View Request Details
              </button>
            )}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className="flex items-center gap-2 text-gray-400 hover:text-white"
              >
                <Eye className="w-5 h-5" />
                {previewMode ? 'Edit' : 'Preview'}
              </button>
              <button onClick={onClose}>
                <X className="w-6 h-6 text-gray-400 hover:text-white" />
              </button>
            </div>
          </div>
        </div>
        
        {showRequestDetails && selectedRequest && (
          <RequestDetailsSidebar
            request={selectedRequest}
            onClose={() => setShowRequestDetails(false)}
            onUseRequest={handleUseRequest}
          />
        )}

        {/* Save Item Modal */}
        {showSaveItemModal && selectedItemToSave && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-96">
              <h3 className="text-lg font-semibold mb-4">Save Line Item</h3>
              <p className="text-sm text-gray-400 mb-4">
                This item will be available for future quotes and invoices.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-1">Name</label>
                  <input
                    type="text"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2"
                    value={selectedItemToSave.name}
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Description</label>
                  <textarea
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2"
                    value={selectedItemToSave.description}
                    readOnly
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowSaveItemModal(false);
                    setSelectedItemToSave(null);
                  }}
                  className="px-4 py-2 text-gray-400 hover:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSaveLineItem(selectedItemToSave)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Save Item
                </button>
              </div>
            </div>
          </div>
        )}


        <div className="p-6 space-y-8">
          {/* Quote Header */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm mb-2">Job Title</label>
              <input
                type="text"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm mb-2">Customer</label>
              <select
                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3"
                value={formData.customerId}
                onChange={(e) => handleCustomerSelect(e.target.value)}
              >
                <option value="">Select Customer</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Line Items */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Line Items</h3>
              <button
                onClick={handleAddLineItem}
                className="text-green-500 hover:text-green-400 flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Line Item
              </button>
            </div>
            
            <div className="space-y-4">
              {formData.lineItems.map((item) => (
                <div key={item.id} className="bg-gray-800 rounded-lg p-4">
                  {item.isExpanded ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-6">
                          <div className="relative">
                            <input
                              type="text"
                              placeholder="Item name"
                              className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 mb-2"
                              value={item.name}
                              onChange={(e) => handleItemNameChange(item.id, e.target.value)}
                            />
                            {showSuggestions && (
                              <div className="absolute z-10 w-full bg-gray-800 border border-gray-700 rounded-lg mt-1 shadow-lg">
                                {suggestions.map((suggestion, index) => (
                                  <div
                                    key={suggestion.id}
                                    className={`p-2 cursor-pointer ${
                                      index === activeSuggestionIndex 
                                        ? 'bg-gray-700' 
                                        : 'hover:bg-gray-700'
                                    }`}
                                    onClick={() => handleSuggestionSelect(item.id, suggestion)}
                                  >
                                    <div className="font-medium">{suggestion.name}</div>
                                    <div className="text-sm text-gray-400">{suggestion.description}</div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          <textarea
                            placeholder="Description"
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2"
                            value={item.description}
                            onChange={(e) => handleLineItemChange(item.id, 'description', e.target.value)}
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-sm text-gray-400 mb-1">Qty</label>
                          <input
                            type="number"
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2"
                            value={item.quantity}
                            onChange={(e) => handleLineItemChange(item.id, 'quantity', Number(e.target.value))}
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-sm text-gray-400 mb-1">Price</label>
                          <input
                            type="number"
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2"
                            value={item.unitPrice}
                            onChange={(e) => handleLineItemChange(item.id, 'unitPrice', Number(e.target.value))}
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-sm text-gray-400 mb-1">Total</label>
                          <div className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-right">
                            ${(item.quantity * item.unitPrice).toFixed(2)}
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <button
                          onClick={() => {
                            setSelectedItemToSave(item);
                            setShowSaveItemModal(true);
                          }}
                          className="text-green-500 hover:text-green-400 flex items-center gap-1"
                        >
                          <Save className="w-4 h-4" />
                          Save for future use
                        </button>
                        <button
                          onClick={() => toggleItemExpansion(item.id)}
                          className="text-gray-400 hover:text-gray-300"
                        >
                          <ChevronUp className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium">{item.name || 'Untitled Item'}</p>
                        <p className="text-sm text-gray-400">{item.description}</p>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-sm">
                          <span className="text-gray-400">Qty:</span> {item.quantity}
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-400">Price:</span> ${item.unitPrice}
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-400">Total:</span> ${(item.quantity * item.unitPrice).toFixed(2)}
                        </div>
                        <button
                          onClick={() => toggleItemExpansion(item.id)}
                          className="text-gray-400 hover:text-gray-300"
                        >
                          <ChevronDown className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-1/3 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount</span>
                <input
                  type="number"
                  className="w-24 bg-gray-700 border border-gray-600 rounded p-1 text-right"
                  value={formData.discount}
                  onChange={(e) => setFormData(prev => ({ ...prev, discount: Number(e.target.value) }))}
                />
              </div>
              <div className="flex justify-between items-center">
                <span>Tax (4.5%)</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={formData.taxEnabled}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      taxEnabled: e.target.checked
                    }))}
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer 
                                peer-checked:after:translate-x-full peer-checked:after:border-white 
                                after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                                after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all 
                                peer-checked:bg-green-600"></div>
                </label>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Required Deposit</span>
                <input
                  type="number"
                  className="w-24 bg-gray-700 border border-gray-600 rounded p-1 text-right"
                  value={formData.requiredDeposit}
                  onChange={(e) => setFormData(prev => ({ ...prev, requiredDeposit: Number(e.target.value) }))}
                />
              </div>
            </div>
          </div>

          {/* Client Message */}
          <div>
            <label className="block text-sm mb-2">Client Message</label>
            <textarea
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3"
              rows={4}
              value={formData.clientMessage}
              onChange={(e) => setFormData(prev => ({ ...prev, clientMessage: e.target.value }))}
            />
          </div>

          {/* Disclaimer */}
          <div>
            <label className="block text-sm mb-2">Contract / Disclaimer</label>
            <textarea
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3"
              rows={4}
              value={formData.disclaimer}
              onChange={(e) => setFormData(prev => ({ ...prev, disclaimer: e.target.value }))}
            />
          </div>

          {/* Internal Notes */}
          <div>
            <label className="block text-sm mb-2">Internal Notes</label>
            <textarea
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3"
              rows={4}
              value={formData.internalNotes}
              onChange={(e) => setFormData(prev => ({ ...prev, internalNotes: e.target.value }))}
            />
          </div>
        </div>

        <div className="p-6 border-t border-gray-700 flex justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-gray-300"
          >
            Cancel
          </button>
          <div className="flex gap-3">
            <button 
              onClick={() => handleSave(true)}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
              disabled={!formData.customerId}
            >
              Save as Draft
            </button>
            <button 
              onClick={() => handleSave(false)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              disabled={!formData.customerId}
            >
              Create Quote
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}