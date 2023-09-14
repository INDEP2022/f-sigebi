export const PERFORMANCEINDICATOR_COLUMNS = {
  consecutive: {
    title: 'Consecutivo',
    width: '10%',
    sort: false,
  },
  strategy: {
    title: 'Estrategia',
    width: '80%',
    sort: false,
  },
  deliveredTime: {
    title: 'Entregada a tiempo',
    width: '10%',
    type: 'html',
    sort: false,
    valuePrepareFunction: (value: string | number) => {
      if (value === '1') {
        return '<div class="text-center text-success"><i class="fas fa-check"></i></div>';
      } else {
        return '';
      }
    },
  },
};
export const REPORTPERFORMANCEINDICATOR_COLUMNS = {
  consecutive: {
    title: 'Consecutivo',
    width: '10%',
    sort: false,
  },
  report: {
    title: 'Reporte',
    width: '80%',
    sort: false,
  },
  deliveredTime: {
    title: 'Entregado a tiempo',
    width: '10%',
    type: 'html',
    sort: false,
    valuePrepareFunction: (value: string | number) => {
      if (value === '1') {
        return '<div class="text-center text-success"><i class="fas fa-check"></i></div>';
      } else {
        return '';
      }
    },
  },
};
