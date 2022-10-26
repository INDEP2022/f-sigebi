import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IRequest } from 'src/app/core/models/catalogs/request.model';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-request-record-tab',
  templateUrl: './request-record-tab.component.html',
  styles: [],
})
export class RequestRecordTabComponent extends BasePage implements OnInit {
  receptionForm: ModelForm<IRequest>;
  selectTypeExpedient = new DefaultSelect<IRequest>();

  constructor(public fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.getCurrentDate();
    this.prepareForm();
  }

  prepareForm(): void {
    let fecha = this.getCurrentDate();
    this.receptionForm = this.fb.group({
      priority: [false],
      infoProvenance: [null],
      receptDate: [{ value: fecha, disabled: true }],
      officeDate: [null, Validators.required],
      typeExpedient: [null],
      indiciado: [null],
      nameSender: [null],
      roleSender: [null],
      phoneSender: [null],
      emailSender: [null, Validators.email],
      publicMinister: [null],
      sender: [null],
      tribunal: [null],
      crime: [null],
      typeReception: [{ value: 'FISICO', disabled: true }], //esta campo depende de que tipo de recepcion es el formulario
      destinationManage: [null],
      contributor: [null],
      subject: [
        { value: 'SOLICITUD DE TRANSFERENCIA DE BIENES', disabled: true },
      ],
      transExpedient: [null],
      typeTransfer: [null],
      transferEntityNotes: [null],
      observations: [null],
    });
  }

  getCurrentDate(): string {
    var today = new Date();
    var year = today.getFullYear();
    var mes = today.getMonth() + 1;
    var dia = today.getDate();
    var fecha = dia + '/' + mes + '' + year;
    console.log(fecha);
    return fecha;
  }

  getTypeExpedient(event: any) {}

  confirm() {
    this.loading = true;
    console.log(this.receptionForm.value);
  }
}
