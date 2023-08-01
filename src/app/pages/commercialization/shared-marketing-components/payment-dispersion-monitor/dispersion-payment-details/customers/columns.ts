import { CheckboxElementComponent } from '../checkbox-element/checkbox-element.component';

export let goodCheckCustomer: any[] = [];

export const COLUMNS = {
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
    title: 'Fecha Ejec.',
    type: 'string',
    sort: false,
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
    show: false,
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

export function clearGoodCheckCustomer() {
  goodCheckCustomer = [];
}
