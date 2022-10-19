import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/ModelForm';
import { IRequest } from 'src/app/core/models/catalogs/request.model';
import { BasePage } from 'src/app/core/shared/base-page';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-registration-of-requests',
  templateUrl: './registration-of-requests.component.html',
  styleUrls: ['./registration-of-requests.component.scss']
})
export class RegistrationOfRequestsComponent extends BasePage implements OnInit {
  registRequestForm: ModelForm<IRequest>;
  edit:boolean = false;
  title: string = 'title';
  parameter: any;
  
  //registro de bienes tab
  state:boolean = false;
  //verificacion de cumplimientos tab
  complianceVerifi:boolean = true;

  constructor(
    public fb: FormBuilder,
    public modalRef:BsModalRef,
    public route: ActivatedRoute,
    public location: Location
  ) { 
    super();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => { console.log(params) })
    //this.title = this.parameter.title;
    //console.log(this.parameter);    
    this.prepareForm();
  }

  prepareForm(){
    this.registRequestForm = this.fb.group({
      date: [],
      noOfi: ['400-10-00-01*00*2020-7824'],
      regDelega: ['BAJA CALIFORNIA'],
      entity: ['Juan Pablo'],
      tranfe: ['SAT FISCO FEDERAL'],
      transmitter: ['ADMINISTRACION GENERAL DE RECAUDACION'],
      authority: ['ADMINISTRACION DESCONCENTRADA DE RECAUDACION DE BAJA CALIFORNIA'],
      typeUser: [''],
      receiUser: [''],
      noExpedient: ['24355'],
      typeExpedient: ['AGR'],
      noRequest: ['27445']
    });
  }

  confirm() {
    console.log('turnar con los datos guardados');
    
  }

  close() {
    //this.modalRef.hide();
    this.location.back();
  }
}
