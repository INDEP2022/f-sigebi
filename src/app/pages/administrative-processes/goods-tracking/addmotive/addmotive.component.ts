import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { DepartamentService } from 'src/app/core/services/catalogs/departament.service';
import { RevisionReasonService } from 'src/app/core/services/catalogs/revision-reason.service';
import { DynamicCatalogsService } from 'src/app/core/services/dynamic-catalogs/dynamiccatalog.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { GoodsReview } from 'src/app/core/services/ms-good/goods-review.service';
import { GoodprocessService } from 'src/app/core/services/ms-goodprocess/ms-goodprocess.service';
import { HistoryGoodService } from 'src/app/core/services/ms-history-good/history-good.service';
import { SecurityService } from 'src/app/core/services/ms-security/security.service';
import { SegAcessXAreasService } from 'src/app/core/services/ms-users/seg-acess-x-areas.service';
import { BasePage } from 'src/app/core/shared';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-addmotive',
  templateUrl: './addmotive.component.html',
  styles: [
    `
      .modal-body {
        padding-top: 0px !important;
      }
    `,
  ],
})
export class AddmotiveComponent extends BasePage implements OnInit {
  title: string = '';
  data1: LocalDataSource = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  filter1 = new BehaviorSubject<FilterParams>(new FilterParams());
  paramsList = new BehaviorSubject<ListParams>(new ListParams());
  noCuenta: any;
  columnFilters: any = [];
  rowData: any;
  form: FormGroup;
  motives = new DefaultSelect<any>();
  maxDate = new Date();
  dateMovem: Date;
  selectedRow: any;
  delegationNumber: any = null; // BLK_CONTROL.DELEGACION
  responsable: any = null; // BLK_CONTROL.RESPONSABLE
  motiveSelect: any = null;
  updateAtt: any;
  label: any;
  label_: any = `Motivos disponibles`;
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private modalService: BsModalService,
    private goodsMotivesrev: GoodsReview,
    private departmentService: DepartamentService,
    private excelService: ExcelService,
    private goodService: GoodService,
    private segAcessXAreasService: SegAcessXAreasService,
    private token: AuthService,
    private goodprocessService: GoodprocessService,
    private readonly historyGoodService: HistoryGoodService,
    private delegationService: DelegationService,
    private dynamicCatalogsService: DynamicCatalogsService,
    private revisionReasonService: RevisionReasonService,
    private router: Router,
    private securityService: SecurityService
  ) {
    super();
  }

  async ngOnInit() {
    this.title = 'Actualizar ' + this.label;
    // this.label_ = `Motivos disponibles`
    this.prepareForm();
    await this.getDataPupInicializaForma();
    await this.getCatMotivosRev(new ListParams());
  }

  prepareForm() {
    this.form = this.fb.group({
      motive: [null, [Validators.required]],
    });
  }

  // PUP_INICIALIZA_FORMA
  async getDataPupInicializaForma() {
    const user = this.token.decodeToken().preferred_username;
    const dataUserToolbar: any = await this.getDataUser(user);
    if (dataUserToolbar != null)
      this.delegationNumber = dataUserToolbar.delegationNumber;

    let obj = {
      otvalor: user,
    };
    const areaCorresp: any = await this.getAreaCorresp(obj);
    if (areaCorresp != null) {
      this.responsable = areaCorresp;
    } else {
      this.alert('info', 'Falta Asignar Área Responsable o Delegación.', '');
    }
  }

  // consulta tabla: SEG_ACCESO_X_AREAS
  async getDataUser(user: any) {
    const params = new ListParams();
    params['filter.user'] = `$eq:${user}`;
    params['filter.assigned'] = `$eq:S`;
    return new Promise((resolve, reject) => {
      this.segAcessXAreasService.getAll(params).subscribe({
        next: (resp: any) => {
          console.log('resp', resp);
          const data = resp.data[0];
          resolve(data);
          // this.loading = false;
        },
        error: error => {
          // this.loading = false;
          resolve(null);
        },
      });
    });
  }

  // consulta tabla: TVALTABLA1 -- Esperando endpoint --
  async getAreaCorresp(data: any) {
    return new Promise((resolve, reject) => {
      this.dynamicCatalogsService.getOtValor(data).subscribe({
        next: (resp: any) => {
          console.log('resp', resp);
          const data = resp.data[0].otvalor;
          resolve(data);
          // this.loading = false;
        },
        error: error => {
          // this.loading = false;
          resolve(null);
        },
      });
    });
  }

  // -------------------------------------------------------------------------------------------------------- //
  motiveSelectFunc(event: any) {
    this.motiveSelect = event;
    console.log(event);
  }

  async getCatMotivosRev(lparams: ListParams) {
    const params = new FilterParams();

    params.page = lparams.page;
    params.limit = lparams.limit;

    params.addFilter('descriptionCause', lparams.text, SearchFilter.ILIKE);
    params.addFilter('initialStatus', this.selectedRow.status, SearchFilter.EQ);
    params.addFilter('goodType', this.selectedRow.goodType, SearchFilter.EQ);

    return new Promise((resolve, reject) => {
      this.revisionReasonService.getAll2(params.getParams()).subscribe({
        next: (response: any) => {
          let result = response.data.map(async (item: any) => {
            item['motivesRev'] =
              item.initialStatus +
              ' - ' +
              item.goodType +
              ' - ' +
              item.descriptionCause;
          });

          Promise.all(result).then((resp: any) => {
            this.motives = new DefaultSelect(response.data, response.count);
            this.loading = false;
          });
        },
        error: error => {
          this.motives = new DefaultSelect();
          this.loading = false;
          resolve(null);
        },
      });
    });
  }

  // --------------------------------------------------------------------------------------------------------------------------- //

  close() {
    this.modalRef.hide();
  }

  async onCellDoubleClick() {
    // this.alert("success", "función de doble click activa", "")
    let V_PANTALLA: any,
      V_RESPONSABLE: any,
      V_PARAMETRO: any,
      V_DESCMOTIVO: any = null;
    let V_EXPEDIENTE: any,
      LV_FEC_INSERT: any = null;
    let LV_ADMINISTRA: any,
      LV_RESPONSABLE: any = null;
    let LV_DESC1: any,
      LV_DESC: any = null;

    const getCatMotivosRev_: any = this.motiveSelect;

    if (getCatMotivosRev_ === null) {
      V_PANTALLA = null;
      V_RESPONSABLE = null;
      this.alert(
        'warning',
        `${this.motiveSelect.description} no es un Motivo Válido`,
        ''
      );
      return;
    } else {
      V_PANTALLA = getCatMotivosRev_.screen;
      V_RESPONSABLE = getCatMotivosRev_.managerArea;
      V_PARAMETRO = getCatMotivosRev_.parameter;
      V_DESCMOTIVO = getCatMotivosRev_.descriptionCause;
    }

    const getGood_: any = await this.getGood(this.selectedRow.goodNumber);
    console.log('getGood_', getGood_);
    if (getGood_ === null) {
      V_EXPEDIENTE = null;
    } else {
      V_EXPEDIENTE = getGood_.fileNumber;
      LV_FEC_INSERT = getGood_.insertRegDate;
    }

    if (V_RESPONSABLE.includes(this.responsable)) {
      V_RESPONSABLE = this.responsable;
    }

    // Esperando endpoints
    // LV_ADMINISTRA:= FA_COORD_ADMIN(: BLK_BIENES_MOTIVOSREV.NO_BIEN, V_EXPEDIENTE, LV_FEC_INSERT);
    // LV_RESPONSABLE:= FA_DEL_RESPONSABLE(: BLK_BIENES_MOTIVOSREV.NO_BIEN);
    let obj = {
      fNoGood: this.selectedRow.goodNumber,
      fNoProceeding: V_EXPEDIENTE,
      fDateRegInsert: LV_FEC_INSERT,
    };
    // ADMINISTRA //
    const getLV_ADMINISTRA: any = await this.getLV_ADMINISTRA(obj);
    if (getLV_ADMINISTRA != null) {
      LV_ADMINISTRA = getLV_ADMINISTRA.fa_coord_admin;
    }
    // RESPONSABLE //
    const getLV_RESPONSABLE_: any = await this.getLV_RESPONSABLE(
      this.selectedRow.goodNumber
    );

    if (getLV_RESPONSABLE_ != null) {
      LV_RESPONSABLE = getLV_RESPONSABLE_.LV_RESPONSABLE;
    }

    // ADMINISTRA //
    const getDelegationDB_1: any = await this.getDelegationDB(LV_ADMINISTRA);
    if (getDelegationDB_1 != null) {
      LV_DESC = getDelegationDB_1.description;
    }
    // RESPONSABLE //
    const getDelegationDB_2: any = await this.getDelegationDB(LV_RESPONSABLE);

    if (getDelegationDB_2 != null) {
      LV_DESC1 = getDelegationDB_2.description;
    }

    if (this.responsable == 'REGIONALES') {
      this.alertQuestion(
        'question',
        `El Bien es Administrado por: ${LV_DESC} , y ${LV_DESC1} como Responsable.`,
        '¿Desea Atender el Bien?'
      ).then(async question => {
        if (question.isConfirmed) {
          if (this.delegationNumber == 0 || this.responsable == 'REGIONALES') {
            if (V_PANTALLA != null) {
              if (V_DESCMOTIVO == 'AMPARO') {
                await this.pupLanzaForma(V_PANTALLA, V_PARAMETRO, V_EXPEDIENTE);
              } else {
                await this.pupLanzaForma(
                  V_PANTALLA,
                  V_PARAMETRO,
                  this.selectedRow.goodNumber
                );
              }
            } else {
              this.alert('warning', 'No se Encontró la Pantalla', '');
            }
          } else if (
            this.delegationNumber == LV_RESPONSABLE ||
            this.delegationNumber == LV_ADMINISTRA
          ) {
            if (V_PANTALLA != null) {
              if (V_DESCMOTIVO == 'AMPARO') {
                await this.pupLanzaForma(V_PANTALLA, V_PARAMETRO, V_EXPEDIENTE);
              } else {
                await this.pupLanzaForma(
                  V_PANTALLA,
                  V_PARAMETRO,
                  this.selectedRow.goodNumber
                );
              }
            } else {
              this.alert('warning', 'No se Encontró la Pantalla', '');
            }
          }
        }
      });
    } else if (this.responsable != 'REGIONALES') {
      if (V_PANTALLA != null) {
        if (V_DESCMOTIVO == 'AMPARO') {
          await this.pupLanzaForma(V_PANTALLA, V_PARAMETRO, V_EXPEDIENTE);
        } else {
          await this.pupLanzaForma(
            V_PANTALLA,
            V_PARAMETRO,
            this.selectedRow.goodNumber
          );
        }
      } else {
        this.alert('warning', 'No se Encontró la Pantalla', '');
      }
    } else {
      this.alert(
        'warning',
        `No Puede Atender este Bien, ya que Usted no Corresponde al Área Responsable: ${V_RESPONSABLE}`,
        ''
      );
    }
  }

  // GET - GOOD
  async getGood(id: any) {
    return new Promise((resolve, reject) => {
      this.goodService.getGoodById(id).subscribe({
        next: response => {
          console.log('res', response);
          resolve(response);
        },
        error: err => {
          resolve(null);
        },
      });
    });
  }

  // getLV_ADMINISTRA
  async getLV_ADMINISTRA(body: any) {
    return new Promise((resolve, reject) => {
      this.securityService.getFaCoordAdmin(body).subscribe({
        next: response => {
          console.log('responseresponseresponse', response);
          // this.loading = false;
          resolve(response.data[0]);
        },
        error: err => {
          resolve(null);
          // this.loading = false;
          console.log(err);
        },
      });
    });
  }

  // getLV_RESPONSABLE
  async getLV_RESPONSABLE(id: any) {
    return new Promise((resolve, reject) => {
      this.securityService.getFaDelResponsable(id).subscribe({
        next: response => {
          // this.loading = false;
          resolve(response);
        },
        error: err => {
          resolve(null);
          // this.loading = false;
          console.log(err);
        },
      });
    });
  }

  // CAT_DELEGACIONES
  async getDelegationDB(id: any) {
    const params = new ListParams();
    params['filter.id'] = `$eq:${id}`;
    params['filter.phaseEdo'] = `$eq:2`;
    return new Promise((resolve, reject) => {
      this.delegationService.getAll(params).subscribe({
        next: response => {
          // this.loading = false;
          resolve(response.data[0]);
        },
        error: err => {
          resolve(null);
          // this.loading = false;
          console.log(err);
        },
      });
    });
  }

  // PUP_LANZA_FORMA
  async pupLanzaForma(screen: any, parameter: any, no_bien: any) {
    if (screen == 'FACTJURBIENESXAMP') {
      this.router.navigate(
        [`/pages/juridical/depositary/assignment-protected-assets`],
        {
          queryParams: {
            origin: 'FMATENCBIENESREV',
            P_PARAM_PANT: parameter,
            P_BIEN: no_bien,
          },
        }
      );
    } else if (screen == 'FACTDIRDATOSBIEN') {
      this.router.navigate([`/pages/general-processes/goods-characteristics`], {
        queryParams: {
          origin: 'FMATENCBIENESREV',
          P_PARAM_PANT: parameter,
          P_BIEN: no_bien,
        },
      });
    } else if (screen == 'FIMGFOTBIEADD') {
      // No hay url
      return;
      this.router.navigate([`/pages/general-processes/scan-documents`], {
        queryParams: {
          origin: 'FMATENCBIENESREV',
          P_PARAM_PANT: parameter,
          P_BIEN: no_bien,
        },
      });
    } else if (screen == 'FCAMNOCLASIFBIEN') {
      this.router.navigate(
        [`/pages/administrative-processes/change-of-good-classification`],
        {
          queryParams: {
            origin: 'FMATENCBIENESREV',
            P_PARAM_PANT: parameter,
            P_BIEN: no_bien,
          },
        }
      );
    } else {
      this.alert('warning', 'No se Localizó la URL de la Forma', '');
    }
  }

  async actualizarMotivo() {
    await this.onCellDoubleClick();
  }
}
