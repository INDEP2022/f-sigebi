import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  EMAIL_PATTERN,
  PHONE_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-register-complementary-documentation',
  templateUrl: './register-complementary-documentation.component.html',
})
export class RegisterComplementaryDocumentationComponent implements OnInit {
  /** INPUT VARIABLES */
  @Input() nombrePantalla: string = 'sinNombre';

  /** OUTPUT VARIABLES */
  @Output() formValues = new EventEmitter<any>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    console.log(this.nombrePantalla);
  }

  initForm() {
    this.form = this.fb.group({
      priority: [null, Validators.required],
      typeProceedings: [null, [Validators.required]],
      receptionDate: [null, [Validators.required]],
      proceedingsTransf: [null, [Validators.required]],
      issue: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      senderName: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      senderCharge: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      senderPhone: [
        null,
        Validators.required,
        Validators.pattern(PHONE_PATTERN),
        Validators.maxLength(13),
      ],
      senderEmail: [
        null,
        Validators.required,
        Validators.pattern(EMAIL_PATTERN),
      ],
      taxpayer: [null, Validators.required, Validators.pattern(STRING_PATTERN)],
      sourceInfo: [null, Validators.required],
      officeNumb: [null, Validators.required],
      officeDate: [null, [Validators.required]],
      viaRecept: [
        null,
        Validators.required,
        Validators.pattern(STRING_PATTERN),
      ],
      typeTransf: [
        null,
        Validators.required,
        Validators.pattern(STRING_PATTERN),
      ],
      judgmentType: [
        null,
        Validators.required,
        Validators.pattern(STRING_PATTERN),
      ],
      judgment: [null, Validators.required, Validators.pattern(STRING_PATTERN)],
      observations: [
        null,
        Validators.required,
        Validators.pattern(STRING_PATTERN),
      ],
    });
    if (
      (this.nombrePantalla == 'return-request-record' ||
        this.nombrePantalla == 'goods-classification') &&
      this.form
    ) {
      this.form.addControl(
        'orderingAuthority',
        new FormControl('', [Validators.required])
      );
    }
    if (this.nombrePantalla != 'register-documentation') {
      this.form.addControl('crime', new FormControl('', [Validators.required]));
      this.form.removeControl('recepcionDate');
    }
  }

  onSubmit() {
    console.log(this.form.value);
    this.formValues.emit(this.form.value);
  }
}
