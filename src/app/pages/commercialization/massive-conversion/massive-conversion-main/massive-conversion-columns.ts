import { DatePipe } from '@angular/common';
import { CustomDateFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-custom/custom-date-filter';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';

export const SETTING_DATA = {
  ...TABLE_SETTINGS,
  hideSubHeader: false,
  actions: false,
  columns: {
    eventId: {
      title: 'ID Evento',
      type: 'number',
      sort: false,
    },
    batchId: {
      title: 'ID Lote',
      type: 'number',
      sort: false,
    },
    comerLots: {
      title: 'Lote Público',
      type: 'number',
      sort: false,

      valuePrepareFunction: (value: any) => {
        return value != null ? value.lotPublic : '';
      },

      filterFunction(cell?: any, search?: string): boolean {
        let column = cell.lotPublic;
        if (column?.toUpperCase() >= search.toUpperCase() || search === '') {
          return true;
        } else {
          return false;
        }
      },
    },
    customerId: {
      title: 'ID Cliente',
      type: 'number',
      sort: false,
    },
    comerClient: {
      title: 'R.F.C.',
      type: 'string',
      sort: false,
      valuePrepareFunction: (value: any) => {
        return value != null ? value.rfc : '';
      },
      filterFunction(cell?: any, search?: string): boolean {
        let column = cell.rfc;
        if (column?.toUpperCase() >= search.toUpperCase() || search === '') {
          return true;
        } else {
          return false;
        }
      },
    },
    amount: {
      title: 'Monto',
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
    validityDate: {
      title: 'Fecha Vigencia',
      type: 'string',
      sort: false,
      filter: {
        type: 'custom',
        component: CustomDateFilterComponent,
      },
      valuePrepareFunction: (date: Date) => {
        var raw = new Date(date);
        var formatted = new DatePipe('en-EN').transform(
          raw,
          'dd/MM/yyyy',
          'UTC'
        );
        return formatted;
      },
    },
    checkNumber: {
      title: 'N° Cheque',
      type: 'number',
      sort: false,
    },
    bankExpCheck: {
      title: 'Banco Exp. Cheque',
      type: 'string',
      sort: false,
    },
    status: {
      title: 'Descripción Estatus',
      type: 'string',
      sort: false,
      valuePrepareFunction: (cell: any, _row: any) => {
        if (cell == 1) return 'LC_GENERADA';
        if (cell == 0) return 'SOLICITADA';
        return '';
      },
      filter: {
        type: 'list',
        config: {
          selectText: 'Seleccionar',
          list: [
            { value: 1, title: 'LC_GENERADA' },
            { value: 0, title: 'SOLICITADA' },
          ],
        },
      },
    },
    observations: {
      title: 'Observaciones',
      type: 'number',
      sort: false,
      valuePrepareFunction: (_cell: any, item: any) => {
        let observation = '';
        if (!item.customerId) {
          observation += 'No se ingresó el cliente. ';
        }
        if (!item.batchId) {
          observation += 'No se ingresó el lote. ';
        }
        if (!item.comerClient == null) {
          observation += 'El ID Cliente no Existe. ';
        }

        if (!item.comerLots == null) {
          observation += 'El ID Lote no Existe. ';
        }

        if (!item.amount) {
          observation += 'No se ingresó el monto. ';
        }

        if (!item.validityDate) {
          observation += 'No se ingresó la fecha de vigencia. ';
        }
        if (!item.checkNumber) {
          observation += 'No se ingresó el número de cheque. ';
        }
        if (!item.bankExpCheck) {
          observation += 'No se ingresó el Expide. Cheque. ';
        }
        // console.log({ observation });
        return observation;
      },
    },
    usrinsert: {
      title: 'Usuario Inserta',
      type: 'string',
      sort: false,
    },
    insertDate: {
      title: 'Fecha Inserta',
      type: 'string',
      sort: false,
      filter: {
        type: 'custom',
        component: CustomDateFilterComponent,
      },
      valuePrepareFunction: (date: Date) => {
        var raw = new Date(date);
        var formatted = new DatePipe('en-EN').transform(
          raw,
          'dd/MM/yyyy',
          'UTC'
        );
        return formatted;
      },
    },
    palletteId: {
      title: 'ID Paleta',
      type: 'string',
      sort: false,
    },
    operationId: {
      title: 'ID Operación',
      type: 'string',
      sort: false,
    },
  },
};

export const SETTING_LCS = {
  ...TABLE_SETTINGS,
  hideSubHeader: false,
  actions: false,
  columns: {
    idlcg: {
      title: 'ID LCG',
      type: 'number',
      sort: false,
    },
    idEvent: {
      title: 'ID Evento',
      type: 'number',
      sort: false,
    },
    idBatch: {
      title: 'ID Lote',
      type: 'number',
      sort: false,
    },
    idCustomer: {
      title: 'ID Cliente',
      type: 'number',
      sort: false,
    },
    amount: {
      title: 'Monto',
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
    refGsae: {
      title: 'Ref. Gsae',
      type: 'string',
      sort: false,
    },
    refGbank: {
      title: 'Ref. Gbanco',
      type: 'number',
      sort: false,
    },
    dateValidity: {
      title: 'Fecha Videncia',
      type: 'string',
      sort: false,
      filter: {
        type: 'custom',
        component: CustomDateFilterComponent,
      },
      valuePrepareFunction: (date: Date) => {
        var raw = new Date(date);
        var formatted = new DatePipe('en-EN').transform(
          raw,
          'dd/MM/yyyy',
          'UTC'
        );
        return formatted;
      },
    },
    status: {
      title: 'Estatus',
      type: 'string',
      sort: false,
      valuePrepareFunction: (cell: any, _row: any) => {
        switch (cell) {
          case 'PAG':
            return 'PAGADA';
          case 'GARA':
            return 'EN GARANTIA';
          case 'CAN':
            return 'CANCELADO';
          case 'PREP':
            return 'EN PREPARACION';
          case 'DES':
            return 'DESIERTO';
          case 'APRO':
            return 'APROBADO';
          case 'CONC':
            return 'CONCILIADO A SIRSAE';
          case 'NDIS':
            return 'NO DISPONIBLE';
          case 'CNE':
            return 'CONVERTIDO A NUMERARIO';
          case 'ACT':
            return 'EVENTO PUBLICO ACTUALIZADO';
          case 'GEN':
            return 'GENERADA';
          case 'CON1':
            return 'CONCILIADO A SIRSAE PRIMERA FASE';
          case 'CON2':
            return 'CONCILIADO A SIRSAE SEGUNDA FASE';
          case 'ETP':
            return 'ETAPA DE PAGO EXTEMPORANEO';
          case 'PAGE':
            return 'PAGADO EN TIEMPO EXTEMPORANEO';
          case 'CANC':
            return 'CANCELADO POR COMERCIALIZACION';
          case 'CDEV':
            return 'CANCELADO POR DEVOLUCION';
          case 'CAE':
            return 'CANCELADO POR PAGO EN EFECTIVO';
          case 'EFE':
            return 'PAGO EN EFECTIVO';
          case 'CANV':
            return 'CANCELADO POR VALUACION';
          case 'PG43':
            return 'CANCELACION PARCIAL 43 POBALINES';
          default:
            return 'S/D';
        }
      },
      filter: {
        type: 'list',
        config: {
          selectText: 'Seleccionar',
          list: [
            { value: 'PAG', title: 'PAGADA' },
            { value: 'GARA', title: 'EN GARANTIA' },
            { value: 'CAN', title: 'CANCELADO' },
            { value: 'PREP', title: 'EN PREPARACION' },
            { value: 'DES', title: 'DESIERTO' },
            { value: 'APRO', title: 'APROBADO' },
            { value: 'CONC', title: 'CONCILIADO A SIRSAE' },
            { value: 'NDIS', title: 'NO DISPONIBLE' },
            { value: 'CNE', title: 'CONVERTIDO A NUMERARIO' },
            { value: 'ACT', title: 'EVENTO PUBLICO ACTUALIZADO' },
            { value: 'GEN', title: 'GENERADA' },
            { value: 'CON1', title: 'CONCILIADO A SIRSAE PRIMERA FASE' },
            { value: 'CON2', title: 'CONCILIADO A SIRSAE SEGUNDA FASE' },
            { value: 'ETP', title: 'ETAPA DE PAGO EXTEMPORANEO' },
            { value: 'PAGE', title: 'PAGADO EN TIEMPO EXTEMPORANEO' },
            { value: 'CANC', title: 'CANCELADO POR COMERCIALIZACION' },
            { value: 'CDEV', title: 'CANCELADO POR DEVOLUCION' },
            { value: 'CAE', title: 'CANCELADO POR PAGO EN EFECTIVO' },
            { value: 'EFE', title: 'PAGO EN EFECTIVO' },
            { value: 'CANV', title: 'CANCELADO POR VALUACION' },
            { value: 'PG43', title: 'CANCELACION PARCIAL 43 POBALINES' },
          ],
        },
      },
    },
    dateRecord: {
      title: 'Fecha Registro',
      type: 'string',
      sort: false,
      filter: {
        type: 'custom',
        component: CustomDateFilterComponent,
      },
      valuePrepareFunction: (date: Date) => {
        var raw = new Date(date);
        var formatted = new DatePipe('en-EN').transform(
          raw,
          'dd/MM/yyyy',
          'UTC'
        );
        return formatted;
      },
    },
    bankExpCheck: {
      title: 'Banco Exp. Cheque',
      type: 'string',
      sort: false,
    },
    numberCheck: {
      title: 'N° Cheque',
      type: 'number',
      sort: false,
    },
    InvoiceApproval: {
      title: 'Folio de Aprobación',
      type: 'string',
      sort: false,
    },
    bankTransmitter: {
      title: 'Banco Emisor',
      type: 'string',
      sort: false,
    },
    userGenerate: {
      title: 'Usuario Genera',
      type: 'string',
      sort: false,
    },
  },
};

export const SETTING_RFC = {
  ...TABLE_SETTINGS,
  hideSubHeader: false,
  actions: {
    columnTitle: 'Acciones',
    position: 'left',
    add: true,
    edit: true,
    delete: true,
  },
  columns: {
    rfc: {
      title: 'R.F.C.',
      type: 'string',
      sort: false,
    },
    batch: {
      title: 'ID Lote',
      type: 'number',
      sort: false,
    },
    amount: {
      title: 'string',
      type: 'number',
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
    palette: {
      title: 'Paleta',
      type: 'number',
      sort: false,
    },
    checkNumber: {
      title: 'N° Cheque',
      type: 'number',
      sort: false,
    },
    checkBank: {
      title: 'Banco Exp. Cheque',
      type: 'string',
      sort: false,
    },
    validityDate: {
      title: 'Fecha Vigencia',
      type: 'string',
      sort: false,
    },
    gsaeRef: {
      title: 'Ref. Gsae',
      type: 'string',
      sort: false,
    },
    gbankRef: {
      title: 'Ref. Gbanco',
      type: 'number',
      sort: false,
    },
    status: {
      title: 'Banco Exp. Cheque',
      type: 'string',
      sort: false,
    },
    registerDate: {
      title: 'Fec. Registro',
      type: 'string',
      sort: false,
    },
    type: {
      title: 'Tipo',
      type: 'string',
      sort: false,
    },
  },
};

export const SETTING_CLIENT_ID = {
  ...TABLE_SETTINGS,
  actions: {
    columnTitle: 'Acciones',
    position: 'left',
    add: true,
    edit: true,
    delete: true,
  },
  columns: {
    clientId: {
      title: 'ID cliente',
      type: 'number',
      sort: false,
    },
    batch: {
      title: 'ID Evento',
      type: 'number',
      sort: false,
    },
    amount: {
      title: 'Monto',
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
    palette: {
      title: 'Paleta',
      type: 'number',
      sort: false,
    },
    checkNumber: {
      title: 'N° Cheque',
      type: 'number',
      sort: false,
    },
    checkBank: {
      title: 'Banco Exp. Cheque',
      type: 'string',
      sort: false,
    },
    validityDate: {
      title: 'Fecha Videncia',
      type: 'string',
      sort: false,
    },
    gsaeRef: {
      title: 'Ref. Gsae',
      type: 'string',
      sort: false,
    },
    gbankRef: {
      title: 'Ref. Gbanco',
      type: 'number',
      sort: false,
    },
    status: {
      title: 'Banco Exp. Cheque',
      type: 'string',
      sort: false,
    },
    registerDate: {
      title: 'Fec. Registro',
      type: 'string',
      sort: false,
    },
    type: {
      title: 'Tipo',
      type: 'string',
      sort: false,
    },
  },
};

export const SETTING_BATCH_REWORK = {
  ...TABLE_SETTINGS,
  selectMode: 'multi',
  attr: {
    class: 'table-bordered center-checkbox',
  },
  columns: {
    batch: {
      title: 'Lote Público',
      type: 'number',
      sort: false,
    },
    description: {
      title: 'Descripción ',
      type: 'string',
      sort: false,
    },
  },
};

export const SETTING_RFC_REWORK = {
  ...TABLE_SETTINGS,
  selectMode: 'multi',
  attr: {
    class: 'table-bordered center-checkbox',
  },
  columns: {
    rfc: {
      title: 'R.F.C.',
      type: 'number',
      sort: false,
    },
    name: {
      title: 'Nombre o Denominación',
      type: 'string',
      sort: false,
    },
  },
};

export const SETTING_REPROCESS = {
  ...TABLE_SETTINGS,
  hideSubHeader: false,
  actions: false,
  columns: {
    idlcg: {
      title: 'ID LCG',
      type: 'number',
      sort: false,
    },
    idEvent: {
      title: 'ID Evento',
      type: 'number',
      sort: false,
    },
    invoiceApproval: {
      title: 'Folio Aprobación',
      type: 'number',
      sort: false,
    },
    bankTransmitter: {
      title: 'Banco Emisor',
      type: 'string',
      sort: false,
    },
    generateUser: {
      title: 'User Genera',
      type: 'string',
      sort: false,
    },
    indicator: {
      title: 'Indicador',
      type: 'string',
      sort: false,
    },
    dateapproPay: {
      title: 'Fecha Aprobación Pago',
      type: 'string',
      sort: false,
      /*filter: {
        type: 'custom',
        component: CustomDateFilterComponent,
      },*/
      valuePrepareFunction: (date?: Date) => {
        if (date) {
          var raw = new Date(date);
          var formatted = new DatePipe('en-EN').transform(
            raw,
            'dd/MM/yyyy',
            'UTC'
          );

          return formatted;
        } else {
          return '';
        }
      },
    },
    palletteNumber: {
      title: 'No. Paleta',
      type: 'string',
      sort: false,
    },
    idBatch: {
      title: 'ID Lote',
      type: 'number',
      sort: false,
    },
    idCustomer: {
      title: 'ID Cliente',
      type: 'number',
      sort: false,
    },
    /*idPublicBatch: {
      title: 'Lote Público',
      type: 'number',
      sort: false,
    },*/
    amount: {
      title: 'Monto',
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
    /*PALETA: {
      title: 'Paleta',
      type: 'string',
      sort: false,
    },*/
    checkNumber: {
      title: 'N° Cheque',
      type: 'number',
      sort: false,
    },
    bankExpCheck: {
      title: 'Banco Exp. Cheque',
      type: 'string',
      sort: false,
    },
    dateValidity: {
      title: 'Fecha Videncia',
      type: 'string',
      sort: false,
      filter: {
        type: 'custom',
        component: CustomDateFilterComponent,
      },
      valuePrepareFunction: (date?: Date) => {
        var raw = new Date(date);
        var formatted = new DatePipe('en-EN').transform(
          raw,
          'dd/MM/yyyy',
          'UTC'
        );

        return formatted;
      },
    },
    refGsae: {
      title: 'Ref. Gsae',
      type: 'string',
      sort: false,
    },
    refGbank: {
      title: 'Ref. Gbanco',
      type: 'number',
      sort: false,
    },
    /*description: {
      title: 'Descripción',
      type: 'string',
      sort: false,
    },*/
    status: {
      title: 'Estatus',
      type: 'string',
      sort: false,
      valuePrepareFunction: (cell: any, _row: any) => {
        switch (cell) {
          case 'PAG':
            return 'PAGADA';
          case 'GARA':
            return 'EN GARANTIA';
          case 'CAN':
            return 'CANCELADO';
          case 'PREP':
            return 'EN PREPARACION';
          case 'DES':
            return 'DESIERTO';
          case 'APRO':
            return 'APROBADO';
          case 'CONC':
            return 'CONCILIADO A SIRSAE';
          case 'NDIS':
            return 'NO DISPONIBLE';
          case 'CNE':
            return 'CONVERTIDO A NUMERARIO';
          case 'ACT':
            return 'EVENTO PUBLICO ACTUALIZADO';
          case 'GEN':
            return 'GENERADA';
          case 'CON1':
            return 'CONCILIADO A SIRSAE PRIMERA FASE';
          case 'CON2':
            return 'CONCILIADO A SIRSAE SEGUNDA FASE';
          case 'ETP':
            return 'ETAPA DE PAGO EXTEMPORANEO';
          case 'PAGE':
            return 'PAGADO EN TIEMPO EXTEMPORANEO';
          case 'CANC':
            return 'CANCELADO POR COMERCIALIZACION';
          case 'CDEV':
            return 'CANCELADO POR DEVOLUCION';
          case 'CAE':
            return 'CANCELADO POR PAGO EN EFECTIVO';
          case 'EFE':
            return 'PAGO EN EFECTIVO';
          case 'CANV':
            return 'CANCELADO POR VALUACION';
          case 'PG43':
            return 'CANCELACION PARCIAL 43 POBALINES';
          default:
            return 'S/D';
        }
      },
      filter: {
        type: 'list',
        config: {
          selectText: 'Seleccionar',
          list: [
            { value: 'PAG', title: 'PAGADA' },
            { value: 'GARA', title: 'EN GARANTIA' },
            { value: 'CAN', title: 'CANCELADO' },
            { value: 'PREP', title: 'EN PREPARACION' },
            { value: 'DES', title: 'DESIERTO' },
            { value: 'APRO', title: 'APROBADO' },
            { value: 'CONC', title: 'CONCILIADO A SIRSAE' },
            { value: 'NDIS', title: 'NO DISPONIBLE' },
            { value: 'CNE', title: 'CONVERTIDO A NUMERARIO' },
            { value: 'ACT', title: 'EVENTO PUBLICO ACTUALIZADO' },
            { value: 'GEN', title: 'GENERADA' },
            { value: 'CON1', title: 'CONCILIADO A SIRSAE PRIMERA FASE' },
            { value: 'CON2', title: 'CONCILIADO A SIRSAE SEGUNDA FASE' },
            { value: 'ETP', title: 'ETAPA DE PAGO EXTEMPORANEO' },
            { value: 'PAGE', title: 'PAGADO EN TIEMPO EXTEMPORANEO' },
            { value: 'CANC', title: 'CANCELADO POR COMERCIALIZACION' },
            { value: 'CDEV', title: 'CANCELADO POR DEVOLUCION' },
            { value: 'CAE', title: 'CANCELADO POR PAGO EN EFECTIVO' },
            { value: 'EFE', title: 'PAGO EN EFECTIVO' },
            { value: 'CANV', title: 'CANCELADO POR VALUACION' },
            { value: 'PG43', title: 'CANCELACION PARCIAL 43 POBALINES' },
          ],
        },
      },
    },
    recordDate: {
      title: 'Fecha Registro',
      type: 'string',
      sort: false,
    },
    idTypeSat: {
      title: 'Tipo de Pago',
      type: 'string',
      sort: false,
    },

    extra: {
      title: 'Extra de prueba',
      type: 'string',
      sort: false,
    },
  },
};
