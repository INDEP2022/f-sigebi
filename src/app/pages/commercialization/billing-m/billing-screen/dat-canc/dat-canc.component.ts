import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { MsInvoiceService } from 'src/app/core/services/ms-invoice/ms-invoice.service';
import { LotService } from 'src/app/core/services/ms-lot/lot.service';
import { BasePage } from 'src/app/core/shared';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { BillingsService } from '../../services/services';
import { BillingCommunicationService } from '../communication/communication.services';

@Component({
  selector: 'app-dat-canc',
  templateUrl: './dat-canc.component.html',
  styles: [
    `
      button.loading:after {
        content: '';
        display: inline-block;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 2px solid #fff;
        border-top-color: transparent;
        border-right-color: transparent;
        animation: spin 0.8s linear infinite;
        margin-left: 5px;
        vertical-align: middle;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
    `,
  ],
})
export class DatCancComponent extends BasePage implements OnInit {
  title: 'Cancelar Factura';
  form: FormGroup;
  events = new DefaultSelect<any>();
  batchs = new DefaultSelect<any>();
  delegations = new DefaultSelect<any>();
  cvmans = new DefaultSelect<any>();
  readonlyDele: boolean = false;
  readonlyLot: boolean = false;
  readonlyMan: boolean = false;

  selectedEvent: any = null;
  selectedLot: any = null;
  selectedDele: any = null;
  selectedMan: any = null;

