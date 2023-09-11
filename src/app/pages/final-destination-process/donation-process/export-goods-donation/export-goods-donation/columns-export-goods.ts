import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';

export let goodCheck: any[] = [];
export let goodCheck2: { [key: string]: any } = {};

export function clearGoodCheck() {
  goodCheck = [];
}

export function newGoodCheck(data: any[]) {
  goodCheck = data;
}

export const COLUMNS_EXPORT_GOODS = {
  numberGood: {
    title: 'No. Bien',
    type: 'number',
    sort: false,
  },
  description: {
    title: 'Descripción',
    type: 'string',
    sort: false,
  },
  quantity: {
    title: 'Cantidad',
    type: 'number',
    sort: false,
  },
  clasificationNumb: {
    title: 'No. Clasf Bien',
    type: 'number',
    sort: false,
  },
  tansfNumb: {
    title: 'No. Transfer',
    type: 'number',
    sort: false,
  },
  delAdmin: {
    title: 'Del_Admin',
    type: 'number',
    sort: false,
  },
  delDeliv: {
    title: 'Del_Recibe',
    type: 'number',
    sort: false,
  },
  recepDate: {
    title: 'Fecha Recepción',
    type: 'string',
    sort: false,
  },
  status: {
    title: 'Estatus',
    type: 'number',
    sort: false,
  },
  proceedingsNumb: {
    title: 'No. Expediente',
    type: 'number',
    sort: false,
  },

  cpd: {
    title: 'CPD',
    type: 'custom',
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
        } else {
          // Si el checkbox se deselecciona, puedes hacer algo aquí si es necesario
        }

        console.log('Evento del checkbox CPD. Fila:', rowData, 'Estado:', isChecked);
      });
    },
    sort: false,
  },
  /*cpd: {
    title: 'CPD',
    type: 'custom',
    renderComponent: CheckboxElementComponent,
    valuePrepareFunction: (cell: any, row: any) => {
      // Usar el valor de "row.cpd" para determinar el estado del checkbox
      return row.cpd ? '<input type="checkbox" checked>' : '<input type="checkbox">';
    },
    filter: false,
    sort: false,
  },*/
  adm: {
    title: 'ADM',
    type: 'custom',
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
        } else {
          // Si el checkbox se deselecciona, puedes hacer algo aquí si es necesario
        }

        console.log('Evento del checkbox CPD. Fila:', rowData, 'Estado:', isChecked);
      });
    },
    sort: false,
  },
  rda: {
    title: 'RDA',
    type: 'custom',
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
        } else {
          // Si el checkbox se deselecciona, puedes hacer algo aquí si es necesario
        }

        console.log('Evento del checkbox CPD. Fila:', rowData, 'Estado:', isChecked);
      });
    },
    sort: false,
  },
  // cpd: {
  //   title: 'CPD',
  //   type: 'custom',
  //   renderComponent: CheckboxElementComponent,
  //   onComponentInitFunction(instance: any) {
  //     // Establecer el estado del checkbox en true al inicializar
  //     instance.setValue(true);

  //     instance.toggle.subscribe((event: { row: any; toggle: boolean }) => {
  //       // Manejar el evento del checkbox CPD aquí
  //       const rowData = event.row;
  //       const isChecked = event.toggle;
  //       console.log('Evento del checkbox CPD. Fila:', rowData, 'Estado:', isChecked);
  //     });
  //   },
  //   sort: false,
  // },

  /*cpd: {
    title: 'CPD',
    type: 'custom',
    renderComponent: CheckboxElementComponent,
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        console.log('Estado del checkbox cambiado CPD:', data.toggle);
        data.row.to = data.toggle;
        if (data.toggle) {
          // Si el checkbox se marca, agrega el elemento al mapa usando su ID como clave
          goodCheck2[data.row.numberGood] = 1;
          console.log("goodCheck1 ", goodCheck2);
        } else {
          // Si el checkbox se desmarca, elimina el elemento del mapa usando su ID como clave
          delete goodCheck2[data.row.numberGood];
          console.log("goodCheck1 ", goodCheck2);
        }
      });
    },
    sort: false,
  },*/


  // adm: {
  //   title: 'ADM',
  //   type: 'custom',
  //   renderComponent: CheckboxElementComponent,
  //   onComponentInitFunction(instance: any) {
  //     instance.toggle.subscribe((data: any) => {
  //       console.log('Estado del checkbox cambiado ADM:', data.toggle);
  //       data.row.to = data.toggle;
  //       if (data.toggle) {
  //         // Si el checkbox se marca, agrega el elemento al mapa usando su ID como clave
  //         goodCheck2[data.row.numberGood] = 2;
  //         console.log("goodCheck2 ", goodCheck2);
  //       } else {
  //         // Si el checkbox se desmarca, elimina el elemento del mapa usando su ID como clave
  //         delete goodCheck2[data.row.numberGood];
  //         console.log("goodCheck2 ", goodCheck2);
  //       }
  //     });
  //   },
  //   sort: false,
  // },
  // rda: {
  //   title: 'RDA',
  //   type: 'custom',
  //   renderComponent: CheckboxElementComponent,
  //   onComponentInitFunction(instance: any) {
  //     instance.toggle.subscribe((data: any) => {
  //       console.log('Estado del checkbox cambiado RDA:', data.toggle);
  //       data.row.to = data.toggle;
  //       if (data.toggle) {
  //         // Si el checkbox se marca, agrega el elemento al mapa usando su ID como clave
  //         goodCheck2[data.row.numberGood] = 3;
  //         console.log("goodCheck3 ", goodCheck2);
  //       } else {
  //         // Si el checkbox se desmarca, elimina el elemento del mapa usando su ID como clave
  //         delete goodCheck2[data.row.numberGood];
  //         console.log("goodCheck3 ", goodCheck2);
  //       }
  //     });
  //   },
  //   sort: false,
  // },
};

