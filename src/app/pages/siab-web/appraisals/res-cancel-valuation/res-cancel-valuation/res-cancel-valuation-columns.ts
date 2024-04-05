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
      return goodCheck.find((e: any) => e.goodNumber == row.goodNumber)
        ? true
        : false;
    },
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        if (data.toggle) {
          goodCheck.push(data.row);
        } else {
          goodCheck = goodCheck.filter(
            valor => valor.goodNumber != data.goodNumber
          );
        }
      });
    },
    sort: false,
  },
  goodNumber: {
    title: 'No. Bien',
    sort: false,
  },
  description: {
    title: 'Descripción',
    sort: false,
  },
  status: {
    title: 'Estatus',
    sort: false,
  },
  motivos: {
    title: 'Motivo(s)',
    sort: false,
  },
};

export const VALUATION_REQUEST_COLUMNS_VALIDATED = {
  goodNumber: {
    title: 'No. Bien',
    sort: false,
  },
  description: {
    title: 'Descripción',
    sort: false,
  },
};

export const VALUATION_REQUEST_COLUMNS_TWO = {
  goodNumber: {
    title: 'No. Bien',
    sort: false,
  },
  description: {
    title: 'Descripción',
    sort: false,
  },
  status: {
    title: 'Estatus',
    sort: false,
  },
  motivos: {
    title: 'Motivo(s)',
    sort: false,
  },
};

export const VALUATION_REQUEST_COLUMNS_VALIDATED_TWO = {
  goodNumber: {
    title: 'No. Bien',
    sort: false,
  },
  description: {
    title: 'Descripción',
    sort: false,
  },
  status: {
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
