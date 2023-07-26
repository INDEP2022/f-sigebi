export const CONSOLIDATED_COLUMNS = {
  indicatorNumber: {
    title: 'No.',
    sort: false,
  },
  desShort: {
    title: 'Indicador',
    sort: false,
  },
  numerator: {
    title: 'Numerador',
    sort: false,
  },
  denominator: {
    title: 'Denominador',
    sort: false,
  },
  percentage: {
    title: '% Cumplimiento',
    sort: false,
  },
};

export interface IConsolidado {
  no: string;
  indicador: string;
  numerador: string;
  denominador: string;
  cumplimiento: string;
}

export interface IDictamina {
  denominator: string;
  desShort: string;
  description: string;
  endDate: string;
  indicatorNumber: string;
  iniDate: string;
  nbOrigin: string | null;
  numerator: string;
  percentage: string;
}

export const dataMock = [
  {
    no: '1',
    indicador: '1',
    numerador: '1',
    denominador: '2',
    cumplimiento: 'TEsting',
  },
  {
    no: '1',
    indicador: '1',
    numerador: '1',
    denominador: '2',
    cumplimiento: 'TEsting',
  },
  {
    no: '1',
    indicador: '1',
    numerador: '1',
    denominador: '2',
    cumplimiento: 'TEsting',
  },
  {
    no: '1',
    indicador: '1',
    numerador: '1',
    denominador: '2',
    cumplimiento: 'TEsting',
  },
  {
    no: '1',
    indicador: '1',
    numerador: '1',
    denominador: '2',
    cumplimiento: 'TEsting',
  },
  {
    no: '1',
    indicador: '1',
    numerador: '1',
    denominador: '2',
    cumplimiento: 'TEsting',
  },
  {
    no: '1',
    indicador: '1',
    numerador: '1',
    denominador: '2',
    cumplimiento: 'TEsting',
  },
  {
    no: '1',
    indicador: '1',
    numerador: '1',
    denominador: '2',
    cumplimiento: 'TEsting',
  },
  {
    no: '1',
    indicador: '1',
    numerador: '1',
    denominador: '2',
    cumplimiento: 'TEsting',
  },
  {
    no: '1',
    indicador: '1',
    numerador: '1',
    denominador: '2',
    cumplimiento: 'TEsting',
  },
  {
    no: '1',
    indicador: '1',
    numerador: '1',
    denominador: '2',
    cumplimiento: 'TEsting',
  },
  {
    no: '1',
    indicador: '1',
    numerador: '1',
    denominador: '2',
    cumplimiento: 'TEsting',
  },
  {
    no: '1',
    indicador: '1',
    numerador: '1',
    denominador: '2',
    cumplimiento: 'TEsting',
  },
  {
    no: '1',
    indicador: '1',
    numerador: '1',
    denominador: '2',
    cumplimiento: 'TEsting',
  },
  {
    no: '1',
    indicador: '1',
    numerador: '1',
    denominador: '2',
    cumplimiento: 'TEsting',
  },
  {
    no: '1',
    indicador: '1',
    numerador: '1',
    denominador: '2',
    cumplimiento: 'TEsting',
  },
];
