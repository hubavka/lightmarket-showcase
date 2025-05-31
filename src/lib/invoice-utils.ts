// Lightning Invoice Validation Utility

export function validateLightningInvoice(invoice: string): {
  isValid: boolean;
  errors: string[];
  details?: {
    network: string;
    amount?: number;
    prefix: string;
    length: number;
  };
} {
  const errors: string[] = [];
  
  if (!invoice) {
    return { isValid: false, errors: ['Invoice is empty'] };
  }

  // Check basic format
  if (!invoice.startsWith('lnbc') && !invoice.startsWith('lntb') && !invoice.startsWith('lnbcrt')) {
    errors.push('Invalid Lightning invoice prefix');
  }

  // Check minimum length (Lightning invoices are typically 200+ characters)
  if (invoice.length < 100) {
    errors.push('Invoice too short (minimum ~100 characters)');
  }

  // Check maximum length (should not exceed ~1000 characters typically)
  if (invoice.length > 2000) {
    errors.push('Invoice too long (maximum ~2000 characters)');
  }

  // Check for invalid characters (should be base32-like)
  const validChars = /^[a-z0-9]+$/;
  if (!validChars.test(invoice)) {
    errors.push('Contains invalid characters (should be lowercase alphanumeric)');
  }

  const network = invoice.startsWith('lnbc') ? 'mainnet' : 
                  invoice.startsWith('lntb') ? 'testnet' : 
                  invoice.startsWith('lnbcrt') ? 'regtest' : 'unknown';

  const details = {
    network,
    prefix: invoice.substring(0, 10),
    length: invoice.length
  };

  return {
    isValid: errors.length === 0,
    errors,
    details
  };
}

export function debugInvoice(invoice: string) {
  const validation = validateLightningInvoice(invoice);
  
  console.log('=== Lightning Invoice Debug ===');
  console.log('Invoice:', invoice);
  console.log('Length:', invoice.length);
  console.log('Prefix:', invoice.substring(0, 20));
  console.log('Suffix:', invoice.substring(-20));
  console.log('Validation:', validation);
  console.log('===============================');
  
  return validation;
}
