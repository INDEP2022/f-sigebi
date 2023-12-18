import { IComerDetExpense2 } from 'src/app/core/models/ms-spent/comer-detexpense';
import { CheckboxChangeStatusComponent } from './checkbox-change-status';
import { CheckboxReportDelitComponent } from './checkbox-report-delit';

export const COLUMNS = {
  changeStatus: {
    title: 'Cambia Estatus',
    sort: false,
    type: 'custom',
    renderComponent: CheckboxChangeStatusComponent,
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        data.row.changeStatus = data.toggle;
      });
    },
    filter: false,
  },
  reportDelit: {
    title: 'Reporte Robo',
    sort: false,
    type: 'custom',
    renderComponent: CheckboxReportDelitComponent,
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe(
        (data: { row: IComerDetExpense2; toggle: any }) => {
          console.log(instance, data);
          data.row.reportDelit = data.toggle;
          // if (data.row.V_VALCON_ROBO > 0) {
          //   if (
          //     data.row.vehiculoCount + '' === '0' &&
          //     data.row.reportDelit &&
          //     data.row.clasifGoodNumber + '' !== '1606'
          //   ) {
          //     data.row.reportDelit = false;
          //   } else if (
          //     data.row.vehiculoCount + '' === '0' &&
          //     !data.row.reportDelit &&
          //     data.row.clasifGoodNumber + '' === '1606'
          //   ) {
          //     data.row.reportDelit = true;
          //   }
          // }
          // console.log(data);
        }
      );
    },
    filter: false,
    // filter: {
    //   type: 'checkbox',
    //   config: {
    //     true: true,
    //     false: false,
    //     resetText: 'x',
    //   },
    // },
  },
  detPaymentsId: {
    title: 'Id',
    sort: false,
  },
  departure: {
    title: 'Partida',
    sort: false,
  },
  manCV: {
    title: 'Ur',
    sort: false,
  },
  mandato: {
    title: 'Transferente',
    sort: false,
  },
  goodNumber: {
    title: 'No. Bien',
    sort: false,
  },
  description: {
    title: 'Descripción',
    sort: false,
  },
  amount: {
    title: 'Monto',
    sort: false,
  },
  iva: {
    title: 'IVA',
    sort: false,
  },
  retencionIsr: {
    title: 'Retención ISR',
    sort: false,
  },
  retencionIva: {
    title: 'Retención IVA',
    sort: false,
  },
  total: {
    title: 'Total',
    sort: false,
  },
};
