import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { format } from 'date-fns';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IGoodDonation } from 'src/app/core/models/ms-donation/donation.model';
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

  stagecreated: any = 2;
  areas$ = new DefaultSelect<any>();
  //indica la delegacion a trabajar
  area_d: any;
  nivelusuario: number = -1;
  delegation1: number = -1;
  delegation2: number = -1;

  //info del evento de donacion
  eventDonacion: IGoodDonation;

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
    console.log('OPERACION::' + this.edit + ' - idActa::' + this.idActa);
    console.log(
      'OPERACION::delegation1::' +
        this.delegation1 +
        ' - delegation2::' +
        this.delegation2 +
        ' - nivelusuario::' +
        this.nivelusuario
    );

    localStorage.setItem('area', this.authService.decodeToken().siglasnivel3);
    console.log('Folio:' + this.foolio + ' - area_d::' + this.area_d);

    this.delegation = Number(localStorage.getItem('area'));
    console.log('this.delegation::' + this.delegation);

    for (let i = 1900; i <= this.currentYear; i++) {
      this.years.push(i);
    }
    this.actaForm();
  }

  changeFn(event) {
    console.log('Folio selected::' + event);
    this.generarClave();
  }
  async actaForm() {
    //await this.generaConsec(this.area_d);
    this.actaRecepttionForm = this.fb.group({
      acta: ['CPD', Validators.required],
      consec: [this.foolio],
      anio: [this.currentYear],
      captureDate: [null],
      delegation: [localStorage.getItem('area'), Validators.required],
      claveacta: [null],
    });
    if (!this.edit) {
      this.actaRecepttionForm.patchValue({
        consec: this.foolio,
      });
      this.actaRecepttionForm.patchValue({
        captureDate: await this.getDate(),
      });
    } else {
      this.getComerDonation(this.idActa);
    }
    if (!this.edit) {
      //this.generaConsec(this.area_d);
      this.generaConsecDona();
    }
  }

  getComerDonation(idActa: number) {
    this.donationService.getByIdEvent(idActa).subscribe({
      next: (data: any) => {
        console.log('0.data:getComerDonation::::' + data);
        this.eventDonacion = data;

        console.log(
          '1.data:getComerDonation::' + JSON.stringify(this.eventDonacion)
        );
        const dateCapture =
          this.eventDonacion.captureDate != null
            ? new Date(this.eventDonacion.captureDate)
            : null;
        const formattedfecCapture =
          dateCapture != null ? this.formatDate(dateCapture) : null;

        const ultimosCincoDigitos = this.eventDonacion.cveAct.slice(-5);
        var pos = this.eventDonacion.cveAct.lastIndexOf('/');
        var anio = parseInt(this.eventDonacion.cveAct.substring(pos - 4, pos));
        var folio = this.eventDonacion.cveAct.substring(pos + 1);
        var pos1 = this.eventDonacion.cveAct.indexOf('/');
        var area = this.eventDonacion.cveAct.substring(pos1 + 1, pos - 5);
        console.log(
          'datos acta:::anio:: ' +
            anio +
            ' ::folio:: ' +
            folio +
            '::area:: ' +
            area
        );
        this.foolio = Number(folio != null ? folio : 0);
        this.actaRecepttionForm.patchValue({
          acta: 'CPD',
        });
        this.actaRecepttionForm.patchValue({
          consec:
            this.eventDonacion.folioUniversal == null
              ? folio
              : data.folioUniversal,
        });
        this.actaRecepttionForm.patchValue({
          anio: anio,
        });
        this.actaRecepttionForm.patchValue({
          claveacta: this.eventDonacion.cveAct,
        });
        this.actaRecepttionForm.patchValue({
          captureDate: formattedfecCapture,
        });
        this.actaRecepttionForm.patchValue({
          delegation: area,
        });
      },
      error: () => {
        console.error('error');
      },
    });
  }

  formatDate(date: Date): string {
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear().toString();
    return `${day}/${month}/${year}`;
  }

  async delegationWhere() {
    return new Promise((resolve, reject) => {
      if (this.delegation != null) {
        this.parametersService
          .getPhaseEdo(`date=${format(new Date(), 'yyyy-MM-dd')}`)
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe(
            (res: any) => {
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

  selectedArea(event: any) {
    console.log('Area selected::' + event);
    this.generarClave();
  }
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

    localStorage.setItem('area', administra);
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

  async generaConsec_(area_d: number) {
    this.procedureManagementService
      //.getFolioMax(Number(localStorage.getItem('area')))
      .getFolioMax(
        area_d == null ? this.authService.decodeToken().department : area_d
      )
      .subscribe({
        next: (data: any) => {
          console.log('generaConsec:: DATA', data);
          this.foolio = data.folioMax;
          this.generarClave();
        },
        error: error => {
          this.foolio = 0;
        },
      });
  }

  async generaConsecDona(area_d?: number) {
    const administra = this.actaRecepttionForm.value.delegation;
    const consec = this.foolio;
    const anio = this.actaRecepttionForm.value.anio;

    let body = {
      delegationNumber2: this.delegation2,
      toolbarDelegationNumber: (this.delegation1==null)?this.delegation2:this.delegation1,
      type: 'CPD',
      userLevel: this.nivelusuario,
      year: anio == null ? this.currentYear : anio,
    };
    console.log('generaConsecDona::' + JSON.stringify(body));
    this.donationService.getConsecDonation(body).subscribe({
      next: (data: any) => {
        console.log('generaConsec:: DATA', data);
        this.foolio = data.consec;
        this.generarClave();
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
      noDelegation1: (this.delegation1==null)?this.delegation2:this.delegation1,
      noDelegation2: this.delegation2,
      identifier: null,
      label: null,
      folioUniversal: this.foolio,
      closeDate: null,
    };
    localStorage.setItem('estatusAct', obj.estatusAct);
    this.donationService.createD(obj).subscribe({
      next: (data: any) => {
        //console.log('DATA', data);
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
    this.edit ? this.updateActa() : this.agregarActa();
  }
  updateRegister: any;

  async updateActa() {
    const acta = this.actaRecepttionForm.value.acta;
    const administra = this.actaRecepttionForm.value.delegation;
    const consec = this.foolio;
    const anio = this.actaRecepttionForm.value.anio;
    const fechacaptura = this.actaRecepttionForm.value.captureDate;
    //const claveacta = this.actaRecepttionForm.value.captureDate;
    let faltante = '';
    console.log('ACTA:::' + acta);
    if (acta == null || acta == '') {
      faltante = ' acta,';
    }
    if (administra == null || administra == '') {
      faltante = faltante + ' área,';
    }
    if (consec == null || consec == 0) {
      faltante = faltante + ' folio,';
    }
    if (anio == null || anio == '') {
      faltante = faltante + ' anio,';
    }
    if (faltante != '') {
      faltante = faltante.substring(0, faltante.length - 1);
      this.alert('warning', 'Falta ingresar informacion: ' + faltante, '');
      return;
    }

    localStorage.setItem('area', administra);
    localStorage.setItem('anio', anio);

    this.cveActa = `${acta}/${administra}/${anio}/${this.foolio}`;
    console.log('cveActa -->', this.cveActa);
    localStorage.setItem('cveAc', this.cveActa);

    if (this.eventDonacion != null) {
      if (this.eventDonacion.estatusAct == 'CERRADA') {
        this.alert('warning', 'el evento ya se encuentra cerrado', '');
        return;
      }

      this.alertQuestion(
        'question',
        '¿Seguro que desea actualizar el evento?',
        ''
      ).then(async question => {
        if (question.isConfirmed) {
          let obj: any = {
            actId: this.idActa,
            cveAct: this.cveActa,
            elaborationDate: this.eventDonacion.elaborationDate,
            estatusAct: this.eventDonacion.estatusAct,
            elaborated: this.eventDonacion.elaborated,
            witness1: this.eventDonacion.witness1,
            witness2: this.eventDonacion.witness2,
            actType: this.eventDonacion.actType,
            observations: this.eventDonacion.observations,
            registreNumber: null,
            noDelegation1: this.eventDonacion.noDelegation1,
            fileId: Number(
              this.eventDonacion.fileId == null ? 0 : this.eventDonacion.fileId
            ),
            noDelegation2: this.eventDonacion.noDelegation2,
            identifier: this.eventDonacion.identifier,
            folioUniversal: this.eventDonacion.folioUniversal,
            closeDate: this.eventDonacion.closeDate,
          };
          console.log(obj);
          this.donationService.putEvent(obj, this.idActa).subscribe({
            next: async data => {
              this.loading = false;
              console.log('updateacta::' + JSON.stringify(data));
              this.newRegister = data;
              this.idActa = data.id;
              this.alert(
                'success',
                'El Evento se ha actualizado correctamente',
                ''
              );
              this.handleSuccess();
            },
            error: error => {
              this.alert(
                'error',
                'Ocurrió un error al actualizar el evento',
                ''
              );
            },
          });
        }
      });
    }
  }

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

  //Obtener area
  async readArea(lparams: FilterParams) {
    const params = new FilterParams();
    this.stagecreated = await this.delegationWhere();
    params.page = lparams.page;
    params.limit = lparams.limit;

    if (lparams?.search.length > 0) {
      if (!isNaN(parseInt(lparams?.search))) {
        console.log('SI');

        params.addFilter('numberDelegation2', lparams.search, SearchFilter.EQ);
      } else {
        params.addFilter('delegation', lparams.search, SearchFilter.ILIKE);
        /*
        params.addFilter(
          'numberDelegation2',
          this.area_d == null
            ? this.authService.decodeToken().department
            : this.area_d
        );*/
      }
    } else {
      params.addFilter(
        'numberDelegation2',
        this.area_d == null
          ? this.authService.decodeToken().department
          : this.area_d
      );
    }
    console.log(
      'this.stagecreated::' +
        JSON.stringify(this.stagecreated) +
        ' - this.area_d::' +
        this.area_d
    );
    params.addFilter('stageedo', this.stagecreated, SearchFilter.EQ);
    params.sortBy = 'numberDelegation2:ASC';

    this.rNomenclaService.getAll(params.getParams()).subscribe({
      next: (data: any) => {
        console.log('readArea', data);
        let result = data.data.map(async (item: any) => {
          item['cveAdmin'] = item.numberDelegation2 + ' - ' + item.delegation;
        });

        Promise.all(result).then(resp => {
          this.areas$ = new DefaultSelect(data.data, data.count);
        });
      },
      error: error => {
        this.areas$ = new DefaultSelect([], 0);
      },
    });
  }
}
