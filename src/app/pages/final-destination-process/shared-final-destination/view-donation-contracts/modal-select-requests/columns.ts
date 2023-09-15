import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';

export let propContratosSelect: any[] = [];
export const COLUMNS = {
  select: {
    title: 'Sel',
    type: 'custom',
    renderComponent: CheckboxElementComponent,
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        data.row.SELEC = data.toggle;
        if (data.toggle === true) {
          propContratosSelect.push(data.row);
        } else {
          propContratosSelect.splice(propContratosSelect.indexOf(data.row), 1);
        }
      });
    },
    sort: false,
    filter: false,
  },
  id_donatario: {
    title: 'Id Donatario',
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
    title: 'Acance de Propuesta',
    type: 'string',
    sort: false,
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
  },
  justificacion: {
    title: 'Descripción',
    type: 'string',
    sort: false,
  },
  id_solicitud: {
    title: 'Solicitud',
    type: 'string',
    sort: false,
  },
};

export function clearCheck() {
  propContratosSelect = [];
}
