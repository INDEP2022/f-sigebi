import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { IMunicipality } from './../../../../core/models/catalogs/municipality.model';
import { MunicipalityService } from './../../../../core/services/catalogs/municipality.service';

@Component({
  selector: 'app-municipality-form',
  templateUrl: './municipality-form.component.html',
  styles: [],
})
export class MunicipalityFormComponent extends BasePage implements OnInit {
  municipalityForm: FormGroup = new FormGroup({});
  title: string = 'Municipio';
  edit: boolean = false;
  municipality: IMunicipality;
  items = new DefaultSelect<IMunicipality>();
  @Output() refresh = new EventEmitter<true>();

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
      key: [null, [Validators.required]],
      entity: [null, [Validators.required]],
      userCreation: [null, [Validators.required]],
      municipalityName: [null, [Validators.required]],
      userModification: [null, [Validators.required]],
      version: [null, [Validators.required]],
    });
    if (this.municipality != null) {
      this.edit = true;
      console.log(this.municipality);
      this.municipalityForm.patchValue(this.municipality);
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
    this.municipalityService.create(this.municipalityForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    this.loading = true;
    this.municipalityService
      .update(this.municipality.idMunicipality, this.municipalityForm.value)
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.refresh.emit(true);
    this.modalRef.hide();
  }
}
