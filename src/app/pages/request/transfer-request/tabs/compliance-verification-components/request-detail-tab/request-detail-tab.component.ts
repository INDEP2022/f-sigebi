import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ModelForm } from 'src/app/core/interfaces/ModelForm';
import { IRequest } from 'src/app/core/models/catalogs/request.model';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-request-detail-tab',
  templateUrl: './request-detail-tab.component.html',
  styleUrls: ['./request-detail-tab.scss']
})
export class RequestDetailTabComponent extends BasePage implements OnInit {
  @Input() typeDoc = '';
  receptionForm: ModelForm<IRequest>;
  selectTypeExpedient = new DefaultSelect<IRequest>;

  constructor(
    public fb:FormBuilder
  ) {
    super();
   }

  ngOnInit(): void {   
    this.prepareForm();
    console.log("buscar documentos del tipo " + this.typeDoc);
    
  }

  prepareForm():void{
    this.receptionForm = this.fb.group({
      priority:[null],
      infoProvenance:['Mensajeria'],
      receptDate:[{value:'', disabled: true}],
      officeDate: [null, Validators.required],
      typeExpedient:['PAMA'],
      nameSender: ['LUIS RENTERA'],
      senderCharge: ['ADMINISTRADOR'],
      phoneSender: [123456789],
      emailSender: ['test@gmail.com'],
      publicMinister: ['MINISTRO TRANSFERENTE'],
      tribunal: ['JUZGADO TRANSFERENTE'],
      crime: ['DEUTO CAPTURA'],
      typeReception: [{value:'FISICO', disabled: true}], //esta campo depende de que tipo de recepcion es el formulario
      destinationManage: [null],
      contributor: [null],
      subject: [{value: 'SOLICITUD DE TRANSFERENCIA DE BIENES', disabled: true}],
      transExpedient: [null],
      typeTransfer: [null],
      transferEntityNotes: [null],
      observations: [null]
    });
  }

  getTypeExpedient(event: any){

  }

  confirm() {
    this.loading = true;
    console.log(this.receptionForm.value);
    
  }
}
