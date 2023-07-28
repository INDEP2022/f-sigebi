import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-maintenance-fraction',
  templateUrl: './maintenance-fraction.component.html',
  styleUrls: ['./maintenance-fraction.component.scss'],
})
export class MaintenanceFractionComponent extends BasePage implements OnInit {
  form: FormGroup;
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

  update() {}

  clear() {
    this.form.reset();
  }
}
