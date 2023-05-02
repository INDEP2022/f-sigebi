import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-consult-txt',
  templateUrl: './consult-txt.component.html',
  styles: [],
})
export class ConsultTxtComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  constructor(private modalRef: BsModalRef, private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      typeRequest: [null, [Validators.required]],
      check: [false],
      file: [null, [Validators.required]],
    });
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.alertQuestion(
      'warning',
      'Confirmación',
      '¿Desea subir el archivo de busqueda?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        this.modalRef.content.callback(this.form.get('file').value);
        this.onLoadToast('success', 'Archivo txt cargado correctamente', '');
        this.close();
      }
    });
  }
}
