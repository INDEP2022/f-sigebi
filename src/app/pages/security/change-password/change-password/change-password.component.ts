/** BASE IMPORT */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';
/** LIBRERÍAS EXTERNAS IMPORTS */
import Swal from 'sweetalert2';

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent
  extends BasePage
  implements OnInit, OnDestroy
{
  cambioPasswordForm: FormGroup;

  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.loading = true;
  }
  prepareForm() {
    this.cambioPasswordForm = this.fb.group({
      confirmar: [null, [Validators.required]],
      nueva: [null, [Validators.required]],
    });
  }
  btnGuardar() {
    console.log('btnGuardar');
    if (this.cambioPasswordForm.valid) {
      if (
        this.cambioPasswordForm.value.nueva ==
        this.cambioPasswordForm.value.confirmar
      ) {
        this.message(
          'Correcto',
          'Las CONTRASEÑAS que se han ingresado son correctas.',
          'success'
        );
      } else {
        this.message(
          'Error',
          'No coninciden las CONTRASEÑAS que se han ingresado.',
          'danger'
        );
      }
    } else {
      this.message(
        'Advertencia',
        'Las CONTRASEÑAS se deben completar correctamente.',
        'warning'
      );
    }
  }
  message(title: string, text: string, type: any) {
    Swal.fire({
      title: title,
      text: text,
      icon: type,
      showCancelButton: false,
      confirmButtonColor: '#9D2449',
      confirmButtonText: 'Aceptar',
    }).then(result => {
      if (result.isConfirmed) {
        console.log('OK');
      }
    });
  }
}
