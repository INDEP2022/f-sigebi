import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { IRequestInformation } from 'src/app/core/models/requests/requestInformation.model';
import { BasePage } from 'src/app/core/shared/base-page';
import { CreateReportComponent } from '../../../shared-request/create-report/create-report.component';
import { CONTRIBUTOR_NOTIFICATION_DOCS } from '../../delivery-request-notif/delivery-request-notif-main/docs-template';
import { IRequestDocument } from './../../../../../core/models/requests/document.model';
import { COMPENSATION_ACT_DOCS } from './docs-template';

@Component({
  selector: 'app-compensation-act-main',
  templateUrl: './compensation-act-main.component.html',
  styleUrls: ['./compensation-act-main.component.scss'],
})
export class CompensationActMainComponent extends BasePage implements OnInit {
  requestId: number = NaN;
  contributor: string = '';
  requestInfo: IRequestInformation;
  screenWidth: number;
  public typeDoc: string = '';
  docTemplateAct: IRequestDocument[];
  docTemplateNotif: IRequestDocument[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modalService: BsModalService
  ) {
    super();
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
      similarGoodsRequest: 1851,
      rejectionComment: 'COMENTARIO DE RECHAZO',
    };
    this.contributor = 'CARLOS G. PALMA';
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

  close() {
    // this.registRequestForm.reset();
    this.router.navigate(['pages/request/list']);
  }

  requestRegistered(request: any) {
    console.log(request);
  }

  endRequest() {
    this.alertQuestion(
      'question',
      `¿Desea finalizar la solicitud con Folio ${this.requestId}`,
      '',
      'Finalizar'
    ).then(question => {
      if (question.isConfirmed) {
        this.onLoadToast('success', 'Solicitud finalizada con éxito', '');
      }
    });
  }

  openDocument(type: string) {
    let context: any;
    switch (type) {
      case 'act':
        this.docTemplateAct = COMPENSATION_ACT_DOCS;
        context = { documents: this.docTemplateAct };
        this.createReport(context);
        break;
      case 'notif':
        this.docTemplateNotif = CONTRIBUTOR_NOTIFICATION_DOCS;
        context = { documents: this.docTemplateNotif };
        this.createReport(context);
        break;
      default:
        break;
    }
  }

  createReport(context?: Partial<CreateReportComponent>): void {
    const modalRef = this.modalService.show(CreateReportComponent, {
      initialState: context,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe(next => {
      if (next) {
        console.log(next);
      } //this.getCities();
    });
  }
}
