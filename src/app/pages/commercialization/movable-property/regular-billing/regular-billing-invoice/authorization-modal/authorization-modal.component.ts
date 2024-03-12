import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { catchError, firstValueFrom, map, of } from 'rxjs';
import {
  FilterParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { TokenInfoModel } from 'src/app/core/models/authentication/token-info.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { ComerInvoiceService } from 'src/app/core/services/ms-invoice/ms-comer-invoice.service';
import { SecurityService } from 'src/app/core/services/ms-security/security.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { BillingsService } from 'src/app/pages/commercialization/billing-m/services/services';

@Component({
  selector: 'authorization-modal',
  templateUrl: './authorization-modal.component.html',
  styles: [],
})
export class AuthorizationModalComponent extends BasePage implements OnInit {
  title: string = 'Verificación';
  user: TokenInfoModel;
  form: FormGroup;
  showPassword: boolean = false;
  data: any[] = [];
  global: any;
  parameter: any;
  constructor(
    private modalRef: BsModalRef,
    private comerInvoiceService: ComerInvoiceService,
    private authService: AuthService,
    private userService: UsersService,
    private securityService: SecurityService,
    private datePipe: DatePipe,
    private billingsService: BillingsService
  ) {
    super();
  }

  ngOnInit(): void {
    this.user = this.authService.decodeToken();
    this.form.patchValue({
      userV: this.user.preferred_username,
    });
    console.log(this.data);
  }

  async validate() {
    let cont_sel: number = 0;
    let aux: number = 0;
    let aux2: number = 0;
    let comp: string = '';
    let aux_auto: number = 0;
    let cf_leyenda: string = '';
    let cf_nuevafact: number;
    let yyyy: number;

    const { refactura, folio, userV, passwordV, causerebillId } =
      this.form.value;
    this.loading = true;
    if (refactura == 'P' && this.global.canxp == 'S') {
      this.alertQuestion(
        'warning',
        `Se cancelarán las facturas relacionadas a la solicitud de pago ${folio}`,
        '¿Desea continuar?'
      ).then(ans => {
        if (ans.isDismissed) {
          this.loading = false;
          return;
        } else {
          //se ejecuta el procedimiento PUP_CANCELAXSOLPAGO
          this.cancelXSolPayment();
        }
      });
    } else if (refactura == 'V') {
      this.alertQuestion(
        'warning',
        `Se cancelarán las facturas de los bienes en estatus VNR`,
        '¿Desea continuar?'
      ).then(async ans => {
        if (ans.isDismissed) {
          this.loading = false;
          this.modalRef.hide();
          this.modalRef.content.callback(null, 0, false);
          return;
        } else {
          for (const invoice of this.data) {
            cont_sel++;
            // COMER_VNR.F_VALIDA_REFACTURACION
            const v_park = await this.pkComerVnr(invoice, null, 0);

            if (v_park == 1) {
              aux++;
            } else if (v_park == 2) {
              aux2++;
            } else if (v_park == 0) {
            }

            if (aux2 >= 1) {
              comp = ` y ${aux2} no cumplen las condiciones para cancelar por la opción VNR (no existe acta, estatus incorrecto o acta abierta)`;
            } else {
              comp = null;
            }
          }

          if (cont_sel == 1 && aux2 == 1) {
            this.alert(
              'warning',
              `El Lote ${this.data[0].batchId} no cumple las condiciones para cancelar por la opción VNR`,
              `(No existe acta, estatus incorrecto o acta abierta)`
            );
            this.loading = false;
            this.modalRef.hide();
            this.modalRef.content.callback(null, 0, false);
            return;
          }

          if (aux >= 1) {
            this.alertQuestion(
              'warning',
              `Se procesará(n) ${aux} por cancelación ${comp}`,
              '¿Desea continuar?'
            ).then(async ans => {
              if (ans.isDismissed) {
                this.loading = false;
                this.modalRef.hide();
                this.modalRef.content.callback(null, 0, false);
                return;
              } else {
                aux_auto = await this.validConexUser(
                  userV,
                  passwordV,
                  this.user.department
                );
                this.parameter.autorizo = aux_auto;
                this.modalRef.hide();

                if (aux_auto == 1) {
                  for (const invoice of this.data) {
                    if (String(invoice.series ?? '').length > 1) {
                      cf_leyenda = `Este CFDI refiere al CFDI ${invoice.series} - ${invoice.Invoice}`;
                    } else {
                      cf_leyenda = `Este CFDI refiere a la factura ${invoice.series} - ${invoice.Invoice}`;
                    }
                    // COMER_VNR.F_VALIDA_REFACTURACION
                    cf_nuevafact = await this.pkComerVnr(
                      invoice,
                      cf_leyenda,
                      1
                    );
                  }
                }
              }
            });
          } else if (aux == 0) {
            aux_auto = await this.validConexUser(
              userV,
              passwordV,
              this.user.department
            );
            this.parameter.autorizo = aux_auto;
            this.modalRef.hide();

            if (aux_auto == 1) {
              for (const invoice of this.data) {
                if (String(invoice.series ?? '').length > 1) {
                  cf_leyenda = `Este CFDI refiere al CFDI ${invoice.series} - ${invoice.Invoice}`;
                } else {
                  cf_leyenda = `Este CFDI refiere a la factura ${invoice.series} - ${invoice.Invoice}`;
                }
                cf_nuevafact = await this.pkComerVnr(invoice, cf_leyenda, 1);
              }
            }
          }
          // COMER_CTRLFACTURA.P_VALORES_SAT
          const p_val = await this.pValSat(this.data[0]); // REFACTURACIÓN

          if (!p_val) {
            this.alert(
              'error',
              'Ha ocurrido un error en el procedimiento valores sat',
              ''
            );
            this.loading = false;
            return;
          }
        }
      });
      this.modalRef.content.callback(
        { eventId: this.data[0].eventId, factstatusId: false },
        0,
        false
      );
    } else {
      // VALI_CONEX_USU_AUTO
      aux_auto = await this.validConexUser(
        userV,
        passwordV,
        this.user.department
      );
      this.parameter.autorizo = aux_auto;
      console.log('aux_auto', aux_auto);
      if (aux_auto == 1) {
        for (const invoice of this.data) {
          yyyy = Number(invoice.impressionDate.split('-')[0]);

          if (!invoice.Invoice) {
            this.alertInfo(
              'warning',
              'Atención',
              `No se puede cancelar una factura sin folio para el evento: ${invoice.eventId} y lote ${invoice.batchId}`
            );
            this.loading = false;
          } else {
            if (String(invoice.series ?? '').length > 1) {
              cf_leyenda = `Este CFDI refiere al CFDI ${invoice.series} - ${invoice.Invoice}`;
            } else {
              cf_leyenda = `Este CFDI refiere a la factura ${invoice.series} - ${invoice.Invoice}`;
            }
            console.log('refactura', refactura);
            console.log('yyyy', yyyy);
            if (refactura == 'R') {
              // -- CREA OTRA FACTURA SIN FOLIO Y CANCELA LA ACTUAL
              if ([2010, 2011].includes(yyyy)) {
                if (yyyy == 2010) {
                  // -- SE CANCELA EL PAPEL Y SE CREA UN CFDI INGRESO (FAC)
                  const body: any = {
                    pEventO: Number(invoice.eventId),
                    pInvoiceO: Number(invoice.billId),
                    pLegend: cf_leyenda,
                    pAuthorized: userV,
                    pStatus: 'PREF',
                    pImagen: 1,
                    pCfdi: 1,
                    pLot: Number(invoice.batchId),
                    pCause: Number(causerebillId),
                    pDelEmits: Number(this.user.department),
                  };
                  // COMER_CTRLFACTURA.COPIA_FACTURA
                  cf_nuevafact = await this.copyInovice(body);

                  if (cf_nuevafact) {
                    const body1 = {
                      invoiceId: invoice.billId,
                      eventId: invoice.eventId,
                      batchId: invoice.batchId,
                    };
                    const success = await this.cancelInvoiceComer(body1);
                    invoice.factstatusId = 'CAN';
                    invoice.causerebillId = causerebillId;
                    invoice.userIauthorize = this.user.preferred_username;
                    invoice.IauthorizeDate = this.datePipe.transform(
                      new Date(),
                      'yyyy-MM-dd'
                    );
                    delete invoice.delegation;
                    await this.billingsService.updateBillings(invoice);
                  }
                } else if (yyyy > 2010) {
                  if (String(invoice.series ?? '').length > 1) {
                    // - SI ES MAYOR A 1 QUIERE DECIR QUE ES NUEVO
                    const body: any = {
                      pEventO: Number(invoice.eventId),
                      pInvoiceO: Number(invoice.billId),
                      pLegend: cf_leyenda,
                      pAuthorized: userV,
                      pStatus: 'PREF',
                      pImagen: 1,
                      pCfdi: 0,
                      pLot: Number(invoice.batchId),
                      pCause: Number(causerebillId),
                      pDelEmits: Number(this.user.department),
                    };

                    cf_nuevafact = await this.copyInovice(body);

                    if (cf_nuevafact) {
                      //procedimiento cancelar factura
                      const body1 = {
                        invoiceId: invoice.billId,
                        eventId: invoice.eventId,
                        batchId: invoice.batchId,
                      };
                      const success = await this.cancelInvoiceComer(body1);
                      invoice.factstatusId = 'CAN';
                      invoice.causerebillId = causerebillId;
                      invoice.userIauthorize = this.user.preferred_username;
                      invoice.IauthorizeDate = this.datePipe.transform(
                        new Date(),
                        'yyyy-MM-dd'
                      );
                      delete invoice.delegation;
                      await this.billingsService.updateBillings(invoice);
                    }
                  } else {
                    // -- SE CANCELA EL PAPEL Y SE CREA UN CFDI INGRESO (FAC)
                    const body: any = {
                      pEventO: Number(invoice.eventId),
                      pInvoiceO: Number(invoice.billId),
                      pLegend: cf_leyenda,
                      pAuthorized: userV,
                      pStatus: 'PREF',
                      pImagen: 1,
                      pCfdi: 1,
                      pLot: Number(invoice.batchId),
                      pCause: Number(causerebillId),
                      pDelEmits: Number(this.user.department),
                    };
                    cf_nuevafact = await this.copyInovice(body);

                    if (cf_nuevafact) {
                      const body1 = {
                        invoiceId: invoice.billId,
                        eventId: invoice.eventId,
                        batchId: invoice.batchId,
                      };
                      const success = await this.cancelInvoiceComer(body1);
                      // if (success) {
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
                      // }
                    }
                  }
                }
              } else if (yyyy > 2011) {
                const body1 = {
                  invoiceId: invoice.billId,
                  eventId: invoice.eventId,
                  batchId: invoice.batchId,
                };
                const VAL_FECHA = await this.cancelInvoiceComer(body1);

                invoice.factstatusId = 'CAN';
                invoice.causerebillId = causerebillId;
                invoice.userIauthorize = this.user.preferred_username;
                invoice.IauthorizeDate = this.datePipe.transform(
                  new Date(),
                  'yyyy-MM-dd'
                );
                delete invoice.delegation;
                // UPDATE FACTURA //
                await this.billingsService.updateBillings(invoice);

                const body2: any = {
                  pEventO: Number(invoice.eventId),
                  pInvoiceO: Number(invoice.billId),
                  pLegend: cf_leyenda,
                  pAuthorized: userV,
                  pStatus: 'PREF',
                  pImagen: 1,
                  pCfdi: 0,
                  pLot: Number(invoice.batchId),
                  pCause: Number(causerebillId),
                  pDelEmits: Number(this.user.department),
                };
                // COMER_CTRLFACTURA.COPIA_FACTURA
                console.log('body2', body2);

                cf_nuevafact = await this.copyInovice(body2);
                console.log('cf_nuevafact', cf_nuevafact);
              } else if (yyyy <= 2009) {
                this.alert('warning', 'Año 2009 proceso por definir', '');
                this.loading = false;
              }

              if (cf_nuevafact > 0) {
                //lipcommit silent
                this.alert(
                  'success',
                  'Cancelación terminada correctamente',
                  ''
                );
              } else {
                this.alert('warning', 'Fallo de operación de cancelación', '');
                this.loading = false;
                break;
              }
            } else if (refactura == 'C') {
              if ([2010, 2011].includes(yyyy)) {
                const body: any = {
                  pEventO: Number(invoice.eventId),
                  pInvoiceO: Number(invoice.billId),
                  pLegend: cf_leyenda,
                  pAuthorized: userV,
                  pStatus: 'PREF',
                  pImagen: 1,
                  pCfdi: 2,
                  pLot: Number(invoice.batchId),
                  pCause: Number(causerebillId),
                  pDelEmits: Number(this.user.department),
                };
                // COMER_CTRLFACTURA.COPIA_FACTURA
                cf_nuevafact = await this.copyInovice(body);

                if (cf_nuevafact) {
                  const body1 = {
                    invoiceId: invoice.billId,
                    eventId: invoice.eventId,
                    batchId: invoice.batchId,
                  };
                  const success = await this.cancelInvoiceComer(body1);
                  invoice.factstatusId = 'CAN';
                  invoice.causerebillId = causerebillId;
                  invoice.userIauthorize = this.user.preferred_username;
                  invoice.IauthorizeDate = this.datePipe.transform(
                    new Date(),
                    'yyyy-MM-dd'
                  );
                  delete invoice.delegation;
                  await this.billingsService.updateBillings(invoice);
                }
              } else if (yyyy <= 2009) {
                this.alert('warning', 'Año 2009 proceso por definir', '');
                this.loading = false;
              }
            }
          }
        }
      }
      this.modalRef.hide();
      this.modalRef.content.callback(
        { eventId: this.data[0].eventId, factstatusId: 'CAN' },
        0,
        false
      );
    }
  }

  async cancelXSolPayment() {
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

    const { refactura, folio, userV, passwordV, causerebillId } =
      this.form.value;

    aux_auto = await this.validConexUser(
      userV,
      passwordV,
      this.user.department
    );
    this.parameter.autorizo = aux_auto;
    this.modalRef.hide();

    if (aux_auto == 1) {
      this.modalRef.content.callback(null, 0, true);
    } //fin aux_auto
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

  async copyInovice(data: any) {
    return firstValueFrom<number>(
      this.comerInvoiceService.copyInvoice(data).pipe(
        map(resp => 1),
        catchError(() => of(0))
      )
    );
  }

  async pValSat(data: any) {
    const body: any = {
      pEventId: data.eventId,
      pLot: data.batchId,
      pInvoice: null,
      pOption: 2,
    };
    return firstValueFrom(
      this.comerInvoiceService.invoicePValuesSat(body).pipe(
        map(() => true),
        catchError(() => of(false))
      )
    );
  }

  async validConexUser(user: string, password: string, delegation: string) {
    let aux_auto = 0;
    let aux_conn = 0;
    let aux_constr = '';
    const data = await this.checkUser(user.toUpperCase());

    if (!data.aux_dominio && !data.aux_user) {
      this.alert('warning', 'Atención', 'Usuario no autorizado');
      this.loading = false;
      return 0;
    }

    if (data.aux_dominio == 'C') {
    } else if (data.aux_dominio == 'R') {
      aux_auto = await this.validateRegUser(
        user.toUpperCase(),
        this.user.department
      );

      if (aux_auto == 0) {
        this.alert(
          'warning',
          'Atención',
          'El usuario no tiene atributos sobre la regional de la factura'
        );
        this.loading = false;
        return 0;
      }
    }
    //revisar esta parte conexion sql
    aux_conn = await this.valConex(user.toUpperCase(), password);

    return 1;
  }

  async valConex(user: string, password: string) {
    const filter = new FilterParams();
    filter.addFilter('user', user, SearchFilter.EQ);
    return firstValueFrom(
      this.userService.getComerUserXCan(filter.getParams()).pipe(
        map(() => {
          return 0;
        }),
        catchError(() => of(0))
      )
    );
  }

  async validateRegUser(user: string, delegation: string) {
    const filter = new FilterParams();
    filter.addFilter('user', user, SearchFilter.EQ);
    return firstValueFrom(
      this.securityService.getViewDelegationUser_(user, delegation).pipe(
        map(resp => resp.aux_dele),
        catchError(() => of(0))
      )
    );
  }

  async checkUser(user: string) {
    const filter = new FilterParams();
    filter.addFilter('user', user, SearchFilter.EQ);
    return firstValueFrom(
      this.userService.getComerUserXCan(filter.getParams()).pipe(
        map(resp => {
          return {
            aux_user: resp.data[0].user,
            aux_dominio: resp.data[0].domain,
          };
        }),
        catchError(() => of({ aux_user: null, aux_dominio: null }))
      )
    );
  }

  async pkComerVnr(data: any, leyend: string, option: number) {
    const { userV, causerebillId } = this.form.value;
    const body: any = {
      pEvent: data.eventId,
      pLot: data.batchId,
      pInvoice: data.billId,
      pLegend: leyend,
      pAuthorized: userV.toUpperCase(),
      pStatus: '',
      pCauseA: causerebillId,
      pOption: option,
      pDelEmits: this.user.department,
      pOcionCan: causerebillId,
    };
    return firstValueFrom(
      this.comerInvoiceService.pkComerVnr(body).pipe(
        map(resp => resp),
        catchError(() => of(null))
      )
    );
  }

  close() {
    this.modalRef.hide();
  }
}
