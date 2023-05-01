import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';
import { IRequestDocument } from '../../../../core/models/requests/document.model';
import { IRequestInformation } from '../../../../core/models/requests/requestInformation.model';
import { CreateReportComponent } from '../../shared-request/create-report/create-report.component';
import { ViewReportComponent } from '../../shared-request/view-report/view-report.component';
import { SendRequestEmailComponent } from '../send-request-email/send-request-email.component';
import { DESTINATION_INFORMATION_DOCS } from './docs-template';

@Component({
  selector: 'app-destination-info-request-main',
  templateUrl: './destination-info-request-main.component.html',
  styleUrls: ['./destination-info-request-main.component.scss'],
})
export class DestinationInfoRequestMainComponent
  extends BasePage
  implements OnInit
{
  requestId: number = NaN;
  requestInfo: IRequestInformation;
  step: string;
  title: string = '';
  screenWidth: number;
  public typeDoc: string = '';
  docTemplate: IRequestDocument[];

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
      if (params.get('step')) {
        this.step = params.get('step');
        switch (this.step) {
          case 'register-response-minute':
            this.title =
              'Generar Solicitud de Información y Oficio de Respuesta';
            break;

          case 'review-response-minute':
            this.title = 'Revisión del Oficio de Respuesta de Información';
            break;

          default:
            break;
        }
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

  openSendEmail(): void {
    const modalRef = this.modalService.show(SendRequestEmailComponent, {
      class: 'modal-md modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.onSend.subscribe(next => {
      if (next) {
        console.log(next);
      }
    });
  }

  openDocument(mode: string) {
    this.docTemplate = DESTINATION_INFORMATION_DOCS;
    const context = { documents: this.docTemplate };
    switch (mode) {
      case 'edit':
        this.createReport(context);
        break;

      case 'view':
        this.viewReport(context);
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
      }
    });
  }

  viewReport(context?: Partial<ViewReportComponent>): void {
    const modalRef = this.modalService.show(ViewReportComponent, {
      initialState: context,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe(next => {
      if (next) {
        console.log(next);
      }
    });
  }
}
