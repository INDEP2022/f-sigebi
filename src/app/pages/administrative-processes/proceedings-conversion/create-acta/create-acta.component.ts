import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { HistoricalService } from 'src/app/core/services/ms-historical/historical.service';
import { ParametersService } from 'src/app/core/services/ms-parametergood/parameters.service';
import { RNomenclaService } from 'src/app/core/services/ms-parametergood/r-nomencla.service';
import { ProceedingsDeliveryReceptionService } from 'src/app/core/services/ms-proceedings/proceedings-delivery-reception';
import { BasePage } from 'src/app/core/shared/base-page';
import { AbandonmentsDeclarationTradesService } from 'src/app/pages/juridical-processes/abandonments-declaration-trades/service/abandonments-declaration-trades.service';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-create-acta',
  templateUrl: './create-acta.component.html',
  styles: [
    `
      .bg-gray {
        background-color: #eee !important;
      }
    `,
  ],
})
export class CreateActaComponent extends BasePage implements OnInit {
  actaRecepttionForm: FormGroup;
  fileNumber: any;
  delegationToolbar: any;
  witnessOic: any;
  @Output() onSave = new EventEmitter<any>();
  arrayDele = new DefaultSelect<any>();
  dele = new DefaultSelect<any>();
  trans = new DefaultSelect<any>();
  expedient: any;
  testigoTree: any;
  responsable: any;
  testigoTwo: any;
  years: number[] = [];
  currentYear: number = new Date().getFullYear();
  months = [
    { value: 1, label: '01' },
    { value: 2, label: '02' },
    { value: 3, label: '03' },
    { value: 4, label: '04' },
    { value: 5, label: '05' },
    { value: 6, label: '06' },
    { value: 7, label: '07' },
    { value: 8, label: '08' },
    { value: 9, label: '09' },
    { value: 10, label: '10' },
    { value: 11, label: '11' },
    { value: 12, label: '12' },
  ];
  disabledSend: boolean = false;
  delegation: any = null;
  subdelegation: any = null;
  areaDict: any = null;
  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private proceedingsDeliveryReceptionService: ProceedingsDeliveryReceptionService,
    private authService: AuthService,
    private historicalService: HistoricalService,
    private rNomenclaService: RNomenclaService,
    private transferenteService: TransferenteService,
    private parametersService: ParametersService,
    private abandonmentsService: AbandonmentsDeclarationTradesService
  ) {
    super();
  }

  async ngOnInit() {
    for (let i = 1900; i <= this.currentYear; i++) {
      this.years.push(i);
    }

    await this.actaForm();
    console.log(this.expedient);
    // OBTENEMOS DELEGACIÓN DEL USUARIO //
    const paramsSender = new ListParams();
    paramsSender.text = this.authService.decodeToken().preferred_username;
    await this.get___Senders(paramsSender);
  }

  async actaForm() {
    this.actaRecepttionForm = this.fb.group({
      acta: [null, Validators.required],
      type: [null, Validators.required],
      claveTrans: [null, Validators.required],
      administra: [null, Validators.required],
      cveReceived: [null, Validators.required],
      consec: [null, Validators.required],
      // ejecuta: [null],
      anio: [null, [Validators.required]],
      mes: [null, [Validators.required]],
      cveActa: [null],
      direccion: [null],
      observaciones: [null],
      testigoOIC: [null],
      testigoTwo: [null],
      testigoTree: [null],
      respConv: [null],
      parrafo1: [null],
      parrafo2: [null],
      parrafo3: [null],
      elaboradate: [null, Validators.required],
      // witness1: [null],
      // witness2: [null],
    });

    this.actaRecepttionForm.patchValue({
      elaboradate: await this.getDate(),
    });
  }

  async getDate() {
    // const formattedDate = moment(date).format('DD-MM-YYYY');

    const fechaEscritura: any = new Date();
    fechaEscritura.setUTCDate(fechaEscritura.getUTCDate());
    const _fechaEscritura: any = new Date(fechaEscritura.toISOString());
    return _fechaEscritura;
    // { authorizeDate: formattedDate }
    // { emitEvent: false }
  }

  // REG_DEL_ADMIN
  globalGstRecAdm: any = null;
  async consulREG_DEL_ADMIN(lparams: ListParams) {
    // let obj = {
    //   gst_todo: 'TODO',
    //   gnu_delegacion: 0,
    //   gst_rec_adm: 'FILTRAR',
    // };
    console.log('WILMER');
    const params = new FilterParams();

    params.page = lparams.page;
    params.limit = lparams.limit;

    let obj = {
      globalGstAll: 'NADA',
      globalGnuDelegation: this.delegation,
      globalGstRecAdm: this.globalGstRecAdm,
    };

    if (lparams.text)
      if (!isNaN(parseInt(lparams?.text))) {
        params.addFilter('delegationNumber2', this.delegation, SearchFilter.EQ);
      } else {
        params.addFilter('delegation', lparams.text, SearchFilter.ILIKE);
      }

    this.parametersService
      .GetDelegationGlobal(obj, params.getParams())
      .subscribe({
        next: (data: any) => {
          console.log('REG_DEL_ADMIN', data);
          let result = data.data.map(async (item: any) => {
            item['cveAdmin'] = item.delegationNumber2 + ' - ' + item.delegation;
          });
          Promise.all(result).then(resp => {
            this.arrayDele = new DefaultSelect(data.data, data.count);
          });
        },
        error: error => {
          this.arrayDele = new DefaultSelect();
        },
      });
  }

  async validacionFirst() {
    const params = new FilterParams();
    params.addFilter('numberDelegation2', this.delegation, SearchFilter.EQ);

    this.rNomenclaService.getAll(params.getParams()).subscribe({
      next: async (data: any) => {
        console.log('datarNomen', data);
        if (data.count > 1) {
          this.globalGstRecAdm = 'FILTRAR';
        } else {
          this.globalGstRecAdm = this.delegation;
        }
        await this.consulREG_DEL_ADMIN(new ListParams());
      },
      error: async error => {
        this.globalGstRecAdm = 'NADA';
        await this.consulREG_DEL_ADMIN(new ListParams());
      },
    });
  }

  // REG_DEL_DESTR
  consulREG_DEL_DESTR(lparams: ListParams) {
    const params = new FilterParams();

    params.page = lparams.page;
    params.limit = lparams.limit;

    if (lparams?.text.length > 0)
      if (!isNaN(parseInt(lparams?.text))) {
        console.log('SI');

        params.addFilter('numberDelegation2', lparams.text, SearchFilter.EQ);
      } else {
        params.addFilter('delegation', lparams.text, SearchFilter.ILIKE);
      }

    params.sortBy = 'numberDelegation2:ASC';
    this.rNomenclaService.getAll(params.getParams()).subscribe({
      next: (data: any) => {
        console.log('REG_DEL_DESTR', data);
        let result = data.data.map(async (item: any) => {
          item['cveReceived'] =
            item.numberDelegation2 + ' - ' + item.delegation;
        });

        Promise.all(result).then(resp => {
          this.dele = new DefaultSelect(data.data, data.count);
        });
      },
      error: error => {
        this.dele = new DefaultSelect([], 0);
      },
    });
  }

  consultREG_TRANSFERENTES(lparams: ListParams) {
    let obj = {
      transfereeNumber: this.expedient.transferNumber,
      expedientType: this.expedient.expedientType,
    };

    const params = new FilterParams();

    params.page = lparams.page;
    params.limit = lparams.limit;

    if (lparams.text)
      if (!isNaN(parseInt(lparams.text))) {
        console.log('SI');

        params.addFilter3('filter.TransfereeNumber', lparams.text);
      } else {
        params.addFilter3('filter.password', lparams.text);
      }

    this.transferenteService
      .appsGetPassword(obj, params.getParams())
      .subscribe({
        next: (data: any) => {
          console.log('Transferentes', data);
          let result = data.data.map(async (item: any) => {
            item['transfer'] =
              item.password + ' - ' + item.number + ' - ' + item.name;
          });

          Promise.all(result).then(resp => {
            this.trans = new DefaultSelect(data.data, data.count);
          });
          console.log('data222', data);
        },
        error: error => {
          this.trans = new DefaultSelect([], 0);
        },
      });
  }

  agregarActa() {
    const acta = this.actaRecepttionForm.value.acta;
    const type = this.actaRecepttionForm.value.type;
    const claveTrans = this.actaRecepttionForm.value.claveTrans;
    const cveReceived = this.actaRecepttionForm.value.cveReceived;
    const administra = this.actaRecepttionForm.value.administra;
    const consec = this.actaRecepttionForm.value.consec;

    const anio = this.actaRecepttionForm.value.anio;
    const mes = this.actaRecepttionForm.value.mes;

    const miCadenaAnio = anio + '';
    const miSubcadena = miCadenaAnio.slice(2, 5);

    let consec_ = consec.toString().padStart(4, '0');
    if (consec_.length > 4) {
      consec_ = consec_.toString().slice(0, 4);
    }

    const cveActa = `${acta}/${type}/${claveTrans}/${administra}/${cveReceived}/${consec_}/${miSubcadena
      .toString()
      .padStart(2, '0')}/${mes.value.toString().padStart(2, '0')}`;
    console.log(cveActa);

    if (cveActa) {
      const params = new ListParams();
      params['filter.keysProceedings'] = `$eq:${cveActa}`;
      this.proceedingsDeliveryReceptionService.getByFilter_(params).subscribe({
        next: (data: any) => {
          if (data.data.length == 1) {
            this.alert('warning', 'Esa Acta ya se tiene Registrada', '');
          } else {
            this.alert(
              'warning',
              'Actas Duplicadas en ACTAS_ENTREGA_RECEPCION',
              ''
            );
          }
          return;
        },
        error: error => {
          this.guardarRegistro(cveActa);
        },
      });
    }
  }
  newRegister: any;
  guardarRegistro(cveActa: any) {
    let obj: any = {
      keysProceedings: cveActa,
      elaborationDate: this.actaRecepttionForm.value.elaboradate,
      datePhysicalReception: this.actaRecepttionForm.value.elaboradate,
      address: this.actaRecepttionForm.value.direccion,
      statusProceedings: 'ABIERTA',
      elaborate: this.authService.decodeToken().preferred_username,
      numFile: this.fileNumber,
      witness1: this.testigoTwo,
      witness2: this.testigoTree,
      typeProceedings: 'CONVERSION',
      dateElaborationReceipt: null,
      dateDeliveryGood: null,
      responsible: this.responsable,
      destructionMethod: null,
      observations: null,
      approvedXAdmon: null,
      approvalDateXAdmon: null,
      approvalUserXAdmon: null,
      numRegister: null,
      captureDate: new Date(),
      numDelegation1: this.delegationToolbar,
      numDelegation2: null,
      identifier: null,
      label: null,
      universalFolio: null,
      numeraryFolio: null,
      numTransfer: null,
      idTypeProceedings: null,
      receiptKey: null,
      comptrollerWitness: this.witnessOic,
      numRequest: null,
      closeDate: null,
      maxDate: null,
      indFulfilled: null,
      dateCaptureHc: null,
      dateCloseHc: null,
      dateMaxHc: null,
      receiveBy: null,
      affair: null,
      numDelegation_1: null,
      numDelegation_2: null,
      file: this.fileNumber,
    };
    this.proceedingsDeliveryReceptionService
      .createDeliveryReception(obj)
      .subscribe({
        next: (data: any) => {
          console.log('DATA', data);
          this.newRegister = data;
          this.alert('success', 'El Acta se ha Creado Correctamente', '');
          this.handleSuccess();
        },
        error: error => {
          this.alert('error', 'Ha Ocurrido al Intentar Crear un Acta', '');
        },
      });
  }

  return() {
    this.modalRef.hide();
  }

  handleSuccess(): void {
    this.onSave.emit(this.newRegister);
    this.modalRef.hide();
  }

  async get___Senders(lparams: ListParams) {
    const params = new FilterParams();
    params.page = lparams.page;
    params.limit = lparams.limit;
    // params.addFilter('assigned', 'S');
    if (lparams?.text) params.addFilter('user', lparams.text, SearchFilter.EQ);
    this.hideError();
    this.abandonmentsService.getUsers(params.getParams()).subscribe({
      next: async (data: any) => {
        console.log('DATA DDELE', data);
        this.delegation = data.data[0].delegationNumber;
        this.subdelegation = data.data[0].subdelegationNumber;
        this.areaDict = data.data[0].departamentNumber;
        await this.validacionFirst();
      },
      error: async () => {
        await this.validacionFirst();
      },
    });
  }
}
