import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import {
  FilterParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IMinpub } from 'src/app/core/models/catalogs/minpub.model';
import { Minpub } from 'src/app/core/models/parameterization/parametrization.model';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { EntFedService } from 'src/app/core/services/catalogs/entfed.service';
import { MinPubService } from 'src/app/core/services/catalogs/minpub.service';
import { SubdelegationService } from 'src/app/core/services/catalogs/subdelegation.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { MaintenanceListComponent } from '../maintenance-list/maintenance-list.component';

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
  edit: boolean = false;
  constructor(
    private readonly fb: FormBuilder,
    private readonly maintenceService: MinPubService,
    private readonly serviceDeleg: DelegationService,
    private readonly serviceSubDeleg: SubdelegationService,
    private readonly serviceFederation: EntFedService,
    private readonly modalService: BsModalService
  ) {
    super();
  }

  ngOnInit(): void {
    this.buildForm();
  }

  openModal() {
    let config: ModalOptions = {
      initialState: {
        callback: (next: boolean, data: IMinpub) => {
          if (next) {
            this.edit = next;
            this.form.patchValue(data);
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(MaintenanceListComponent, config);
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
        [
          Validators.minLength(1),
          Validators.maxLength(100),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      street: [
        null,
        [
          Validators.minLength(1),
          Validators.maxLength(60),
          Validators.pattern(STRING_PATTERN),
        ],
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
        [
          Validators.minLength(1),
          Validators.maxLength(60),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      delegNunic: [
        null,
        [
          Validators.minLength(1),
          Validators.maxLength(60),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      zipCode: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      phone: [
        null,
        [Validators.maxLength(20), Validators.pattern(STRING_PATTERN)],
      ],
      idCity: [null],
      entity: [null],
      delegation: [null],
      subDelegation: [null],
      cityNumber: [null],
      id: [null],
    });

    this.form.get('entity').disable();
    this.form.get('delegation').disable();
    this.form.get('subDelegation').disable();
  }

  public confirm() {
    this.form.get('cityNumber').patchValue(this.form.controls['idCity'].value);
    if (this.form.valid) {
      this.loading = true;
      if (this.edit) {
        this.maintenceService.update('', this.form.value).subscribe({
          next: () => {
            this.onLoadToast('success', 'Ha sido actualizado con éxito', '');
            this.clean();
          },
          error: error => {
            this.loading = false;
            this.onLoadToast('error', error.erro.message, '');
          },
        });
      } else {
        const filter = new FilterParams();
        const { description } = this.form.value;

        filter.removeAllFilters();
        filter.addFilter('description', description, SearchFilter.EQ);

        this.maintenceService.getAllWithFilters(filter.getParams()).subscribe({
          next: resp => {
            if (resp.data.length > 0) {
              this.loading = false;
              this.onLoadToast('error', 'Descripción ya registrada', '');
            } else {
              this.maintenceService.create(this.form.value).subscribe({
                next: () => {
                  this.onLoadToast('success', 'Ha sido creado con éxito', '');
                  this.clean();
                },
                error: error => {
                  this.loading = false;
                  this.onLoadToast('error', error.erro.message, '');
                },
              });
            }
          },
          error: err => {
            this.loading = false;
            this.onLoadToast('error', err.error.message, '');
          },
        });
      }
    }
  }

  public updateEntity(data: any) {
    if (data) {
      if (typeof data.state == 'string') {
        this.getEntidad(data.state);
      } else {
        this.form.get('entity').patchValue(data.state.descCondition);
      }
      this.getDelegation(data.noDelegation);
      this.getSubDelegation(data.noSubDelegation);
    }
  }

  private getEntidad(id: number) {
    this.serviceFederation.getById(id).subscribe({
      next: data => this.form.get('entity').patchValue(data.otWorth),
      error: error => this.onLoadToast('error', error.erro.message, ''),
    });
  }

  private getDelegation(delegation: number) {
    this.serviceDeleg.getById(delegation).subscribe({
      next: data => this.form.get('delegation').patchValue(data.description),
      error: error => this.onLoadToast('error', error.erro.message, ''),
    });
  }

  private getSubDelegation(subDelegation: number) {
    this.serviceSubDeleg.getById(subDelegation).subscribe({
      next: data => this.form.get('subDelegation').patchValue(data.description),
      error: error => this.onLoadToast('error', error.erro.message, ''),
    });
  }

  clean() {
    this.form.reset();
    this.edit = false;
    this.loading = false;
  }
}
