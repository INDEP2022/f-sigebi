import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';

export const GENERAL_PROCESSES_CAPTURE_DIGITALIZATION_COLUNNS = {
  coordinacion_regional: {
    title: 'Coord. Regional',
    sort: false,
  },
  cve_oficio_externo: {
    title: 'Cve. Oficio Externo',
    sort: false,
  },
  no_expediente: {
    title: 'No. Expediente',
    sort: false,
  },
  no_volante: {
    title: 'No. Volante',
    sort: false,
  },
  no_tramite: {
    title: 'No. Trámite',
    sort: false,
  },
  urecepcion: {
    title: 'Usuario',
    sort: false,
  },
  programa: {
    title: 'Programa',
    sort: false,
  },
  finicia: {
    title: 'Fecha Inicio Ind.',
    sort: false,
  },
  fmaxima: {
    title: 'Fecha Fin Ind.',
    sort: false,
  },
  cumplio: {
    title: 'Cumplió',
    sort: false,
    type: 'custom',
    renderComponent: CheckboxElementComponent,
    // onComponentInitFunction(instance: any) {
    //   instance.toggle.subscribe((data: any) => {
    //     data.row.cumplio = data.toggle ? '1' : '0';
    //   });
    // },
    valuePrepareFunction: (value: any) => {
      if (value !== null) {
        switch (value) {
          case '0':
            value = false;
            return value;
            break;
          case '1':
            value = true;
            return value;
            break;
          default:
            value = 'S/N';
            return value;
            break;
        }
      }
    },
  },
};
function getData() {
  const data = [];
  const el = {
    regional: 'EXAMPLE_DATA',
    cve: 'EXAMPLE_DATA',
    expediente: 'EXAMPLE_DATA',
    noVolante: 'EXAMPLE_DATA',
    tramite: 'EXAMPLE_DATA',
    usuario: 'EXAMPLE_DATA',
    page: 'EXAMPLE_DATA',
    fin: 'EXAMPLE_DATA',
    max: 'EXAMPLE_DATA',
  };
  for (let index = 0; index < 10; index++) {
    data.push(el);
  }
  return data;
}
export const GENERAL_PROCESSES_CAPTURE_DIGITALIZATION_DATA = getData();
