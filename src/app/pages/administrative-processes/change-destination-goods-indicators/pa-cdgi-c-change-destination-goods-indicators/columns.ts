//Components

export const COLUMNS = {
  id: {
    title: 'No. Bien',
    sort: false,
  },
  description: {
    title: 'Descripcion',
    sort: false,
  },
  status: {
    title: 'Estatus',
    sort: false,
  },
  labelNumber: {
    title: 'Ind. Destino',
    sort: false,
    valuePrepareFunction: (row: any) => {
      switch (Number(row)) {
        case 1:
          return 'VENTA';
          break;
        case 2:
          return 'DONACION';
          break;
        case 3:
          return 'RESGUARDO';
          break;
        case 4:
          return 'DESTRUCCION';
          break;
        case 5:
          return 'DEVOLUCION';
          break;
        case 6:
          return 'AMPARO';
          break;
        case 7:
          return 'ENTERADO LIF';
          break;

        default:
          return '0';
          break;
      }
    },
    filter: {
      type: 'list',
      config: {
        selectText: 'Seleccionar',
        list: [
          { value: 1, title: 'VENTA' },
          { value: 2, title: 'DONACION' },
          { value: 3, title: 'RESGUARDO' },
          { value: 4, title: 'DESTRUCCION' },
          { value: 5, title: 'DEVOLUCION' },
          { value: 6, title: 'AMPARO' },
          { value: 7, title: 'ENTERADO LIF' },
        ],
      },
    },
  },
  fileNumber: {
    title: 'No. Expediente',
    sort: false,
  },
  goodClassNumber: {
    title: 'No. Clasificación',
    sort: false,
  },
  transferNumberExpedient: {
    title: 'No. Transferente',
    sort: false,
    valuePrepareFunction: (row: any) => {
      if (row == null || row == '') {
        return '0';
      } else {
        return row;
      }
    },
  },
  nameInstitutionExpedient: {
    title: 'Transferente',
    sort: false,
  },

  /*valid: {
    title: 'Válido',
    type: 'custom',
    renderComponent: CheckboxElementComponent,
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        data.row.to = data.toggle;
      });
    },
    sort: false,
  },*/
};
