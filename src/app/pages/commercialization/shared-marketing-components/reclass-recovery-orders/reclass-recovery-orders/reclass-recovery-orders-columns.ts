import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';

export let goodCheck: any[] = [];

export const DETAILS_OI_COLUMNS = {
  lotSiab: {
    title: 'Lote',
    type: 'string',
    sort: false,
  },
  description: {
    title: 'Descripción',
    type: 'string',
    sort: false,
  },
  mandate: {
    title: 'Mandato',
    type: 'string',
    sort: false,
  },
  amount: {
    title: 'Importe',
    type: 'string',
    sort: false,
  },
  amountSVat: {
    title: 'Importe sin Iva',
    type: 'string',
    sort: false,
  },
  vat: {
    title: 'Iva',
    type: 'string',
    sort: false,
  },
  entry: {
    title: 'Tipo de Ingreso',
    type: 'string',
    sort: false,
  },
  indType: {
    title: 'Pago',
    type: 'string',
    sort: false,
  },
  percentVat: {
    title: 'Iva',
    type: 'string',
    sort: false,
  },
  priceVtaLot: {
    title: 'Precio Vta.',
    type: 'string',
    sort: false,
  },
  percentageRetained: {
    title: 'Ret',
    type: 'string',
    sort: false,
  },
  amountRetained: {
    title: 'Retenido',
    type: 'string',
    sort: false,
  },
  check: {
    title: 'Rec Imp',
    type: 'custom',
    filter: false,
    showAlways: true,
    renderComponent: CheckboxElementComponent,
    valuePrepareFunction: (isSelected: any, row: any) => {
      return goodCheck.find((e: any) => e.row.id == row.id) ? true : false;
    },
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        if (data.toggle) {
          goodCheck.push(data);
          console.log(goodCheck);
        } else {
          goodCheck = goodCheck.filter(valor => valor.row.id != data.row.id);
          console.log(goodCheck);
        }
      });
    },
    sort: false,
  },
};

export function clearGoodCheck() {
  goodCheck = [];
}
