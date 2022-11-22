import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-create-classificate-vehicle-form',
  templateUrl: './create-classificate-vehicle-form.component.html',
  styles: [],
})
export class CreateClassificateVehicleFormComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup = new FormGroup({});
  constructor(private modalRef: BsModalRef, private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      typeVehicle: [null],
      sale: [null],
      donation: [null],
      destruction: [null],
    });
  }

  confirm() {
    this.alertQuestion(
      'warning',
      'Confirmación',
      '¿Deseas crear una clasificación de vehiculos?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        this.onLoadToast('success', 'Clasificación creada correctamente', '');
        this.modalRef.content.callback(this.form.value);
        this.close();
      }
    });
  }

  close() {
    this.modalRef.hide();
  }
}
