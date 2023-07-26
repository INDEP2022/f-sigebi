import { CheckboxDisabledElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-disabled-element';
import { TextAreaRenderComponent } from 'src/app/shared/render-components/text-area-render/text-area-render.component';

export const COLUMNS = {
  // button: {
  //   title: 'Copiar Parámetros',
  //   type: 'custom',
  //   sort: false,
  //   filter: false,
  //   renderComponent: CopyParametersComponent,
  // },
  id: {
    title: 'Concepto',
    type: 'string',
    sort: false,
    editable: false,
  },
  description: {
    title: 'Descripción',
    type: 'string',
    sort: false,
    editor: {
      type: 'custom',
      component: TextAreaRenderComponent,
    },
  },
  address: {
    title: 'Dirección',
    type: 'string',
    sort: false,
    class: 'w-md',
    editor: {
      type: 'list',
      config: {
        selectText: 'Seleccionar',
        list: [
          { value: '', title: 'SELECCIONAR' },
          { value: 'MUEBLES', title: 'MUEBLES' },
          { value: 'INMUEBLES', title: 'INMUEBLES' },
          { value: 'GENERAL', title: 'GENERAL' },
          { value: 'VIGILANCIA', title: 'VIGILANCIA' },
          { value: 'SEGUROS', title: 'SEGUROS' },
          { value: 'JURIDICO', title: 'JURIDICO' },
          { value: 'ADMINISTRACIÓN', title: 'ADMINISTRACIÓN' },
        ],
      },
    },
  },
  automatic: {
    title: 'Automático',
    type: 'custom',
    sort: false,
    renderComponent: CheckboxDisabledElementComponent,
    valuePrepareFunction: (value: any, row: any) => {
      // DATA FROM HERE GOES TO renderComponent
      return {
        checked: row.automatic === 'S' || row.automatic === true ? true : false,
        disabled: true,
      };
    },
    editor: {
      type: 'custom',
      component: CheckboxDisabledElementComponent,
    },
  },
  routineCalculation: {
    title: 'Rut. Cálculo',
    type: 'string',
    sort: false,
  },
  numerary: {
    title: 'Afecta Num.',
    type: 'custom',
    sort: false,
    renderComponent: CheckboxDisabledElementComponent,
    valuePrepareFunction: (value: any, row: any) => {
      // DATA FROM HERE GOES TO renderComponent
      return {
        checked: row.numerary === 'S' || row.numerary === true ? true : false,
        disabled: true,
      };
    },
    editor: {
      type: 'custom',
      component: CheckboxDisabledElementComponent,
    },
  },
};
