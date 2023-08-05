import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
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
import { AddmotiveComponent } from '../addmotive/addmotive.component';

@Component({
  selector: 'app-dobleclickadd',
  templateUrl: './dobleclickadd.component.html',
  styles: [
    `
      .hoverBg:hover {
        background-color: #11798a !important;
        font-weight: 600;
      }
    `,
  ],
})
export class DobleclickaddComponent extends BasePage implements OnInit {
  @Input() value: any;
  clickTimer: any;
  @Input() rowData: any;
  @Output() funcionEjecutada = new EventEmitter<void>();
  @Input() label: string;
  @Input() updateAtt: string;
  selectedRow: any;
  responsable: any = null;
  delegationNumber: any = null;
  constructor(
    private modalService: BsModalService,
    private modalRef: BsModalRef,
    private fb: FormBuilder,
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

  ngOnInit(): void {
    this.selectedRow = this.rowData;
  }

  onCellClick(event: any) {
    console.log('rpw', this.rowData);
    // if (!this.value) {
    //   this.onCellDoubleClick();
    // } else {
    if (this.clickTimer) {
      clearTimeout(this.clickTimer);
      this.clickTimer = null;
      this.onCellDoubleClick();
    } else {
      this.clickTimer = setTimeout(() => {
        this.clickTimer = null;
      }, 300);
    }
    // }
  }

  // onCellDoubleClick() {
  //   if (!this.value) {
  //     // Lógica a ejecutar en caso de doble clic en una celda vacía
  //     console.log('Celda vacía seleccionada');
  //     // this.openForm(null);
  //     this.openForm();
  //   } else {
  //     // Lógica a ejecutar en caso de doble clic en una celda con valor
  //     this.alert(
  //       'warning',
  //       'Ya tiene un motivo relacionado',
  //       ''
  //     );
  //     console.log('Celda seleccionada:', this.value);
  //   }
  // }
  onContextMenu(event: MouseEvent) {
    event.preventDefault();
  }

  openForm(data?: any) {
    const modalConfig = MODAL_CONFIG;
    const selectedRow = this.rowData;
    const updateAtt = this.updateAtt;
    const label = this.label;
    modalConfig.initialState = {
      data,
      updateAtt,
      label,
      selectedRow,
      callback: (next: boolean) => {
        console.log('AQUI', next);
        this.ejecutarFuncion();
      },
    };
    this.modalService.show(AddmotiveComponent, modalConfig);
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

    let obj__: any = {
      initialStatus: this.selectedRow.status,
      goodType: this.selectedRow.goodType,
      descriptionCause: this.value,
    };

    const getCatMotivosRev_: any = await this.getCatMotivosRev();

    if (getCatMotivosRev_ === null) {
      V_PANTALLA = null;
      V_RESPONSABLE = null;
      this.alert(
        'warning',
        `${this.selectedRow.goodNumber} no es un Motivo Válido`,
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
              return;
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
              return;
            }
          }
        }
      });
    } else if (this.responsable != 'REGIONALES') {
      if (V_PANTALLA != null) {
        if (V_DESCMOTIVO === 'AMPARO') {
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
        return;
      }
    } else {
      this.alert(
        'warning',
        `No Puede Atender este Bien, ya que Usted no Corresponde al Área Responsable: ${V_RESPONSABLE}`,
        ''
      );
      return;
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
      this.router.navigate([
        '/pages/juridical/depositary/assignment-protected-assets/' + no_bien,
      ]);
      // this.router.navigate(
      //   [`/pages/juridical/depositary/assignment-protected-assets`],
      //   {
      //     queryParams: {
      //       origin: 'FMATENCBIENESREV',
      //       P_PARAM_PANT: parameter,
      //       P_BIEN: no_bien,
      //     },
      //   }
      // );
    } else if (screen == 'FACTDIRDATOSBIEN') {
      localStorage.setItem('goodCharacteristicNumber', no_bien);

      this.router.navigate([`/pages/general-processes/goods-characteristics`], {
        queryParams: {
          origin: 'FMATENCBIENESREV',
        },
      });
    } else if (screen == 'FIMGFOTBIEADD') {
      // No hay url
      let arr = [];
      arr.push(no_bien);
      const dataString = JSON.stringify(arr);
      localStorage.setItem('selectedGoodsForPhotos', dataString);
      this.router.navigate([`/pages/general-processes/good-photos`], {
        queryParams: {
          origin: 'FMATENCBIENESREV',
          numberGood: no_bien,
        },
      });
    } else if (screen == 'FCAMNOCLASIFBIEN') {
      this.router.navigate(
        [`/pages/administrative-processes/change-of-good-classification`],
        {
          queryParams: {
            origin: 'FMATENCBIENESREV',
            numberGood: no_bien,
          },
        }
      );
    } else {
      this.alert('warning', 'No se Localizó la URL de la Forma', '');
      return;
    }
  }

  async getCatMotivosRev() {
    const params = new FilterParams();

    // params.page = lparams.page;
    // params.limit = lparams.limit;

    params.addFilter('descriptionCause', this.value, SearchFilter.ILIKE);
    params.addFilter('initialStatus', this.selectedRow.status, SearchFilter.EQ);
    params.addFilter('goodType', this.selectedRow.goodType, SearchFilter.EQ);

    return new Promise((resolve, reject) => {
      this.revisionReasonService.getAll2(params.getParams()).subscribe({
        next: (response: any) => {
          resolve(response.data[0]);
        },
        error: error => {
          this.loading = false;
          resolve(null);
        },
      });
    });
  }

  // RECARGAR DATA DE LA TABLA DE MOVIMIENTOS //
  ejecutarFuncion() {
    console.log('AQUI2');
    this.funcionEjecutada.emit();
  }
}
