import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
import { CustomCellCcpComponent } from './custom-cell-ccp/custom-cell-ccp.component';

export const RELATED_DOCUMENTS_COLUMNS_GOODS = {
  goodId: {
    title: 'No. Bien',
    type: 'number',
    sort: false,
  },
  description: {
    title: 'Descripcion',
    type: 'string',
    sort: false,
  },
  quantity: {
    title: 'Cantidad',
    type: 'string',
    sort: false,
  },
  identifier: {
    title: 'Ident.',
    type: 'string',
    sort: false,
  },
  status: {
    title: 'Estatus',
    type: 'string',
    sort: false,
  },
  desEstatus: {
    title: 'Des. Estatus',
    type: 'string',
    sort: false,
  },
  seleccion: {
    title: 'Selección',
    type: 'custom',
    renderComponent: CheckboxElementComponent,
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        data.row.to = data.toggle;
      });
    },
    sort: false,
  },
  improcedente: {
    title: 'Improcedente',
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

export const ConfigTableCcp = {
  settings: {
    columns: {
      type: {
        title: 'Tipo de copia',
        filter: {
          type: 'list',
          config: {
            selectText: 'Seleccionar tipo de copia',
            list: [
              { value: 'internal', title: 'Interna' },
              { value: 'external', title: 'Externa' },
            ],
          },
        },
      },
      ccpPerson: {
        title: 'Persona',
        type: 'custom',
        component: CustomCellCcpComponent,
        // filter: {
        // type: 'custom',
        // },
      },
    },
  },
};

function validationCheck(checked: boolean) {
  if (checked) {
  }
}

export interface IOficioDictamenParams {
  parametros: string; //PARAMETROS;
  p_gest_ok: string; //P_GEST_OK;
  p_no_tramite: string; // P_NO_TRAMITE;
  tipo_of: string; //TIPO_OF;
  sale: string; //SALE;
  doc: string; //DOC;
  bien: string; //BIEN;
  volante: string; //VOLANTE;
  expediente: string; //EXPEDIENTE;
  pllamo: string; //PLLAMO;
  p_dictamen: string; //P_DICTAMEN;
}

export interface IDataGoodsTable {
  goodId: number;
  description: string;
  quantity: number;
  identifier: string;
  status: string;
  desEstatus: string;
  seleccion: boolean;
  improcedente: boolean;
  disponible: boolean;
}
