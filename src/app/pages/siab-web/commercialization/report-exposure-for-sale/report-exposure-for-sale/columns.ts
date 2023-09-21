import { DatePipe } from '@angular/common';
import { CustomDateFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-custom/custom-date-filter';

export const UNEXPOSED_GOODS_COLUMNS = {
  no_bien: {
    title: 'No. Bien',
    sort: false,
  },
  descripcion_bien: {
    title: 'Descripción',
    sort: false,
  },
  valor_base: {
    title: 'Valor Base',
    sort: false,
  },
  nombre_transferente: {
    title: 'Desc. Transferente',
    sort: false,
  },
  id_estatusvta: {
    title: 'ID Status VTA',
    sort: false,
  },
  fecha_bien: {
    title: 'Fecha Bien',
    sort: false,
  },
  fecha_fallo: {
    title: 'Fecha Fallo',
    sort: false,
  },
  fecha_evento: {
    title: 'Fecha Evento',
    sort: false,
  },
  fecha_creacion: {
    title: 'Fecha Creación',
    sort: false,
  },
  tipo_bien: {
    title: 'Tipo Bien',
    sort: false,
  },
  sub_tipo_bien: {
    title: 'Sub tipo Bien',
    sort: false,
  },
  delegacion_admin: {
    title: 'Delegación Admin',
    sort: false,
  },
};

export const MONTH_COLUMNS = {
  no_bien: {
    title: 'No. Bien',
    sort: false,
  },
  descripcion_bien: {
    title: 'Descripción',
    sort: false,
  },
  valor_base: {
    title: 'Valor Base',
    sort: false,
  },
  nombre_transferente: {
    title: 'Desc. Transferente',
    sort: false,
  },
  id_estatusvta: {
    title: 'ID Status VTA',
    sort: false,
  },
  fecha_bien: {
    title: 'Fecha Bien',
    sort: false,
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
  },
  fecha_fallo: {
    title: 'Fecha Fallo',
    sort: false,
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
  },
  fecha_evento: {
    title: 'Fecha Evento',
    sort: false,
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
  },
  fecha_creacion: {
    title: 'Fecha Creación',
    sort: false,
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
  },
  tipo_bien: {
    title: 'Tipo Bien',
    sort: false,
  },
  sub_tipo_bien: {
    title: 'Sub tipo Bien',
    sort: false,
  },
  delegacion_admin: {
    title: 'Delegación Admin',
    sort: false,
  },
};

export const CONSULT_COLUMNS = {
  goodNumber: {
    title: 'No. Bien',
    sort: false,
  },
  description: {
    title: 'Descripción',
    sort: false,
  },
  baseValue: {
    title: 'Valor Base',
    sort: false,
  },
  transfDesc: {
    title: 'Desc. Transferente',
    sort: false,
  },
  status: {
    title: 'ID Status VTA',
    sort: false,
  },
  goodDate: {
    title: 'Fecha Bien',
    sort: false,
    valuePrepareFunction: (date: Date) => {
      var raw = new Date(date);
      var formatted = new DatePipe('en-EN').transform(raw, 'dd/MM/yyyy', 'UTC');
      return formatted;
    },
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
  },
  failedDate: {
    title: 'Fecha Fallo',
    sort: false,
    valuePrepareFunction: (date: Date) => {
      var raw = new Date(date);
      var formatted = new DatePipe('en-EN').transform(raw, 'dd/MM/yyyy', 'UTC');
      return formatted;
    },
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
  },
  eventDate: {
    title: 'Fecha Evento',
    sort: false,
    valuePrepareFunction: (date: Date) => {
      var raw = new Date(date);
      var formatted = new DatePipe('en-EN').transform(raw, 'dd/MM/yyyy', 'UTC');
      return formatted;
    },
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
  },
  creationDate: {
    title: 'Fecha Creación',
    sort: false,
    valuePrepareFunction: (date: Date) => {
      var raw = new Date(date);
      var formatted = new DatePipe('en-EN').transform(raw, 'dd/MM/yyyy', 'UTC');
      return formatted;
    },
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
  },
  goodType: {
    title: 'Tipo Bien',
    sort: false,
  },
  goodSubType: {
    title: 'Sub tipo Bien',
    sort: false,
  },
  coordAdminNumber: {
    title: 'Delegación Admin',
    sort: false,
  },
};

export const GOOD_COLUMNS = {
  no_bien: {
    title: 'No. Bien',
    sort: false,
  },
  descripcion: {
    title: 'Descripción',
    sort: false,
  },
  valor_base: {
    title: 'Valor Base',
    sort: false,
  },
  desc_transferente: {
    title: 'Desc. Transferente',
    sort: false,
  },
  id_estatusvta: {
    title: 'ID Status VTA',
    sort: false,
  },
  fecha_bien: {
    title: 'Fecha Bien',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      const parts = cell.split('-');
      const year = parts[0];
      const month = parts[1];
      const day = parts[2];
      const formattedDate = `${day}/${month}/${year}`;
      return formattedDate;
    },
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
  },
  fecha_fallo: {
    title: 'Fecha Fallo',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      const parts = cell.split('-');
      const year = parts[0];
      const month = parts[1];
      const day = parts[2];
      const formattedDate = `${day}/${month}/${year}`;
      return formattedDate;
    },
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
  },
  fecha_evento: {
    title: 'Fecha Evento',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      const parts = cell.split('-');
      const year = parts[0];
      const month = parts[1];
      const day = parts[2];
      const formattedDate = `${day}/${month}/${year}`;
      return formattedDate;
    },
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
  },
  fecha_creacion: {
    title: 'Fecha Creación',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      const parts = cell.split('-');
      const year = parts[0];
      const month = parts[1];
      const day = parts[2];
      const formattedDate = `${day}/${month}/${year}`;
      return formattedDate;
    },
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
  },
  tipo_bien: {
    title: 'Tipo Bien',
    sort: false,
  },
  sub_tipo_bien: {
    title: 'Sub tipo Bien',
    sort: false,
  },
  delegacion_admin: {
    title: 'Delegación Admin',
    sort: false,
  },
};
