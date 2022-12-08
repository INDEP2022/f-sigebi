import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
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
      add: true,
      edit: true,
      delete: true,
    },
  };
  assignedGoodSettings = {
    ...TABLE_SETTINGS,
    actions: {
      columnTitle: 'Acciones',
      position: 'right',
      add: true,
      edit: true,
      delete: true,
    },
  };

  applicantTestData = [
    {
      applicationId: 136,
      entityId: 'M63',
      applicant: 'EJEMPLO SOLICITANTE 1',
      position: 'ALCALDE',
      municipality: 'EJEMPLO MUNICIPIO',
      state: 'EJEMPLO ESTAOD',
      applicationDate: '17/05/2021',
      applicationQuantity: 4,
      description: 'EJEMPLO DESCRIPTION DE APLCIANTE',
      phone: '+52 111 111 1111',
      adjudication: 'EJEMPLO ADJUDICACION',
      email: 'correo123@ejemplo.com',
    },
    {
      applicationId: 137,
      entityId: 'M74',
      applicant: 'EJEMPLO SOLICITANTE 2',
      position: 'ALCALDE',
      municipality: 'EJEMPLO MUNICIPIO',
      state: 'EJEMPLO ESTAOD',
      applicationDate: '17/05/2021',
      applicationQuantity: 3,
      description: 'EJEMPLO DESCRIPTION DE APLCIANTE',
      phone: '+52 111 111 1111',
      adjudication: 'EJEMPLO ADJUDICACION',
      email: 'correo123@ejemplo.com',
    },
    {
      applicationId: 138,
      entityId: 'M95',
      applicant: 'EJEMPLO SOLICITANTE 2',
      position: 'ALCALDE',
      municipality: 'EJEMPLO MUNICIPIO',
      state: 'EJEMPLO ESTAOD',
      applicationDate: '17/05/2021',
      applicationQuantity: 5,
      description: 'EJEMPLO DESCRIPTION DE APLCIANTE',
      phone: '+52 111 111 1111',
      adjudication: 'EJEMPLO ADJUDICACION',
      email: 'correo123@ejemplo.com',
    },
  ];

  assignedGoodTestData = [
    {
      goodId: 466,
      appraisal: 17000,
      appraisalDate: '18/06/2021',
      sessionNumber: 468,
      goodClasification: 'EJEMPLO CLAS.',
      description: 'EJEMPLO DESCRICION DE BIEN ASIGNADO',
      delegation: 'EJEMPLO DELEGACION',
      location: 'EJEMPLO UBICACION',
      mandate: 'EJEMPLO MANDATO',
      siabClassification: 'EJEMPLO CLAS.',
      commentary: 'EJEMPLO COMENTARIO',
    },
    {
      goodId: 467,
      appraisal: 14000,
      appraisalDate: '18/06/2021',
      sessionNumber: 469,
      goodClasification: 'EJEMPLO CLAS.',
      description: 'EJEMPLO DESCRICION DE BIEN ASIGNADO',
      delegation: 'EJEMPLO DELEGACION',
      location: 'EJEMPLO UBICACION',
      mandate: 'EJEMPLO MANDATO',
      siabClassification: 'EJEMPLO CLAS.',
      commentary: 'EJEMPLO COMENTARIO',
    },
    {
      goodId: 468,
      appraisal: 24000,
      appraisalDate: '18/06/2021',
      sessionNumber: 470,
      goodClasification: 'EJEMPLO CLAS.',
      description: 'EJEMPLO DESCRICION DE BIEN ASIGNADO',
      delegation: 'EJEMPLO DELEGACION',
      location: 'EJEMPLO UBICACION',
      mandate: 'EJEMPLO MANDATO',
      siabClassification: 'EJEMPLO CLAS.',
      commentary: 'EJEMPLO COMENTARIO',
    },
  ];

  constructor(private modalService: BsModalService) {
    super();
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
    this.applicantColumns = this.applicantTestData;
    this.applicantTotalItems = this.applicantColumns.length;
  }

  refreshGoods() {
    this.assignedGoodColumns = [...this.assignedGoodColumns];
    this.assignedGoodTotalItems = this.assignedGoodColumns.length;
  }

  selectApplicant(row: any[]) {
    this.assignedGoodColumns = this.assignedGoodTestData;
    this.assignedGoodTotalItems = this.assignedGoodColumns.length;
  }

  askDelete(row: any, type: string) {
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
    // Llamar servicio para eliminar
  }

  deleteAssignedGood(row: any) {
    // Llamar servicio para eliminar
  }

  openFormApplicant(applicant?: any) {
    this.openModalApplicant({ applicant });
  }

  openModalApplicant(context?: Partial<ApplicantsModalComponent>) {
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
