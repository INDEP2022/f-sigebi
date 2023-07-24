import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IGoodSituation } from 'src/app/core/models/catalogs/good-situation.model';
import { IStatusGood } from 'src/app/core/models/ms-good/status-good';
import { GoodSituationService } from 'src/app/core/services/catalogs/good-situation.service';
import { StatusGoodService } from 'src/app/core/services/ms-good/status-good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-good-situation-form',
  templateUrl: './good-situation-form.component.html',
  styles: [],
})
export class GoodSituationFormComponent extends BasePage implements OnInit {
  goodSituationForm: ModelForm<IGoodSituation>;
  title = 'Tipo de Situación Bien';
  edit: boolean = false;
  situation: any;
  id: string;
  statusSelect = new DefaultSelect<IStatusGood>();
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private goodSituationService: GoodSituationService,
    private statusGoodService: StatusGoodService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.goodSituationForm = this.fb.group({
      situation: [
        null,
        [
          Validators.required,
          Validators.maxLength(3),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      descSituation: [
        null,
        [
          Validators.required,
          Validators.maxLength(300),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      status: [null, [Validators.required]],
    });
    if (this.situation != null) {
      this.edit = true;
      console.log(this.situation.status);
      this.goodSituationForm.patchValue(this.situation);
      this.getStatesUpdate(new ListParams(), this.situation.status);
      this.goodSituationForm.controls['status'].disable();
      this.goodSituationForm.controls['situation'].disable();
    }
    setTimeout(() => {
      this.getStates(new ListParams());
    }, 1000);
  }

  getStates(params: ListParams) {
    this.statusGoodService.getAll(params).subscribe({
      next: data => {
        this.statusSelect = new DefaultSelect(data.data, data.count);
      },
      error: error => {
        console.log(error);
        this.statusSelect = new DefaultSelect();
        this.loading = false;
      },
    });
  }

  getStatesUpdate(params: ListParams, value: string) {
    if (value) {
      params['filter.status'] = `$eq:${value}`;
    }
    this.statusGoodService.getAll(params).subscribe({
      next: data => {
        this.statusSelect = new DefaultSelect(data.data, data.count);
      },
      error: error => {
        console.log(error);
        this.statusSelect = new DefaultSelect();
        this.loading = false;
      },
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
      this.goodSituationForm.controls['situation'].value.trim() == '' ||
      this.goodSituationForm.controls['descSituation'].value.trim() == '' ||
      (this.goodSituationForm.controls['situation'].value.trim() == '' &&
        this.goodSituationForm.controls['descSituation'].value.trim() == '')
    ) {
      this.alert('warning', 'No se puede guardar campos vacíos', ``);
      return;
    } else {
      this.loading = true;
      this.goodSituationService
        .create(this.goodSituationForm.getRawValue())
        .subscribe({
          next: data => this.handleSuccess(),
          error: error => (this.loading = false),
        });
    }
  }

  update() {
    if (
      this.goodSituationForm.controls['situation'].value.trim() == '' ||
      this.goodSituationForm.controls['descSituation'].value.trim() == '' ||
      (this.goodSituationForm.controls['situation'].value.trim() == '' &&
        this.goodSituationForm.controls['descSituation'].value.trim() == '')
    ) {
      this.alert('warning', 'No se puede actualizar campos vacíos', ``);
      return;
    } else {
      this.loading = true;
      this.id = this.goodSituationForm.get('situation').value;
      let numero: number = parseInt(this.id);
      this.goodSituationForm.controls['situation'].setValue(numero);
      this.goodSituationService
        .updateCatalogGoodSituation(
          numero,
          this.goodSituationForm.getRawValue()
        )
        .subscribe({
          next: data => this.handleSuccess(),
          error: error => (this.loading = false),
        });
    }
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizada' : 'Guardada';
    this.alert('success', this.title, `${message} Correctamente`);
    //this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
