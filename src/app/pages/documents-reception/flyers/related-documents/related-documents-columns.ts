import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';

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
    onComponentInitFunction: (event: any) => {},
    sort: false,
  },
  improcedente: {
    title: 'Improcedente',
    type: 'custom',
    renderComponent: CheckboxElementComponent,
    onComponentInitFunction: (event: any) => {},
    sort: false,
  },
};

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
