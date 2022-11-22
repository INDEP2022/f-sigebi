import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';
import { CreateReportComponent } from '../../../shared-request/create-report/create-report.component';

@Component({
  selector: 'app-msg-rsb-c-register-request-goods',
  templateUrl: './msg-rsb-c-register-request-goods.component.html',
  styleUrls: ['./msg-rsb-c-register-request-goods.component.scss'],
})
export class MsgRsbCRegisterRequestGoodsComponent
  extends BasePage
  implements OnInit
{
  /** INPUT VARIABLES */
  @Input() nombrePantalla: string = 'sinNombre';
  @Input() idParam: number = null;
  @Input() registroDocumentacion: boolean = true;
  @Input() buscarAsociarExpediente: boolean = true;
  @Input() seleccionarBienes: boolean = true;
  @Input() expediente: boolean = true;
  public typeDoc: string = '';

  /** OUTPUT VARIABLES */
  @Output() formValuesDataDocumentation = new EventEmitter<any>();
  @Output() formValuesSeleccionarBienes = new EventEmitter<any>();

  /** OTHERS VARIABLES */
  requestNumb: number;
  registRequestForm: FormGroup;

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
      `¿Desea turnar la solicitud con Folio ${this.requestNumb}`,
      '',
      'Turnar'
    ).then(question => {
      if (question.isConfirmed) {
        this.onLoadToast('success', 'Solicitud turnada con éxito', '');
      }
    });
  }

  generateReport(context?: Partial<CreateReportComponent>): void {
    const modalRef = this.modalService.show(CreateReportComponent, {
      initialState: context,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe(next => {
      if (next) console.log(next);
    });
  }
}
