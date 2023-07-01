import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IIfaiSerie } from 'src/app/core/models/catalogs/ifai-serie.model';
import { IfaiSerieService } from 'src/app/core/services/catalogs/ifai-serie.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-ifai-series-form',
  templateUrl: './ifai-series-form.component.html',
  styles: [],
})
export class IfaiSeriesFormComponent extends BasePage implements OnInit {
  ifaiSerieForm: ModelForm<IIfaiSerie>;
  title: string = 'Serie IFAI';
  edit: boolean = false;
  ifaiSerie: IIfaiSerie;
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private ifaiSeriService: IfaiSerieService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.ifaiSerieForm = this.fb.group({
      code: [
        null,
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(8),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      typeProcedure: [
        null,
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(2),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      description: [
        null,
        [
          Validators.minLength(1),
          Validators.maxLength(80),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      registryNumber: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      status: [
        null,
        [
          Validators.required,
          Validators.maxLength(1),
          Validators.minLength(1),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
    });
    if (this.ifaiSerie != null) {
      this.edit = true;
      this.ifaiSerieForm.patchValue(this.ifaiSerie);
      this.ifaiSerieForm.controls['status'].disable();
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
    const params: ListParams = new ListParams();
    let count: number;
    params['filter.status'] = this.ifaiSerieForm.controls['status'].value;
    this.ifaiSeriService.getAll(params).subscribe({
      next: response => {
        count = response.count;
        if (response.count > 0) {
          this.alert('warning', 'Series Ifai', 'El estatus esta ya existe.');
        } else {
          this.ifaiSeriService
            .create(this.ifaiSerieForm.getRawValue())
            .subscribe({
              next: data => this.handleSuccess(),
              error: error => (this.loading = false),
            });
        }
        this.loading = false;
      },
      error: error => {
        if (count > 0) {
          this.alert('warning', 'Series Ifai', 'El estatus esta ya existe.');
        } else {
          this.ifaiSeriService
            .create(this.ifaiSerieForm.getRawValue())
            .subscribe({
              next: data => this.handleSuccess(),
              error: error => (this.loading = false),
            });
        }

        this.loading = false;
      },
    });
  }

  update() {
    this.loading = true;
    this.ifaiSeriService
      .update(this.ifaiSerie.status, this.ifaiSerieForm.getRawValue())
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizada' : 'Guardada';
    this.alert('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
