import { DatePipe } from '@angular/common';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';

export const COLUMNS = {
  NO_BIEN: {
    title: 'No. Bien',
    sort: false,
  },
  FEC_PAGO: {
    title: 'Fecha de Pago',
    type: 'string',
    sort: false,
    valuePrepareFunction: (date: Date) => {
      var raw = new Date(date);
      var formatted = new DatePipe('en-EN').transform(raw, 'dd/MM/yyyy');
      return formatted;
    },
  },
  IMPORTE: {
    title: 'Importe',
    sort: false,
  },
  CVE_CONCEPTO_PAGO: {
    title: 'Concepto de Pago',
    sort: false,
  },
  OBSERVACION: {
    title: 'Observaciones',
    sort: false,
  },
  JURIDICO: {
    title: 'Jurídico',
    sort: false,
  },
  ADMINISTRA: {
    title: 'Administrativo',
    sort: false,
  },
  VALIDADO: {
    title: 'Válido Pago',
    sort: false,
    type: 'custom',
    renderComponent: CheckboxElementComponent,
    valuePrepareFunction: (VALIDADO: string, row: any) =>
      row.VALIDADO == 'S' ? true : false,
    onComponentInitFunction: (instance: CheckboxElementComponent) => {
      instance.toggle.subscribe(event => {
        const { row, toggle } = event;
        row.VALIDADO = toggle ? 'S' : 'N';
      });
    },
  },
  VALJUR: {
    title: 'Válido Jur.',
    sort: false,
    type: 'custom',
    renderComponent: CheckboxElementComponent,
    valuePrepareFunction: (VALJUR: string, row: any) =>
      row.VALJUR == 'S' ? true : false,
    onComponentInitFunction: (instance: CheckboxElementComponent) => {
      instance.toggle.subscribe(event => {
        const { row, toggle } = event;
        row.VALJUR = toggle ? 'S' : 'N';
      });
    },
  },
  VALADM: {
    title: 'Válido Adm.',
    sort: false,
    type: 'custom',
    renderComponent: CheckboxElementComponent,
    valuePrepareFunction: (VALADM: string, row: any) =>
      row.VALADM == 'S' ? true : false,
    onComponentInitFunction: (instance: CheckboxElementComponent) => {
      instance.toggle.subscribe(event => {
        const { row, toggle } = event;
        row.VALADM = toggle ? 'S' : 'N';
      });
    },
  },
  APLICADO: {
    title: 'Aplicado Pagos',
    sort: false,
    type: 'custom',
    renderComponent: CheckboxElementComponent,
    valuePrepareFunction: (APLICADO: string, row: any) =>
      row.APLICADO == 'S' ? true : false,
    onComponentInitFunction: (instance: CheckboxElementComponent) => {
      instance.toggle.subscribe(event => {
        const { row, toggle } = event;
        row.APLICADO = toggle ? 'S' : 'N';
      });
    },
  },
  APLJUR: {
    title: 'Aplicado Jur.',
    sort: false,
    type: 'custom',
    renderComponent: CheckboxElementComponent,
    valuePrepareFunction: (APLJUR: string, row: any) =>
      row.APLJUR == 'S' ? true : false,
    onComponentInitFunction: (instance: CheckboxElementComponent) => {
      instance.toggle.subscribe(event => {
        const { row, toggle } = event;
        row.APLJUR = toggle ? 'S' : 'N';
      });
    },
  },
  APLADM: {
    title: 'Aplicado Adm.',
    sort: false,
    type: 'custom',
    renderComponent: CheckboxElementComponent,
    valuePrepareFunction: (APLADM: string, row: any) =>
      row.APLADM == 'S' ? true : false,
    onComponentInitFunction: (instance: CheckboxElementComponent) => {
      instance.toggle.subscribe(event => {
        const { row, toggle } = event;
        row.APLADM = toggle ? 'S' : 'N';
      });
    },
  },
};
