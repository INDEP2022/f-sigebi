import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

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
      issue: [null, [Validators.required]],
      senderName: [null, [Validators.required]],
      senderCharge: [null, [Validators.required]],
      senderPhone: [null, Validators.required],
      senderEmail: [null, Validators.required],
      taxpayer: [null, Validators.required],
      sourceInfo: [null, Validators.required],
      officeNumb: [null, Validators.required],
      officeDate: [null, [Validators.required]],
      viaRecept: [null, Validators.required],
      typeTransf: [null, Validators.required],
      judgmentType: [null, Validators.required],
      judgment: [null, Validators.required],
      observations: [null, Validators.required],
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
