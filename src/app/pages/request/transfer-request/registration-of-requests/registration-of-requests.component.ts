import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IRequest } from 'src/app/core/models/catalogs/request.model';
import { BasePage } from 'src/app/core/shared/base-page';
import Swal from 'sweetalert2';

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
  //tabs
  tab1: string = '';
  tab2: string = '';
  tab3: string = '';

  //registro de bienes tab
  state: boolean = false;
  //verificacion de cumplimientos tab
  complianceVerifi: boolean = true;
  //clasificacion de bienes
  classifyAssets: boolean = false;

  constructor(
    public fb: FormBuilder,
    public modalRef: BsModalRef,
    public route: ActivatedRoute,
    public location: Location
  ) {
    super();
  }

  ngOnInit(): void {
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

  intiTabs(): void {
    if (this.state == true) {
      this.tab1 = 'Registro de Solicitud';
      this.tab2 = 'Bienes';
      this.tab3 = 'Domicilio de la Transferencia';
      this.btnTitle = 'Guardar Proceso'; //cambiar el nombre al real
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
    }
  }
  confirm() {
    this.msgAvertanceModal(
      'Aceptar',
      'Asegurse de tener guardado los formularios antes de turnar la solicitud!',
      'Confirmación',
      ''
    );
  }

  close() {
    this.location.back();
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
}
