import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IStation2 } from 'src/app/core/models/catalogs/station.model';
import { ITransferente } from 'src/app/core/models/catalogs/transferente.model';
import { StationService } from 'src/app/core/services/catalogs/station.service';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-cat-station-modal',
  templateUrl: './cat-station-modal.component.html',
  styles: [],
})
export class CatStationModalComponent extends BasePage implements OnInit {
  stationForm: ModelForm<IStation2>;
  station: IStation2;

  idTrans: ITransferente;

  title: string = 'Emisora';
  edit: boolean = false;

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private stationService: StationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.stationForm = this.fb.group({
      idTransferent: [null, []],
      stationName: [null, [Validators.required]],
      status: [1, []],
    });
    if (this.station != null) {
      this.edit = true;
      this.stationForm.patchValue(this.station);
    } else {
      this.edit = false;
      this.stationForm.controls['idTransferent'].setValue(this.idTrans.id);
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
    this.stationService.create(this.stationForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    this.loading = true;
    this.stationService
      .update(this.station.id, this.stationForm.value)
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
