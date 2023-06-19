import { CheckboxImprocedentElementComponent } from './checkbox-improcedent/checkbox-improcedent-element';
import { CheckboxSelectElementComponent } from './checkbox-improcedent/checkbox-select-element';

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
    hide: true,
  },
  seleccion: {
    title: 'Selección',
    type: 'custom',
    renderComponent: CheckboxSelectElementComponent, //CheckboxElementComponent,
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        data.row.to = data.toggle;
      });
    },
    sort: false,
    hide: false,
  },
  improcedente: {
    title: 'Improcedente',
    type: 'custom',
    renderComponent: CheckboxImprocedentElementComponent,
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        data.row.to = data.toggle;
      });
    },
    sort: false,
  },
};
// Columnas de la tabla de documentos relacionados al volante y folio universal
export const RELATED_FOLIO_COLUMNS = {
  id: {
    title: 'Folio',
    sort: false,
  },
  sheets: {
    title: 'Documentos',
    sort: false,
  },
  descriptionDocument: {
    title: 'Descripción del documento',
    sort: false,
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
