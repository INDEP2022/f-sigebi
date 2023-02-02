import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Minpub } from 'src/app/core/models/parameterization/parametrization.model';
import { MinPubService } from 'src/app/core/services/catalogs/minpub.service';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-maintenance-of-public-ministries',
  templateUrl: './maintenance-of-public-ministries.component.html',
  styles: [],
})
export class MaintenanceOfPublicMinistriesComponent
  extends BasePage
  implements OnInit
{
  form!: FormGroup;
  formData: Minpub = {} as Minpub;

  constructor(
    private readonly fb: FormBuilder,
    private readonly maintenceService: MinPubService
  ) {
    super();
  }

  ngOnInit(): void {
    this.buildForm();
  }

  private buildForm() {
    this.form = this.fb.group({
      pubMinistry: [null, [Validators.required]],
      description: [
        null,
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(100),
        ],
      ],
      manager: [null, Validators.required],
      street: [null, Validators.required],
      insideNumber: [null, Validators.required],
      outNumber: [null, Validators.required],
      colony: [null, Validators.required],
      delegNunic: [null, Validators.required],
      zipCode: [null, Validators.required],
      phone: [null, Validators.required],
      city: [null, [Validators.required]],
      // delegation: [null, [Validators.required]],
      // subdelegation: [null, [Validators.required]],
      entity: [null, Validators.required],
    });
  }
  saved() {
    if (!this.form.contains('idClave')) {
      this.form.addControl(
        'idClave',
        new FormControl(this.form.controls['city'].value)
      );
    }

    if (this.form.valid) {
      this.maintenceService.create(this.form.value).subscribe({
        next: (resp: any) => {
          if (resp.statusCode == 201) {
            this.onLoadToast(
              'success',
              'Creacion ministerio publico',
              'Ha sido creado con éxito'
            );
            this.form.reset();
          }
        },
        error: () =>
          this.onLoadToast(
            'error',
            'Conexión',
            'Revise su conexion de internet'
          ),
      });
    }
  }
}
