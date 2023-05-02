import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { IPerson } from 'src/app/core/models/catalogs/person.model';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  CURP_PATTERN,
  KEYGENERATION_PATTERN,
  NUMBERS_PATTERN,
  PHONE_PATTERN,
  RFC_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { ModelForm } from '../../../../core/interfaces/model-form';
import { PersonService } from '../../../../core/services/catalogs/person.service';

@Component({
  selector: 'app-person-form',
  templateUrl: './person-form.component.html',
  styles: [],
})
export class PersonFormComponent extends BasePage implements OnInit {
  personForm: ModelForm<IPerson>;
  person: IPerson;
  title: string = 'Mantto. a administrador, depositario e interventor';
  edit: boolean = false;

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
    this.personForm = this.fb.group({
      id: [null, []],
      personName: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      name: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      street: [null, [, Validators.pattern(STRING_PATTERN)]],
      streetNumber: [null, []],
      apartmentNumber: [null, []],
      suburb: [null, [, Validators.pattern(STRING_PATTERN)]],
      delegation: [null, [, Validators.pattern(STRING_PATTERN)]],
      zipCode: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      rfc: [null, [Validators.pattern(RFC_PATTERN)]],
      curp: [null, [Validators.pattern(CURP_PATTERN)]],
      phone: [null, [Validators.pattern(STRING_PATTERN)]],
      typePerson: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      typeResponsible: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      manager: [null, [, Validators.pattern(STRING_PATTERN)]],
      numberDeep: [null, [, Validators.pattern(PHONE_PATTERN)]],
      profesion: [null, [, Validators.pattern(STRING_PATTERN)]],
      curriculum: [null, [, Validators.pattern(STRING_PATTERN)]],
      keyEntFed: [null, [, Validators.pattern(KEYGENERATION_PATTERN)]],
      keyOperation: [null, [, Validators.pattern(KEYGENERATION_PATTERN)]],
      observations: [null, [, Validators.pattern(STRING_PATTERN)]],
      profile: [null, [, Validators.pattern(STRING_PATTERN)]],
      precedentSecodam: [null, [, Validators.pattern(STRING_PATTERN)]],
      precedentPgr: [null, [, Validators.pattern(STRING_PATTERN)]],
      precedentPff: [null, [, Validators.pattern(STRING_PATTERN)]],
      precedentSera: [null, [, Validators.pattern(STRING_PATTERN)]],
      precedent0ther: [null, [, Validators.pattern(STRING_PATTERN)]],
      email: [null, [, Validators.email]],
      blackList: [null, [, Validators.pattern(STRING_PATTERN)]],
    });
    if (this.person != null) {
      this.edit = true;
      this.personForm.patchValue(this.person);
    }
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    this.loading = true;
    this.personService.create(this.personForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    this.loading = true;
    this.personService.update(this.person.id, this.personForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizada' : 'Guardada';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
