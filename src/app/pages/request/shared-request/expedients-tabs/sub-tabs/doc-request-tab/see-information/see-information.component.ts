import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IRequest } from 'src/app/core/models/catalogs/request.model';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-see-information',
  templateUrl: './see-information.component.html',
  styleUrls: ['./see-information.component.scss'],
})
export class SeeInformationComponent extends BasePage implements OnInit {
  title: string = 'Información del Documento';
  infoForm: ModelForm<IRequest>;
  info: any;
  typeInfo: string = '';

  constructor(private modalRef: BsModalRef, private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.initForm();
    console.log(this.info + ' mostrado');

    console.log(this.typeInfo);
  }

  initForm(): void {
    this.infoForm = this.fb.group({
      docType: ['SOLICITUD DE TRANSFERENCIA'],
      author: [null],
      noReq: [null],
      noGood: [null],
      regDelega: [null],
      state: [null],
      transfe: [null],
      typeTransfer: [null],
      sender: [null],
      roleSender: [null],
      responsible: [null],
      contributor: [null],
      date: [null],
      noOfi: [null],
      observations: [null],
    });
  }

  close(): void {
    this.modalRef.hide();
  }
}
