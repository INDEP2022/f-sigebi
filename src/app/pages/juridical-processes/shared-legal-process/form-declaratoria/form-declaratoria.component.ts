import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';  
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'ngx-form-declaratoria',
  templateUrl: './form-declaratoria.component.html',
  styleUrls: ['./form-declaratoria.component.scss']
})
export class FormDeclaratoriaComponent  {
    @Input() form: FormGroup;
    @Input() nombrePantalla: string;


//   public form: FormGroup;
@Output() formValues = new EventEmitter<any>();

  constructor() {  
  }

  ngOnInit(): void {
  }
  
mostrarInfoDeclaratoria(): any{
  console.log(this.form.value);
  this.formValues.emit(this.form);
}

/**
 * Formulario
 */
// public returnField(field) { return this.form.get(field); }
// public returnShowRequirements(field) { return this.returnField(field)?.errors?.required && this.returnField(field).touched; }

}
