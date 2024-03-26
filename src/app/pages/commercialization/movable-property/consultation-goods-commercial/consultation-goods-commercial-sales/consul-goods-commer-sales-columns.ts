import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';

export let goodCheck: any[] = [];

export const CONSUL_GOODS_COMMER_SALES_COLUMNS = {
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
    title: 'No. Expediente',
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
  check: {
    title: 'Seleccionar',
    type: 'custom',
    sort: false,
    showAlways: true,
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
          console.log(data);
          goodCheck.push(data.row);
        } else {
          console.log(data.row.idordeningreso);
          goodCheck = goodCheck.filter(valor => {
            console.log(valor);
            return valor.idordeningreso !== data.row.idordeningreso;
          });
        }
      });
    },
  },
};

export function clearGoodCheck() {
  goodCheck = [];
}
