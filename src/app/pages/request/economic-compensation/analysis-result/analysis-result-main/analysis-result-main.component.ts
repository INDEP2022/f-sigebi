import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';
import { IRequestInformation } from '../../../../../core/models/requests/requestInformation.model';
import { RejectRequestModalComponent } from '../../../shared-request/reject-request-modal/reject-request-modal.component';
import { ViewReportComponent } from '../../../shared-request/view-report/view-report.component';
import { COMPENSATION_DICTUM_DOCS } from '../../guidelines-revision/guidelines-revision-main/docs-template';
import { IRequestDocument } from './../../../../../core/models/requests/document.model';

@Component({
  selector: 'app-analysis-result-main',
  templateUrl: './analysis-result-main.component.html',
  styleUrls: ['./analysis-result-main.component.scss'],
})
export class AnalysisResultMainComponent extends BasePage implements OnInit {
  requestId: number = NaN;
  contributor: string = '';
  requestInfo: IRequestInformation;
  screenWidth: number;
  public typeDoc: string = '';
  docTemplate: IRequestDocument[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modalService: BsModalService
  ) {
    super();
    this.docTemplate = COMPENSATION_DICTUM_DOCS;
    this.screenWidth =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      if (params.get('request')) {
        this.requestId = parseInt(params.get('request'));
        this.getRequestInfo(this.requestId);
      }
    });
    this.requestSelected(1);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    let screenWidth = window.innerWidth;
    this.screenWidth = screenWidth;
  }

  getRequestInfo(rquestId: number) {
    // Llamar servicio para obtener informacion de la solicitud
    this.requestInfo = {
      date: '17-abr-2018',
      requestNo: 1896,
      fileNo: 15499,
      memorandumNo: 54543,
      regionalDelegation: 'BAJA CALIFORNIA',
      state: 'BAJA CALIFORNIA',
      transferee: 'SAT - COMERCIO EXTERIOR',
      emitter: 'ALAF',
      authority: 'ADMINISTRACIÓN LOCAL DE AUDITORÍA FISCAL DE MEXICALI',
    };
    this.contributor = 'CARLOS G. PALMA';
  }

  close() {
    // this.registRequestForm.reset();
    this.router.navigate(['pages/request/list']);
  }

  turnRequest() {
    this.alertQuestion(
      'question',
      `¿Desea turnar la solicitud con Folio ${this.requestId}?`,
      '',
      'Turnar'
    ).then(question => {
      if (question.isConfirmed) {
        this.onLoadToast('success', 'Solicitud turnada con éxito', '');
      }
    });
  }

  viewReport(context?: Partial<ViewReportComponent>): void {
    const modalRef = this.modalService.show(ViewReportComponent, {
      initialState: { documents: this.docTemplate },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe(next => {
      if (next) {
        console.log(next);
      }
    });
  }

  rejectRequest() {
    const modalRef = this.modalService.show(RejectRequestModalComponent, {
      initialState: {
        title: 'Confirmar Rechazo',
        message: '¿Está seguro que desea rechazar el análisis?',
        requestId: this.requestId,
      },
      class: 'modal-md modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.onReject.subscribe((data: boolean) => {
      if (data) {
        console.log(data);
      }
    });
  }

  requestSelected(type: number) {
    this.typeDocumentMethod(type);
  }

  typeDocumentMethod(type: number) {
    switch (type) {
      case 1:
        this.typeDoc = 'doc-request';
        break;
      case 2:
        this.typeDoc = 'doc-expedient';
        break;
      case 3:
        this.typeDoc = 'request-expedient';
        break;
      default:
        break;
    }
  }
}
