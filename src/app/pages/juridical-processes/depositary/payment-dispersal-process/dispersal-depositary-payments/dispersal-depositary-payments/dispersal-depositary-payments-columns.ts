import { DatePipe } from '@angular/common';
import { TABLE_SETTINGS } from 'src/app/core/shared';

export const TABLE_SETTINGS_1 = {
  ...TABLE_SETTINGS,
  actions: {
    columnTitle: 'Acciones',
    add: false,
    edit: true,
    delete: false,
    position: 'right',
  },
  hideSubHeader: true, //oculta subheaader de filtro
  mode: 'external', // ventana externa

  columns: {
    payGensId: {
      title: 'No. Pago',
      sort: false,
    },
    payId: {
      title: 'Id Pago',
      sort: false,
    },
    noGood: {
      title: 'No. Bien',
      sort: false,
    },
    reference: {
      title: 'Referencia',
      sort: false,
    },
    impWithoutIva: {
      title: 'Monto Sin Iva',
      sort: false,
    },
    iva: {
      title: 'Iva',
      sort: false,
    },
    amountIva: {
      title: 'Monto Iva',
      sort: false,
    },
    payment: {
      title: 'Abono/Comp.',
      sort: false,
    },
    paymentAct: {
      title: 'Pago Actual',
      sort: false,
    },
    xcentdedu: {
      title: 'Rec. Gast. %',
      sort: false,
    },
    valuededu: {
      title: 'Rec. Gast. Valor',
      sort: false,
    },
    status: {
      title: 'Pago',
      sort: false,
      // type: 'html',
      // valuePrepareFunction: (value: any) => {
      //   if (value !== null) {
      //     switch (value) {
      //       case 'P':
      //         value = `<div class="badge badge-pill bg-success text-wrap ml-2 mr-2">Pagado</div>`;
      //         return value;
      //       case 'A':
      //         value = `<div class="badge badge-pill bg-info text-wrap ml-2 mr-2">Abonado</div>`;
      //         return value;
      //       case 'C':
      //         value = `<div class="badge badge-pill bg-warning text-wrap ml-2 mr-2">Complemento</div>`;
      //         return value;
      //       default:
      //         value = ``;
      //         return value;
      //     }
      //   }
      // },
    },
    dateProcess: {
      title: 'Fecha Proceso',
      sort: false,
      filter: false,
      valuePrepareFunction: (value: string) => {
        if (!value) {
          return '';
        }
        return new DatePipe('en-US').transform(value, 'dd-MM-yyyy');
      },
    },
    statusDep: {
      title: 'Estatus',
      sort: false,
      type: 'html',
      valuePrepareFunction: (value: any) => {
        if (value !== null) {
          switch (value) {
            case 'P':
              value = `<div class="badge badge-pill bg-success text-wrap ml-2 mr-2">Pagado</div>`;
              return value;
            case 'A':
              value = `<div class="badge badge-pill bg-info text-wrap ml-2 mr-2">Abonado</div>`;
              return value;
            case 'C':
              value = `<div class="badge badge-pill bg-warning text-wrap ml-2 mr-2">Complemento</div>`;
              return value;
            default:
              value = ``;
              return value;
          }
        }
      },
    },
    paymentObserv: {
      title: 'Observaciones del Pago',
      sort: false,
    },
    deduObserv: {
      title: 'Observaciones del Reconocimiento de Gastos',
      sort: false,
    },
    reconocimiento: {
      title: 'Reconocimiento de Gastos (%/Valor)',
      sort: false,
    },
  },
};
