import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {
  BehaviorSubject,
  catchError,
  firstValueFrom,
  map,
  of,
  takeUntil,
} from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { ComerDetailInvoiceService } from 'src/app/core/services/ms-invoice/ms-comer-dinvocie.service';
import { ComerInvoiceService } from 'src/app/core/services/ms-invoice/ms-comer-invoice.service';
import { BasePage } from 'src/app/core/shared';
import { BillingsService } from 'src/app/pages/commercialization/billing-m/services/services';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-fact-canceladas',
  templateUrl: './fact-canceladas.component.html',
  styles: [],
})
export class FactCanceladasComponent extends BasePage implements OnInit {
  title: string = 'Facturas Canceladas';
  data: LocalDataSource = new LocalDataSource();
  totalItems: number = 0;
  eventId: any;
  idpayment: any;
  columnFilters: any = [];
  paramsList = new BehaviorSubject<ListParams>(new ListParams());
  val: boolean;
  form: FormGroup;
  user: any;
  constructor(
    private modalRef: BsModalRef,
    private comerInvoice: ComerInvoiceService,
    private billingsService: BillingsService,
    private comerDetInvoice: ComerDetailInvoiceService,
    private authService: AuthService,
    private comerInvoiceService: ComerInvoiceService,
    private datePipe: DatePipe
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: COLUMNS,
    };
  }

  ngOnInit(): void {
    this.user = this.authService.decodeToken();
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;

            const search: any = {
              id_factura: () => (searchFilter = SearchFilter.EQ),
              seriefact: () => (searchFilter = SearchFilter.ILIKE),
              id_evento: () => (searchFilter = SearchFilter.EQ),
              id_lote: () => (searchFilter = SearchFilter.EQ),
              fecha_impresion: () => (searchFilter = SearchFilter.EQ),
            };

            search[filter.field]();

            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.paramsList = this.pageFilter(this.paramsList);
          this.getData(this.eventId, this.idpayment);
        }
      });

    this.paramsList.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      this.getData(this.eventId, this.idpayment);
    });
  }

  close() {
    this.modalRef.hide();
  }

  async getData(event: number, expend: number) {
    let params = {
      ...this.paramsList,
      ...this.columnFilters,
    };
    this.comerInvoice.getEats(event, expend).subscribe({
      next: resp => {
        this.data.load(resp.data);
        this.data.refresh();
        if (resp.count) this.totalItems = resp.count;

        if (this.val) {
          this.validacionFactCancel();
          this.val = false;
        }
      },
      error: err => {
        this.data.load([]);
        this.data.refresh();
        this.totalItems = 0;
      },
    });
  }

  async validacionFactCancel() {
    let aux_auto: number = 0;
    let cf_leyenda: string = '';
    let cf_nuevafact: number;
    let borra: string;
    let yyyy: number;
    let numreg: number;
    let aut: number = 0;
    let plote: number;
    let total: number;
    let v_precioivta: number;
    let v_iva: number;
    let v_total: number;
    let monto_valid: number;

    let data: any[] = await this.data.getAll();
    const { refactura, folio, userV, passwordV, causerebillId } =
      this.form.value;
    for (const invoice of data) {
      let yyyy = Number(invoice.impressionDate.split('/')[0]);
      if (!invoice.folio) {
        this.alertInfo(
          'warning',
          'No se puede cancelar una factura sin folio',
          `Para el evento: ${invoice.id_evento} y lote ${invoice.id_lote}`
        );
      } else {
        if (String(invoice.seriefact ?? '').length > 1) {
          cf_leyenda = `Este CFDI refiere al CFDI ${invoice.seriefact} - ${invoice.folio}`;
        } else {
          cf_leyenda = `Este CFDI refiere a la factura ${invoice.seriefact} - ${invoice.folio}`;
        }
        if (yyyy > 2011) {
          // CF_NUEVAFACT := COPIA_FACTURADEV(:FACT_CANCELADAS.ID_EVENTO_FACT,:FACT_CANCELADAS.ID_LOTE_FACT, :FACT_CANCELADAS.ID_FACTURA_FACT, CF_LEYENDA, :BLK_CTRL.USUARIO_AUT, 'PREF', 1,2,:GLOBAL.PID_GASTO,:BLK_TOOLBAR.TOOLBAR_NO_DELEGACION,:BLK_CTRL.CAUSA);
          cf_nuevafact = await this.copyFactDev();
          // SELECT SUM(PRECIOVTA),SUM(IVA),SUM(TOTAL)
          const params = new ListParams();
          params['filter.eventId'] = `$eq:${invoice.id_evento}`;
          params['filter.billId'] = `$eq:${cf_nuevafact}`;
          let dataSum: any = await this.getSumaDetFacturas(params);
          let body = {
            eventId: invoice.id_evento,
            billId: cf_nuevafact,
            price: dataSum.importe,
            vat: dataSum.iva,
            total: dataSum.total,
            totalBsatKey: dataSum.total,
            SubtotalBsatKey: dataSum.importe,
          };
          // PRECIO = V_PRECIOVTA, IVA = V_IVA, TOTAL=V_TOTAL,
          // CVE_SUBTOTAL_BSAT = V_PRECIOVTA, CVE_TOTAL_BSAT = V_TOTAL
          // UPDATE COMER_FACTURAS
          this.billingsService.updateBillings(body);
          // MONTO_VALIDADO:= PUF_verificamontos(:FACT_CANCELADAS.ID_EVENTO_FACT,:FACT_CANCELADAS.ID_LOTE_FACT,:FACT_CANCELADAS.ID_FACTURA_FACT);
          let bodyAmount = {
            pEvent: invoice.id_evento,
            pBatch: invoice.id_lote,
            pInvoice: invoice.id_factura,
            invoiceSb: invoice.folio,
          };
          let amountValidate: any = await this.getAmount(bodyAmount);
          if (amountValidate < 0) {
            this.alert(
              'warning',
              'No se puede generar el egreso porque excede el monto disponible de la factura.',
              ''
            );
            cf_nuevafact = 0;
            break;
          } else if (amountValidate == 0) {
            cf_nuevafact = 0;
          } else {
            // LIP_COMMIT_SILENCIOSO
          }
        } else if (yyyy == 2010) {
          const body: any = {
            pEventO: Number(invoice.id_evento),
            pInvoiceO: Number(invoice.id_factura),
            pLegend: cf_leyenda,
            pAuthorized: userV,
            pStatus: 'PREF',
            pImagen: 1,
            pCfdi: 1,
            pLot: Number(invoice.id_lote),
            pCause: Number(causerebillId),
            pDeletedEmits: Number(this.user.department),
          };
          // :GLOBAL.CF_NUEVAFACT:=COPIA_FACTURADEVA(:FACT_CANCELADAS.ID_EVENTO_FACT,:FACT_CANCELADAS.ID_LOTE_FACT, :FACT_CANCELADAS.ID_FACTURA_FACT, CF_LEYENDA, :BLK_CTRL.USUARIO_AUT, 'PREF', 1,2,:BLK_CTRL.CAUSA,:BLK_TOOLBAR.TOOLBAR_NO_DELEGACION);
          let global_cf_nuevafact = await this.copyInovice(body);

          // let global_cf_nuevafact = await this.copyFactDeva()
          if (global_cf_nuevafact) {
            const success = await this.cancelInvoiceComer(body);
            if (success) {
              invoice.factstatusId = 'CAN';
              invoice.causerebillId = causerebillId;
              invoice.userIauthorize = this.user.preferred_username;
              invoice.IauthorizeDate = this.datePipe.transform(
                new Date(),
                'yyyy-MM-dd'
              );
              delete invoice.delegation;
              await this.billingsService.updateBillings(invoice);
              //update invoice service invoice
            }
          }
        } else if (yyyy <= 2009) {
          this.alert('warning', '2009 proceso por definir', '');
          break;
        }
        // if ([2010, 2011].includes(yyyy)) {
        //   if (yyyy == 2010) { // -- SE CANCELA EL PAPEL Y SE CREA UN CFDI INGRESO (FAC)
        //     const body: any = {
        //       pEventO: Number(invoice.eventId),
        //       pInvoiceO: Number(invoice.billId),
        //       pLegend: cf_leyenda,
        //       pAuthorized: userV,
        //       pStatus: 'PREF',
        //       pImagen: 1,
        //       pCfdi: 1,
        //       pLot: Number(invoice.batchId),
        //       pCause: Number(causerebillId),
        //       pDeletedEmits: Number(this.user.department),
        //     };
        //     // COMER_CTRLFACTURA.COPIA_FACTURA
        //     cf_nuevafact = await this.copyInovice(body);

        //     if (cf_nuevafact) {
        //       const success = await this.cancelInvoiceComer(body);
        //       if (success) {
        //         invoice.factstatusId = 'CAN';
        //         invoice.causerebillId = causerebillId;
        //         invoice.userIauthorize = this.user.preferred_username;
        //         invoice.IauthorizeDate = this.datePipe.transform(
        //           new Date(),
        //           'yyyy-MM-dd'
        //         );
        //         delete invoice.delegation;
        //         await this.billingsService.updateBillings(invoice)
        //         //update invoice service invoice
        //       }
        //     }
        //   } else if (yyyy > 2010) {
        //     if (String(invoice.series ?? '').length > 1) { // - SI ES MAYOR A 1 QUIERE DECIR QUE ES NUEVO
        //       const body: any = {
        //         pEventO: Number(invoice.eventId),
        //         pInvoiceO: Number(invoice.billId),
        //         pLegend: cf_leyenda,
        //         pAuthorized: userV,
        //         pStatus: 'PREF',
        //         pImagen: 1,
        //         pCfdi: 0,
        //         pLot: Number(invoice.batchId),
        //         pCause: Number(causerebillId),
        //         pDeletedEmits: Number(this.user.department),
        //       };

        //       cf_nuevafact = await this.copyInovice(body);

        //       if (cf_nuevafact) {
        //         //procedimiento cancelar factura
        //         const success = await this.cancelInvoiceComer(body);
        //         if (success) {
        //           invoice.factstatusId = 'CAN';
        //           invoice.causerebillId = causerebillId;
        //           invoice.userIauthorize = this.user.preferred_username;
        //           invoice.IauthorizeDate = this.datePipe.transform(
        //             new Date(),
        //             'yyyy-MM-dd'
        //           );
        //           delete invoice.delegation;
        //           await this.billingsService.updateBillings(invoice)
        //           //update invoice service invoice
        //         }
        //       }
        //     } else { // -- SE CANCELA EL PAPEL Y SE CREA UN CFDI INGRESO (FAC)
        //       const body: any = {
        //         pEventO: Number(invoice.eventId),
        //         pInvoiceO: Number(invoice.billId),
        //         pLegend: cf_leyenda,
        //         pAuthorized: userV,
        //         pStatus: 'PREF',
        //         pImagen: 1,
        //         pCfdi: 1,
        //         pLot: Number(invoice.batchId),
        //         pCause: Number(causerebillId),
        //         pDeletedEmits: Number(this.user.department),
        //       };

        //       cf_nuevafact = await this.copyInovice(body);

        //       if (cf_nuevafact) {
        //         const body = {
        //           invoiceId: invoice.billId,
        //           eventId: invoice.eventId,
        //           batchId: invoice.batchId,
        //         };
        //         const success = await this.cancelInvoiceComer(body);
        //         if (success) {
        //           invoice.factstatusId = 'CAN';
        //           invoice.causerebillId = causerebillId;
        //           invoice.userIauthorize = this.user.preferred_username;
        //           invoice.IauthorizeDate = this.datePipe.transform(
        //             new Date(),
        //             'yyyy-MM-dd'
        //           );
        //           delete invoice.delegation;
        //           await this.billingsService.updateBillings(invoice)
        //           //update invoice service invoice
        //         }
        //       }
        //     }
        //   }
        // } else if (yyyy > 2011) {
        //   const body = {
        //     invoiceId: invoice.billId,
        //     eventId: invoice.eventId,
        //     batchId: invoice.batchId,
        //   };
        //   const success = await this.cancelInvoiceComer(body);
        //   if (success) {
        //     invoice.factstatusId = 'CAN';
        //     invoice.causerebillId = causerebillId;
        //     invoice.userIauthorize = this.user.preferred_username;
        //     invoice.IauthorizeDate = this.datePipe.transform(
        //       new Date(),
        //       'yyyy-MM-dd'
        //     );
        //     delete invoice.delegation;
        //     await this.billingsService.updateBillings(invoice)
        //     //update invoice service invoice
        //   }

        //   const body2: any = {
        //     pEventO: Number(invoice.eventId),
        //     pInvoiceO: Number(invoice.billId),
        //     pLegend: cf_leyenda,
        //     pAuthorized: userV,
        //     pStatus: 'PREF',
        //     pImagen: 1,
        //     pCfdi: 0,
        //     pLot: Number(invoice.batchId),
        //     pCause: Number(causerebillId),
        //     pDeletedEmits: Number(this.user.department),
        //   };
        //   // COMER_CTRLFACTURA.COPIA_FACTURA
        //   cf_nuevafact = await this.copyInovice(body2);
        // } else if (yyyy <= 2009) {
        //   this.alert(
        //     'warning',
        //     'Atención',
        //     'Año 2009 proceso por definir'
        //   );
        //   this.loading = false;
        // }

        // if (cf_nuevafact > 0) {
        //   //lipcommit silent
        // } else {
        //   this.alert(
        //     'warning',
        //     'Fallo de operación de cancelación',
        //     ''
        //   );
        //   this.loading = false;
        //   break

        // }

        // if ([2010, 2011].includes(yyyy)) {
        //   const body: any = {
        //     pEventO: Number(invoice.eventId),
        //     pInvoiceO: Number(invoice.billId),
        //     pLegend: cf_leyenda,
        //     pAuthorized: userV,
        //     pStatus: 'PREF',
        //     pImagen: 1,
        //     pCfdi: 2,
        //     pLot: Number(invoice.batchId),
        //     pCause: Number(causerebillId),
        //     pDeletedEmits: Number(this.user.department),
        //   };
        //   // COMER_CTRLFACTURA.COPIA_FACTURA
        //   cf_nuevafact = await this.copyInovice(body);

        //   if (cf_nuevafact) {
        //     const success = await this.cancelInvoiceComer(body);
        //     if (success) {
        //       invoice.factstatusId = 'CAN';
        //       invoice.causerebillId = causerebillId;
        //       invoice.userIauthorize = this.user.preferred_username;
        //       invoice.IauthorizeDate = this.datePipe.transform(
        //         new Date(),
        //         'yyyy-MM-dd'
        //       );
        //       delete invoice.delegation;
        //       await this.billingsService.updateBillings(invoice)
        //       //update invoice service invoice
        //     }
        //   }
        // } else if (yyyy <= 2009) {
        //   this.alert(
        //     'warning',
        //     'Atención',
        //     'Año 2009 proceso por definir'
        //   );
        //   this.loading = false;
        // }
      }
    }
  }

  async copyFactDev() {
    return 1;
  }

  async copyFactDeva() {
    return 1;
  }
  async getSumaDetFacturas(params: ListParams) {
    return new Promise((resolve, reject) => {
      this.comerDetInvoice.getAllCustom(params).subscribe({
        next: async (resp: any) => {
          const data = {
            importe: resp.data[0].sum.importe,
            iva: resp.data[0].sum.iva,
            total: resp.data[0].sum.total,
          };
          resolve(data);
        },
        error: () => {
          const data = {
            importe: 0,
            iva: 0,
            total: 0,
          };
          resolve(data);
        },
      });
    });
  }

  async getAmount(body: any) {
    return new Promise((resolve, reject) => {
      this.comerInvoice.getApplicationPufVerifyAmounts(body).subscribe({
        next(value) {
          resolve(1);
        },
        error(err) {
          resolve(0);
        },
      });
    });
  }

  async copyInovice(data: any) {
    return firstValueFrom<number>(
      this.comerInvoiceService.copyInvoice(data).pipe(
        map(resp => resp),
        catchError(() => of(0))
      )
    );
  }

  async cancelInvoiceComer(data: any) {
    return firstValueFrom<boolean>(
      this.comerInvoiceService.cancelInvoice(data).pipe(
        map(resp => {
          return true;
        }),
        catchError(() => of(false))
      )
    );
  }
}
