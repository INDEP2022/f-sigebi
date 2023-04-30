import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { IRequestInformation } from 'src/app/core/models/requests/requestInformation.model';
import { BasePage } from 'src/app/core/shared/base-page';
import { CreateReportComponent } from '../../../shared-request/create-report/create-report.component';
import { IRequestDocument } from './../../../../../core/models/requests/document.model';
import { CONTRIBUTOR_NOTIFICATION_DOCS } from './docs-template';

@Component({
  selector: 'app-delivery-request-notif-main',
  templateUrl: './delivery-request-notif-main.component.html',
  styleUrls: ['./delivery-request-notif-main.component.scss'],
})
export class DeliveryRequestNotifMainComponent
  extends BasePage
  implements OnInit
{
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
    this.docTemplate = CONTRIBUTOR_NOTIFICATION_DOCS;
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
      rejectionComment: 'COMENTARIO DE RECHAZO',
    };
    this.contributor = 'CARLOS G. PALMA';
  }

  close() {
    // this.registRequestForm.reset();
    this.router.navigate(['pages/request/list']);
  }

  requestRegistered(request: any) {
    console.log(request);
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

  createReport(context?: Partial<CreateReportComponent>): void {
    const modalRef = this.modalService.show(CreateReportComponent, {
      initialState: { documents: this.docTemplate },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe(next => {
      if (next) {
        console.log(next);
      } //this.getCities();
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
