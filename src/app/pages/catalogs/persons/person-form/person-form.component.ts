import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IPerson } from 'src/app/core/models/catalogs/person.model';
import { TvalTable1Service } from 'src/app/core/services/catalogs/tval-table1.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  CURP_PATTERN,
  KEYGENERATION_PATTERN,
  NUMBERS_PATTERN,
  PHONE_PATTERN,
  RFC_PATTERN,
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
  personForm: ModelForm<IPerson>;
  person: IPerson;
  title: string = 'Mantenimiento a Administrador, Depositario e Interventor';
  edit: boolean = false;
  optionsTipoP: any[];
  optionsTipoR: any[];
  entFed = new DefaultSelect();
  operation = new DefaultSelect();
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private personService: PersonService,
    private tvalTable1Service: TvalTable1Service
  ) {
    super();
  }

  ngOnInit(): void {
    this.optionsTipoP = [
      { value: null, label: 'Seleccione un Tipo persona' },
      { value: 'F', label: 'FÍSICA' },
      { value: 'M', label: 'MORAL' },
    ];
    this.optionsTipoR = [
      { value: null, label: 'Seleccione un Tipo responsable' },
      { value: 'A', label: 'Administrador' },
      { value: 'D', label: 'Depositario' },
      { value: 'I', label: 'Interventor' },
      { value: 'C', label: 'COMODATARIO' },
      { value: 'U', label: 'CUSTODIO' },
      { value: 'O', label: 'OTRO' },
    ];
    this.prepareForm();
  }

  private prepareForm() {
    this.personForm = this.fb.group({
      id: [null, []],
      personName: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      name: [
        null,
        [
          Validators.required,
          Validators.maxLength(30),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      street: [
        null,
        [Validators.maxLength(200), Validators.pattern(STRING_PATTERN)],
      ],
      streetNumber: [null, []],
      apartmentNumber: [null, []],
      suburb: [
        null,
        [Validators.maxLength(100), Validators.pattern(STRING_PATTERN)],
      ],
      delegation: [
        null,
        [Validators.maxLength(60), Validators.pattern(STRING_PATTERN)],
      ],
      zipCode: [
        null,
        [Validators.maxLength(5), Validators.pattern(NUMBERS_PATTERN)],
      ],
      rfc: [
        null,
        [
          Validators.required,
          Validators.maxLength(20),
          Validators.pattern(RFC_PATTERN),
        ],
      ],
      curp: [
        null,
        [Validators.maxLength(20), Validators.pattern(CURP_PATTERN)],
      ],
      phone: [
        null,
        [, Validators.maxLength(20), Validators.pattern(STRING_PATTERN)],
      ],
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
        [Validators.maxLength(30), Validators.pattern(STRING_PATTERN)],
      ],
      numberDeep: [
        null,
        [Validators.maxLength(20), Validators.pattern(PHONE_PATTERN)],
      ],
      profesion: [
        null,
        [Validators.maxLength(60), Validators.pattern(STRING_PATTERN)],
      ],
      curriculum: [
        null,
        [Validators.maxLength(1), Validators.pattern(STRING_PATTERN)],
      ],
      keyEntFed: [
        null,
        [
          Validators.required,
          Validators.maxLength(15),
          Validators.pattern(KEYGENERATION_PATTERN),
        ],
      ],
      keyOperation: [
        null,
        [
          Validators.required,
          Validators.maxLength(15),
          Validators.pattern(KEYGENERATION_PATTERN),
        ],
      ],
      observations: [
        null,
        [Validators.maxLength(100), Validators.pattern(STRING_PATTERN)],
      ],
      profile: [
        null,
        [Validators.maxLength(500), Validators.pattern(STRING_PATTERN)],
      ],
      precedentSecodam: [
        null,
        [Validators.maxLength(500), Validators.pattern(STRING_PATTERN)],
      ],
      precedentPgr: [
        null,
        [Validators.maxLength(500), Validators.pattern(STRING_PATTERN)],
      ],
      precedentPff: [
        null,
        [Validators.maxLength(500), Validators.pattern(STRING_PATTERN)],
      ],
      precedentSera: [
        null,
        [Validators.maxLength(500), Validators.pattern(STRING_PATTERN)],
      ],
      precedent0ther: [
        null,
        [Validators.maxLength(500), Validators.pattern(STRING_PATTERN)],
      ],
      email: [null, [Validators.maxLength(60), Validators.email]],
      blackList: [
        null,
        [Validators.maxLength(2), Validators.pattern(STRING_PATTERN)],
      ],
    });
    if (this.person != null) {
      this.edit = true;
      this.personForm.patchValue(this.person);
      this.getEntFed(
        new ListParams(),
        this.personForm.controls['keyEntFed'].value
      );
      if (this.personForm.controls['keyOperation'].value != null) {
        this.getTurn(
          new ListParams(),
          this.personForm.controls['keyOperation'].value
        );
      }
    }
    setTimeout(() => {
      this.getEntFed(new ListParams(), null);
      this.getTurn(new ListParams(), null);
    }, 1000);
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    this.loading = true;
    this.personService.create(this.personForm.getRawValue()).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    this.loading = true;
    this.personService
      .update(this.person.id, this.personForm.getRawValue())
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }
  getEntFed(params: ListParams, id?: string) {
    params['filter.nmtable'] = `$eq:1`;
    if (id != null) {
      params['filter.otkey'] = `$eq:${id}`;
    }
    this.tvalTable1Service.getAlls(params).subscribe(
      data => {
        this.entFed = new DefaultSelect(data.data, data.count);
      },
      error => {
        this.entFed = new DefaultSelect();
      }
    );
  }
  getTurn(params: ListParams, id?: string) {
    params['filter.nmtable'] = `$eq:8`;
    if (id != null) {
      params['filter.otkey'] = `$eq:${id}`;
    }
    this.tvalTable1Service.getAlls(params).subscribe(
      data => {
        this.operation = new DefaultSelect(data.data, data.count);
      },
      error => {
        this.operation = new DefaultSelect();
      }
    );
  }
  handleSuccess() {
    const message: string = this.edit ? 'Actualizada' : 'Guardada';
    this.alert('success', `${message} correctamente`, '');
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
