import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-register-appointment-tab',
  templateUrl: './register-appointment-tab.component.html',
  styles: [''],
})
export class RegisterAppointmentTabComponent
  extends BasePage
  implements OnInit
{
  @Output() onRegister = new EventEmitter<boolean>();
  appointmentForm: FormGroup = new FormGroup({});
  maxDate: Date = new Date();

  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.appointmentForm = this.fb.group({
      datetime: [null, [Validators.required]],
      place: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
    });
  }

  save() {
    //Llamar servicio para registrar cita
    console.log(this.appointmentForm.value);
    this.onRegister.emit(true);
    this.onLoadToast('success', 'Cita regisrada con éxito', '');
  }
}
