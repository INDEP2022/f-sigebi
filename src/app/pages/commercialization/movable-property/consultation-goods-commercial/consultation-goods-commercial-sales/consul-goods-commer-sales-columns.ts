import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';

export let goodCheck: any[] = [];

export const CONSUL_GOODS_COMMER_SALES_COLUMNS = {
  check: {
    title: '',
    type: 'custom',
    sort: false,
    renderComponent: CheckboxElementComponent,
    valuePrepareFunction: (isSelected: any, row: any) => {
      return goodCheck.find(
        (e: any) => e.row.idordeningreso == row.idordeningreso
      )
        ? true
        : false;
    },
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        if (data.toggle) {
          console.log(goodCheck);
          goodCheck.push(data.row);
        } else {
          goodCheck = goodCheck.filter(
            valor => valor.row.idordeningreso != data.row.idordeningreso
          );
        }
      });
    },
  },
  idordeningreso: {
    title: 'Id Orden',
    type: 'number',
    sort: false,
  },
  evento_comer_eventos: {
    title: 'Id Evento',
    type: 'number',
    sort: false,
  },
  descripcion_tipo_evento: {
    title: 'Descripción Evento',
    type: 'text',
    sort: false,
  },
  lote_publico: {
    title: 'Lote',
    type: 'number',
    sort: false,
  },
  no_expediente: {
    title: 'Expediente',
    type: 'number',
    sort: false,
  },
  no_bien: {
    title: 'No. Bien',
    type: 'number',
    sort: false,
  },
  descripcion_bien: {
    title: 'Descripción Bien',
    type: 'text',
    sort: false,
  },
};

export function clearGoodCheck() {
  goodCheck = [];
}
