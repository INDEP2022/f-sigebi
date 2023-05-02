/** BASE IMPORT */
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

@Component({
  selector: 'ngx-users-desbloqueo-usuario',
  templateUrl: './users-desbloqueo-usuario.component.html',
  styleUrls: ['./users-desbloqueo-usuario.component.scss'],
})
export class UsersDesbloqueoUsuarioComponent
  extends BasePage
  implements OnInit
{
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
      fechaUltimoCambioPassword: ['', [Validators.maxLength(11)]], // 11 date
      accountStatus: ['', [Validators.maxLength(32)]], // 32 char
      observaciones: ['', [Validators.maxLength(500)]], // 500 char
    });
  }
  btnDesbloquearUsuario() {
    console.log('btnDesbloquearUsuario');
    if (this.form.value) {
      this.formValues.emit(this.form.value);
    }
  }
}
