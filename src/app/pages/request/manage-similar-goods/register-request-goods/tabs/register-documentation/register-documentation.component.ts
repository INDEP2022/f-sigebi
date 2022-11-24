import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-register-documentation',
  templateUrl: './register-documentation.component.html',
  styles: [],
})
export class RegisterDocumentationComponent implements OnInit {
  /** INPUT VARIABLES */
  @Input() nombrePantalla: string = 'sinNombre';

  /** OUTPUT VARIABLES */
  @Output() formValues = new EventEmitter<any>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
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
  }

  onSubmit() {
    console.log(this.form.value);
    this.formValues.emit(this.form.value);
  }
}
