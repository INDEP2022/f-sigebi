import { Injectable } from '@angular/core';

export const INDICATORS_HISTORY_COLUMNS = {
  coordinacion_regional: {
    title: 'Regional',
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
  column5: {
    title: 'Captura y Digitalización',
    sort: false,
  },
  column6: {
    title: 'Dictaminación',
    sort: false,
  },
  column7: {
    title: 'Recepción Fisica',
    sort: false,
  },
  column8: {
    title: 'Entregas',
    sort: false,
  },
  column9: {
    title: 'Comer.',
    sort: false,
  },
  column10: {
    title: 'Donación',
    sort: false,
  },
  column11: {
    title: 'Destrucción',
    sort: false,
  },
  column12: {
    title: 'Devolución',
    sort: false,
  },
  column13: {
    title: 'Fecha Tecnica',
    sort: false,
  },
};

export class Indicators {
  onCustom(event: any) {
    console.log('Seleccionamos la columna vamoooo');
  }
}

@Injectable()
export class FunctionCumplioIndicador {
  //

  date1: string;
  date2: string;
  dateEnd: string;
  pNumCor: number;
  TpInd: number;

  //
}
