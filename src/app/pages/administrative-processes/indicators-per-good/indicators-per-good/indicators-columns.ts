import { DatePipe } from '@angular/common';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';

export const INDICATORS_GOOD_COLUMNS1 = {
  idGoodNumber: {
    title: 'Nombre',
    type: 'text',
    sort: false,
    // valuePrepareFunction: (value: IGood) => {
    //   return value?.description;
    // },
  },
  value: {
    title: 'Valor',
    type: 'number',
    sort: false,
    // valuePrepareFunction: (value: IGood) => {
    //   return value?.quantity;
    // },
  },
};

export const INDICATORS_COLUMNS2 = {
  idGoodNumber: {
    title: 'Nombre',
    type: 'text',
    sort: false,
    // valuePrepareFunction: (value: IGood) => {
    //   return value?.description;
    // },
  },
  idIndicatorDate: {
    title: 'Descripción',
    type: 'text',
    sort: false,
    valuePrepareFunction: (date: Date) => {
      var raw = new Date(date);
      var formatted = new DatePipe('es-ES').transform(raw, 'dd/MM/aaaa');
      return formatted;
    },
  },
  registryNumber: {
    title: '',
    sort: true,
    type: 'custom',
    renderComponent: CheckboxElementComponent,
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        data.row.to = data.toggle;
      });
    },
  },
};
