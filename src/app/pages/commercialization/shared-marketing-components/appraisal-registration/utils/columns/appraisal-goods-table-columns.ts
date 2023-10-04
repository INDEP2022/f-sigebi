import { SearchFilter } from 'src/app/common/repository/interfaces/list-params';
import { SeeMoreComponent } from 'src/app/shared/components/see-more/see-more.component';

export const APPRAISAL_GOODS_TABLE_COLUMNS = {
  no_bien: {
    title: 'No. Bien',
    sort: false,
  },
  estatus: {
    title: 'Estatus',
    sort: false,
  },
  valor_avaluo: {
    title: 'Valor Avalúo',
    sort: false,
  },
  descripcion: {
    title: 'Descripción',
    sort: false,
    type: 'custom',
    renderComponent: SeeMoreComponent,
    operator: SearchFilter.ILIKE,
  },
  val34: {
    title: 'Situación Jurídica',
    sort: false,
    filter: false,
  },
  item_justificacion: {
    title: 'Incidencia',
    sort: false,
    filter: false,
  },
};
