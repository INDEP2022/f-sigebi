import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IStation } from 'src/app/core/models/catalogs/station.model';
import { StationService } from 'src/app/core/services/catalogs/station.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  POSITVE_NUMBERS_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

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
  itemsTransfer = new DefaultSelect();
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
      idTransferent: [null, []],
      idEntity: [null],
      stationName: [null, [Validators.required, , Validators.maxLength(150)]],
      keyState: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(30),
        ],
      ],
      version: [
        null,
        [
          Validators.required,
          Validators.pattern(POSITVE_NUMBERS_PATTERN),
          Validators.maxLength(10),
        ],
      ],
      status: [
        null,
        [
          Validators.required,
          Validators.maxLength(10),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
    });
    if (this.station != null) {
      this.stationForm.get('idTransferent').disable();
      this.edit = true;
      this.stationForm.patchValue(this.station);
    }
    this.getFromSelectTransfer(new ListParams());
  }

  getFromSelectTransfer(params: ListParams, id?: string) {
    if (id) {
      params['filter.id'] = `$eq:${id}`;
    }
    this.stationService.getTransfers(params).subscribe((data: any) => {
      this.itemsTransfer = new DefaultSelect(data.data, data.count);
    });
  }
  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    if (
      this.stationForm.controls['stationName'].value.trim() == '' ||
      this.stationForm.controls['keyState'].value.trim() == '' ||
      (this.stationForm.controls['stationName'].value.trim() == '' &&
        this.stationForm.controls['keyState'].value.trim() == '')
    ) {
      this.alert('warning', 'No se puede guardar campos vacíos', ``);
      this.loading = false;
      return;
    } else {
      this.loading = true;
      this.stationService.create(this.stationForm.getRawValue()).subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
    }
  }

  update() {
    if (
      this.stationForm.controls['stationName'].value.trim() == '' ||
      this.stationForm.controls['keyState'].value.trim() == '' ||
      (this.stationForm.controls['stationName'].value.trim() == '' &&
        this.stationForm.controls['keyState'].value.trim() == '')
    ) {
      this.alert('warning', 'No se puede actualzar campos vacíos', ``);
      this.loading = false;
      return;
    } else {
      this.loading = true;
      this.stationService
        .update(this.station.id, this.stationForm.getRawValue())
        .subscribe({
          next: data => this.handleSuccess(),
          error: error => (this.loading = false),
        });
    }
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
