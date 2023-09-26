export const DEPOSIT_TOKENS_MODAL_COLUMNS = {
  numberMotion: {
    title: 'Movimiento',
    type: 'string',
    sort: false,
  },
  deposit: {
    title: 'Abono',
    type: 'html',
    sort: false,
    valuePrepareFunction: (amount: string) => {
      const numericAmount = parseFloat(amount);

      if (!isNaN(numericAmount)) {
        const a = numericAmount.toLocaleString('en-US', {
          // style: 'currency',
          // currency: 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        return '<p class="cell_right">' + a + '</p>';
      } else {
        return amount;
      }
    },
    filterFunction(cell?: any, search?: string): boolean {
      return true;
    },
  },
};
