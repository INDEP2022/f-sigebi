import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';
import { CreateReportComponent } from '../create-report/create-report.component';

@Component({
  selector: 'app-complementary-request-information',
  templateUrl: './complementary-request-information.component.html',
  styleUrls: ['./complementary-request-information.component.scss'],
})
export class ComplementaryRequestInformationComponent
  extends BasePage
  implements OnInit
{
  /** INPUT VARIABLES */
  @Input() nombrePantalla: string = 'sinNombre';
  @Input() idParam: number = null;
  @Input() title: string = null;
  @Input() registroDocumentacion: boolean = true;
  @Input() buscarAsociarExpediente: boolean = true;
  @Input() seleccionarBienes: boolean = true;
  @Input() validarResultadoVisitas: boolean = false;
  @Input() resultadoVisitas: boolean = false;
  @Input() verificarCumplimientoBienes: boolean = false;
  @Input() expediente: boolean = true;
  @Input() tabRegisterDocumentation: string = 'Registro de Documentación';
  signedReport: boolean = false;
  public typeDoc: string = '';

  /** OUTPUT VARIABLES */
  @Output() formValuesDataDocumentation = new EventEmitter<any>();
  @Output() formValuesSeleccionarBienes = new EventEmitter<any>();

  /** OTHERS VARIABLES */
  requestNumb: number = null;
  typeOfRequest: number = null;
  registRequestForm: FormGroup;
  titleArray = [
    'Bienes Similares: Registro de Documentación Complementaria, No. Solicitud: requestNumb',
    'Bienes Similares: Programar Visita Ocular, No. Solicitud requestNumb, Contribuyente: taxPayer, PAMA: pama',
    'Bienes Similares: Validar Resultado Visita Ocular, No. Solicitud requestNumb, Contribuyente: taxPayer, PAMA: pama',
    'Bienes Similares: Notificar a Transferente, No. Solicitud requestNumb, Contribuyente: taxPayer, PAMA: pama',
    'Bienes Similares: ELaborar Oficio de Respuesta, No. Solicitud requestNumb, Contribuyente: taxPayer, PAMA: pama',
  ];
  titleReport: string = '';
  titleReportArray = [
    'Reporte de Notificaci\u00f3n',
    'Reporte Resultado Visita Ocular',
  ];

  constructor(
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private modalService: BsModalService
  ) {
    super();
  }

  ngOnInit(): void {
    this.selectTitleReport();
    this.getPathParameter();
    this.prepareForm();
    this.requestSelected(1);
  }

  selectTitleReport() {
    if (this.nombrePantalla === 'transf-notification')
      this.titleReport = this.titleReportArray[0];
    else this.titleReport = this.titleReportArray[1];
  }

  getPathParameter() {
    this.activatedRoute.paramMap.subscribe(params => {
      if (params.get('typeOfRequest')) {
        this.typeOfRequest = parseInt(params.get('typeOfRequest'));
        this.titleArray[this.typeOfRequest - 1] = this.titleArray[
          this.typeOfRequest - 1
        ].replace('requestNumb', params.get('id'));
      } else {
        if (this.idParam) {
          this.requestNumb = this.idParam;
        } else {
          this.requestNumb = parseInt(params.get('id'));
        }
      }
    });
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
    this.formValuesDataDocumentation.emit(data);
  }
  dataSeleccionarBienes(data: any) {
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

  generateReport(context?: Partial<CreateReportComponent>): void {
    if (!this.signedReport) {
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
    } else {
      this.finishRequest();
    }
  }

  finishRequest() {
    this.alertQuestion(
      'question',
      `¿Desea Finalizar la solicitud con Folio: `,
      '',
      'Finalizar'
    ).then(question => {
      if (question.isConfirmed) {
        this.onLoadToast('success', 'Solicitud Finalizada', '');
      }
    });
  }
}
