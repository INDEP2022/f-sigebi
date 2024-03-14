import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';

export let goodCheck: any = [];
export const VALUATION_REQUEST_COLUMNS = {
  check: {
    width: '5px',
    title: '',
    type: 'custom',
    filter: false,
    renderComponent: CheckboxElementComponent,
    valuePrepareFunction: (isSelected: any, row: any) => {
      return goodCheck.find((e: any) => e.row.no_bien == row.no_bien)
        ? true
        : false;
    },
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        if (data.toggle) {
          goodCheck.push(data);
        } else {
          goodCheck = goodCheck.filter(
            valor => valor.row.no_bien != data.row.no_bien
          );
        }
      });
    },
    sort: false,
  },
  no_bien: {
    title: 'No. Bien',
    sort: false,
  },
  descripcion: {
    title: 'Descripción',
    sort: false,
  },
  estatus: {
    title: 'Estatus',
    sort: false,
  },
  motivos: {
    title: 'Motivo(s)',
    sort: false,
  },
};

export const VALUATION_REQUEST_COLUMNS_VALIDATED = {
  no_bien: {
    title: 'No. Bien',
    sort: false,
  },
  descripcion: {
    title: 'Descripción',
    sort: false,
  },
};

export const VALUATION_REQUEST_COLUMNS_TWO = {
  no_bien: {
    title: 'No. Bien',
    sort: false,
  },
  descripcion: {
    title: 'Descripción',
    sort: false,
  },
  estatus: {
    title: 'Estatus',
    sort: false,
  },
  motivos: {
    title: 'Motivo(s)',
    sort: false,
  },
};

export const VALUATION_REQUEST_COLUMNS_VALIDATED_TWO = {
  no_bien: {
    title: 'No. Bien',
    sort: false,
  },
  descripcion: {
    title: 'Descripción',
    sort: false,
  },
  estatus: {
    title: 'Estatus',
    sort: false,
  },
  motivos: {
    title: 'Motivo(s)',
    sort: false,
  },
};

export const MOT_CAN = {
  id_motivo: {
    title: 'No. Motivo',
    sort: false,
  },
  descripcion_motivo: {
    title: 'Descripción',
    sort: false,
  },
};
