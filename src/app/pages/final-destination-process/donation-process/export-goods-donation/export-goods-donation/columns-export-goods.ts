import { CustomDateFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-custom/custom-date-filter';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';

export let goodCheck: any[] = [];
export let goodCheck2: { [key: string]: any } = {};
var t: any = this;
export function clearGoodCheck() {
  goodCheck = [];
}

export function newGoodCheck(data: any[]) {
  goodCheck = data;
}

export const COLUMNS_EXPORT_GOODS = {
  goodNumber: {
    title: 'No. Bien',
    type: 'number',
    sort: false,
  },
  description: {
    title: 'Descripción',
    type: 'string',
    sort: false,
  },
  amount: {
    title: 'Cantidad',
    type: 'number',
    sort: false,
  },
  notClassificationWell: {
    title: 'No. Clasf Bien',
    type: 'number',
    sort: false,
  },
  transferor: {
    title: 'No. Transfer',
    type: 'number',
    sort: false,
  },
  delAdmin: {
    title: 'Del_Admin',
    type: 'number',
    sort: false,
  },
  delReceives: {
    title: 'Del_Recibe',
    type: 'number',
    sort: false,
  },
  recepDate: {
    title: 'Fecha Recepción',
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
    valuePrepareFunction: (text: string) => {
      return `${text ? text.split('-').reverse().join('/') : ''}`;
    },
    sort: false,
  },
  status: {
    title: 'Estatus',
    type: 'number',
    sort: false,
  },
  proceedingsNumber: {
    title: 'No. Expediente',
    type: 'number',
    sort: false,
  },
  cpd: {
    title: 'CPD',
    type: 'custom',
    filter: false,
    renderComponent: CheckboxElementComponent,
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((event: { row: any; toggle: boolean }) => {
        // Manejar el evento del checkbox CPD aquí
        const rowData = event.row;
        const isChecked = event.toggle;

        // Verificar si el checkbox se ha seleccionado
        if (isChecked) {
          // Si el checkbox se selecciona, establecer el valor en true
          rowData.cpd = true; // Asume que rowData.cpd representa el valor de la columna 'CPD'
          rowData.rda = false;
          rowData.adm = false;
          if (event.toggle) {
            // Llamar a la función del componente principal cuando isChecked es true
          }
        } else {
          // Si el checkbox se deselecciona, puedes hacer algo aquí si es necesario
        }

        console.log(
          'Evento del checkbox CPD. Fila:',
          rowData,
          'Estado:',
          isChecked
        );
      });
    },
    sort: false,
  },
  adm: {
    title: 'ADM',
    type: 'custom',
    filter: false,
    renderComponent: CheckboxElementComponent,
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((event: { row: any; toggle: boolean }) => {
        // Manejar el evento del checkbox CPD aquí
        const rowData = event.row;
        const isChecked = event.toggle;

        // Verificar si el checkbox se ha seleccionado
        if (isChecked) {
          // Si el checkbox se selecciona, establecer el valor en true
          rowData.adm = true; // Asume que rowData.cpd representa el valor de la columna 'CPD'
          rowData.rda = false;
          rowData.cpd = false;
        } else {
          // Si el checkbox se deselecciona, puedes hacer algo aquí si es necesario
        }

        console.log(
          'Evento del checkbox CPD. Fila:',
          rowData,
          'Estado:',
          isChecked
        );
      });
    },
    sort: false,
  },
  rda: {
    title: 'RDA',
    type: 'custom',
    filter: false,
    renderComponent: CheckboxElementComponent,
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((event: { row: any; toggle: boolean }) => {
        // Manejar el evento del checkbox CPD aquí
        const rowData = event.row;
        const isChecked = event.toggle;

        // Verificar si el checkbox se ha seleccionado
        if (isChecked) {
          // Si el checkbox se selecciona, establecer el valor en true
          rowData.rda = true; // Asume que rowData.cpd representa el valor de la columna 'CPD'
          rowData.cpd = false;
          rowData.adm = false;
        } else {
          // Si el checkbox se deselecciona, puedes hacer algo aquí si es necesario
        }

        console.log(
          'Evento del checkbox CPD. Fila:',
          rowData,
          'Estado:',
          isChecked
        );
      });
    },
    sort: false,
  },
};
