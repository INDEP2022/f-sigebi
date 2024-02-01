import { CheckboxElementComponent_ } from 'src/app/pages/final-destination-process/donation-process/maintenance-commitment-donation/data-in-table/CheckboxDisabled';

export const CREATION_PERMISSIONS_COLUMNS = {
  user: {
    title: 'Usuario',
    type: 'string',
    sort: false,
    width: '25%',
  },
  name: {
    title: 'Nombre',
    type: 'string',
    sort: false,
    width: '35%',
    filter: false,
  },
  _indGuarantee: {
    title: 'Crea Controles No Ganadores',
    type: 'custom',
    sort: false,
    width: '20%',
    filter: {
      type: 'list',
      config: {
        selectText: 'Todos',
        list: [
          { value: '1', title: 'Activo' },
          { value: '0', title: 'Inactivo' },
        ],
      },
    },
    renderComponent: CheckboxElementComponent_,
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        console.log(data);
      });
    },
    filterFunction: () => {
      return true;
    },
    // valuePrepareFunction: (_cell: any, row: any) => {
    //   const process = row.indGuarantee;
    //   if (process == 1) {
    //     return 'Si';
    //   } else {
    //     return 'No';
    //   }
    // },
  },
  _inddisp: {
    title: 'Crea Controles Ganadores',
    type: 'custom',
    sort: false,
    width: '20%',
    filter: {
      type: 'list',
      config: {
        selectText: 'Todos',
        list: [
          { value: '1', title: 'Activo' },
          { value: '0', title: 'Inactivo' },
        ],
      },
    },
    renderComponent: CheckboxElementComponent_,
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        console.log(data);
      });
    },
    filterFunction: () => {
      return true;
    },
    // valuePrepareFunction: (_cell: any, row: any) => {
    //   const process = row.inddisp;
    //   if (process == 1) {
    //     return 'Si';
    //   } else {
    //     return 'No';
    //   }
    // },
  },
};
