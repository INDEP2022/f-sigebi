import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Minpub } from 'src/app/core/models/parameterization/parametrization.model';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { MinPubService } from 'src/app/core/services/catalogs/minpub.service';
import { SubdelegationService } from 'src/app/core/services/catalogs/subdelegation.service';
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
    private readonly maintenceService: MinPubService,
    private readonly serviceDeleg: DelegationService,
    private readonly serviceSubDeleg: SubdelegationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.buildForm();
  }

  private buildForm() {
    this.form = this.fb.group({
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
      entity: [null],
      delegation: [null],
      subDelegation: [null],
    });

    this.form.get('entity').disable();
    this.form.get('delegation').disable();
    this.form.get('subDelegation').disable();
  }

  public saved() {
    if (!this.form.contains('idClave')) {
      this.form.addControl(
        'idClave',
        new FormControl(this.form.controls['city'].value)
      );
      this.form.addControl(
        'cityNumber',
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

  public updateEntity(data: any) {
    this.form.get('entity').patchValue(data.state.descCondition);
    this.getDelegation(data.noDelegation);
    this.getSubDelegation(data.noSubDelegation);
  }

  private getDelegation(delegation: number) {
    this.serviceDeleg.getById(delegation).subscribe({
      next: data => this.form.get('delegation').patchValue(data.description),
      error: () => {},
    });
  }

  private getSubDelegation(subDelegation: number) {
    this.serviceSubDeleg.getById(subDelegation).subscribe({
      next: data => this.form.get('subDelegation').patchValue(data.description),
      error: () => {},
    });
  }
}
