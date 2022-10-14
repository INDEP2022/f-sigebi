import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IPerson } from 'src/app/core/models/catalogs/person.model';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { ModelForm } from '../../../../core/interfaces/ModelForm';
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
      name: [null, [Validators.required]],
      street: [null, [Validators.required]],
      streetNumber: [null, [Validators.required]],
      apartmentNumber: [null, [Validators.required]],
      suburb: [null, [Validators.required]],
      delegation: [null, [Validators.required]],
      zipCode: [null, [Validators.required]],
      rfc: [null, [Validators.required]],
      curp: [null, [Validators.required]],
      phone: [null, [Validators.required]],
      typePerson: [null, [Validators.required]],
      typeResponsible: [null, [Validators.required]],
      manager: [null, [Validators.required]],
      numberDeep: [null, [Validators.required]],
      profesion: [null, [Validators.required]],
      curriculum: [null, [Validators.required]],
      keyEntFed: [null, [Validators.required]],
      keyOperation: [null, [Validators.required]],
      observations: [null, [Validators.required]],
      profile: [null, [Validators.required]],
      precedentSecodam: [null, [Validators.required]],
      precedentPgr: [null, [Validators.required]],
      precedentPff: [null, [Validators.required]],
      precedentSera: [null, [Validators.required]],
      precedent0ther: [null, [Validators.required]],
      registryNumber: [null, [Validators.required]],
      email: [null, [Validators.required], [Validators.email]],
      blackList: [null, [Validators.required]],
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
