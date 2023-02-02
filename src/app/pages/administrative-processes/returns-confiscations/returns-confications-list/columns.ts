import { DatePickerComponent } from 'src/app/shared/render-components/date-picker/date-picker.component';
import { SelectUserComponent } from 'src/app/shared/render-components/select-user/select-user.component';

export const COLUMNS = {
  id: {
    title: 'Bien',
    sort: false,
    editable: false,
  },
  description: {
    title: 'Descripción',
    sort: false,
    editable: false,
  },
  extDomProcess: {
    title: 'Ext. Dominio',
    sort: false,
    editable: false,
  },
  dateRenderDecoDev: {
    title: 'Fecha Decomiso',
    editor: {
      type: 'custom',
      component: DatePickerComponent,
    },
    sort: false,
  },
  promoterUserDecoDevo: {
    title: 'Promovente',
    sort: false,
    width: '20%',
    editor: {
      type: 'custom',
      component: SelectUserComponent,
    },
  },
  quantity: {
    title: 'Cantidad',
    sort: false,
    editable: false,
  },
  appraisedValue: {
    title: 'Importe',
    sort: false,
    editable: false,
  },
  tesofeDate: {
    title: 'Fecha Tesofe',
    sort: false,
    editable: false,
  },
  /*confRet: {
    title: 'Dev/Conf',
    sort: false,
    editable: false,
  },*/
  tesofeFolio: {
    title: 'Folio Tesofe',
    sort: false,
    editable: false,
  },
};
