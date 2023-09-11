import { CustomDateFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-custom/custom-date-filter';
const meses = [
  'ENE',
  'FEB',
  'MAR',
  'ABR',
  'MAY',
  'JUN',
  'JUL',
  'AGO',
  'SEP',
  'OCT',
  'NOV',
  'DIC',
];

export const COLUMNS = {
  movementNumber: {
    title: 'No. Movimiento',
    // width: '15%',
    type: 'string',
    sort: false,
  },
  date: {
    title: 'Fecha',
    // width: '15%',
    type: 'string',
    sort: false,
    valuePrepareFunction: (text: string) => {
      // console.log('text', text);
      if (!text) return null;
      const fechaOriginal: any = text;

      // Dividir la fecha en día, mes y año
      const partesFecha = fechaOriginal.split('-');
      const dia = partesFecha[0];
      const mes = partesFecha[1] - 1; // Restamos 1 ya que los arrays en JavaScript comienzan desde 0
      const ano = partesFecha[2];

      // Obtener el nombre del mes
      const nombreMes = meses[mes];

      // Crear la nueva fecha en el formato deseado
      const fechaTransformada = `${dia}-${nombreMes}-${ano}`;
      // console.log("fechaTransformada", fechaTransformada)
      return `${
        fechaTransformada
          ? fechaTransformada.split('T')[0].split('-').reverse().join('/')
          : ''
      }`;
    },
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
  },
  move: {
    title: 'Movimiento',
    // width: '15%',
    type: 'string',
    sort: false,
  },
  bill: {
    title: 'Cuenta',
    // width: '15%',
    type: 'string',
    sort: false,
  },
  reference: {
    title: 'Referencia',
    // width: '15%',
    type: 'string',
    sort: false,
  },
  referenceOri: {
    title: 'Referencia Orden Ingreso',
    // width: '15%',
    type: 'string',
    sort: false,
  },
  bankKey: {
    title: 'Banco',
    // width: '15%',
    type: 'string',
    sort: false,
  },
  branchOffice: {
    title: 'Sucursal',
    // width: '15%',
    type: 'string',
    sort: false,
  },
  amount: {
    title: 'Monto',
    // width: '15%',
    type: 'string',
    sort: false,
    valuePrepareFunction: (amount: string) => {
      const numericAmount = parseFloat(amount);

      if (!isNaN(numericAmount)) {
        return numericAmount.toLocaleString('en-US', {
          // style: 'currency',
          // currency: 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      } else {
        return amount;
      }
    },
  },
  result: {
    title: 'Resultado',
    // width: '15%',
    type: 'string',
    sort: false,
  },
  validSistem: {
    title: 'Válido',
    // width: '15%',
    type: 'string',
    sort: false,
    filter: {
      type: 'list',
      config: {
        selectText: 'Todos',
        list: [
          { value: 'S', title: 'Si' },
          { value: 'R', title: 'Rechazado' },
          { value: 'N', title: 'No Inválido' },
          { value: 'A', title: 'Aplicado' },
          { value: 'B', title: 'Pago de Bases' },
          { value: 'D', title: 'Devuelto' },
          { value: 'C', title: 'Contabilizado' },
          { value: 'P', title: 'Penalizado' },
          { value: 'Z', title: 'Devuelto al Cliente' },
        ],
      },
    },
    valuePrepareFunction: (cell: any, row: any) => {
      if (row.validSistem == 'S') {
        return 'Si';
      } else if (row.validSistem == 'R') {
        return 'Rechazado';
      } else if (row.validSistem == 'N') {
        return 'No Inválido';
      } else if (row.validSistem == 'A') {
        return 'Aplicado';
      } else if (row.validSistem == 'B') {
        return 'Pago de Bases';
      } else if (row.validSistem == 'D') {
        return 'Devuelto';
      } else if (row.validSistem == 'C') {
        return 'Contabilizado';
      } else if (row.validSistem == 'P') {
        return 'Penalizado';
      } else if (row.validSistem == 'Z') {
        return 'Devuelto al Cliente';
      } else {
        return row.validSistem;
      }
    },
  },
  paymentId: {
    title: 'Id. Pago',
    // width: '15%',
    type: 'string',
    sort: false,
  },

  lotPub: {
    title: 'Lote Pub.',
    // width: '15%',
    type: 'string',
    sort: false,
  },
  event: {
    title: 'Evento',
    // width: '15%',
    type: 'string',
    sort: false,
  },
  entryOrderId: {
    title: 'Orden Ingreso',
    // width: '15%',
    type: 'string',
    sort: false,
  },
  affectationDate: {
    title: 'Fecha Afectación',
    // width: '15%',
    type: 'string',
    sort: false,
    valuePrepareFunction: (text: string) => {
      console.log('text', text);
      if (!text) return null;
      const fechaOriginal: any = text;

      // Dividir la fecha en día, mes y año
      const partesFecha = fechaOriginal.split('-');
      const dia = partesFecha[0];
      const mes = partesFecha[1] - 1; // Restamos 1 ya que los arrays en JavaScript comienzan desde 0
      const ano = partesFecha[2];

      // Obtener el nombre del mes
      const nombreMes = meses[mes];

      // Crear la nueva fecha en el formato deseado
      const fechaTransformada = `${dia}-${nombreMes}-${ano}`;
      // console.log("fechaTransformada", fechaTransformada)
      return `${
        fechaTransformada
          ? fechaTransformada.split('T')[0].split('-').reverse().join('/')
          : ''
      }`;
    },
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
  },
  descriptionSAT: {
    title: 'Descripción Pago SAT',
    // width: '15%',
    type: 'string',
    sort: false,
  },

  // dateOi: {
  //   title: 'Fecha OI',
  //   width: '15%',
  //   type: 'string',
  //   sort: false,
  // },
  // clientId: {
  //   title: 'ID Cliente',
  //   // width: '15%',
  //   type: 'string',
  //   sort: false,
  // },
  // rfc: {
  //   title: 'R.F.C',
  //   // width: '15%',
  //   type: 'string',
  //   sort: false,
  // },
  // name: {
  //   title: 'Nombre',
  //   // width: '15%',
  //   type: 'string',
  //   sort: false,
  // },
  // appliedTo: {
  //   title: 'Dev/Pena',
  //   // width: '15%',
  //   type: 'string',
  //   sort: false,
  //   filter: {
  //     type: 'list',
  //     config: {
  //       selectText: 'Todos',
  //       list: [
  //         { value: 'D', title: 'Devolución' },
  //         { value: 'P', title: 'Penalización' },
  //       ],
  //     },
  //   },
  //   valuePrepareFunction: (cell: any, row: any) => {
  //     if (row.appliedTo == 'P') {
  //       return 'Penalización';
  //     } else if (row.appliedTo == 'D') {
  //       return 'Devolución';
  //     } else {
  //       return row.appliedTo;
  //     }
  //   },
  // },
};

export const COLUMNS_CARGADOS = {
  movementNumber: {
    title: 'No. Movimiento',
    // width: '15%',
    type: 'string',
    sort: false,
  },
  date: {
    title: 'Fecha',
    // width: '15%',
    type: 'string',
    sort: false,
    valuePrepareFunction: (text: string) => {
      console.log('text', text);
      if (!text) return null;
      const fechaOriginal: any = text;

      // Dividir la fecha en día, mes y año
      const partesFecha = fechaOriginal.split('-');
      const dia = partesFecha[0];
      const mes = partesFecha[1] - 1; // Restamos 1 ya que los arrays en JavaScript comienzan desde 0
      const ano = partesFecha[2];

      // Obtener el nombre del mes
      const nombreMes = meses[mes];

      // Crear la nueva fecha en el formato deseado
      const fechaTransformada = `${dia}-${nombreMes}-${ano}`;
      return `${
        fechaTransformada
          ? fechaTransformada.split('T')[0].split('-').reverse().join('/')
          : ''
      }`;
    },
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
  },
  move: {
    title: 'Movimiento',
    // width: '15%',
    type: 'string',
    sort: false,
  },

  reference: {
    title: 'Referencia',
    // width: '15%',
    type: 'string',
    sort: false,
  },
  referenceOri: {
    title: 'Referencia Orden Ingreso',
    // width: '15%',
    type: 'string',
    sort: false,
  },
  bankKey: {
    title: 'Banco',
    // width: '15%',
    type: 'string',
    sort: false,
  },
  amount: {
    title: 'Monto',
    // width: '15%',
    type: 'string',
    sort: false,
    valuePrepareFunction: (amount: string) => {
      const numericAmount = parseFloat(amount);

      if (!isNaN(numericAmount)) {
        return numericAmount.toLocaleString('en-US', {
          // style: 'currency',
          // currency: 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      } else {
        return amount;
      }
    },
  },
  bill: {
    title: 'Cuenta',
    // width: '15%',
    type: 'string',
    sort: false,
  },
  branchOffice: {
    title: 'Sucursal',
    // width: '15%',
    type: 'string',
    sort: false,
  },

  result: {
    title: 'Resultado',
    // width: '15%',
    type: 'string',
    sort: false,
  },
  validSistem: {
    title: 'Válido',
    // width: '15%',
    type: 'string',
    sort: false,
    filter: {
      type: 'list',
      config: {
        selectText: 'Todos',
        list: [
          { value: 'S', title: 'Si' },
          { value: 'R', title: 'Rechazado' },
          { value: 'N', title: 'No Inválido' },
          { value: 'A', title: 'Aplicado' },
          { value: 'B', title: 'Pago de Bases' },
          { value: 'D', title: 'Devuelto' },
          { value: 'C', title: 'Contabilizado' },
          { value: 'P', title: 'Penalizado' },
          { value: 'Z', title: 'Devuelto al Cliente' },
        ],
      },
    },
    valuePrepareFunction: (cell: any, row: any) => {
      if (row.validSistem == 'S') {
        return 'Si';
      } else if (row.validSistem == 'R') {
        return 'Rechazado';
      } else if (row.validSistem == 'N') {
        return 'No Inválido';
      } else if (row.validSistem == 'A') {
        return 'Aplicado';
      } else if (row.validSistem == 'B') {
        return 'Pago de Bases';
      } else if (row.validSistem == 'D') {
        return 'Devuelto';
      } else if (row.validSistem == 'C') {
        return 'Contabilizado';
      } else if (row.validSistem == 'P') {
        return 'Penalizado';
      } else if (row.validSistem == 'Z') {
        return 'Devuelto al Cliente';
      } else {
        return row.validSistem;
      }
    },
  },
  paymentId: {
    title: 'Id. Pago',
    // width: '15%',
    type: 'string',
    sort: false,
  },
  lotPub: {
    title: 'Lote Pub.',
    // width: '15%',
    type: 'string',
    sort: false,
  },
  event: {
    title: 'Evento',
    // width: '15%',
    type: 'string',
    sort: false,
  },
  entryOrderId: {
    title: 'Orden Ingreso',
    // width: '15%',
    type: 'string',
    sort: false,
  },
  affectationDate: {
    title: 'Fecha Afectación',
    // width: '15%',
    type: 'string',
    sort: false,
    valuePrepareFunction: (text: string) => {
      console.log('text', text);
      if (!text) return null;
      const fechaOriginal: any = text;

      // Dividir la fecha en día, mes y año
      const partesFecha = fechaOriginal.split('-');
      const dia = partesFecha[0];
      const mes = partesFecha[1] - 1; // Restamos 1 ya que los arrays en JavaScript comienzan desde 0
      const ano = partesFecha[2];

      // Obtener el nombre del mes
      const nombreMes = meses[mes];

      // Crear la nueva fecha en el formato deseado
      const fechaTransformada = `${dia}-${nombreMes}-${ano}`;
      return `${
        fechaTransformada
          ? fechaTransformada.split('T')[0].split('-').reverse().join('/')
          : ''
      }`;
    },
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
  },
  descriptionSAT: {
    title: 'Descripción Pago SAT',
    // width: '15%',
    type: 'string',
    sort: false,
  },

  // dateOi: {
  //   title: 'Fecha OI',
  //   width: '15%',
  //   type: 'string',
  //   sort: false,
  // },
  // clientId: {
  //   title: 'ID Cliente',
  //   // width: '15%',
  //   type: 'string',
  //   sort: false,
  // },
  // rfc: {
  //   title: 'R.F.C',
  //   // width: '15%',
  //   type: 'string',
  //   sort: false,
  // },
  // name: {
  //   title: 'Nombre',
  //   // width: '15%',
  //   type: 'string',
  //   sort: false,
  // },
  // appliedTo: {
  //   title: 'Dev/Pena',
  //   // width: '15%',
  //   type: 'string',
  //   sort: false,
  //   filter: {
  //     type: 'list',
  //     config: {
  //       selectText: 'Todos',
  //       list: [
  //         { value: 'D', title: 'Devolución' },
  //         { value: 'P', title: 'Penalización' },
  //       ],
  //     },
  //   },
  //   valuePrepareFunction: (cell: any, row: any) => {
  //     if (row.appliedTo == 'P') {
  //       return 'Penalización';
  //     } else if (row.appliedTo == 'D') {
  //       return 'Devolución';
  //     } else {
  //       return row.appliedTo;
  //     }
  //   },
  // },
};

export const COLUMNS_DATA_CARGADAS = {
  COMER_PAGOREF_REFERENCIA: {
    title: 'Referencia',
    width: '15%',
    type: 'string',
    sort: false,
  },
  COMER_PAGOREF_REFERENCIAORI: {
    title: 'Referencia Ori',
    width: '15%',
    type: 'string',
    sort: false,
  },
  COMER_PAGOREF_FECHA: {
    title: 'Fecha',
    width: '15%',
    type: 'string',
    sort: false,
  },
  COMER_PAGOREF_MONTO: {
    title: 'Monto',
    width: '15%',
    type: 'string',
    sort: false,
  },
  COMER_PAGOREF_TIPO: {
    title: 'Tipo',
    width: '15%',
    type: 'string',
    sort: false,
  },
  COMER_PAGOREF_DESCPAGO: {
    title: 'Movimiento',
    width: '15%',
    type: 'string',
    sort: false,
  },
  COMER_PAGOREF_ID_TIPO_SAT: {
    title: 'ID Tipo SAT',
    width: '15%',
    type: 'string',
    sort: false,
  },
  COMER_PAGOREF_NO_MOVIMIENTO: {
    title: 'No. Movimiento',
    width: '15%',
    type: 'string',
    sort: false,
  },
  COMER_PAGOREF_CVE_BANCO: {
    title: 'Banco',
    width: '15%',
    type: 'string',
    sort: false,
  },
  COMER_PAGOREF_CODIGO: {
    title: 'Código',
    width: '15%',
    type: 'string',
    sort: false,
  },
  COMER_PAGOREF_SUCURSAL: {
    title: 'Sucursal',
    width: '15%',
    type: 'string',
    sort: false,
  },
  COMER_PAGOREF_RESULTADO: {
    title: 'Resultado',
    width: '15%',
    type: 'string',
    sort: false,
  },
  COMER_PAGOREF_VAL: {
    title: 'Válido',
    width: '15%',
    type: 'string',
    sort: false,
  },
  COMER_PAGOREF_ID_LOTE: {
    title: 'Lote',
    width: '15%',
    type: 'string',
    sort: false,
  },
};
