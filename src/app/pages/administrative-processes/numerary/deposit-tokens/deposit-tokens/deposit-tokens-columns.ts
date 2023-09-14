import { CustomdbclickComponent } from '../customdbclick/customdbclick.component';

export const DEPOSIT_TOKENS_COLUMNS = {
  bank: {
    title: 'Banco',
    type: 'string',
    sort: false,
  },
  cveAccount: {
    title: 'Cuenta',
    type: 'string',
    sort: false,
  },
  fec_insercion_: {
    title: 'Fecha Depósito',
    type: 'string',
    sort: false,
  },
  folio_ficha: {
    title: 'Folio',
    type: 'string',
    sort: false,
  },
  fec_traspaso_: {
    title: 'Fecha Transferencia',
    type: 'string',
    sort: false,
  },
  currency: {
    title: 'Moneda',
    type: 'string',
    sort: false,
  },
  deposito: {
    title: 'Depósito',
    type: 'string',
    sort: false,
  },
  no_expediente: {
    title: 'Expediente',
    type: 'string',
    sort: false,
  },
  no_bien: {
    title: 'Bien',
    type: 'custom',
    sort: false,
    renderComponent: CustomdbclickComponent,
  },
  categoria: {
    title: 'Categoria',
    type: 'string',
    sort: false,
  },
  es_parcializacion: {
    title: 'Parcial',
    type: 'string',
    sort: false,
  },
};
