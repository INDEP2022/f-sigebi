import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PersonService } from 'src/app/core/services/catalogs/person.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  PHONE_PATTERN,
  RFCCURP_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';

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

  constructor(
    private readonly fb: FormBuilder,
    private readonly personService: PersonService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      personNumber: [null],
      name: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      street: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      streetNumber: [null, [Validators.required]],
      apartmentNumber: [null, [Validators.required]],
      suburb: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      zipCode: [null, Validators.required],
      delegation: [null, Validators.required],
      federative: [null, Validators.required],
      phone: [null, [Validators.required, Validators.pattern(PHONE_PATTERN)]],
      observations: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      rfc: [null, [Validators.required, Validators.pattern(RFCCURP_PATTERN)]],
      curp: [null, [Validators.required, Validators.pattern(RFCCURP_PATTERN)]],
      curriculumV: [null],
      curriculum: ['N'],
      typePerson: [null],
      keyOperation: [null],
      profile: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      manager: [null],
      numberDeep: [null],
      keyEntFed: [null],
      typeResponsible: [null],
    });

    this.onChangeForm();
  }

  onChangeForm() {
    this.form.get('curriculumV').valueChanges.subscribe({
      next: (value: boolean) =>
        this.form.get('curriculum').patchValue(value ? 'S' : 'N'),
    });

    this.form.get('name').valueChanges.subscribe({
      next: (value: string) => this.form.get('personNumber').patchValue(value),
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

  saved() {
    if (this.form.valid) {
      this.form.get('typeResponsible').patchValue('D');
      this.personService.create(this.form.value).subscribe({
        next: () => {
          this.onLoadToast(
            'success',
            'Creacion ministerio publico',
            'Ha sido creado con éxito'
          );
          this.form.reset();
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
