import { Quote } from '../types';

export function generateQuotePDF(quote: Quote, customer: any): string {
  // Create a hidden iframe to generate PDF
  const iframe = document.createElement('iframe');
  iframe.style.visibility = 'hidden';
  document.body.appendChild(iframe);
  
  const doc = iframe.contentWindow?.document;
  if (!doc) return '';

  // Add content to iframe
  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Quote #${quote.id}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
          .title { font-size: 24px; font-weight: bold; color: #005B9E; }
          .info { margin-bottom: 20px; }
          .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .table th, .table td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
          .total { text-align: right; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="title">True Blue Handyman</div>
            <div>Quote #${quote.id}</div>
            <div>Date: ${new Date(quote.createdAt).toLocaleDateString()}</div>
          </div>
        </div>

        <div class="info">
          <strong>Quote For:</strong><br>
          ${customer.name}<br>
          ${customer.address}<br>
          ${customer.phone}<br>
          ${customer.email}
        </div>

        <table class="table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Qty</th>
              <th>Rate</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            ${quote.lineItems.map(item => `
              <tr>
                <td>
                  <div><strong>${item.name}</strong></div>
                  <div style="color: #666;">${item.description}</div>
                </td>
                <td>${item.quantity}</td>
                <td>$${item.unitPrice.toFixed(2)}</td>
                <td>$${(item.quantity * item.unitPrice).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="total">
          <div>Subtotal: $${quote.subtotal.toFixed(2)}</div>
          ${quote.taxEnabled ? `<div>Tax (${quote.tax}%): $${(quote.subtotal * quote.tax / 100).toFixed(2)}</div>` : ''}
          ${quote.discount > 0 ? `<div>Discount: -$${quote.discount.toFixed(2)}</div>` : ''}
          <div><strong>Total: $${quote.total.toFixed(2)}</strong></div>
          ${quote.requiredDeposit > 0 ? `<div>Required Deposit: $${quote.requiredDeposit.toFixed(2)}</div>` : ''}
        </div>

        ${quote.clientMessage ? `
          <div style="margin-top: 40px;">
            <strong>Message:</strong><br>
            ${quote.clientMessage}
          </div>
        ` : ''}

        <div style="margin-top: 40px;">
          <strong>Terms & Conditions:</strong><br>
          ${quote.disclaimer}
        </div>
      </body>
    </html>
  `);
  doc.close();

  // Print to PDF
  const content = doc.documentElement.outerHTML;
  document.body.removeChild(iframe);
  
  // Create blob and download
  const blob = new Blob([content], { type: 'application/pdf' });
  return URL.createObjectURL(blob);
}