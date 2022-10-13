import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/ModelForm';
import { IRequest } from 'src/app/core/models/catalogs/request.model';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-registration-of-requests',
  templateUrl: './registration-of-requests.component.html',
  styleUrls: ['./registration-of-requests.component.scss']
})
export class RegistrationOfRequestsComponent extends BasePage implements OnInit {
  registRequestForm: ModelForm<any>;
  edit:boolean = false;
  title: string = '';


  constructor(
    public fb: FormBuilder,
    public modalRef:BsModalRef
  ) { 
    super();
  }

  ngOnInit(): void {
    this.prepareForm();

    console.log(this.registRequestForm.get('entity'));
    
  }

  prepareForm(){
    this.registRequestForm = this.fb.group({
      date: [{value:'18-10-2022', disabled:'disabled'}],
      noOfi: [{value:'400-10-00-01*00*2020-7824', disabled:'disabled'}],
      regDelega: [{value:'BAJA CALIFORNIA', disabled:'disabled'}],
      entity: [{value:'Juan Pablo', disabled:'disabled'}],
      tranfe: [{value:'SAT FISCO FEDERAL', disabled:'disabled'}],
      transmitter: [{value:'ADMINISTRACION GENERAL DE RECAUDACION', disabled:'disabled'}],
      authority: [{value:'ADMINISTRACION DESCONCENTRADA DE RECAUDACION DE BAJA CALIFORNIA', disabled:'disabled'}],
      typeUser: [{value:'', disabled:'disabled'}],
      receiUser: [{value:'', disabled:'disabled'}],
      noExpedient: [{value:'24355', disabled:'disabled'}],
      typeExpedient: [{value:'AGR', disabled:'disabled'}],
      noRequest: [{value:'27445', disabled:'disabled'}]
    });
  }

  confirm() {}

  close() {
    this.modalRef.hide();
  }
}
