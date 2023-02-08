import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-register-dictum-information',
  templateUrl: './register-dictum-information.component.html',
  styleUrls: ['./register-dictum-information.component.scss'],
})
export class RegisterDictumInformationComponent
  extends BasePage
  implements OnInit
{
  dictumForm: FormGroup = new FormGroup({});
  @Output() onSave = new EventEmitter<boolean>();
  maxDate: Date = new Date();

  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.dictumForm = this.fb.group({
      dictumNo: [null, [Validators.required]],
      dictumDate: [null],
      courtroom: [null, [Validators.required]],
      judgementNullity: [null, [Validators.required]],
      adminiResolutionNo: [null],
      paymentOrderNo: [null],
      paymentAmount: [null],
      contributor: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      address1: [null, [Validators.pattern(STRING_PATTERN)]],
      address2: [null, [Validators.pattern(STRING_PATTERN)]],
      legalRepresentative: [null, [Validators.pattern(STRING_PATTERN)]],
      requiredSatCopy: [null],
    });
  }

  save() {
    //Llamar servicio para guardar datos del dictamen
    console.log(this.dictumForm.value);
    this.onSave.emit(true);
    this.onLoadToast('success', 'Datos del dictamen registrados con éxito', '');
  }
}
