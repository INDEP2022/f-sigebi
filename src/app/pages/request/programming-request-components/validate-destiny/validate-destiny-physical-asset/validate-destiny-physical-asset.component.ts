import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ModelForm } from '../../../../../core/interfaces/model-form';
import { BasePage } from '../../../../../core/shared/base-page';

@Component({
  selector: 'app-validate-destiny-physical-asset',
  templateUrl: './validate-destiny-physical-asset.component.html',
  styleUrls: ['./validate-destiny-physical-asset.scss'],
})
export class ValidateDestinyPhysicalAssetComponent
  extends BasePage
  implements OnInit
{
  validateDestinyForm: ModelForm<any>;

  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.validateDestinyForm = this.fb.group({
      validateState: [null],
    });
  }

  save(): void {
    let message =
      '¿Seguro que quiere guardar las modificaciones (cambio irreversible)?';
    this.alertQuestion(
      undefined,
      'Guardar Validación',
      message,
      'Guardar'
    ).then(question => {
      if (question.isConfirmed) {
      }
    });
  }

  finishValidation(): void {
    let message = '¿Seguro que quiere terminar la tarea de validación?';
    this.alertQuestion(
      undefined,
      'Terminar Validación',
      message,
      'Aceptar'
    ).then(question => {
      if (question.isConfirmed) {
      }
    });
  }
}
