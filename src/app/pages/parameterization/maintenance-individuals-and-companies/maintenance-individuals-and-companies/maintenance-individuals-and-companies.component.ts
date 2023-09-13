import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PersonService } from 'src/app/core/services/catalogs/person.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  CURP_PATTERN,
  NUMBERS_PATTERN,
  PHONE_PATTERN,
  RFC_PATTERN,
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
  edit: boolean = false;
  title: string = 'Mantenimiento de Personas Físicas y Morales';
  dataPerson: any;
  value: string;
  constructor(
    private readonly fb: FormBuilder,
    private readonly personService: PersonService,
    private modalRef: BsModalRef,
    private readonly modalService: BsModalService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      id: [null],
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
      street: [null, [Validators.maxLength(200)]],
      streetNumber: [null, [Validators.maxLength(10)]],
      apartmentNumber: [null, [Validators.maxLength(10)]],
      suburb: [null, [Validators.maxLength(100)]],
      zipCode: [
        null,
        [Validators.pattern(NUMBERS_PATTERN), Validators.maxLength(5)],
      ],
      delegation: [null, [Validators.maxLength(100)]],
      federative: [null],
      phone: [
        null,
        [Validators.pattern(PHONE_PATTERN), Validators.maxLength(13)],
      ],
      observations: [null, [Validators.required, Validators.maxLength(100)]],
      rfc: [null, [Validators.pattern(RFC_PATTERN)]],
      curp: [null, [Validators.pattern(CURP_PATTERN)]],
      curriculumV: [null],
      curriculum: ['N'],
      typePerson: [null, [Validators.required]],
      keyOperation: [null],
      profile: [null, [Validators.required, Validators.maxLength(500)]],
      manager: [null, [Validators.maxLength(60)]],
      numberDeep: [null, [Validators.maxLength(20)]],
      keyEntFed: [null, [Validators.required]],
      typeResponsible: [null],
    });
    if (this.dataPerson != null) {
      console.log(this.dataPerson);
      this.edit = true;
      this.form.patchValue(this.dataPerson);
      this.form.controls['federative'].setValue(
        this.dataPerson.state.descCondition
      );

      this.form.controls['curriculumV'].setValue(
        this.dataPerson.curriculum == 'N' ? false : true
      );

      if (this.form.controls['typePerson'].value === 'M') {
        this.form
          .get('manager')
          .setValidators([Validators.required, Validators.maxLength(50)]);
        this.form.get('manager').updateValueAndValidity();
        this.form.get('numberDeep').setValidators(Validators.required);
      }
      console.log(this.form.value);
    }
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
        this.value = value;
      },
    });

    this.form.get('federative').valueChanges.subscribe({
      next: value => {
        console.log(value);
        this.form.get('keyEntFed').patchValue(value);
      },
    });
  }

  confirm() {
    console.log(this.form.value);
    if (this.form.valid) {
      this.loading = true;
      this.form.get('typeResponsible').patchValue('D');
      if (this.edit) {
        this.form.get('id').enable();
        const { id } = this.form.value;
        this.personService.update(id, this.form.value).subscribe({
          next: () => {
            this.handleSuccess();
            this.loading = false;
          },
          error: error => {
            this.onLoadToast('error', error.error.message, '');
            this.loading = false;
          },
        });
      } else {
        if (this.value == 'M') {
          if (
            this.form.controls['personName'].value.trim() === '' ||
            this.form.controls['name'].value.trim() === '' ||
            this.form.controls['observations'].value.trim() === '' ||
            this.form.controls['profile'].value.trim() === '' ||
            this.form.controls['manager'].value.trim() === '' ||
            this.form.controls['numberDeep'].value.trim() === ''
          ) {
            this.alert('warning', 'No se puede guardar campos vacíos', '');
            return;
          }
        }
        if (this.value == 'F') {
          if (
            this.form.controls['personName'].value.trim() === '' ||
            this.form.controls['name'].value.trim() === '' ||
            this.form.controls['observations'].value.trim() === '' ||
            this.form.controls['profile'].value.trim() === ''
          ) {
            this.alert('warning', 'No se puede guardar campos vacíos', '');
            return;
          }
        }
        console.log();
        this.personService.create(this.form.value).subscribe({
          next: () => {
            this.handleSuccess();
          },
          error: error => {
            this.onLoadToast('error', error.error.message, '');
            this.loading = false;
          },
        });
      }
    }
  }
  handleSuccess() {
    this.loading = false;
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.alert('success', `${message} correctamente`, '');
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
  typeChange(data: string) {
    if (data === 'M') {
      this.form
        .get('manager')
        .setValidators([Validators.required, Validators.maxLength(50)]);
      this.form
        .get('numberDeep')
        .setValidators([Validators.required, Validators.maxLength(50)]);
      this.form.get('manager').updateValueAndValidity();
      this.form.get('numberDeep').updateValueAndValidity();
    } else {
      this.form.get('manager').clearValidators();
      this.form.get('numberDeep').clearValidators();
      this.form.get('manager').updateValueAndValidity();
      this.form.get('numberDeep').updateValueAndValidity();
    }
  }
  close() {
    this.modalRef.hide();
  }
}
