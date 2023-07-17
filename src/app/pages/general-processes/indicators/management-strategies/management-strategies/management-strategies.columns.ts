import { CheckboxDisabledElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-disabled-element';

export const MANAGEMENT_STRATEGIES_COLUMNS = {
  consecutiveId: {
    title: 'Ref.',
    sort: false,
  },
  folioAmongWeatherId: {
    title: 'Folio Estrategias de Administración',
    sort: false,
  },
  valFolioAmongTime: {
    title: 'Entregada a Tiempo',
    type: 'custom',
    filter: false,
    class: 'text-center',
    renderComponent: CheckboxDisabledElementComponent,
    valuePrepareFunction: (cell: any, row: any) => {
      return { checked: +row.valFolioAmongTime ? 1 : 0, disabled: true };
    },
    onComponentInitFunction(instance: any) {
      let isChecked = false;
      instance.toggle.subscribe((data: any) => {
        isChecked = data.toggle; // Actualizar el estado del checkbox
        console.log(isChecked); // Imprimir el estado del checkbox

        // Realiza las acciones necesarias en función del estado del checkbox
        if (isChecked) {
          // goodCheck.push(data);
        } else {
          // goodCheck = goodCheck.filter(valor => valor.row.id != data.row.id);
        }
      });
    },
    sort: false,
    editable: false,
  },
  repAmongWeather: {
    title: 'Folio Reporte Implementación',
    sort: false,
  },
  valRepAmongTime: {
    title: 'Entregado a Tiempo',
    type: 'custom',
    filter: false,
    renderComponent: CheckboxDisabledElementComponent,
    valuePrepareFunction: (cell: any, row: any) => {
      return { checked: +row.valRepAmongTime ? 1 : 0, disabled: true };
    },
    rowData: { disabled: true },
    onComponentInitFunction(instance: any) {
      let isChecked = false;
      instance.toggle.subscribe((data: any) => {
        isChecked = data.toggle; // Actualizar el estado del checkbox
        console.log(isChecked); // Imprimir el estado del checkbox

        // Realiza las acciones necesarias en función del estado del checkbox
        if (isChecked) {
          // goodCheck.push(data);
        } else {
          // goodCheck = goodCheck.filter(valor => valor.row.id != data.row.id);
        }
      });
    },
    sort: false,
  },
};
