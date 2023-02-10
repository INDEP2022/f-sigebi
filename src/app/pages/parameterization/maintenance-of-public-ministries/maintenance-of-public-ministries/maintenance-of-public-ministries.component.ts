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
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';

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
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      manager: [
        null,
        [Validators.maxLength(100), Validators.pattern(STRING_PATTERN)],
      ],
      street: [
        null,
        [Validators.maxLength(60), Validators.pattern(STRING_PATTERN)],
      ],
      insideNumber: [
        null,
        [Validators.maxLength(10), Validators.pattern(STRING_PATTERN)],
      ],
      outNumber: [
        null,
        [Validators.maxLength(100), Validators.pattern(STRING_PATTERN)],
      ],
      colony: [
        null,
        [Validators.maxLength(60), Validators.pattern(STRING_PATTERN)],
      ],
      delegNunic: [
        null,
        [Validators.maxLength(60), Validators.pattern(STRING_PATTERN)],
      ],
      zipCode: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      phone: [
        null,
        [Validators.maxLength(20), Validators.pattern(STRING_PATTERN)],
      ],
      city: [null],
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
            this.onLoadToast('success', 'Ha sido creado con éxito', '');
            this.form.reset();
          }
        },
        error: error => this.onLoadToast('error', error.erro.message, ''),
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
