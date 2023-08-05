import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
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
  applicantTotalItems: number = 0;
  assignedGoodTotalItems: number = 0;
  applicantColumns: any[] = [];
  assignedGoodColumns: any[] = [];
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

  constructor(
    private modalService: BsModalService,
    private municipalityControlMainService: MunicipalityControlMainService
  ) {
    super();
    this.applicantSettings.hideSubHeader = false;
    this.assignedGoodSettings.hideSubHeader = false;
    this.applicantSettings.columns = MUNICIPALITY_CONTROL_APPLICANT_COLUMNS;
    this.assignedGoodSettings.columns =
      MUNICIPALITY_CONTROL_ASSIGNED_GOOD_COLUMNS;
  }

  ngOnInit(): void {
    this.getData();
  }
  getData() {
    this.assignedGoodColumns = [];
    this.assignedGoodTotalItems = 0;
    this.municipalityControlMainService.getSolicitantes().subscribe(data => {
      this.applicantColumns = data.data;
      this.applicantTotalItems = this.applicantColumns.length;
      console.log(this.applicantTotalItems);
    });
    this.municipalityControlMainService.getBienesAsignados().subscribe(data => {
      this.assignedGoodColumns = data.data;
      this.assignedGoodTotalItems = this.assignedGoodColumns.length;
      console.log(this.assignedGoodTotalItems);
    });
  }
  refreshGoods() {
    this.assignedGoodColumns = [...this.assignedGoodColumns];
    this.assignedGoodTotalItems = this.assignedGoodColumns.length;
  }
  askDelete(row: any, type: string) {
    console.log(row, type);
    this.alertQuestion(
      'question',
      '¿Desea eliminar este registro?',
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
        this.onLoadToast('success', 'Datos eliminados correctamente', '');
        this.getData();
        // location.reload();
      },
      error: err => {
        this.onLoadToast(
          'warning',
          'advertencia',
          'Lo sentimos ha ocurrido un error'
        );
      },
    });
  }

  deleteAssignedGood(row: any) {
    console.log(row);
    this.municipalityControlMainService
      .deleteBienesAsignados(row.repvendcId)
      .subscribe({
        next: data => {
          this.onLoadToast('success', 'Datos eliminados correctamente', '');
          // location.reload();
          this.getData();
        },
        error: err => {
          this.onLoadToast(
            'warning',
            'advertencia',
            'Lo sentimos ha ocurrido un error'
          );
        },
      });
  }

  openFormApplicant(applicant?: any) {
    this.openModalApplicant({ applicant });
  }

  openModalApplicant(context?: Partial<ApplicantsModalComponent>) {
    console.log(context);
    const modalRef = this.modalService.show(ApplicantsModalComponent, {
      initialState: { ...context },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.onConfirm.subscribe(data => {
      if (data) this.getData();
    });
  }

  openFormAssignedGood(good?: any) {
    this.openModalAssignedGood({ good });
  }

  openModalAssignedGood(context?: Partial<AssignedGoodsModalComponent>) {
    const modalRef = this.modalService.show(AssignedGoodsModalComponent, {
      initialState: { ...context },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.onConfirm.subscribe(data => {
      if (data) this.refreshGoods();
    });
  }
}
