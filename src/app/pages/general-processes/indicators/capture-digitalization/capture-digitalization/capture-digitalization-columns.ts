import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';

export const GENERAL_PROCESSES_CAPTURE_DIGITALIZATION_COLUNNS = {
  RegionalCoordination: {
    title: 'Coord. Regional',
    sort: false,
  },
  OficioExterno: {
    title: 'Cve. Oficio Externo',
    sort: false,
  },
  ExpendientNumber: {
    title: 'No. Expediente',
    sort: false,
  },
  VolanteNumber: {
    title: 'No. Volante',
    sort: false,
  },
  TramiteNumber: {
    title: 'No. Trámite',
    sort: false,
  },
  ReceivingUnit: {
    title: 'Usuario',
    sort: false,
  },
  Program: {
    title: 'Programa',
    sort: false,
  },
  StartDate: {
    title: 'Fecha Inicio Ind.',
    sort: false,
  },
  MaxDate: {
    title: 'Fecha Fin Ind.',
    sort: false,
  },
  Fulfilled: {
    title: 'Cumplió',
    sort: false,
    type: 'custom',
    renderComponent: CheckboxElementComponent,
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
