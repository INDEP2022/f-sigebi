import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IStation } from 'src/app/core/models/catalogs/station.model';
import { StationService } from 'src/app/core/services/catalogs/station.service';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-station-form',
  templateUrl: './station-form.component.html',
  styles: [],
})
export class StationFormComponent extends BasePage implements OnInit {
  stationForm: ModelForm<IStation>;
  title: string = 'Emisoras';
  edit: boolean = false;
  station: IStation;
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private stationService: StationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.stationForm = this.fb.group({
      id: [null],
      idTransferent: [null],
      idEntity: [null],
      stationName: [null, Validators.required],
      keyState: [null, Validators.required],
      version: [null, Validators.required],
      status: [null, Validators.required],
    });
    if (this.station != null) {
      this.edit = true;
      this.stationForm.patchValue(this.station);
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
    this.stationService.create(this.stationForm.getRawValue()).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    this.loading = true;
    this.stationService
      .update(this.station.id, this.stationForm.getRawValue())
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
