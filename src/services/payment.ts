// To'lov shlyuzlari (Payment Gateway) uchun Modulyar Arxitektura
export interface PaymentGateway {
  name: string;
  createInvoiceUrl(amount: number, invoiceId: string): string;
  validateWebhook(requestData: any): boolean;
}

export class ClickProvider implements PaymentGateway {
  name = 'CLICK';
  createInvoiceUrl(amount: number, invoiceId: string) {
    return `https://my.click.uz/services/pay?service_id=MOCK_SERVICE&merchant_id=MOCK_MERCHANT&amount=${amount}&transaction_param=${invoiceId}`;
  }
  validateWebhook(data: any) {
    // Haqiqiy dasturda bu yerda sign_string va md5 xesh tekshiriladi
    return true; 
  }
}

export class PaymeProvider implements PaymentGateway {
  name = 'PAYME';
  createInvoiceUrl(amount: number, invoiceId: string) {
    // Payme formati uchu base64 kodlash
    const params = Buffer.from(`m=MOCK_MERCHANT;ac.invoice_id=${invoiceId};a=${amount * 100}`).toString('base64');
    return `https://checkout.paycom.uz/${params}`;
  }
  validateWebhook(data: any) {
    // Xavfsizlik kalitini tekshirish
    return true;
  }
}
