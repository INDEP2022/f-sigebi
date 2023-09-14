import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { AccountMovementService } from 'src/app/core/services/ms-account-movements/account-movement.service';
import { ComerEventosService } from 'src/app/core/services/ms-event/comer-eventos.service';
import { PaymentService } from 'src/app/core/services/ms-payment/payment-services.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DATA_COLUMNS } from './columns';

@Component({
  selector: 'app-payload',
  templateUrl: './payload.component.html',
  styles: [],
})
export class PayloadComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  dateMax: string;
  columnFilters: any = [];

  constructor(
    private fb: FormBuilder,
    private comerEventosService: ComerEventosService,
    private accountMovementService: AccountMovementService,
    private paymentService: PaymentService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...DATA_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      event: [null, [Validators.required]],
      bank: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
    });
  }

  rowSelect(event: any) {}

  data: any;

  async loadAgo() {
    let Contador: number = 0;
    let ResFase: number = 0;
    let NoEvento: number = 0;
    let srtBancotxt: string = '';
    let TipoSat: string = '';
    let references: string = '';
    let V_ValTPago: string = '';
    let LST_REFERENCIA: string = null;
    let V_TIPOREF: number;
    let LST_TIPO: string = '';
    let L_LOTE: number;
    let L_PUBLICO: number;
    let LOTE_AUX: number;
    let LST_2COL1: string = '';
    let AUX_RESULTADO: string = '';
    let AUX_VAL: string = '';
    let L_RECHAZO: string = '';
    let V_CTA_BANCARIA: string = '';
    let V_FECHA: number = 0;
    let n_TFECHA: number = 0;
    let LST_COL2: string = '';
    let CODIGO_BANCO: number = 0;
    let L_DESCPAGO: string = '';
    let DESCRIPCION_MOV: string = '';
    let SUCURSAL_B = '';
    let EXISTE: number = 0;
    let secuencia: number = 0;
    let MAX_CARGA = '';

    let phase = await this.phase();
    let dataPhase: any = phase;
    ResFase = dataPhase.fase;

    if (ResFase == 1) {
      let date = await this.maxDate();
      let dataDate: any = date;
      //this.dateMax = dataDate.data[0].max;
      MAX_CARGA = dataDate.data[0].max;
    } else if (dataPhase.fase == 2) {
      const event = this.form.get('event').value;
      let payment = await this.paymentsConfirmed(event);

      let paymentData: any = payment;
      console.log(paymentData.count);
      for (let i = 0; i < paymentData.count; i++) {
        references = paymentData.data[i].reference;
        //Llamar al servicio
        /*let data = await this.loadSqlPayments(references);
        let dataSQL:any = data;
        TipoSat = dataSQL.data[0]*/
        L_LOTE = paymentData.data[i].lotId;
        L_PUBLICO = paymentData.data[i].lotPublic;
        /*
        LST_2COL1 = dataSQL.data[0];
        V_CTA_BANCARIA = dataSQL.data[0];
        LST_COL2 = dataSQL.data[0];
        DESCRIPCION_MOV = dataSQL.data[0];
        if (TipoSat == "99" || TipoSat is null){
          let CarPagos = await this.paymentType(L_LOTE,references);
          let CarPagosData = CarPagos;
          V_ValTPago = CarPagosData.data[0];
        }
        else{
          V_ValTPago = TipoSat;
        }
        */
        if (references) {
          references = references.trim();
          LST_REFERENCIA = references.substring(0, 20);
          if (V_TIPOREF == 3 || V_TIPOREF == 4 || V_TIPOREF == 5)
            LST_TIPO = 'L';
          else LST_TIPO = 'G';

          if (L_LOTE > 0 && L_PUBLICO != 0) {
            LOTE_AUX = L_LOTE;
            AUX_RESULTADO = 'Referencia Valida';
            AUX_VAL = 'A';
          } else if (L_LOTE > 0 && L_PUBLICO == 0) {
            LOTE_AUX = L_LOTE;
            AUX_RESULTADO = 'Referencia Pago Bases';
            AUX_VAL = 'B';
          } else if (L_LOTE == 0) {
            LOTE_AUX = 0;
            AUX_RESULTADO = 'Referencia no Existe';
            AUX_VAL = 'R';
          }

          if (L_RECHAZO == 'S') {
            LOTE_AUX = 0;
            AUX_RESULTADO = 'Deposito Rechazo por devolución';
            AUX_VAL = 'R';
          }
        } else {
          if (L_RECHAZO == 'S') {
            LST_REFERENCIA = 'SIN REFERENCIA';
            AUX_RESULTADO = 'Deposito Rechazado por devolución';
            LST_TIPO = 'I';
            AUX_VAL = 'R';
            LOTE_AUX = 0;
          } else {
            LST_REFERENCIA = 'SIN REFERENCIA';
            AUX_RESULTADO = 'SIN REFERENCIA';
            LST_TIPO = 'I';
            AUX_VAL = 'R';
            LOTE_AUX = 0;
          }
        }

        if (LST_2COL1.indexOf('BANAMEX') !== -1) {
          V_FECHA = 1;
          if (V_CTA_BANCARIA == '7495220') {
            LST_2COL1 = 'BANAMEX2';
            n_TFECHA = LST_COL2.length;
            if (n_TFECHA == 5) {
              LST_COL2 = '0' + LST_COL2;
            }
            let bancDesc = await this.obtenCodDescPago(LST_2COL1, 17);
            let bancData: any = bancDesc;
            CODIGO_BANCO = bancData.data[0];
            L_DESCPAGO = bancData.data[0];
          } else {
            LST_2COL1 = 'BANAMEX PS';
            let bancDesc = await this.obtenCodDescPago(LST_2COL1, 17);
            let bancData: any = bancDesc;
            CODIGO_BANCO = bancData.data[0];
            L_DESCPAGO = bancData.data[0];
          }
        } else if (LST_2COL1.indexOf('BANCO SANT') !== -1) {
          V_FECHA = 2;
          LST_2COL1 = 'SANTAND PS';
        }
      }
    }
  }

  async phase() {
    return new Promise((resolve, reject) => {
      let body = {
        pEventNumber: this.form.get('event').value,
      };
      this.comerEventosService.getspObtnPhaseEvent(body).subscribe({
        next: resp => {
          resolve(resp);
        },
        error: err => {
          resolve(null);
        },
      });
    });
  }

  async maxDate() {
    return new Promise((resolve, reject) => {
      let body = {};
      this.accountMovementService.getMaxDate(body).subscribe({
        next: resp => {
          resolve(resp);
        },
        error: err => {
          resolve(null);
        },
      });
    });
  }

  async paymentsConfirmed(idEvent?: number | string) {
    return new Promise((resolve, reject) => {
      if (idEvent) {
        this.params.getValue()['filter.eventId'] = idEvent;
      }
      let params = {
        ...this.params.getValue(),
        ...this.columnFilters,
      };
      this.paymentService.getPaymentsxConfirm(params).subscribe({
        next: resp => {
          console.log(resp);
          resolve(resp);
        },
        error: err => {
          resolve(null);
        },
      });
    });
  }

  async loadSqlPayments(ref: string) {
    //Servicio de Obten_Proc_Nuevo_Carga_Pagos_SQL
  }

  async paymentType(lotId: number, ref: string) {
    //Servicio de ObtenTipoPago
  }

  async obtenCodDescPago(cveBanc: string, cod: number) {
    //Revisar con back
    return new Promise((resolve, reject) => {
      let body = {
        cveBanco: cveBanc,
        codigo: cod,
      };
      this.accountMovementService.getCodBancDesc(body).subscribe({
        next: resp => {
          resolve(resp);
        },
        error: err => {
          resolve(null);
        },
      });
    });
  }
}
