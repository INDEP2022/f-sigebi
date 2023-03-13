import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IRequest } from 'src/app/core/models/catalogs/request.model';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

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
  toggleSearch: boolean = true;

  constructor(public fb: FormBuilder, public modalRef: BsModalRef) {
    super();
  }

  ngOnInit(): void {
    console.log(this.typeDoc);
    this.initForm();
    //console.log('NEW DOC TIPO');
    //console.log(this.typeDoc);
  }

  initForm(): void {
    this.newDocForm = this.fb.group({
      docType: [null],
      docFile: [null],
      docTit: [null, [Validators.pattern(STRING_PATTERN)]],
      noExpedient: ['23360'],
      contributor: [null, [Validators.pattern(STRING_PATTERN)]],
      regDelega: ['BAJA CALIFORNIA'],
      noOfi: [null],
      state: ['BAJA CALIFORNIA'],
      tranfe: ['SAT FISCO FEDERAL'],
      sender: [null, [Validators.pattern(STRING_PATTERN)]],
      senderCharge: [null, [Validators.pattern(STRING_PATTERN)]],
      responsible: [null, [Validators.pattern(STRING_PATTERN)]],
      observations: [null, [Validators.pattern(STRING_PATTERN)]],
    });
    this.newDocForm.addControl(
      'returnOpinionFolio',
      new FormControl('', [Validators.required])
    );
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
