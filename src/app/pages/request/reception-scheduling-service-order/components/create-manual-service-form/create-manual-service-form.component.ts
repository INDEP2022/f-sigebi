import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-create-manual-service-form',
  templateUrl: './create-manual-service-form.component.html',
  styles: [],
})
export class CreateManualServiceFormComponent
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
      description: [null, [Validators.required]],
      UnitMeasureService: [null, [Validators.required]],
      priceUnitary: [null, [Validators.required]],
    });
  }
  confirm() {
    this.alertQuestion(
      'warning',
      'Confirmación',
      '¿Estas seguro que deseas crear el servicio manual?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        this.onLoadToast('success', 'Servicio manual creado correctamente', '');
        this.modalRef.content.callback(this.form.value);
        this.close();
      }
    });
  }

  close() {
    this.modalRef.hide();
  }
}
