import { CustomFilterComponent } from 'src/app/@standalone/shared-forms/input-number/input-number';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';

export const PRE_INVOICING_COLUMNS = {
  select: {
    title: '',
    sort: false,
    filter: false,
    type: 'custom',
    renderComponent: CheckboxElementComponent,
    onComponentInitFunction(instance: any) {
      const time = setTimeout(() => {
        (instance.box.nativeElement as HTMLInputElement).click();
        clearTimeout(time);
      }, 300);
      instance.toggle.subscribe((data: any) => {
        instance.rowData.select = data.toggle;
      });
    },
  },
  eventId: {
    title: 'Evento',
    sort: false,
    filter: {
      type: 'custom',
      component: CustomFilterComponent,
    },
  },
  batchId: {
    title: 'Lote',
    sort: false,
    filter: {
      type: 'custom',
      component: CustomFilterComponent,
    },
  },
  customer: {
    title: 'Cliente',
    sort: false,
  },
  delegationNumber: {
    title: 'Regional',
    sort: false,
    filter: {
      type: 'custom',
      component: CustomFilterComponent,
    },
  },
  Type: {
    title: 'Tipo',
    sort: false,
    valuePrepareFunction: (val: number) => {
      return val == 7 ? 'Venta de Bases' : '';
    },
  },
  series: {
    title: 'Serie',
    sort: false,
  },
  folioinvoiceId: {
    title: 'Folio',
    sort: false,
    filter: {
      type: 'custom',
      component: CustomFilterComponent,
    },
  },
  factstatusId: {
    title: 'Estatus',
    sort: false,
  },
  vouchertype: {
    title: 'Tipo',
    sort: false,
  },
  impressionDate: {
    title: 'Fecha',
    sort: false,
    valuePrepareFunction: (val: string) => {
      return val ? val.split('-').reverse().join('/') : '';
    },
  },
  price: {
    title: 'Precio',
    sort: false,
    filter: {
      type: 'custom',
      component: CustomFilterComponent,
    },
  },
  vat: {
    title: 'IVA',
    sort: false,
    filter: {
      type: 'custom',
      component: CustomFilterComponent,
    },
  },
  total: {
    title: 'Total',
    sort: false,
    filter: {
      type: 'custom',
      component: CustomFilterComponent,
    },
  },
};
