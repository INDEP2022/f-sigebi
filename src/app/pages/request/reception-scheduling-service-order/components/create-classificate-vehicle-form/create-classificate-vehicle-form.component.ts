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
  item: any;
  title: string = 'Clasificación de vehiculos';
  edit: boolean = false;
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

    if (this.item != null) {
      this.edit = true;
      this.form.patchValue(this.item);
    }
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  update() {
    this.alertQuestion(
      'warning',
      'Confirmación',
      '¿Deseas editar una clasificación de vehiculos?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar servicio
        this.onLoadToast('success', 'Clasificación editada correctamente', '');
        this.modalRef.content.callback(this.form.value);
        this.close();
      }
    });
  }
  create() {
    this.alertQuestion(
      'warning',
      'Confirmación',
      '¿Deseas crear una clasificación de vehiculos?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar servicio
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
