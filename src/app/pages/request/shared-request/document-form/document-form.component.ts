import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-document-form',
  templateUrl: './document-form.component.html',
  styles: [],
})
export class DocumentFormComponent extends BasePage implements OnInit {
  documentForm: FormGroup = new FormGroup({});
  typesDocuments = new DefaultSelect();
  constructor(private fb: FormBuilder, private modalRef: BsModalRef) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.documentForm = this.fb.group({
      typeDocument: [null, [Validators.required]],
      document: [null, [Validators.required]],
      titleDocument: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      numberGestion: [5296016],
      noSIAB: [null],
      responsible: [null, [Validators.pattern(STRING_PATTERN)]],
      delegation: ['Metropolitana', [Validators.pattern(STRING_PATTERN)]],
      taxpayer: [null, [Validators.pattern(STRING_PATTERN)]],
      state: [null],
      numberOffice: [null],
      transferent: [null],
      numberProgramming: [5397],
      sender: [null, [Validators.pattern(STRING_PATTERN)]],
      programmingFolio: ['R-METROPOLITANA-SAT-5397-OS'],
      senderCharge: [null, [Validators.pattern(STRING_PATTERN)]],
      comments: [null, [Validators.pattern(STRING_PATTERN)]],
    });
  }

  getDocumentSelect(typeDocument: ListParams) {}

  confirm() {
    this.alertQuestion(
      'warning',
      'Confirmación',
      '¿Estas seguro que deseas crear un nuevo documento?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        this.onLoadToast('success', 'Documento creado correctamente', '');

        this.close();
      }
    });
  }

  close() {
    this.modalRef.hide();
  }
}
