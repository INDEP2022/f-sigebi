import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-register-dictum-val',
  templateUrl: './register-dictum-val.component.html',
  styles: [],
})
export class RegisterDictumValComponent extends BasePage implements OnInit {
  validateForm: FormGroup = new FormGroup({});
  @Output() onSave = new EventEmitter<boolean>();

  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.validateForm = this.fb.group({
      dictumNo: [null, [Validators.required]],
      courtroom: [null, [Validators.required]],
      judmentNullity: [null, [Validators.required]],
    });
  }

  save() {
    //Llamar servicio para guardar datos del dictamen
    console.log(this.validateForm.value);
    this.onSave.emit(true);
    this.onLoadToast('success', 'Datos del dictamen registrados con éxito', '');
  }
}
