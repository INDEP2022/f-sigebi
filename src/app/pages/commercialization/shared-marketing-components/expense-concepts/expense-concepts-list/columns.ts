import { CheckboxDisabledElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-disabled-element';
import { CopyParametersComponent } from './copyParameters/copyParameters.component';

export const COLUMNS = {
  button: {
    title: 'Copiar Parámetros',
    type: 'custom',
    sort: false,
    filter: false,
    renderComponent: CopyParametersComponent,
  },
  id: {
    title: 'Concepto',
    type: 'string',
    sort: false,
  },
  description: {
    title: 'Descripción',
    type: 'string',
    sort: false,
  },
  address: {
    title: 'Dirección',
    type: 'string',
    sort: false,
    // valuePrepareFunction: (cell: any, row: IConcept) => {
    //   if (row.address) {
    //     switch (row.address) {
    //       case 'M':
    //         return 'MUEBLES';
    //       case 'I':
    //         return 'INMUEBLES';
    //       case 'C':
    //         return 'GENERAL';
    //       case 'V':
    //         return 'VIGILANCIA';
    //       case 'S':
    //         return 'SEGUROS';
    //       case 'J':
    //         return 'JURIDICO';
    //       case 'A':
    //         return 'ADMINISTRACIÓN';
    //       default:
    //         return null;
    //     }
    //   } else {
    //     return null;
    //   }
    // },
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
  },
};
