import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';  
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'ngx-form-oficio',
  templateUrl: './form-oficio.component.html',
  styleUrls: ['./form-oficio.component.scss']
})
export class FormOficioComponent  {
    @Input() form: FormGroup;
    @Input() nombrePantalla: string;


//   public form: FormGroup;
@Output() formValues = new EventEmitter<any>();

  constructor() {  
  }

  ngOnInit(): void {
  }
  
mostrarInfo(): any{
  console.log(this.form.value);
  this.formValues.emit(this.form);
}

/**
 * Formulario
 */
public returnField(field) { return this.form.get(field); }
public returnShowRequirements(field) { return this.returnField(field)?.errors?.required && this.returnField(field).touched; }

}
