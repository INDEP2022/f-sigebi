import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { format } from 'date-fns';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IProceedingDeliveryReception } from 'src/app/core/models/ms-proceedings/proceeding-delivery-reception';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { DonationService } from 'src/app/core/services/ms-donationgood/donation.service';
import { HistoricalService } from 'src/app/core/services/ms-historical/historical.service';
import { ParametersService } from 'src/app/core/services/ms-parametergood/parameters.service';
import { RNomenclaService } from 'src/app/core/services/ms-parametergood/r-nomencla.service';
import { ProceedingsDeliveryReceptionService } from 'src/app/core/services/ms-proceedings';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { ProcedureManagementService } from 'src/app/core/services/proceduremanagement/proceduremanagement.service';
import { BasePage } from 'src/app/core/shared';
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
  title: string = 'Evento';
  detalleActa: IProceedingDeliveryReception;
  witnessOic: any;
  witnessTes: any;
  witnessAdm: any;
  cve_recibe: any;
  cveActa: string = '';
  idActa: number = 0;
  @Output() onSave = new EventEmitter<any>();
  arrayDele: any[] = [];
  dele = new DefaultSelect<any>();
  trans = new DefaultSelect<any>();
  expedient: any;
  edit: boolean = false;
  testigoTree: any;
  responsable: any;
  testigoOne: any;
  from: string = '';
  years: number[] = [];
  foolio: number;
  mes: any;
  date = new Date();
  currentYear: number = new Date().getFullYear();
  delegation: any = 11;
  subdelegation: any = null;
  areaDict: any = null;
  disabledSend: boolean = false;
  get captureDate() {
    return this.actaRecepttionForm.get('captureDate');
  }

  public delegationLst = new DefaultSelect();

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private proceedingsDeliveryReceptionService: ProceedingsDeliveryReceptionService,
    private authService: AuthService,
    private historicalService: HistoricalService,
    private rNomenclaService: RNomenclaService,
    private transferenteService: TransferenteService,
    private usersService: UsersService,
    private donationService: DonationService,
    private procedureManagementService: ProcedureManagementService,
    private parametersService: ParametersService,
    private abandonmentsService: AbandonmentsDeclarationTradesService,
    private datePipe: DatePipe,
    private delegationService: DelegationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.generaConsec();
    this.actaForm();
    console.log('Folio:' + this.foolio);
    this.delegation = Number(localStorage.getItem('area'));
    console.log('this.delegation::' + this.delegation);
    //this.consulREG_DEL_DESTR(new ListParams());
    //this.consulREG_DEL_ADMIN(new ListParams());
    //chm:
    this.consulREG_DEL_ADMIN1();
    for (let i = 1900; i <= this.currentYear; i++) {
      this.years.push(i);
    }
  }

  async actaForm() {
    this.actaRecepttionForm = this.fb.group({
      acta: ['CPD', Validators.required],
      //type: [null],
      //administra: [null, Validators.required],
      consec: [this.foolio],
      anio: [null],
      /*
      fileId: [null, [Validators.required]],
      observaciones: [null],
      testigoOne: [null, [Validators.required]],
      testigoOIC: [null, [Validators.required]],
      */
      captureDate: [null],
      delegation: [null, Validators.required],
      claveacta: [null, [Validators.required]],
    });
    //this.actaRecepttionForm.get('consec').setValue(this.foolio);
    this.actaRecepttionForm.patchValue({
      consec: this.foolio,
    });
    this.actaRecepttionForm.patchValue({
      captureDate: await this.getDate(),
    });
  }
  async delegationWhere() {
    return new Promise((resolve, reject) => {
      if (this.delegation != null) {
        this.parametersService
          .getPhaseEdo(`date=${format(new Date(), 'yyyy-MM-dd')}`)
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe(
            (res: any) => {
              console.log('REESS', res);
              resolve(res.stagecreated);
            },
            err => {
              resolve(null);
              console.log(err);
            }
          );
      }
    });
  }

  async getDate() {
    const fechaEscritura: any = new Date();
    fechaEscritura.setUTCDate(fechaEscritura.getUTCDate());
    const _fechaEscritura: any = new Date(fechaEscritura.toISOString());
    return _fechaEscritura;
  }
  /*
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
 */
  consulREG_DEL_ADMIN1() {
    let obj = {
      gst_todo: 'TODO',
      gnu_delegacion: this.delegation,
      gst_rec_adm: 'FILTRAR',
    };
    this.historicalService.getHistoricalConsultDelegation(obj).subscribe({
      next: (data: any) => {
        console.log('consulREG_DEL_ADMIN1:: data', data);
        this.arrayDele = data.data;
      },
      error: error => {
        this.arrayDele = [];
      },
    });
  }

  /*CHM
  stagecreated: any = null;
  async get___Senders(lparams: ListParams) {
    const params = new FilterParams();
    params.page = lparams.page;
    params.limit = lparams.limit;
    // params.addFilter('assigned', 'S');
    if (lparams?.text) params.addFilter('user', lparams.text, SearchFilter.EQ);
    // this.hideError();
    this.abandonmentsService.getUsers(params.getParams()).subscribe({
      next: async (data: any) => {
        console.log('DATA DDELE', data);
        this.delegation = data.data[0].delegationNumber;
        this.subdelegation = data.data[0].subdelegationNumber;
        this.areaDict = data.data[0].departamentNumber;
        this.stagecreated = await this.delegationWhere();
        console.log('aaaaaaaaa', this.stagecreated);
        await this.validacionFirst();
        await this.consulREG_DEL_DESTR(new ListParams());
        await this.consulREG_DEL_ADMIN(new ListParams());
      },
      error: async () => {
        await this.consulREG_DEL_DESTR(new ListParams());
        await this.consulREG_DEL_ADMIN(new ListParams());
        await this.validacionFirst();
      },
    });
  }

  globalGstRecAdm: any = null;
  async consulREG_DEL_ADMIN(lparams: ListParams) {
    const params = new FilterParams();
    const area = this.delegation;
    params.page = lparams.page;
    params.limit = lparams.limit;

    let obj = {
      globalGstAll: 'NADA',
      globalGnuDelegation: this.delegation,
      globalGstRecAdm: this.globalGstRecAdm,
    };

    if (lparams.text)
      if (!isNaN(parseInt(lparams?.text))) {
        params.addFilter('delegationNumber2', area, SearchFilter.EQ);
      } else {
        params.addFilter('delegation', lparams.text, SearchFilter.ILIKE);
      }

    params.addFilter('stageEdo', this.stagecreated, SearchFilter.EQ);
    this.parametersService
      .GetDelegationGlobal(obj, params.getParams())
      .subscribe({
        next: (data: any) => {
          console.log('REG_DEL_ADMIN', data);
          let result = data.data.map(async (item: any) => {
            item['cveReceived'] =
              item.delegationNumber2 + ' - ' + item.delegation;
          });
          Promise.all(result).then(resp => {
            this.dele = new DefaultSelect(data.data, data.count);
          });
        },
        error: error => {
          console.log('consulREG_DEL_ADMIN::'+ JSON.stringify(error));
          this.dele = new DefaultSelect();
        },
      });
  }

  REG_DEL_DESTR;
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
  }
*/
  onSelectChange(event: any) {
    console.log(event);
    this.generarClave();
    /*
       const data = this.items.find(
         item => item[this.value] === event[this.value]
       );
   */
  }
  onSelectChangeYear(event: any) {
    console.log(event);
    this.generarClave();
  }

  generarClave() {
    const acta = this.actaRecepttionForm.value.acta;
    //const type = this.actaRecepttionForm.value.type;
    //const obser = this.actaRecepttionForm.value.observaciones;
    const administra = this.actaRecepttionForm.value.delegation;
    //  ? this.actaRecepttionForm.value.administra
    //  : 'COMPDON';
    const consec = this.foolio;
    //this.witnessOic = this.actaRecepttionForm.value.testigoOIC;
    //this.witnessTes = this.actaRecepttionForm.value.testigoOne;
    const anio = this.actaRecepttionForm.value.anio;

    localStorage.setItem('anio', anio);

    this.cveActa = `${acta}/${administra}/${anio}/${this.foolio}`;

    this.actaRecepttionForm.patchValue({
      claveacta: this.cveActa,
    });
  }
  agregarActa() {
    const acta = this.actaRecepttionForm.value.acta;
    //const type = this.actaRecepttionForm.value.type;
    //const obser = this.actaRecepttionForm.value.observaciones;
    const administra = this.actaRecepttionForm.value.delegation;
    //  ? this.actaRecepttionForm.value.administra
    //  : 'COMPDON';
    const consec = this.foolio;
    //this.witnessOic = this.actaRecepttionForm.value.testigoOIC;
    //this.witnessTes = this.actaRecepttionForm.value.testigoOne;
    const anio = this.actaRecepttionForm.value.anio;

    localStorage.setItem('anio', anio);
    console.log('AÑO', anio);

    console.log('numeraryFolio - >', this.foolio);
    this.cveActa = `${acta}/${administra}/${anio}/${this.foolio}`;
    console.log('cveActa -->', this.cveActa);
    localStorage.setItem('cveAc', this.cveActa);
    if (this.cveActa) {
      const params = new ListParams();
      params['filter.keysProceedings'] = `$eq:${this.cveActa}`;
      this.proceedingsDeliveryReceptionService
        .getAllFilterDelRec(params)
        .subscribe({
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
            this.guardarRegistro(this.cveActa);
          },
        });
    }
  }

  generaConsec() {
    this.procedureManagementService
      .getFolioMax(Number(localStorage.getItem('area')))
      .subscribe({
        next: (data: any) => {
          console.log('generaConsec:: DATA', data);
          this.foolio = data.folioMax;
        },
        error: error => {
          this.foolio = 0;
        },
      });
  }

  newRegister: any;
  guardarRegistro(cveActa: any) {
    let obj: any = {
      cveAct: cveActa,
      elaborationDate: new Date(),
      estatusAct: 'ABIERTA',
      elaborated: this.authService.decodeToken().username,
      fileId: 0, //this.actaRecepttionForm.value.fileId,
      witness1: '', //this.actaRecepttionForm.value.testigoOne,
      witness2: '', //this.actaRecepttionForm.value.testigoOIC,
      actType: 'COMPDON',
      captureDate: this.actaRecepttionForm.value.captureDate,
      observations: '', //this.actaRecepttionForm.value.observaciones,
      registreNumber: null,
      noDelegation1: this.authService.decodeToken().department,
      noDelegation2: null,
      identifier: null,
      label: null,
      folioUniversal: this.foolio,
      closeDate: null,
    };
    localStorage.setItem('estatusAct', obj.estatusAct);
    this.donationService.createD(obj).subscribe({
      next: (data: any) => {
        console.log('DATA', data);
        this.newRegister = data;
        this.idActa = data.id;
        this.alert('success', 'El Evento se ha Creado Correctamente', '');
        this.handleSuccess();
      },
      error: error => {
        this.alert(
          'error',
          'Ha Ocurrido un Error al Intentar Crear un Acta',
          ''
        );
      },
    });
  }

  return() {
    this.modalRef.hide();
  }

  handleSuccess(): void {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.alert('success', this.title, `${message} Correctamente`);
    this.onSave.emit(this.newRegister);
    this.modalRef.hide();
  }
  confirm() {
    this.edit ? this.update() : this.agregarActa();
  }
  updateRegister: any;

  update() {
    this.loading = true;
    this.donationService
      .updateDonation(
        this.actaRecepttionForm.value,
        localStorage.getItem('actaId')
      )
      .subscribe({
        next: data => {
          this.updateRegister = data;
          this.idActa = Number(localStorage.getItem('actaId'));
          this.alert(
            'success',
            'El Evento se ha actualizado Correctamente',
            ''
          );
          this.handleSuccess();
        },
        error: error => (this.loading = false),
      });
  }

  getDelegations(params: ListParams) {
    this.delegationService.getAll(params).subscribe(data => {
      this.delegationLst = new DefaultSelect(data.data, data.count);
    });
  }

  // consultREG_TRANSFERENTES(lparams: ListParams) {
  //   console.log('LPARAMS - ', lparams);
  //   let obj = {
  //     transfereeNumber: this.expedient.transferNumber,
  //     expedientType: this.expedient.expedientType,
  //   };

  //   console.log('ObJ --', obj);

  //   const params = new FilterParams();

  //   params.page = lparams.page;
  //   params.limit = lparams.limit;

  //   if (lparams?.text.length > 0)
  //     if (!isNaN(parseInt(lparams?.text))) {
  //       console.log('SI');

  //       params.addFilter3('number', lparams.text);
  //     } else {
  //       params.addFilter3('password', lparams.text);
  //     }

  //   this.transferenteService.appsGetPassword(obj, lparams).subscribe({
  //     next: (data: any) => {
  //       console.log('data', data);
  //       let result = data.data.map(async (item: any) => {
  //         item['transfer'] =
  //           item.password + ' - ' + item.number + ' - ' + item.name;
  //       });

  //       Promise.all(result).then(resp => {
  //         this.trans = new DefaultSelect(data.data, data.count);
  //       });
  //       console.log('data222', data);
  //     },
  //     error: error => {
  //       this.trans = new DefaultSelect([], 0);
  //     },
  //   });
  // }
}
