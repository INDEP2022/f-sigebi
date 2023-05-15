import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { IRequestDocument } from 'src/app/core/models/requests/document.model';
import { BasePage } from 'src/app/core/shared/base-page';
import Swal from 'sweetalert2';
import { COMPENSATION_ACT_DOCS } from '../../../economic-compensation/compensation-act/compensation-act-main/docs-template';
import { CONTRIBUTOR_NOTIFICATION_DOCS } from '../../../economic-compensation/delivery-request-notif/delivery-request-notif-main/docs-template';
import { CreateReportComponent } from '../../../shared-request/create-report/create-report.component';

@Component({
  selector: 'app-register-request-goods',
  templateUrl: './register-request-goods.component.html',
  styleUrls: ['./register-request-goods.component.scss'],
})
export class RegisterRequestGoodsComponent extends BasePage implements OnInit {
  /** INPUT VARIABLES */
  @Input() nombrePantalla: string = 'sinNombre';
  @Input() idParam: number = null;
  @Input() registroDocumentacion: boolean = true;
  @Input() buscarAsociarExpediente: boolean = true;
  @Input() seleccionarBienes: boolean = true;
  @Input() verificarCumplimientoBienes: boolean = false;
  @Input() expediente: boolean = true;
  @Input() tabRegisterDocumentation: string = 'Registro de Documentación';
  public typeDoc: string = '';

  /** OUTPUT VARIABLES */
  @Output() formValuesDataDocumentation = new EventEmitter<any>();
  @Output() formValuesSeleccionarBienes = new EventEmitter<any>();

  /** OTHERS VARIABLES */
  requestNumb: number;
  registRequestForm: FormGroup;

  docTemplateAct: IRequestDocument[];
  docTemplateNotif: IRequestDocument[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private modalService: BsModalService
  ) {
    super();
  }

  ngOnInit(): void {
    this.getPathParameter();
    this.prepareForm();
    this.requestSelected(1);
  }

  getPathParameter() {
    if (this.idParam) {
      this.requestNumb = this.idParam;
    } else {
      this.activatedRoute.paramMap.subscribe(params => {
        this.requestNumb = parseInt(params.get('id'));
      });
    }
  }

  prepareForm() {
    this.registRequestForm = this.fb.group({
      date: [],
      noOfi: ['400-10-00-01*00*2020-7824'],
      regDelega: ['BAJA CALIFORNIA'],
      noExpedient: ['24355'],
      noRequest: ['27445'],
      state: ['Juan Pablo'],
      tranfe: ['SAT FISCO FEDERAL'],
      transmitter: ['ADMINISTRACION GENERAL DE RECAUDACION'],
      authority: [
        'ADMINISTRACION DESCONCENTRADA DE RECAUDACION DE BAJA CALIFORNIA',
      ],
    });
  }
  dataRegistration(data: any) {
    console.log(data);
    this.formValuesDataDocumentation.emit(data);
  }
  dataSeleccionarBienes(data: any) {
    console.log(data);
    this.formValuesSeleccionarBienes.emit(data);
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

  requestSelected(type: number) {
    this.typeDocumentMethod(type);
  }

  turnRequest() {
    this.alertQuestion(
      'question',
      `¿Desea turnar la solicitud con Folio ${this.requestNumb}?`,
      '',
      'Turnar'
    ).then(question => {
      if (question.isConfirmed) {
        this.onLoadToast('success', 'Solicitud turnada con éxito', '');
      }
    });
  }

  agreeRequest() {
    this.alertQuestion(
      'question',
      `¿Desea solicitar la aprobación para la solicitud con Folio: ${this.requestNumb}`,
      '',
      'Enviar a aprovación'
    ).then(question => {
      if (question.isConfirmed) {
        this.onLoadToast(
          'success',
          'Solicitud enviada a aprobación con éxito',
          ''
        );
      }
    });
  }

  openDocument(type: string) {
    let context: any;
    switch (type) {
      case 'devol':
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

  rejectRequest() {
    Swal.fire({
      title: 'Confirma Rechazo',
      text: 'El resultado de la verificación y análisis documental será rechazado.',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off',
      },
      showCancelButton: true,
      confirmButtonColor: '#9d2449',
      confirmButtonText:
        "<i class='bx bxs-check-circle check-icon fs-2 mr-2'></i>Aceptar",
      cancelButtonColor: '#b38e5d',
      cancelButtonText:
        "<i class='bx bxs-x-circle cancel-icon fs-2 mr-2'></i>Cancelar",
      showLoaderOnConfirm: true,
      preConfirm: (comment: any) => {
        try {
          if (!comment) {
            throw new Error(
              'Se necesita un comentario para retornar la solicitud'
            );
          } else {
            return comment;
          }
        } catch (error) {
          Swal.showValidationMessage(`${error}`);
        }
      },
      // allowOutsideClick: () => !Swal.isLoading(),
    }).then(result => {
      console.log(result);
      if (result.isConfirmed) {
        console.log(result.value);
      }
    });
  }
}
