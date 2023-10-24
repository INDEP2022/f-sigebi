import { CustomDateFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-custom/custom-date-filter';

export const RESOLUTION_REVISION_COLUMNS = {
  goodId: {
    title: 'No Bien',
    type: 'string',
    sort: false,
  },
  description: {
    title: 'Descripción',
    type: 'string',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return row?.description;
    },
  },
  status: {
    title: 'Estatus',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return row?.status;
    },
  },
  quantity: {
    title: 'Cantidad',
    sort: false,
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
  revRecCause: {
    title: 'Motivo de Recurso de Revisión',
    type: 'string',
    sort: false,
    width: '20%',
    valuePrepareFunction: (cell: any, row: any) => {
      return row?.revRecCause;
    },
  },
  physicalReceptionDate: {
    title: 'Fecha de Recepción',
    sort: false,
    valuePrepareFunction: (value: string) => formatDate(value),
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
    filterFunction(cell?: any, search?: string): boolean {
      let column = cell;
      if (column?.toUpperCase() >= search.toUpperCase() || search === '') {
        return true;
      } else {
        return false;
      }
    },
  },
  resolutionEmissionRecRevDate: {
    title: 'Fecha de Emisión de Resolución',
    sort: false,
    //  type: 'html',
    valuePrepareFunction: (value: string) => formatDate(value),
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
    filterFunction(cell?: any, search?: string): boolean {
      let column = cell;
      if (column?.toUpperCase() >= search.toUpperCase() || search === '') {
        return true;
      } else {
        return false;
      }
    },
  },
  revRecObservations: {
    title: 'Observaciones del Recurso de Revisión',
    type: 'string',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return row?.revRecObservations;
    },
  },
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${day}/${month}/${year}`;
}
