/** BASE IMPORT */
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

@Component({
  selector: 'ngx-users-baja-usuario',
  templateUrl: './users-baja-usuario.component.html',
  styleUrls: ['./users-baja-usuario.component.scss'],
})
export class UsersBajaUsuarioComponent extends BasePage implements OnInit {
  @Output() formValues = new EventEmitter<any>();
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.loading = true;
  }
  prepareForm() {
    this.form = this.fb.group({
      habilitarFecha: [''], // check
      fechaSolicitudBaja: ['', [Validators.maxLength(10)]], // 10 date dd-mm-yyyy
      fechaBaja: ['', [Validators.maxLength(10)]], // 10 date dd-mm-yyyy
      usuarioBaja: ['', [Validators.maxLength(30)]], // 30 char
      observaciones: ['', [Validators.maxLength(500)]], // 500 char
    });
  }
  btnBajaUsuario() {
    console.log('btnBajaUsuario');
    if (this.form.value) {
      this.formValues.emit(this.form.value);
    }
  }
}
