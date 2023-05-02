/** BASE IMPORT */
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';
/** LIBRERÍAS EXTERNAS IMPORTS */
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { Example } from 'src/app/core/models/catalogs/example';

/** SERVICE IMPORTS */
import { ExampleService } from 'src/app/core/services/catalogs/example.service';

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'ngx-users-alta-usuario',
  templateUrl: './users-alta-usuario.component.html',
  styleUrls: ['./users-alta-usuario.component.scss'],
})
export class UsersAltaUsuarioComponent extends BasePage implements OnInit {
  form: FormGroup;
  items = new DefaultSelect<Example>();

  @Output() formValues = new EventEmitter<any>();
  altaUsuarioForm: FormGroup;
  datosUsuarioForm: FormGroup;

  constructor(private exampleService: ExampleService, private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.loading = true;
  }
  prepareForm() {
    this.altaUsuarioForm = this.fb.group({
      fechaSolicitudAlta: ['', [Validators.maxLength(10)]], // 10 date dd-mm-yyyy
      usuarioAlta: ['', [Validators.maxLength(30)]], // 30 char
      fechaAlta: ['', [Validators.maxLength(10)]], // 10 date dd-mm-yyyy
    });

    this.datosUsuarioForm = this.fb.group({
      usuario: ['', [Validators.required, Validators.maxLength(30)]], //30 char si
      perfil: ['', [Validators.maxLength(30)]], //30 char
      nombre: ['', [Validators.required, Validators.maxLength(100)]], //100 char si
      rfc: ['', [Validators.maxLength(13)]], //13 char
      curp: ['', [Validators.maxLength(20)]], //20 char
      calle: ['', [Validators.maxLength(30)]], //30 char
      noInterior: ['', [Validators.maxLength(10)]], //10 char
      colonia: ['', [Validators.maxLength(60)]], //60 char
      codigoPostal: ['', [Validators.maxLength(5)]], //5 number
      telefono: ['', [Validators.maxLength(20)]], //20 char
      profesion: ['', [Validators.maxLength(60)]], //60 char
      noCargo: ['', [Validators.required]], // Select required
      correoElectronico: ['', [Validators.maxLength(50)]], // 50 char
      usuarioCopiaPermisos: [''], // Select
      observaciones: ['', [Validators.maxLength(500)]], // 500 char
    });
  }

  btnCrearUsuarioSIAB() {
    console.log('Captura copias');
    var objData: any;
    objData['altaUsuarioForm'] = this.altaUsuarioForm.value;
    objData['datosUsuarioForm'] = this.datosUsuarioForm.value;
    if (this.altaUsuarioForm.valid && this.datosUsuarioForm.valid) {
      this.formValues.emit(objData);
    }
  }

  getFromSelect(params: ListParams) {
    this.exampleService.getAll(params).subscribe(data => {
      this.items = new DefaultSelect(data.data, data.count);
    });
  }
}
