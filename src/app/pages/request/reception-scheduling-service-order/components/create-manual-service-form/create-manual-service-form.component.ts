import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

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
      description: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      UnitMeasureService: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      priceUnitary: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
  }
  confirm() {
    this.alertQuestion(
      'warning',
      'Confirmación',
      '¿Estás seguro que desea crear el servicio manual?'
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
