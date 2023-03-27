export const RELATED_DOCUMENTS_COLUMNS = {
  noBien: {
    title: 'No. Bien',
    type: 'number',
    sort: false,
  },
  description: {
    title: 'Descripcion',
    type: 'string',
    sort: false,
  },
  cantidad: {
    title: 'Cantidad',
    type: 'string',
    sort: false,
  },
  ident: {
    title: 'Ident.',
    type: 'string',
    sort: false,
  },
};

export const RELATED_DOCUMENTS_EXAMPLE_DATA = [
  {
    noBien: 12345,
    description: 'UNA BOLSA',
    cantidad: 1,
    ident: 'ENGD',
    proceso: 'ASEGURADO',
  },
  {
    noBien: 12345,
    description: 'UNA BOLSA',
    cantidad: 1,
    ident: 'ENGD',
    proceso: 'ASEGURADO',
  },
  {
    noBien: 12345,
    description: 'UNA BOLSA',
    cantidad: 1,
    ident: 'ENGD',
    proceso: 'ASEGURADO',
  },
];
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
