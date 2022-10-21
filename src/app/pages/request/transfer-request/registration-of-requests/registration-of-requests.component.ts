import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IRequest } from 'src/app/core/models/catalogs/request.model';
import { BasePage } from 'src/app/core/shared/base-page';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

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
  //tabs
  tab1: string = '';
  tab2: string = '';
  tab3: string = '';
  //registro de bienes tab
  state: boolean = false;
  //verificacion de cumplimientos tab
  complianceVerifi: boolean = false;
  //clasificacion de bienes
  classifyAssets: boolean = true;

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
    this.route.params.subscribe(params => {
      this.prepareForm();
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
    } else if (this.complianceVerifi == true) {
      this.tab1 = 'Detalle Solicitud';
      this.tab2 = 'Verificar Cumplimiento';
      this.tab3 = 'Expediente';
    } else if (this.classifyAssets == true) {
      this.tab1 = 'Detalle Solicitud';
      this.tab2 = 'Clasificación de Bienes';
      this.tab3 = 'Expediente';
    }
  }
  confirm() {
    this.msgAvertanceModal(
      'Aceptar',
      'Asegurse de tener guardado los formularios antes de turnar el folio',
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
          'Clasificar Bien',
          '¿Deseas turnar la solicitud con Folio:....?',
          'Confirmación',
          ''
        );
      }
    });
  }

  msgSaveModal(btnTitle: string, message: string, title: string, typeMsg: any) {
    this.alertQuestion(typeMsg, title, message, btnTitle).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        console.log('Guardar Solicitud');
      }
    });
  }
}
