/** BASE IMPORT */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';
/** LIBRERÍAS EXTERNAS IMPORTS */
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { Example } from 'src/app/core/models/catalogs/example';
import Swal from 'sweetalert2';

/** SERVICE IMPORTS */
import { ExampleService } from 'src/app/core/services/catalogs/example.service';

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-register-document-return',
  templateUrl: './register-document-return.component.html',
  styleUrls: ['./register-document-return.component.scss'],
})
export class RegisterDocumentReturnComponent
  extends BasePage
  implements OnInit, OnDestroy
{
  items = new DefaultSelect<Example>();
  public form: FormGroup;

  constructor(private fb: FormBuilder, private exampleService: ExampleService) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.loading = true;
  }

  private prepareForm() {
    this.form = this.fb.group({
      fechaSolicitud: ['', [Validators.required]],
      noOficio: ['', [Validators.required]],
      delegacionRegional: ['', [Validators.required]], // Select delegaciones
      estado: ['', [Validators.required]], // Select estado
      transferente: ['', [Validators.required]], // Select transferente
      emisora: ['', [Validators.required]], // Select emisora
      autoridad: ['', [Validators.required]], // Select autoridad
      asunto: ['', [Validators.required]], // Select asunto
      tipoUsuario: ['', [Validators.required]], // Radio button (T.E. SAE) Buscador
      usuarioRecepcion: ['', [Validators.required]], // Usuario -- Correo electronico
    });
  }
  btnGuardar() {
    console.log('btnGuardar');
  }
  getFromSelect(params: ListParams) {
    this.exampleService.getAll(params).subscribe(data => {
      this.items = new DefaultSelect(data.data, data.count);
    });
  }
  btnTurnar() {
    Swal.fire({
      title: 'Verifica los datos antes de continuar!',
      html:
        '<p>Se ha seleccionado el asunto: <span class="badge badge-info bg-info">"DEVOLUCIÓN"</span>.</p></br>' +
        '<p>¿Desea turnar la solicitud con Folio: <span class="badge badge-success bg-success">"12345"</span>.?</p>',
      icon: undefined,
      showCancelButton: true,
      confirmButtonColor: '#9D2449',
      cancelButtonColor: '#b38e5d',
      confirmButtonText: 'Turnar',
      cancelButtonText: 'Cancelar',
    }).then(result => {
      if (result.isConfirmed) {
        Swal.fire(
          '¡Guardado!',
          'Se envio la solicitud correctamente.',
          'success'
        );
      }
    });
  }
}
