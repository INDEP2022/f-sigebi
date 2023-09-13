import { format } from 'date-fns';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';

//Arrays
export let goodCheckCustomer: any[] = [];
export let batchEventCheck: any[] = []

//COLUMNAS
export const COLUMNSCUSTOMER = {
  RFC: {
    title: 'R.F.C',
    type: 'string',
    sort: false,
  },
  Client: {
    title: 'Cliente',
    type: 'string',
    sort: false,
  },
  Processed: {
    title: 'Proc.',
    type: 'string',
    sort: false,
  },
  ExecutionDate: {
    title: 'Fecha Ejecución',
    type: 'string',
    sort: false,
    valuePrepareFunction: (isSelected: any, row: any) => {
      return format(new Date(row.ExecutionDate), 'dd/MM/yyyy');
    },
  },
  BlackListed: {
    title: 'Lista Negra',
    type: 'string',
    sort: false,
  },
  check: {
    title: 'Procesar',
    type: 'custom',
    sort: false,
    hide: false,
    renderComponent: CheckboxElementComponent,
    valuePrepareFunction: (isSelected: any, row: any) => {
      return goodCheckCustomer.find((e: any) => e.row.ClientId == row.ClientId)
        ? true
        : false;
    },
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        if (data.row.available) {
          if (data.toggle) {
            console.log(goodCheckCustomer);
            goodCheckCustomer.push(data.row);
          } else {
            goodCheckCustomer = goodCheckCustomer.filter(
              valor => valor.ClientId != data.row.ClientId
            );
          }
        } else {
          data.toggle = false;
        }
      });
    },
  },
};

export const COLUMNS_LOT_EVENT_FALSE = {
  publicLot: {
    title: 'Lote',
    type: 'number',
    sort: false,
  },
  rfc: {
    title: 'RFC Cliente',
    type: 'number',
    sort: false,
  },
  vtaStatusId: {
    title: 'Estatus',
    type: 'text',
    sort: false,
  },
  guaranteePrice: {
    title: 'Garantía',
    type: 'number',
    sort: false,
  },
  advancePayment: {
    title: 'Anticipo',
    type: 'number',
    sort: false,
  },
  description: {
    title: 'Descripción',
    type: 'text',
    sort: false,
  },
};

export const COLUMNS_LOT_EVENT_TRUE = {
  ...COLUMNS_LOT_EVENT_FALSE,
  check: {
    title: 'Procesar',
    type: 'custom',
    sort: false,
    hide: false,
    renderComponent: CheckboxElementComponent,
    valuePrepareFunction: (isSelected: any, row: any) => {
      return batchEventCheck.find(
        (e: any) => e.row.lotId == row.lotId
      )
        ? true
        : false;
    },
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        if (data.row.available) {
          if (data.toggle) {
            console.log(batchEventCheck);
            batchEventCheck.push(data.row.lotId);
          } else {
            batchEventCheck = batchEventCheck.filter(
              valor => {
                return valor != data.row.lotId
              }
            );
            console.log(batchEventCheck);
          }
        } else {
          data.toggle = false;
        }
      });
    },
  },
}

export const COLUMNS_DESERT_LOTS = {
  lotPublic: {
    title: 'Lote',
    type: 'text',
    sort: false,
  },
  description: {
    title: 'Descripción',
    type: 'text',
    sort: false,
  },
};

function correctDate(date: string) {
  const dateUtc = new Date(date);
  return new Date(dateUtc.getTime() + dateUtc.getTimezoneOffset() * 60000);
}

export const COLUMNS_CUSTOMER_BANKS = {
  movementNumber: {
    title: 'No. Movimiento',
    type: 'number',
    sort: false,
  },
  Public_Batch: {
    title: 'Lote',
    type: 'number',
    sort: false,
  },
  date:{
    title: 'Fecha',
    type: 'text',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return format(correctDate(cell), 'dd/MM/yyyy');
    },
  },
  bankCode: {
    title: 'Banco',
    type: 'text',
    sort: false,
  }, 
  reference: {
    title: 'Referencia',
    type: 'text',
    sort: false,
  },
  amount: {
    title: 'Depósito',
    type: 'number',
    sort: false,
  },
  Income_Order_ID: {
    title: 'No. Orden Ingreso',
    type: 'number',
    sort: false,
  },
  Payment_ID: {
    title: 'No. Pago',
    type: 'number',
    sort: false,
  },
};

export const COLUMNS_LOTS_BANKS = {
  movementNumber: {
    title: 'No. Movimiento',
    type: 'number',
    sort: false,
  },
  date: {
    title: 'Fecha',
    type: 'text',
    sort: false,
    valuePrepareFunction: (isSelected: any, row: any) => {
      return format(new Date(row.date), 'dd/MM/yyyy');
    },
  },
  bankKey: {
    title: 'Banco',
    type: 'text',
    sort: false,
  },
  reference: {
    title: 'Referencia',
    type: 'text',
    sort: false,
  },
  amount: {
    title: 'Depósito',
    type: 'number',
    sort: false,
  },
  entryOrderId: {
    title: 'No. Orden Ingreso',
    type: 'number',
    sort: false,
  },
  paymentId: {
    title: 'No.Pago',
    type: 'number',
    sort: false,
  },
};

export const COLUMNS_PAYMENT_LOT = {
  reference: {
    title: 'Referencia',
    type: 'text',
    sort: false,
  },
  amountAppVat: {
    title: 'Monto',
    type: 'number',
    sort: false,
  },
  vat: {
    title: 'IVA',
    type: 'number',
    sort: false,
  },
  amountNoAppVat: {
    title: 'Monto no Aplica IVA',
    type: 'number',
    sort: false,
  },
  'transferent.nameTransferent': {
    title: 'Transferente',
    type: 'text',
    sort: false,
    valuePrepareFunction: (isSelected: any, row: any) => {
      return row.transferent.nameTransferent;
    },
  },
  desc_tipo: {
    title: 'Pago Origen',
    type: 'text',
    sort: false,
    valuePrepareFunction: (isSelected: any, row: any) => {
      switch (row.type) {
        case 'P':
          return 'PENALIZACIÓN';

        case 'N':
          return 'NORMAL';

        case 'D':
          return 'DEVOLUCIÓN';

        default:
          return null;
      }
    },
  },
};

//FUNCIONES
export function setCheckHide(hideValue: boolean) {
  clearGoodCheckCustomer();
  COLUMNSCUSTOMER.check.hide = hideValue;
}

export function clearGoodCheckCustomer() {
  goodCheckCustomer = [];
}
