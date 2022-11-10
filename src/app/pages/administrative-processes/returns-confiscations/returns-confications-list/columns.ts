import { DatePickerComponent } from 'src/app/shared/render-components/date-picker/date-picker.component';
import { SelectUserComponent } from 'src/app/shared/render-components/select-user/select-user.component';

export const COLUMNS = {
  goodId: {
    title: 'Bien',
    sort: false,
    editable: false,
    addable: false,
  },
  description: {
    title: 'Descripción',
    sort: false,
    editable: false,
    addable: false,
  },
  domain: {
    title: 'Ext. Dominio',
    sort: false,
    editable: false,
    addable: false,
  },
  dateConfiscation: {
    title: 'Fecha Decomiso',
    editor: {
      type: 'custom',
      component: DatePickerComponent,
    },
    sort: false,
  },
  promoter: {
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
    addable: false,
  },
  amount: {
    title: 'Importe',
    sort: false,
    editable: false,
    addable: false,
  },
  dateTesofe: {
    title: 'Fecha Tesofe',
    sort: false,
    editable: false,
    addable: false,
  },
  confRet: {
    title: 'Dev/Conf',
    sort: false,
    editable: false,
    addable: false,
  },
  folioTesofe: {
    title: 'Folio Tesofe',
    sort: false,
    editable: false,
    addable: false,
  },
};
