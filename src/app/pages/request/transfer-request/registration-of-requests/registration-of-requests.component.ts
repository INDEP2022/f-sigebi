import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IRequest } from 'src/app/core/models/catalogs/request.model';
import { BasePage } from 'src/app/core/shared/base-page';
import Swal from 'sweetalert2';
import { GenerateDictumComponent } from '../tabs/approval-requests-components/generate-dictum/generate-dictum.component';

@Component({
  selector: 'app-registration-of-requests',
  templateUrl: './registration-of-requests.component.html',
  styleUrls: ['./registration-of-requests.component.scss'],
})
export class RegistrationOfRequestsComponent
  extends BasePage
  implements OnInit
{
  registRequestForm: ModelForm<IRequest>;
  edit: boolean = false;
  title: string = 'title';
  parameter: any;
  object: any = '';
  btnTitle: string = '';
  btnSaveTitle: string = '';
  saveClarifiObject: boolean = false;

  //tabs
  tab1: string = '';
  tab2: string = '';
  tab3: string = '';
  tab4: string = '';
  tab5: string = '';
  tab6: string = '';

  //registro de solicitudos o bienes
  requestRegistration: boolean = false;
  //verificacion de cumplimientos tab
  complianceVerifi: boolean = false; //ok
  //clasificacion de bienes
  classifyAssets: boolean = false;
  //validar destino del bien(documento)
  validateDocument: boolean = false;
  //notificar aclaraciones o improcedencias
  notifyClarifiOrImpropriety: boolean = false;
  //aprovacion del proceso
  approvalProcess: boolean = false;

  constructor(
    public fb: FormBuilder,
    public modalRef: BsModalRef,
    public modalService: BsModalService,
    public route: ActivatedRoute,
    public router: Router,
    public location: Location
  ) {
    super();
  }

  ngOnInit(): void {
    let path: any = window.location.pathname.split('/');
    this.setView(path[4]);
    this.intiTabs();
    this.prepareForm();
    this.route.params.subscribe(params => {
      this.object = this.registRequestForm.value;
    });
  }

  prepareForm() {
    this.registRequestForm = this.fb.group({
      date: [],
      noOfi: ['400-10-00-01*00*2020-7824'],
      regDelega: ['BAJA CALIFORNIA'],
      entity: ['Juan Pablo'],
      tranfe: ['SAT FISCO FEDERAL'],
      transmitter: ['ADMINISTRACION GENERAL DE RECAUDACION'],
      authority: [
        'ADMINISTRACION DESCONCENTRADA DE RECAUDACION DE BAJA CALIFORNIA',
      ],
      typeUser: [''],
      receiUser: [''],
      noExpedient: ['24355'],
      typeExpedient: ['AGR'],
      noRequest: ['27445'],
    });
  }

  setView(path: string): void {
    switch (path) {
      case 'registration-request':
        this.requestRegistration = true;
        break;
      case 'verify-compliance':
        this.complianceVerifi = true;
        break;
      case 'classify-assets':
        this.classifyAssets = true;
        break;
      case 'validate-document':
        this.validateDocument = true;
        break;
      case 'notify-clarification-inadmissibility':
        this.notifyClarifiOrImpropriety = true;
        break;
      case 'process-approval':
        this.approvalProcess = true;
        break;
      default:
        this.requestRegistration = true;
        break;
    }
  }

  intiTabs(): void {
    if (this.requestRegistration == true) {
      this.tab1 = 'Registro de Solicitud';
      this.tab2 = 'Bienes';
      this.tab3 = 'Domicilio de la Transferente';
      this.tab4 = 'Asociar Expediente';
      this.tab5 = 'Expediente';
      this.btnTitle = 'Verificar Cumplimiento';
    } else if (this.complianceVerifi == true) {
      this.tab1 = 'Detalle Solicitud';
      this.tab2 = 'Verificar Cumplimiento';
      this.tab3 = 'Expediente';
      this.btnTitle = 'Clasificar Bien';
    } else if (this.classifyAssets == true) {
      this.tab1 = 'Detalle Solicitud';
      this.tab2 = 'Clasificación de Bienes';
      this.tab3 = 'Expediente';
      this.btnTitle = 'Destino Documental';
    } else if (this.validateDocument) {
      this.tab1 = 'Detalle Solicitud';
      this.tab2 = 'Aclaraciones';
      this.tab3 = 'Identifica Destino Documental';
      this.btnTitle = 'Solicitar Aprobación';
    } else if (this.notifyClarifiOrImpropriety) {
      this.tab1 = 'Detalle de la Solicitud';
      this.tab2 = 'Bienes';
      this.tab3 = 'Expediente';
      this.btnTitle = 'Terminar';
      this.btnSaveTitle = 'Guardar';
    } else if (this.approvalProcess) {
      this.tab1 = 'Detalle de la Solicitud';
      this.tab2 = 'Bienes';
      this.tab3 = 'Domicilio de la Transferente';
      this.tab4 = 'Verificación del Cumplimiento';
      this.tab5 = 'Expediente';
      this.btnTitle = 'Aprovar';
      this.btnSaveTitle = '';
    }
  }

  confirm() {
    this.msgAvertanceModal(
      '',
      'Asegurse de tener guardado los formularios antes de turnar la solicitud!',
      'Confirmación',
      ''
    );
  }

  saveClarification(): void {
    this.saveClarifiObject = true;
  }

  close() {
    this.registRequestForm.reset();
    this.router.navigate(['pages/request/list']);
  }

  signDictum() {
    //habrir modal generar dictamen
    this.openModal(GenerateDictumComponent, '', 'approval-request');
  }

  msgAvertanceModal(
    btnTitle: string,
    message: string,
    title: string,
    typeMsg: any
  ) {
    this.alertQuestion(typeMsg, title, message, btnTitle).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        this.msgSaveModal(
          this.btnTitle,
          '¿Deseas turnar la solicitud con Folio:....?',
          'Confirmación',
          undefined
        );
      }
    });
  }

  msgSaveModal(btnTitle: string, message: string, title: string, typeMsg: any) {
    Swal.fire({
      title: title,
      text: message,
      icon: typeMsg,
      width: 450,
      showCancelButton: true,
      confirmButtonColor: '#9D2449',
      cancelButtonColor: '#b38e5d',
      confirmButtonText: btnTitle,
    }).then(result => {
      if (result.isConfirmed) {
        console.log('Guardar solicitud');
      }
    });
  }

  openModal(component: any, data?: any, typeAnnex?: String): void {
    let config: ModalOptions = {
      initialState: {
        data: data,
        typeAnnex: typeAnnex,
        callback: (next: boolean) => {
          //if (next){ this.getData();}
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalRef = this.modalService.show(component, config);

    this.modalRef.content.event.subscribe((res: any) => {
      // cargarlos en el formulario
      console.log(res);
    });
  }
}
