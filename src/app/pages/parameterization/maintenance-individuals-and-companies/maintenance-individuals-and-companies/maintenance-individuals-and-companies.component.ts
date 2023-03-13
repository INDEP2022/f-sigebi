import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { IPerson } from 'src/app/core/models/catalogs/person.model';
import { PersonService } from 'src/app/core/services/catalogs/person.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  NUMBERS_PATTERN,
  PHONE_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { ListIndividualsAndCompaniesComponent } from '../list-individuals-and-companies/list-individuals-and-companies.component';

@Component({
  selector: 'app-maintenance-individuals-and-companies',
  templateUrl: './maintenance-individuals-and-companies.component.html',
  styles: [],
})
export class MaintenanceIndividualsAndCompaniesComponent
  extends BasePage
  implements OnInit
{
  form!: FormGroup;
  isCreate: boolean = true;
  edit: boolean = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly personService: PersonService,
    private readonly modalService: BsModalService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      id: [
        { value: null, disabled: true },
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      personName: [
        null,
        [
          Validators.pattern(STRING_PATTERN),
          Validators.required,
          Validators.maxLength(30),
        ],
      ],
      name: [
        null,
        [
          Validators.maxLength(200),
          Validators.pattern(STRING_PATTERN),
          Validators.required,
        ],
      ],
      street: [
        null,
        [Validators.maxLength(200), Validators.pattern(STRING_PATTERN)],
      ],
      streetNumber: [
        null,
        [Validators.maxLength(10), Validators.pattern(STRING_PATTERN)],
      ],
      apartmentNumber: [
        null,
        [Validators.maxLength(10), Validators.pattern(STRING_PATTERN)],
      ],
      suburb: [
        null,
        [Validators.maxLength(100), Validators.pattern(STRING_PATTERN)],
      ],
      zipCode: [null, Validators.pattern(NUMBERS_PATTERN)],
      delegation: [
        null,
        [Validators.maxLength(100), Validators.pattern(STRING_PATTERN)],
      ],
      federative: [null],
      phone: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.pattern(PHONE_PATTERN)],
      ],
      observations: [
        null,
        [Validators.maxLength(100), Validators.pattern(STRING_PATTERN)],
      ],
      rfc: [
        null,
        [Validators.maxLength(20), Validators.pattern(STRING_PATTERN)],
      ],
      curp: [
        null,
        [Validators.maxLength(20), Validators.pattern(STRING_PATTERN)],
      ],
      curriculumV: [null],
      curriculum: ['N'],
      typePerson: [null, Validators.required],
      keyOperation: [null],
      profile: [
        null,
        [Validators.maxLength(500), Validators.pattern(STRING_PATTERN)],
      ],
      manager: [
        null,
        [Validators.maxLength(60), Validators.pattern(STRING_PATTERN)],
      ],
      numberDeep: [
        null,
        [Validators.maxLength(20), Validators.pattern(STRING_PATTERN)],
      ],
      keyEntFed: [null, [Validators.required]],
      typeResponsible: [null],
    });

    this.onChangeForm();
  }

  onChangeForm() {
    this.form.get('curriculumV').valueChanges.subscribe({
      next: (value: boolean) =>
        this.form.get('curriculum').patchValue(value ? 'S' : 'N'),
    });

    this.form.get('typePerson').valueChanges.subscribe({
      next: (value: string) => {
        if (value === 'F') {
          this.form.get('manager').patchValue(null);
          this.form.get('numberDeep').patchValue(null);
        }
      },
    });

    this.form.get('federative').valueChanges.subscribe({
      next: (value: string) => {
        this.form.get('keyEntFed').patchValue(value);
      },
    });
  }

  confirm() {
    if (this.form.valid) {
      this.form.get('typeResponsible').patchValue('D');
      if (this.edit) {
        this.form.get('id').enable();
        const { id } = this.form.value;
        this.personService.update(id, this.form.value).subscribe({
          next: () => {
            this.onLoadToast('success', 'Ha sido actualizado con éxito', '');
            this.clean();
          },
          error: error => this.onLoadToast('error', error.error.message, ''),
        });
      } else {
        this.personService.create(this.form.value).subscribe({
          next: () => {
            this.onLoadToast('success', 'Ha sido creado con éxito', '');
            this.clean();
          },
          error: error => {
            this.onLoadToast('error', error.error.message, '');
            this.loading = false;
          },
        });
      }
    }
  }

  openModal() {
    let config: ModalOptions = {
      initialState: {
        callback: (next: boolean, data: IPerson) => {
          if (next) {
            this.edit = next;
            this.form.patchValue(data);
            this.form.get('id').disable();
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ListIndividualsAndCompaniesComponent, config);
  }

  clean() {
    this.form.reset();
    this.form.get('id').disable();
    this.edit = false;
    this.loading = false;
  }
}
