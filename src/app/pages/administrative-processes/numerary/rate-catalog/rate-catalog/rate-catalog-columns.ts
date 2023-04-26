export const RATE_CATALOG_COLUMNS = {
  month: {
    title: 'Mes',
    type: 'string',
    sort: false,
    valuePrepareFunction: (month: number) => {
      const monthName: any = {
        1: () => '     Enero',
        2: () => '   Febrero',
        3: () => '     Marzo',
        4: () => '     Abril',
        5: () => '      Mayo',
        6: () => '     Junio',
        7: () => '     Julio',
        8: () => '    Agosto',
        9: () => 'Septiembre',
        10: () => '   Octubre',
        11: () => ' Noviembre',
        12: () => ' Diciembre',
      };
      console.log(monthName[month]());

      return monthName[month]();
    },
  },
  year: {
    title: 'Año',
    type: 'number',
    sort: false,
  },
  pesos: {
    title: 'Tasa pesos',
    type: 'number',
    sort: false,
  },
  dollars: {
    title: 'Tasa dólares',
    type: 'number',
    sort: false,
  },
  euro: {
    title: 'Tasa euros',
    type: 'number',
    sort: false,
  },
};
