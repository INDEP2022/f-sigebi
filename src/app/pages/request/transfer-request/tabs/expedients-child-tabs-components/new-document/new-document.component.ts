import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ModelForm } from 'src/app/core/interfaces/ModelForm';
import { BasePage } from 'src/app/core/shared/base-page';
import { IRequest } from 'src/app/core/models/catalogs/request.model';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-new-document',
  templateUrl: './new-document.component.html',
  styleUrls: ['./new-document.component.scss'],
})
export class NewDocumentComponent extends BasePage implements OnInit {
  title: string = 'Información Gneneral';
  newDocForm: ModelForm<IRequest>;
  selectTypeDoc = new DefaultSelect<IRequest>();
  request: IRequest;
  typeDoc: string = '';
  selectedFile: File;

  constructor(public fb: FormBuilder, public modalRef: BsModalRef) {
    super();
  }

  ngOnInit(): void {
    this.initForm();
    console.log('NEW DOC TIPO');

    console.log(this.typeDoc);
  }

  initForm(): void {
    this.newDocForm = this.fb.group({
      docType: [null],
      docFile: [null],
      docTit: [null],
      noExpedient: ['23360'],
      contributor: [null],
      regDelega: ['BAJA CALIFORNIA'],
      noOfi: [null],
      state: ['BAJA CALIFORNIA'],
      tranfe: ['SAT FISCO FEDERAL'],
      sender: [null],
      senderCharge: [null],
      responsible: [null],
      observations: [null],
    });
  }

  getTypeDoc(event: any) {}

  confirm() {
    console.log(this.newDocForm.getRawValue());
  }

  selectFile(event: any) {
    this.selectedFile = event.target.files;
  }

  close() {
    this.modalRef.hide();
  }
}
