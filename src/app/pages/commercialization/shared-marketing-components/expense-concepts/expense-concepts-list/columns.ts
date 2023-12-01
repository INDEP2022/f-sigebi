import { getAddress } from 'src/app/core/services/ms-commer-concepts/concepts.service';
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
    sort: false,
    class: 'w-md',
    editor: {
      type: 'list',
      config: {
        selectText: 'Seleccionar',
        list: [
          { value: '', title: 'SELECCIONAR' },
          { value: 'M', title: 'MUEBLES' },
          { value: 'I', title: 'INMUEBLES' },
          { value: 'C', title: 'GENERAL' },
          { value: 'VIGILANCIA', title: 'VIGILANCIA' },
          { value: 'SEGUROS', title: 'SEGUROS' },
          { value: 'JURIDICO', title: 'JURÍDICO' },
          { value: 'ADMINISTRACIÓN', title: 'ADMINISTRACIÓN' },
        ],
      },
    },
    valuePrepareFunction: (value: any, row: any) => {
      // DATA FROM HERE GOES TO renderComponent
      return row.address ? getAddress(row.address) : '';
    },
  },
  automatic: {
    title: 'Automático',
    sort: false,
    type: 'html',
    valuePrepareFunction: (value: any) => {
      if (value == 'S')
        return '<strong><span class="badge badge-pill badge-success">Si</span></strong>';
      if (value == 'N' || !value)
        return '<strong><span class="badge badge-pill badge-warning">No</span></strong>';
      return value;
    },
    filter: {
      type: 'list',
      config: {
        selectText: 'Seleccionar',
        list: [
          { value: 'N', title: 'No Automático' },
          { value: 'S', title: 'Automático' },
        ],
      },
    },
  },
  routineCalculation: {
    title: 'Rut. Cálculo',
    type: 'string',
    sort: false,
  },
  numerary: {
    title: 'Afecta No.',
    sort: false,
    type: 'html',
    valuePrepareFunction: (value: any) => {
      if (value == 'S')
        return '<strong><span class="badge badge-pill badge-success">Si</span></strong>';
      if (value == 'N' || !value)
        return '<strong><span class="badge badge-pill badge-warning">No</span></strong>';
      return value;
    },
    filter: {
      type: 'list',
      config: {
        selectText: 'Seleccionar',
        list: [
          { value: 'N', title: 'No Afecta' },
          { value: 'S', title: 'Afecta' },
        ],
      },
    },
  },
  // numerary: {
  //   title: 'Afecta No.',
  //   type: 'custom',
  //   sort: false,
  //   renderComponent: CheckboxDisabledElementComponent,
  //   valuePrepareFunction: (value: any, row: any) => {
  //     // DATA FROM HERE GOES TO renderComponent
  //     return {
  //       checked: row.numerary === 'S' || row.numerary === true ? true : false,
  //       disabled: true,
  //     };
  //   },
  //   editor: {
  //     type: 'custom',
  //     component: CheckboxDisabledElementComponent,
  //   },
  //   filter: {
  //     type: 'checkbox',
  //     config: {
  //       true: 'S',
  //       false: 'N',
  //       resetText: 'x',
  //     },
  //   },
  // },
};
