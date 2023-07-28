import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-maintenance-goods',
  templateUrl: './maintenance-goods.component.html',
  styleUrls: ['./maintenance-goods.component.scss'],
})
export class MaintenanceGoodsComponent extends BasePage implements OnInit {
  form: FormGroup;
  readOnlyDebeDecir = true;
  constructor(private fb: FormBuilder) {
    super();
    this.form = this.fb.group({
      gestion: [null, [Validators.required]],
      dice: [null],
      debeDecir: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
  }

  ngOnInit() {}

  searchDescription() {
    this.readOnlyDebeDecir = false;
    // llenar dice
  }

  updateDescription() {
    this.alertQuestion(
      'question',
      'Se actualizará la descripción del bien ¿Desea continuar?',
      ''
    ).then(question => {
      if (question.isConfirmed) {
        // actualizar descripción
      }
    });
  }

  clear() {
    this.form.reset();
  }
}
