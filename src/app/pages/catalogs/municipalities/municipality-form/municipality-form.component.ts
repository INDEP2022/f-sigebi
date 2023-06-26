import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IStateOfRepublic } from 'src/app/core/models/catalogs/state-of-republic.model';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import {
  NUMBERS_PATTERN,
  STRING_PATTERN,
} from '../../../../core/shared/patterns';
import { IMunicipality } from './../../../../core/models/catalogs/municipality.model';
import { MunicipalityService } from './../../../../core/services/catalogs/municipality.service';
@Component({
  selector: 'app-municipality-form',
  templateUrl: './municipality-form.component.html',
  styles: [],
})
export class MunicipalityFormComponent extends BasePage implements OnInit {
  municipalityForm: ModelForm<IMunicipality>;
  title: string = 'Municipio';
  edit: boolean = false;
  municipality: IMunicipality;
  states = new DefaultSelect<IStateOfRepublic>();

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private municipalityService: MunicipalityService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm(): void {
    this.municipalityForm = this.fb.group({
      idMunicipality: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
      stateKey: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
      nameMunicipality: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      description: [null, [Validators.required]],
      codMarginality: [
        null,
        [
          Validators.required,
          Validators.pattern(NUMBERS_PATTERN),
          Validators.maxLength(2),
          Validators.pattern('^([0-9]|[1-9][0-9])$'),
        ],
      ],
      noRegister: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      risk: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(2),
        ],
      ],
      version: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
    });
    if (this.municipality != null) {
      this.edit = true;
      console.log(this.municipality)
      this.municipalityForm.patchValue(this.municipality);
      this.municipalityForm.get('stateKey').disable();
      this.municipalityForm.get('idMunicipality').disable();
      this.getStates(new ListParams, this.municipality.stateKey);
    }
    this.getStates(new ListParams);
  }

  getStates(params: ListParams, id?: string) {
    if (id) {
      params['filter.id'] = id;
    }
    this.municipalityService.getStates(params).subscribe(data => {
      this.states = new DefaultSelect(data.data, data.count);
    });
  }

  stateChange(state: IStateOfRepublic) { }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    this.loading = true;
    this.municipalityService.create(this.municipalityForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    this.loading = true;
    this.municipalityForm.value.idMunicipality =
      this.municipality.idMunicipality;
    this.municipalityForm.value.stateKey = this.municipality.stateKey;
    this.municipalityService.update(this.municipalityForm.value).subscribe({
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
