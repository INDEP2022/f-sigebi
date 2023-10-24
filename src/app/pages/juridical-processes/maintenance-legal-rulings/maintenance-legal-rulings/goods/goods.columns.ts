export const DICTAMINATION_X_GOOD_COLUMNS = {
  ofDictNumber: { sort: false, title: 'No. dictaminación' },
  typeDict: { sort: false, title: 'Tipo' },
  proceedingsNumber: { sort: false, title: 'No. Expediente' },
  id: { sort: false, title: 'No. Bien' },
  descriptionDict: { sort: false, title: 'Descripción' },
  amountDict: {
    sort: false,
    title: 'Cantidad',
    valuePrepareFunction: (amount: string) => {
      const numericAmount = parseFloat(amount);
      if (!isNaN(numericAmount)) {
        return numericAmount.toLocaleString('en-US', {
          // style: 'currency',
          // currency: 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      } else {
        return amount;
      }
    },
  },
};
