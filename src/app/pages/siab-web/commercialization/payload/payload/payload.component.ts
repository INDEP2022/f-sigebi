import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { AccountMovementService } from 'src/app/core/services/ms-account-movements/account-movement.service';
import { ComerEventosService } from 'src/app/core/services/ms-event/comer-eventos.service';
import { FIndicaService } from 'src/app/core/services/ms-good/findica.service';
import { InterfaceesirsaeService } from 'src/app/core/services/ms-interfacesirsae/interfaceesirsae.service';
import { PaymentService } from 'src/app/core/services/ms-payment/payment-services.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { PayloadFormComponent } from '../payload-form/payload-form.component';
import { DATA_COLUMNS } from './columns';

@Component({
  selector: 'app-payload',
  templateUrl: './payload.component.html',
  styles: [],
})
export class PayloadComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  params = new BehaviorSubject<ListParams>(new ListParams());
  columnFilters: any = [];

  totalItems: number = 0;
  dateMax: string;

  dataFormat: any[] = [];
  totalrecords: number = 0;
  loadedAmount: number = 0;

  columnFilters1: any = [];
  params1 = new BehaviorSubject<ListParams>(new ListParams());
  totalItems1: number = 0;
  data1: LocalDataSource = new LocalDataSource();

  dataSql: any;
  paymentData: any;

  constructor(
    private fb: FormBuilder,
    private comerEventosService: ComerEventosService,
    private accountMovementService: AccountMovementService,
    private paymentService: PaymentService,
    private interfaceesirsaeService: InterfaceesirsaeService,
    private fIndicaService: FIndicaService,
    private modalService: BsModalService
  ) {
    super();
    this.settings = {
      ...this.settings,
      //actions: true,
      columns: { ...DATA_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.prepareForm();
    this.loadSqlPayments(new ListParams());
  }

  private prepareForm() {
    this.form = this.fb.group({
      event: [null, []],
      bank: [null, [Validators.pattern(STRING_PATTERN)]],
    });
  }

  rowSelect(event: any) {}

  data: any;

  async loadAgo() {
    if (this.form.get('event').value) {
      this.loading = true;
      this.dataFormat = [];
      this.data1.load([]);
      let data = await this.loadSqlPayments(new ListParams());
      console.log(data);
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
      let SUCURSAL_B: string = '';
      let EXISTE: number = 0;
      let secuencia: number = 0;
      let MAX_CARGA: string = '';

      let phase = await this.phase();
      let dataPhase: any = phase;
      ResFase = dataPhase.fase;
      console.log(ResFase);

      if (ResFase == 1) {
        this.alert('info', '¡Carga de Pagos Fase: 1!', ``);
        if (this.form.get('bank').value) {
          let date = await this.maxDate();
          let dataDate: any = date;
          this.dateMax = dataDate.data[0].max;
          MAX_CARGA = dataDate.data[0].max;
        } else {
          this.alert(
            'warning',
            '¡Necesita Indicar de que Banco va a cargar datos!',
            ``
          );
          return;
        }
      } else if (dataPhase.fase == 2) {
        const event = this.form.get('event').value;
        let payment = await this.paymentsConfirmed(event);

        this.paymentData = payment;
        console.log(this.paymentData.count);
        if (this.paymentData.count > 0) {
          for (let i = 0; i < this.paymentData.count; i++) {
            references = this.paymentData.data[i].reference;
            //Llamar al servicio
            let data = await this.loadSqlPayments(new ListParams());
            this.dataSql = data;
            console.log(data);
            TipoSat = this.dataSql.data[0].TIPO_PAGO_SAT;

            L_LOTE = this.paymentData.data[i].lotId;
            L_PUBLICO = this.paymentData.data[i].lotPublic;

            LST_2COL1 = this.dataSql.data[0].ifDsc;
            V_CTA_BANCARIA = this.dataSql.data[0].cbCtaBn;
            LST_COL2 = this.dataSql.data[0].Fecha_Mov;
            DESCRIPCION_MOV = this.dataSql.data[0].CveCheque;
            if (TipoSat == '99' || TipoSat == null) {
              let CarPagos = await this.paymentType(L_LOTE, references);
              let CarPagosData: any = CarPagos;
              V_ValTPago = CarPagosData.data[0].vres;
            } else {
              V_ValTPago = TipoSat;
            }
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
                let bancDesc = await this.obtenCodDescPago(
                  LST_2COL1,
                  17,
                  false
                );
                let bancData: any = bancDesc;
                CODIGO_BANCO = bancData.data[0].codigo;
                console.log(bancData.data[0]);
                L_DESCPAGO = bancData.data[0].descripcion;
              } else {
                LST_2COL1 = 'BANAMEX PS';
                let bancDesc1 = await this.obtenCodDescPago(
                  LST_2COL1,
                  17,
                  false
                );
                let bancData1: any = bancDesc1;
                CODIGO_BANCO = bancData1.data[0];
                console.log(bancData1.data[0]);
                L_DESCPAGO = bancData1.data[0];
                console.log(bancDesc1);
              }
            } else if (LST_2COL1.indexOf('BANCO SANT') !== -1) {
              V_FECHA = 2;
              LST_2COL1 = 'SANTAND PS';
              let DESCRIPCION_MOV_TRIM = DESCRIPCION_MOV.trim();
              const auxsan = DESCRIPCION_MOV_TRIM;
              let bancDesc2 = await this.obtenCodDescPago(auxsan, 0, true);
              let bancData2: any = bancDesc2;
              CODIGO_BANCO = bancData2.data[0].codigo;
              console.log(bancData2.data[0]);
              L_DESCPAGO = DESCRIPCION_MOV;
            } else if (LST_2COL1.indexOf('HSBC') !== -1) {
              V_FECHA = 3;
              LST_2COL1 = 'HSBC PS';
              let bancDesc3 = await this.obtenCodDescPago(
                LST_2COL1,
                100,
                false
              );
              let bancData3: any = bancDesc3;
              CODIGO_BANCO = bancData3.data[0].codigo;
              console.log(bancData3.data[0]);
              L_DESCPAGO = bancData3.data[0].descripcion;
            } else if (LST_2COL1.indexOf('BANORTE') !== -1) {
              V_FECHA = 4;
              LST_2COL1 = 'BANORTE PS';
              let bancDesc4 = await this.obtenCodDescPago(LST_2COL1, 3, false);
              let bancData4: any = bancDesc4;
              CODIGO_BANCO = bancData4.data[0].codigo;
              console.log(bancData4.data[0]);
              L_DESCPAGO = bancData4.data[0].descripcion;
            } else if (LST_2COL1.indexOf('SCOTIABANK') !== -1) {
              V_FECHA = 5;
              LST_2COL1 = 'SCOTIA PS';
              let bancDesc5 = await this.obtenCodDescPago(LST_2COL1, 10, false);
              let bancData5: any = bancDesc5;
              CODIGO_BANCO = bancData5.data[0].codigo;
              console.log(bancData5.data[0]);
              L_DESCPAGO = bancData5.data[0].descripcion;
            } else if (LST_2COL1.indexOf('BBVA BA') !== -1) {
              V_FECHA = 5;
              LST_2COL1 = 'BANCOM PS';
              let bancDesc6 = await this.obtenCodDescPago(LST_2COL1, 10, false);
              let bancData6: any = bancDesc6;
              CODIGO_BANCO = bancData6.data[0].codigo;
              console.log(bancData6.data[0]);
              L_DESCPAGO = bancData6.data[0].descripcion;
            } else {
              V_FECHA = 0;
            }
            let sucursal = await this.obtenSucursal(LST_2COL1);
            let sucursalData: any = sucursal;
            console.log(sucursal);
            SUCURSAL_B = sucursalData.data[0].sucursal;
            let existe = await this.consultaExiste(
              LST_COL2,
              V_FECHA,
              references
            );
            let existeData: any = existe;
            console.log(existeData);
            EXISTE = existeData.data[0].count;

            let ValidoTexto: string = '';
            if (AUX_VAL == 'S') ValidoTexto = 'Si';
            else if (AUX_VAL == 'R') ValidoTexto = 'Rechazado';
            else if (AUX_VAL == 'N') ValidoTexto = 'No Invalido';
            else if (AUX_VAL == 'A') ValidoTexto = 'Aplicado';
            else if (AUX_VAL == 'B') ValidoTexto = 'Pago de Bases';
            else if (AUX_VAL == 'D') ValidoTexto = 'Devuelto';
            else if (AUX_VAL == 'C') ValidoTexto = 'Contabilizado';
            else if (AUX_VAL == 'P') ValidoTexto = 'Penalizado';
            else if (AUX_VAL == 'Z') ValidoTexto = 'Devuelto al Cliente';

            if (EXISTE == 0) {
              Contador = Contador + 1;
              let seqComer = await this.secuenciaPag();
              let dataSeqComer: any = seqComer;
              secuencia = Number(dataSeqComer.data[0].nextval);
              const data: any = {
                //NoMovimiento: dtSQL.Rows[0.ItemArray[5.ToString(),  numMov
                NoMovimiento: this.dataSql.data[0].numMov,
                FechaMov: LST_COL2,
                Movimiento: L_DESCPAGO,
                Cuenta: V_CTA_BANCARIA,
                Referencia: references,
                ReferenciaOrdenIngreso: '',
                Banco: LST_2COL1,
                Sucursal: '',
                //Monto: Convert.ToDecimal(dtSQL.Rows[0.ItemArray[2.ToString()),  parseFloat(ImporteDep)
                Monto: parseFloat(this.dataSql.data[0].ImporteDep),
                Resultado: AUX_RESULTADO,
                Valido: AUX_VAL,
                ValidoText: ValidoTexto,
                idPago: secuencia,
                LotePublico: L_PUBLICO.toString(),
                //Evento: dtOracle.Rows[i.ItemArray[1.ToString(),
                Evento: this.paymentData.data[i].eventId,
                OrdenIngreso: '',
                Fecha: '',
                DescripcionSAT: '',
                Tipo: LST_TIPO,
                DescPago: L_DESCPAGO,
                Contador: Contador,
                V_Fecha: V_FECHA,
                Codigo_Banco: CODIGO_BANCO,
                Id_Lote: L_LOTE,
                Id_Tipo_SAT: V_ValTPago,
              };
              this.dataFormat.push(data);
            }
          }
          console.log(this.dataFormat);
          this.totalrecords = Contador;
          this.params1
            .pipe(takeUntil(this.$unSubscribe))
            .subscribe(() => this.getDataAll());
        } else {
          this.loading = false;
          this.alert('warning', '¡No se encontraron registros del evento!', ``);
        }
      } else {
        this.loading = false;
        this.alert('warning', '¡El evento no se encuentra en una Fase!', ``);
      }
    } else {
      this.alert(
        'error',
        '¡Error Se debe de ingresar un Número de evento!',
        ``
      );
    }
  }

  getDataAll() {
    console.log(this.dataFormat);
    if (this.dataFormat) {
      this.data1.load(this.dataFormat);
      this.data1.refresh();
      this.totalItems1 = this.dataFormat.length;
      this.loading = false;
    }
  }

  async phase() {
    return new Promise((resolve, reject) => {
      let body = {
        pEventNumber: this.form.get('event').value, // 23667
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

  async loadSqlPayments(params: ListParams) {
    //Servicio de Obten_Proc_Nuevo_Carga_Pagos_SQL
    return new Promise((resolve, reject) => {
      this.interfaceesirsaeService.loadPayments(params).subscribe({
        next: resp => {
          resolve(resp);
        },
        error: err => {
          resolve(null);
        },
      });
    });
  }

  async paymentType(lotId: number, ref: string) {
    //Servicio de ObtenTipoPago
    return new Promise((resolve, reject) => {
      let body = {
        idLot: lotId,
        reference: ref,
      };
      this.fIndicaService.getMethoPagof(body).subscribe({
        next: resp => {
          resolve(resp);
        },
        error: err => {
          resolve(null);
        },
      });
    });
  }

  async obtenCodDescPago(cveBanc: string, cod: number, min: boolean) {
    //Revisar con back
    return new Promise((resolve, reject) => {
      let body = {
        cveBanco: cveBanc,
        codigo: cod,
        min: min,
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

  async obtenSucursal(lst_2col1: string) {
    return new Promise((resolve, reject) => {
      let body = {
        cveBanco: lst_2col1,
      };
      this.accountMovementService.getSucursal(body).subscribe({
        next: resp => {
          resolve(resp);
        },
        error: err => {
          resolve(null);
        },
      });
    });
  }

  async consultaExiste(fecMov: string, vFec: number, ref: string) {
    //Consultar a back
    return new Promise((resolve, reject) => {
      let body = {
        vmovimiento: this.dataSql.data[0].numMov,
        FecMovimiento: fecMov,
        vfecha: vFec,
        Referencia: ref,
      };
      this.accountMovementService.getExiste(body).subscribe({
        next: resp => {
          resolve(resp);
        },
        error: err => {
          resolve(null);
        },
      });
    });
  }

  async secuenciaPag() {
    return new Promise((resolve, reject) => {
      let body = {};
      this.accountMovementService.getSeqComerPago(body).subscribe({
        next: resp => {
          resolve(resp);
        },
        error: err => {
          resolve(null);
        },
      });
    });
  }

  searchRef() {}

  changeevent() {}

  relatepagosport() {}

  relatePaymentsSIRSAE() {}

  openForm(paymentLoad?: any) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      paymentLoad,
      callback: (next: boolean) => {
        if (next)
          this.params1
            .pipe(takeUntil(this.$unSubscribe))
            .subscribe(() => this.getDataAll());
      },
    };
    this.modalService.show(PayloadFormComponent, modalConfig);
  }
}
