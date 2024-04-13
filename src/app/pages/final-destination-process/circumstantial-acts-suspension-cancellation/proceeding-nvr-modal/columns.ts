import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';

export let goodCheck: any[] = [];

export const Columns = {
  BLK_BIEVNR_NO_BIEN: {
    title: 'No. Bien',
    sort: false,
  },
  BLK_BIEVNR_NO_CLASIF: {
    title: 'No. Clasificación',
    sort: false,
  },
  BLK_BIEVNR_DI_DESC_BIEN: {
    title: 'Descripción',
    sort: false,
  },
  BLK_BIEVNR_PROCESO_EXT_DOM: {
    title: 'Proceso de extensión de dominio',
    sort: false,
  },
  BLK_BIEVNR_CANTIDAD: {
    title: 'Cantidad',
    sort: false,
  },
  BLK_BIEVNR_UNIDADM: {
    title: 'Unidad',
    sort: false,
  },
  check: {
    title: 'Seleccionar',
    type: 'custom',
    filter: false,
    renderComponent: CheckboxElementComponent,
    valuePrepareFunction: (isSelected: any, row: any) => {
      return goodCheck.find(
        (e: any) => e.row.BLK_BIEVNR_NO_BIEN == row.BLK_BIEVNR_NO_BIEN
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
            valor => valor.BLK_BIEVNR_NO_BIEN != data.row.BLK_BIEVNR_NO_BIEN
          );
        }
      });
    },
    sort: false,
  },
};
