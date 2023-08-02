import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
export const COLUMNS_EXPORT_GOODS = {
  no_bien: {
    title: 'No. Bien',
    type: 'number',
    sort: false,
  },
  descripcion: {
    title: 'Descripción',
    type: 'string',
    sort: false,
  },
  cantidad: {
    title: 'Cantidad',
    type: 'number',
    sort: false,
  },
  no_clasif_bien: {
    title: 'No. Clasf Bien',
    type: 'number',
    sort: false,
  },
  no_transferente: {
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
  fecha_liberacion: {
    title: 'Fecha Recepción',
    type: 'string',
    sort: false,
  },
  estatus: {
    title: 'Estatus',
    type: 'number',
    sort: false,
  },
  no_expediente: {
    title: 'No. Expediente',
    type: 'number',
    sort: false,
  },
  cpd: {
    title: 'CPD',
    type: 'custom',
    renderComponent: CheckboxElementComponent,
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        data.row.to = data.toggle;
      });
    },
    sort: false,
  },
  adm: {
    title: 'ADM',
    type: 'custom',
    renderComponent: CheckboxElementComponent,
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        data.row.to = data.toggle;
      });
    },
    sort: false,
  },
  rda: {
    title: 'RDA',
    type: 'custom',
    renderComponent: CheckboxElementComponent,
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        data.row.to = data.toggle;
      });
    },
    sort: false,
  },
};
