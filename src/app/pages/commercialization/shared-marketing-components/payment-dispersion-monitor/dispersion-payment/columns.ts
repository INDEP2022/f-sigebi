import { format } from 'date-fns';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';

//Arrays
export let goodCheckCustomer: any[] = [];

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
        if (data.toggle) {
          console.log(goodCheckCustomer);
          goodCheckCustomer.push(data.row);
        } else {
          goodCheckCustomer = goodCheckCustomer.filter(
            valor => valor.ClientId != data.row.ClientId
          );
        }
      });
    },
  },
};

export const COLUMNS_LOT_EVENT = {};

//FUNCIONES
export function setCheckHide(hideValue: boolean) {
  clearGoodCheckCustomer();
  COLUMNSCUSTOMER.check.hide = hideValue;
}

export function clearGoodCheckCustomer() {
  goodCheckCustomer = [];
}
