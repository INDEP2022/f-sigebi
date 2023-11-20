import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IConfigvtadmun } from 'src/app/core/models/ms-parametercomer/configvtadmum.model';
import { MsDirectawardService } from 'src/app/core/services/ms-directaward/ms-directaward.service';
import { MunicipalityControlMainService } from 'src/app/core/services/ms-directsale/municipality-control-main.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { ApplicantsModalComponent } from '../applicants-modal/applicants-modal.component';
import { AssignedGoodsModalComponent } from '../assigned-goods-modal/assigned-goods-modal.component';
import {
  MUNICIPALITY_CONTROL_APPLICANT_COLUMNS,
  MUNICIPALITY_CONTROL_ASSIGNED_GOOD_COLUMNS,
} from './municipality-control-columns';

@Component({
  selector: 'app-municipality-control-main',
  templateUrl: './municipality-control-main.component.html',
  styles: [],
})
export class MunicipalityControlMainComponent
  extends BasePage
  implements OnInit
{
  applicantParams = new BehaviorSubject<ListParams>(new ListParams());
  assignedGoodParams = new BehaviorSubject<ListParams>(new ListParams());
  dataFactGen: LocalDataSource = new LocalDataSource();
  params2 = new BehaviorSubject<ListParams>(new ListParams());
  applicantTotalItems: number = 0;
  totalItems: number = 0;
  assignedGoodTotalItems: number = 0;
  applicantColumns: any[] = [];
  data: IConfigvtadmun[] = [];
  columnFilters: any = [];
  assignedGoodColumns: any[] = [];
  idGood: any;
  applicant: any;
  applicantSettings = {
    ...TABLE_SETTINGS,
    actions: {
      columnTitle: 'Acciones',
      position: 'right',
      add: false,
      edit: true,
      delete: true,
    },
  };
  assignedGoodSettings = {
    ...TABLE_SETTINGS,
    actions: {
      columnTitle: 'Acciones',
      position: 'right',
      add: false,
      edit: true,
      delete: true,
    },
  };
  paramsScreen: IParamsVault = {
    PAR_MASIVO: '', // PAQUETE
  };
  origin: string = '';

  constructor(
    private modalService: BsModalService,
    private municipalityControlMainService: MunicipalityControlMainService,
    private activatedRoute: ActivatedRoute,
    private msDirectawardService: MsDirectawardService
  ) {
    super();
    this.applicantSettings.hideSubHeader = false;
    this.assignedGoodSettings.hideSubHeader = false;
    this.applicantSettings.columns = MUNICIPALITY_CONTROL_APPLICANT_COLUMNS;
    this.assignedGoodSettings.columns =
      MUNICIPALITY_CONTROL_ASSIGNED_GOOD_COLUMNS;
  }

  ngOnInit(): void {
    //this.getData();

    this.activatedRoute.queryParams
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe((params2: any) => {
        for (const key in this.paramsScreen) {
          if (Object.prototype.hasOwnProperty.call(params2, key)) {
            this.paramsScreen[key as keyof typeof this.paramsScreen] =
              params2[key] ?? null;
          }
        }
      });
    if (this.paramsScreen) {
      if (this.paramsScreen.PAR_MASIVO) {
        this.getData();
      }
    }
    this.dataFactGen
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            // console.log('loooool');
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            switch (filter.field) {
              case 'soladjinstgobId':
                searchFilter = SearchFilter.EQ;
                break;
              case 'typeentgobId':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'applicant':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'applicationDate':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'award':
                searchFilter = SearchFilter.EQ;
                break;
              case 'description':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'municipality':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'phone':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'position':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'state':
                searchFilter = SearchFilter.ILIKE;
                break;
            }
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params2 = this.pageFilter(this.params2);
          this.getData();
        }
      });

    this.params2
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getData());
  }

  getData() {
    this.loading = true;
    let params = {
      ...this.params2.getValue(),
      ...this.columnFilters,
    };
    this.assignedGoodColumns = [];
    this.assignedGoodTotalItems = 0;
    this.dataFactGen.reset();
    this.municipalityControlMainService.getSolicitantes(params).subscribe({
      next: response => {
        this.loading = false;
        this.data = response.data;
        console.log(this.data);
        this.totalItems = response.count;
        this.dataFactGen.load(response.data);
        this.dataFactGen.refresh();
      },
      error: error => (this.loading = false),
    });
  }
  onClick(data: any) {
    // console.log(data);
  }
  getDataGoods(applicant?: any) {
    this.idGood = applicant.soladjinstgobId;
    this.applicant = applicant;
    this.msDirectawardService.getGoodsByApplicant(this.idGood).subscribe({
      next: data => {
        this.assignedGoodColumns = data.data;
        this.assignedGoodTotalItems = data.count;
        console.log(this.assignedGoodColumns);
      },
      error: err => {
        this.assignedGoodColumns = [];
        this.assignedGoodTotalItems = 0;
        this.onLoadToast(
          'warning',
          'Advertencia',
          'No se han Encontrado Bienes para el Solicitante Seleccionado'
        );
      },
    });
  }

  refreshGoods() {
    this.assignedGoodColumns = [...this.assignedGoodColumns];
    this.assignedGoodTotalItems = this.assignedGoodColumns.length;
  }
  askDelete(row: any, type: string) {
    //console.log(row, type);
    this.alertQuestion(
      'question',
      '¿Desea Eliminar este Registro?',
      '',
      'Eliminar'
    ).then(question => {
      if (question.isConfirmed) {
        switch (type) {
          case 'APPLICANT':
            this.deleteApplicant(row);
            break;
          case 'GOOD':
            this.deleteAssignedGood(row);
            break;
          default:
            break;
        }
      }
    });
  }
  deleteApplicant(row: any) {
    let body = {
      typeentgobId: row.typeentgobId.typeentgobId,
      soladjinstgobId: row.soladjinstgobId,
    };
    this.municipalityControlMainService.deleteSolicitante(body).subscribe({
      next: data => {
        this.onLoadToast('success', 'Se ha eliminado el solicitante', '');
        this.getData();
        // location.reload();
      },
      error: err => {
        this.onLoadToast(
          'warning',
          'Advertencia',
          'El Solicitante no se ha Eliminado Correctamente'
        );
      },
    });
  }

  deleteAssignedGood(row: any) {
    // console.log(row);
    this.msDirectawardService.deleteGoodsById(row.detbienesadjId).subscribe({
      next: data => {
        this.onLoadToast('success', 'Se ha eliminado el bien', '');
        // location.reload();
        this.getData();
      },
      error: err => {
        this.onLoadToast(
          'warning',
          'Advertencia',
          'El bien no se ha Eliminado Correctamente'
        );
      },
    });
  }

  openFormApplicant(applicant?: any) {
    //console.log(applicant);
    this.openModalApplicant({ applicant });
  }

  openModalApplicant(context?: Partial<ApplicantsModalComponent>) {
    //console.log(context);
    const modalRef = this.modalService.show(ApplicantsModalComponent, {
      initialState: { ...context },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe(data => {
      if (data) this.getData();
    });
  }

  openFormAssignedGood(good?: any) {
    if (good == undefined && this.applicant == undefined) {
      this.onLoadToast(
        'info',
        'Para agregar un nuevo bien seleccione un solicitante'
      );
      return;
    }
    this.openModalAssignedGood({ good });
  }

  openModalAssignedGood(context?: Partial<AssignedGoodsModalComponent>) {
    const modalRef = this.modalService.show(AssignedGoodsModalComponent, {
      initialState: {
        ...context,
        ...this.assignedGoodColumns,
        applicant: this.applicant,
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe(data => {
      if (data) {
        this.getDataGoods(this.applicant);
      }
    });
  }
}

export interface IParamsVault {
  PAR_MASIVO: string;
}
