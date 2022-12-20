import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IRequest } from 'src/app/core/models/catalogs/request.model';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-request-record-tab',
  templateUrl: './request-record-tab.component.html',
  styles: [],
})
export class RequestRecordTabComponent extends BasePage implements OnInit {
  @Input() dataObject: any;
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
    //console.log(this.dataObject);
    let fecha = this.getCurrentDate();
    this.receptionForm = this.fb.group({
      priority: [false],
      infoProvenance: [null, [Validators.pattern(STRING_PATTERN)]],
      receptDate: [{ value: fecha, disabled: true }],
      officeDate: [null, Validators.required],
      typeExpedient: [null],
      indiciado: [null, [Validators.pattern(STRING_PATTERN)]],
      nameSender: [null, [Validators.pattern(STRING_PATTERN)]],
      roleSender: [null, [Validators.pattern(STRING_PATTERN)]],
      phoneSender: [null],
      emailSender: [null, Validators.email],
      publicMinister: [null],
      sender: [null, [Validators.pattern(STRING_PATTERN)]],
      tribunal: [null, [Validators.pattern(STRING_PATTERN)]],
      crime: [null, [Validators.pattern(STRING_PATTERN)]],
      typeReception: [
        { value: 'FISICO', disabled: true },
        [Validators.pattern(STRING_PATTERN)],
      ], //esta campo depende de que tipo de recepcion es el formulario
      destinationManage: [null, [Validators.pattern(STRING_PATTERN)]],
      contributor: [null, [Validators.pattern(STRING_PATTERN)]],
      subject: [
        { value: 'SOLICITUD DE TRANSFERENCIA DE BIENES', disabled: true },
        [Validators.pattern(STRING_PATTERN)],
      ],
      transExpedient: [null, [Validators.pattern(STRING_PATTERN)]],
      typeTransfer: [null, [Validators.pattern(STRING_PATTERN)]],
      transferEntityNotes: [null, [Validators.pattern(STRING_PATTERN)]],
      observations: [null, [Validators.pattern(STRING_PATTERN)]],
    });
  }

  getCurrentDate(): string {
    var today = new Date();
    var year = today.getFullYear();
    var mes = today.getMonth() + 1;
    var dia = today.getDate();
    var fecha = dia + '/' + mes + '' + year;
    return fecha;
  }

  getTypeExpedient(event: any) {}

  confirm() {
    this.loading = true;
    console.log(this.receptionForm.value);
  }
}
