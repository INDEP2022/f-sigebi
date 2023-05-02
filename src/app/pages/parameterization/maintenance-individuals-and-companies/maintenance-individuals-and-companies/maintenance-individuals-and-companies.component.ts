import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PersonService } from 'src/app/core/services/catalogs/person.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  NUMBERS_PATTERN,
  PHONE_PATTERN,
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
  title: string = 'MANTENIMIENTO DE PERSONAS FÍSICAS Y MORALES';
  dataPerson: any;
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
      zipCode: [null, Validators.pattern(NUMBERS_PATTERN)],
      delegation: [null, [Validators.maxLength(100)]],
      federative: [null],
      phone: [
        null,
        [Validators.pattern(PHONE_PATTERN), Validators.maxLength(13)],
      ],
      observations: [null, [Validators.maxLength(100)]],
      rfc: [null, [Validators.maxLength(20)]],
      curp: [null, [Validators.maxLength(20)]],
      curriculumV: [null],
      curriculum: ['N'],
      typePerson: [null, Validators.required],
      keyOperation: [null],
      profile: [null, [Validators.maxLength(500)]],
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
          error: error => this.onLoadToast('error', error.error.message, ''),
        });
      } else {
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
    this.alert('success', `${message} Correctamente`, this.title);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
  close() {
    this.modalRef.hide();
  }
}