  dataSeleccionada: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  cause: any;
  btnLoading: boolean = false;
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private billingsService: BillingsService,
    private token: AuthService,
    private msInvoiceService: MsInvoiceService,
    private lotService: LotService,
    private billingCommunicationService: BillingCommunicationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      event: [null, Validators.required],
      keyProcess: [null],
      idLot: [null, Validators.required],
      desLote: [null],
      noDelegation: [null],
      descDelegation: [null],
      cvman: [null],
      descCvman: [null],
    });
  }

  close() {
    this.changeValSelect(false);
    this.modalRef.hide();
  }

  async confirm() {
    let contador: any;
    if (!this.selectedEvent)
      return (
        this.form.markAllAsTouched,
        this.alert('warning', 'Debe especificar un evento', '')
      );

    if (!this.selectedLot)
      return (
        this.form.markAllAsTouched,
        this.alert('warning', 'Debe especificar un lote', '')
      );

    let obj = {
      idEvent: this.selectedEvent.idEvent,
      idLot: this.selectedLot.lotPublic,
      delegationNumber: !this.selectedDele
        ? null
        : this.selectedDele.idDelegation,
      cvman: !this.selectedMan ? null : this.selectedMan.cvman,
    };
    this.btnLoading = true;
    contador = await this.billingsService.valueContador(obj);
    if (contador > 0)
      return (
        (this.btnLoading = false),
        this.alert('warning', 'No se tienen facturas con este criterio', '')
      );

    let obj1 = {
      idEvent: this.selectedEvent.idEvent,
      idLot: this.selectedLot.lotPublic,
      delegationNumber: !this.selectedDele
        ? null
        : this.selectedDele.idDelegation,
      cvman: !this.selectedMan ? null : this.selectedMan.cvman,
    };
    contador = await this.billingsService.valueContador1(obj1);
    if (contador > 0)
      return (
        (this.btnLoading = false),
        this.alert(
          'warning',
          'Se tienen facturas con estatus FOL',
          'No se puede realizar la cancelación.'
        )
      );
    this.params.getValue()[
      'filter.eventId'
    ] = `$eq:${this.selectedEvent.idEvent}`;
    this.params.getValue()[
      'filter.batchId'
    ] = `$eq:${this.selectedLot.lotPublic}`;
    if (this.selectedDele)
      this.params.getValue()[
        'filter.delegationNumber'
      ] = `$eq:${this.selectedDele.idDelegation}`;

    if (this.selectedMan)
      this.params.getValue()['filter.cvman'] = `$eq:${this.selectedMan.cvman}`;

    this.params.getValue()['filter.factstatusId'] = `$in:CFDI,IMP,PREF`;
    this.params.getValue()['filter.vouchertype'] = `$eq:FAC`;

    await this.enviarParams(this.params);
    contador = 0;
    let n_CONP = 0;
    let l_BAF = false;
    let obj_cursor1 = {
      idEvent: this.selectedEvent.idEvent,
      idLot: this.selectedLot.lotPublic,
      delegationNumber: !this.selectedDele
        ? null
        : this.selectedDele.idDelegation,
      cvman: !this.selectedMan ? null : this.selectedMan.cvman,
    };
    let cursor1: any = await this.billingsService.cursor1(obj_cursor1);

    for (let a = 0; a < cursor1; a++) {
      let obj_cursor2 = {
        idEvent: cursor1[a].idEvent,
        idLot: cursor1[a].idLot,
        delegationNumber: cursor1[a].delegationNumber,
        cvman: cursor1[a].cvman,
      };
      let cursor2: any = await this.billingsService.cursor2(obj_cursor2);
      l_BAF = false;
      for (let i = 0; i < cursor2; i++) {
        if (cursor2[i].idStatusFac == 'PREF') {
          n_CONP = n_CONP + 1;
          l_BAF = true;
        } else {
          if (l_BAF) {
            l_BAF = true;
            break;
          }
          n_CONP = n_CONP + 1;
        }
      }
      if (l_BAF) {
        break;
      }
    }

    if (l_BAF)
      return (
        (this.btnLoading = false),
        this.alert(
          'warning',
          'No se puede realizar la cancelación por inconsistencia en estatus.',
          ''
        )
      );

    // await this.selectData()
    // Seleccionamos todos los registros de la tabla
    // GO_BLOCK('COMER_FACTURAS');
    //   FIRST_RECORD;
    //   LOOP
    //   : COMER_FACTURAS.SELECCIONA := 'S';
    //     EXIT WHEN: SYSTEM.LAST_RECORD = 'TRUE';
    //   NEXT_RECORD;
    // END LOOP;
    this.billingCommunicationService.dataSeleccionada$.subscribe(
      (next: any) => {
        this.dataSeleccionada = next;
        console.log('Data seleccionada', next);
        if (contador == 0 && n_CONP == 0)
          return (
            (this.btnLoading = false),
            this.alert(
              'warning',
              'No se tienen facturas para cancelar ni eliminar',
              ''
            )
          );
        this.alertQuestion(
          'question',
          `Se cancelará(n) ${contador}, y se eliminará(n) ${n_CONP} factura(s)`,
          '¿Desea ejecutar el proceso?'
        ).then(async question => {
          if (question.isConfirmed) {
            this.valUser();
          } else {
            this.btnLoading = false;
            this.modalRef.content.callback(false);
            this.close();
          }
        });
      }
    );
  }
  async selectData() {
    this.billingCommunicationService.dataSeleccionada$.subscribe(
      (next: any) => {
        this.dataSeleccionada = next;
        console.log('Data seleccionada', next);
      }
    );
    return true;
  }
  valUser() {
    // Validamos al usuario para autorizar la cancelación //
    const params = new ListParams();
    params['filter.user'] = `$eq:${
      this.token.decodeToken().preferred_username
    }`;
    // delete params.sortBy;
    const user = this.billingsService.getSegAcessXAreasService(params);
    if (!user)
      return (
        (this.btnLoading = false),
        this.alert('warning', 'El usuario no puede autorizar cancelación', '')
      );
    this.pupNvoCancFact();
  }

  getEvents(lparams: ListParams) {
    const params = new FilterParams();

    params.page = lparams.page;
    params.limit = lparams.limit;

    if (lparams.text)
      params.addFilter('idEvent', lparams.text, SearchFilter.EQ);
    params.sortBy = `idEvent:DESC`;
    this.msInvoiceService
      .getApplicationLovsCanbacEvent(params.getParams())
      .subscribe({
        next: data => {
          console.log('EVENT', data);
          this.events = new DefaultSelect(data.data, data.count);
        },
        error: err => {
          this.events = new DefaultSelect();
        },
      });
  }

  async selectEvent(event: any) {
    console.log(event);
    this.selectedEvent = event;
    if (event) {
      this.form.get('keyProcess').setValue(event.processKey);
      this.readonlyLot = true;
      this.getLotes(new ListParams());
      this.readonlyMan = false;
      this.readonlyDele = false;
    } else {
      this.form.get('keyProcess').setValue(null);
      this.readonlyLot = false;
      this.readonlyMan = false;
      this.readonlyDele = false;
      this.getLotes(new ListParams());
    }
  }
  getLotes(lparams: ListParams) {
    // COMER_LOTES
    const params = new FilterParams();

    params.page = lparams.page;
    params.limit = lparams.limit;

    if (lparams.text)
      params.addFilter('lotPublic', lparams.text, SearchFilter.EQ);

    if (this.selectedEvent)
      params.addFilter('idEvent', this.selectedEvent.idEvent, SearchFilter.EQ);
    params.sortBy = `lotPublic:DESC`;
    this.lotService.getLotbyEvent_(params.getParams()).subscribe({
      next: data => {
        console.log('LOTE', data);
        // Promise.all(result).then(resp => {
        this.batchs = new DefaultSelect(data.data, data.count);
        // });
      },
      error: err => {
        this.batchs = new DefaultSelect([], 0);
      },
    });
  }
  async selectLot(event: any) {
    console.log(event);
    this.selectedLot = event;
    if (event) {
      this.form.get('desLote').setValue(event.description);
      this.form.get('noDelegation').setValue(null);
      this.readonlyDele = true;
      this.readonlyMan = false;
      this.getDelegacion(new ListParams());
    } else {
      this.readonlyDele = false;
      this.readonlyMan = false;
      this.form.get('desLote').setValue(null);
    }
  }
  getDelegacion(lparams: ListParams) {
    const params = new FilterParams();

    params.page = lparams.page;
    params.limit = lparams.limit;

    if (lparams.text)
      params.addFilter('idDelegation', lparams.text, SearchFilter.EQ);

    let body = {
      idEvent: this.selectedEvent.idEvent,
      idLot: this.selectedLot.lotPublic,
    };

    this.msInvoiceService
      .getApplicationlovsCanbaccDelegation(body, params.getParams())
      .subscribe({
        next: data => {
          console.log('DELE', data);
          this.delegations = new DefaultSelect(data.data, data.count);
        },
        error: err => {
          this.delegations = new DefaultSelect();
        },
      });
  }
  async selectDele(event: any) {
    console.log(event);
    this.selectedDele = event;
    if (event) {
      this.form.get('descDelegation').setValue(event.description);
      this.readonlyMan = true;
      this.getMandatos(new ListParams());
    } else {
      this.readonlyMan = false;
      this.form.get('descDelegation').setValue(null);
    }
  }
  getMandatos(lparams: ListParams) {
    const params = new FilterParams();

    params.page = lparams.page;
    params.limit = lparams.limit;

    if (lparams.text)
      params.addFilter('idDelegation', lparams.text, SearchFilter.EQ);

    let body = {
      idEvent: this.selectedEvent.idEvent,
      idLot: this.selectedLot.lotPublic,
      delegationNumber: this.selectedDele.idDelegation,
    };

    this.msInvoiceService
      .getApplicationLovsCanbaccTransfer(body, params.getParams())
      .subscribe({
        next: data => {
          console.log('DELE', data);
          this.cvmans = new DefaultSelect(data.data, data.count);
        },
        error: err => {
          this.cvmans = new DefaultSelect();
        },
      });
  }
  async selectMan(event: any) {
    console.log(event);
    this.selectedMan = event;
    if (event) {
      this.form.get('descCvman').setValue(event.key);
    } else {
      this.form.get('descCvman').setValue(null);
    }
  }

  pupNvoCancFact() {
    // PUP_NVO_CANC_FACT
    if (this.dataSeleccionada.length == 0)
      return (
        (this.btnLoading = false),
        this.alert('warning', 'No hay facturas seleccionadas', '')
      );
    let cont = 0;
    let l_BAN: boolean = false;
    let n_OPCION: number;
    let c_SECDOC: string;
    let result = this.dataSeleccionada.map(item => {
      if (
        (item.factstatusId == 'CFDI' ||
          item.factstatusId == 'IMP' ||
          item.factstatusId == 'PREF') &&
        item.vouchertype == 'FAC' &&
        item.delegationNumber == this.token.decodeToken().department
      ) {
        cont = cont + 1;
      } else {
        l_BAN = true;
      }
    });
    Promise.all(result).then(resp => {
      if (l_BAN)
        return (
          (this.btnLoading = false),
          this.alert(
            'warning',
            'Usuario que autoriza inválido para esta selección.',
            ''
          )
        );
      if (cont == 0)
        return (
          (this.btnLoading = false),
          this.alert(
            'warning',
            'No se tienen facturas por cancelar/eliminar',
            ''
          )
        );

      this.alertQuestion(
        'question',
        `Se cancelarán/eliminarán ${cont} factura(s)`,
        '¿Desea ejecutar el proceso?'
      ).then(async question => {
        if (question.isConfirmed) {
          let result_ = this.dataSeleccionada.map(async item => {
            if (item.factstatusId == 'PREF') {
              let obj_1 = {
                eventId: item.eventId,
                lotId: item.lotId,
              };
              await this.billingsService.comerCtrFacRegxBatch(obj_1);

              // PK_COMER_FACTINM.PA_NVO_ELIMINA_FACTURA
              let obj_2 = {
                pEventId: item.eventId,
                pInvoiceId: item.billId,
              };
              let c_RESUL: any =
                await this.billingsService.getPaNvoDeleteInvoice(obj_2); //
              if (c_RESUL != 'Correcto.') {
                this.alert(
                  'warning',
                  c_RESUL +
                    ` en eliminación para Evento: ${item.eventId}, Lote: ${item.lotId}, Del.: ${item.delegationNumber}, Mandato.:${item.cvman}`,
                  ''
                );
              }
            } else {
              if (item.type === 8 || item.type === 9) {
                n_OPCION = 0;
                c_SECDOC = 'P';
              } else {
                n_OPCION = 1;
                c_SECDOC = 'S';
              }

              let obj___ = {
                eventId: item.eventId,
                invoiceId: item.billId,
                causereinvoiceId: 1,
                usuarioAuthorize: this.token.decodeToken().preferred_username,
                dateIauthorize: new Date(),
              };
              let c_RESUL: any = await this.billingsService.paNewGeneratePay(
                obj___
              ); // PK_COMER_FACTINM.PA_NVO_GENERA_NC
              if (c_RESUL != 'Correcto.') {
                this.alert(
                  'warning',
                  c_RESUL +
                    ` en N.C. para Evento: ${item.eventId}, Lote: ${item.lotId}, Del.: ${item.delegationNumber}, Mandato.:${item.cvman}`,
                  ''
                );
              } else {
                let obj: any = {
                  p_id_evento: item.eventId,
                  p_opcion: n_OPCION,
                  p_lote_publico: item.lotId,
                  p_cve_pantalla: 'FCOMER086_I',
                  p_id_factura: item.billId,
                  p_id_pago: item.paymentId,
                  p_documento: 'FAC',
                  p_secdoc: c_SECDOC,
                  p_ind_gendet: 1,
                  p_no_delegacion: item.delegationNumber,
                  p_mandato: item.cvman,
                  p_parcialidad: item.numBiasSat,
                };
                // PK_COMER_FACTINM.PA_NVO_FACTURA_PAG
                const newBillingPay: any =
                  await this.billingsService.paNewBillingPay(obj); // EDWIN - CORRECCIÓN
                if (newBillingPay != 'Correcto.') {
                  this.alert(
                    'warning',
                    newBillingPay,
                    `Para Evento: ${item.eventId}, Lote: ${item.lotId}, Del.: ${item.delegationNumber}, Mandato.:${item.cvman}`
                  );
                }
              }
            }
          });

          Promise.all(result_).then(resp_ => {
            this.btnLoading = false;
            this.modalRef.content.callback(true);
            this.close();
            this.alert('success', 'Proceso terminado correctamente', '');
          });
        } else {
          this.btnLoading = false;
        }
      });
    });
  }

  async enviarParams(params: any) {
    this.billingCommunicationService.enviarParams(params);
  }

  async changeValSelect(bool: boolean) {
    this.billingCommunicationService.changeValSelect(bool);
  }
}
