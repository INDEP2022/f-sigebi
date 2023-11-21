import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IProceedingDeliveryReception } from 'src/app/core/models/ms-proceedings/proceeding-delivery-reception';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { DonationService } from 'src/app/core/services/ms-donationgood/donation.service';
import { HistoricalService } from 'src/app/core/services/ms-historical/historical.service';
import { RNomenclaService } from 'src/app/core/services/ms-parametergood/r-nomencla.service';
import { ProceedingsDeliveryReceptionService } from 'src/app/core/services/ms-proceedings/proceedings-delivery-reception';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { ProcedureManagementService } from 'src/app/core/services/proceduremanagement/proceduremanagement.service';
import { BasePage } from 'src/app/core/shared/base-page';
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
  title: string = 'Captura';
  detalleActa: IProceedingDeliveryReception;
  witnessOic: any;
  witnessTes: any;
  witnessAdm: any;
  cve_recibe: any;
  cveActa: string = '';
  idActa: number = 0;
  @Output() onSave = new EventEmitter<any>();
  arrayDele = new DefaultSelect<any>();
  dele = new DefaultSelect<any>();
  trans = new DefaultSelect<any>();
  expedient: any;
  edit: boolean = false;
  testigoTree: any;
  responsable: any;
  testigoOne: any;
  years: number[] = [];
  foolio: number;
  mes: any;
  currentYear: number = new Date().getFullYear();

  disabledSend: boolean = false;
  get captureDate() {
    return this.actaRecepttionForm.get('captureDate');
  }
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
    private procedureManagementService: ProcedureManagementService
  ) {
    super();
  }

  ngOnInit(): void {
    this.actaForm();
    this.consulREG_DEL_ADMIN();
    for (let i = 1900; i <= this.currentYear; i++) {
      this.years.push(i);
    }
  }

  async actaForm() {
    this.actaRecepttionForm = this.fb.group({
      acta: [null, Validators.required],
      type: [null],
      administra: [null, Validators.required],
      consec: [null],
      observaciones: [null],
      testigoOne: [null, [Validators.required]],
      testigoOIC: [null, [Validators.required]],
      captureDate: [null],
    });

    this.actaRecepttionForm.patchValue({
      captureDate: await this.getDate(),
    });
  }
  async getDate() {
    const fechaEscritura: any = new Date();
    fechaEscritura.setUTCDate(fechaEscritura.getUTCDate());
    const _fechaEscritura: any = new Date(fechaEscritura.toISOString());
    return _fechaEscritura;
  }

  // REG_DEL_ADMIN
  consulREG_DEL_ADMIN() {
    let obj = {
      gst_todo: 'TODO',
      gnu_delegacion: 12,
      gst_rec_adm: 'FILTRAR',
    };
    this.historicalService.getHistoricalConsultDelegation(obj).subscribe({
      next: data => {
        this.arrayDele = new DefaultSelect(data.delegacion, 0);
        console.log('data', this.arrayDele);
      },
      error: error => {
        this.arrayDele = new DefaultSelect();
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
  }

  agregarActa() {
    const acta = this.actaRecepttionForm.value.acta;
    const type = this.actaRecepttionForm.value.type;
    const obser = this.actaRecepttionForm.value.observaciones;
    const administra = this.actaRecepttionForm.value.administra;
    const consec = this.actaRecepttionForm.value.consec;
    this.witnessOic = this.actaRecepttionForm.value.testigoOIC;
    this.witnessTes = this.actaRecepttionForm.value.testigoOne;
    const anio = this.actaRecepttionForm.value.captureDate;
    this.generaConsec();
    const miCadenaAnio = anio.slice(0, 4);
    // localStorage.setItem('actaId', acta);
    localStorage.setItem('anio', anio);
    console.log('AÑO', anio);
    // let consec_ = consec.toString().padStart(4, '0');
    // this.foolio = consec;
    console.log('numeraryFolio - >', consec);
    this.cveActa = `${acta}/${administra}/${miCadenaAnio}/${type}${this.foolio}`;
    console.log('cveActa -->', this.cveActa);
    localStorage.setItem('cveAc', this.cveActa);
    if (this.cveActa) {
      const params = new ListParams();
      params['filter.keysProceedings'] = `$eq:${this.cveActa}`;
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
          console.log('DATA', data);
          this.foolio = data;
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
      fileId: this.actaRecepttionForm.value.fileId,
      witness1: this.actaRecepttionForm.value.testigoOne,
      witness2: this.actaRecepttionForm.value.testigoTree,
      actType: 'COMPDON',
      captureDate: new Date(),
      observations: this.actaRecepttionForm.value.observaciones,
      registreNumber: null,
      numDelegation1: localStorage.getItem('area'),
      numDelegation2: null,
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
  delegationToolbar: any = null;
  getDelegation(params: FilterParams) {
    params.addFilter(
      'id',
      this.authService.decodeToken().username,
      SearchFilter.EQ
    );
    return this.usersService.getAllSegUsers(params.getParams()).subscribe({
      next: (value: any) => {
        const data = value.data[0].usuario;
        if (data) this.delegationToolbar = data.delegationNumber;
        localStorage.setItem('area', data.delegationNumber);
        console.log('SI', data.delegationNumber);
      },
      error(err) {
        console.log('NO');
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
