import { SelectElementComponent } from 'src/app/shared/components/select-element-smarttable/select-element';

export const COLUMNS_TABLE_1 = {
  id_donatario: {
    title: 'Id. Donatario',
    type: 'number',
    sort: false,
  },
  donatario: {
    title: 'Donatario',
    type: 'string',
    sort: false,
  },
  no_almacen: {
    title: 'No. Almacén',
    type: 'number',
    sort: false,
  },
  desc_almacen: {
    title: 'Almacén',
    type: 'string',
    sort: false,
  },
  avance_propu: {
    title: 'Avance de Propuesta',
    type: 'custom',
    sort: false,
    renderComponent: SelectElementComponent,
    onComponentInitFunction(instance: any) {
      const values = ['I', 'E'];
      instance.values.emit(values);
      instance.toggle.subscribe((data: any) => {
        data.row.avance_propu = data.toggle;
      });
    },
  },
  cve_autoriza: {
    title: 'Cve Autorización',
    type: 'string',
    sort: false,
  },
  fec_autoriza: {
    title: 'Fecha Autorización',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: string) => {
      return value ? value.split('T')[0].split('-').reverse().join('-') : '';
    },
  },
  id_solicitud: {
    title: 'Solicitud',
    type: 'string',
    sort: false,
  },
};
