import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IPerson } from 'src/app/core/models/catalogs/person.model';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  KEYGENERATION_PATTERN,
  PHONE_PATTERN,
  RFCCURP_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { ModelForm } from '../../../../core/interfaces/model-form';
import { PersonService } from '../../../../core/services/catalogs/person.service';

@Component({
  selector: 'app-person-form',
  templateUrl: './person-form.component.html',
  styles: [],
})
export class PersonFormComponent extends BasePage implements OnInit {
  form: ModelForm<IPerson>;
  title: string = 'Persona';
  edit: boolean = false;
  person: IPerson;
  persons = new DefaultSelect<IPerson>();
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private personService: PersonService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      id: [null],
      personNumber: [null, [Validators.required]],
      name: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      street: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      streetNumber: [null, [Validators.required]],
      apartmentNumber: [null, [Validators.required]],
      suburb: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      delegation: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      zipCode: [null, [Validators.required]],
      rfc: [null, [Validators.required, Validators.pattern(RFCCURP_PATTERN)]],
      curp: [null, [Validators.required, Validators.pattern(RFCCURP_PATTERN)]],
      phone: [null, [Validators.required, Validators.pattern(PHONE_PATTERN)]],
      typePerson: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      typeResponsible: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      manager: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      numberDeep: [
        null,
        [Validators.required, Validators.pattern(PHONE_PATTERN)],
      ],
      profesion: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      curriculum: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      keyEntFed: [
        null,
        [Validators.required, Validators.pattern(KEYGENERATION_PATTERN)],
      ],
      keyOperation: [
        null,
        [Validators.required, Validators.pattern(KEYGENERATION_PATTERN)],
      ],
      observations: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      profile: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      precedentSecodam: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      precedentPgr: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      precedentPff: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      precedentSera: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      precedent0ther: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      registryNumber: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      blackList: [null, [Validators.required, Validators.email]],
    });
    if (this.person != null) {
      this.edit = true;
      this.form.patchValue(this.person);
    }
  }

  getData(params: ListParams) {
    this.personService.getAll(params).subscribe(data => {
      this.persons = new DefaultSelect(data.data, data.count);
    });
  }
  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    this.loading = true;
    this.personService.create(this.form.getRawValue()).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    this.loading = true;
    this.personService
      .update(this.person.id, this.form.getRawValue())
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
