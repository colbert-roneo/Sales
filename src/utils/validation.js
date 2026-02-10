export const validateHeader = (header) => {
  const errors = {};
  
  if (!header.vr_no || isNaN(header.vr_no)) {
    errors.vr_no = 'Valid Voucher Number is required';
  }
  
  if (!header.vr_date) {
    errors.vr_date = 'Date is required';
  }
  
  if (!header.ac_name || header.ac_name.trim() === '') {
    errors.ac_name = 'Account Name is required';
  }
  
  if (header.ac_amt < 0) {
    errors.ac_amt = 'Amount cannot be negative';
  }
  
  return errors;
};

export const validateDetail = (detail) => {
  const errors = {};
  
  if (!detail.item_code || detail.item_code.trim() === '') {
    errors.item_code = 'Item is required';
  }
  
  if (!detail.qty || parseFloat(detail.qty) <= 0) {
    errors.qty = 'Quantity must be greater than 0';
  }
  
  if (!detail.rate || parseFloat(detail.rate) < 0) {
    errors.rate = 'Rate cannot be negative';
  }
  
  return errors;
};

export const validateAllDetails = (details) => {
  return details.map(validateDetail);
};