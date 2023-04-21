import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-charge-documents-form',
  templateUrl: './charge-documents-form.component.html',
  styles: [],
})
export class ChargeDocumentsFormComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  constructor(private modalRef: BsModalRef, private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      file: [null],
    });
  }

  adjuntDocument() {
    this.alertQuestion(
      'warning',
      'Confirmación',
      '¿Estás seguro que quieres cargar el documento?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        this.onLoadToast('success', 'Documento cargado correctamente', '');
        this.modalRef.hide();
      }
    });
  }

  close() {
    this.modalRef.hide();
  }
}
