import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IOriginCisi } from 'src/app/core/models/catalogs/origin-cisi.model';
import { OiriginCisiService } from 'src/app/core/services/catalogs/origin-cisi.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { ModelForm } from '../../../../core/interfaces/model-form';

@Component({
  selector: 'app-orign-cisi-form',
  templateUrl: './orign-cisi-form.component.html',
  styles: [],
})
export class OrignCisiFormComponent extends BasePage implements OnInit {
  orignCisiForm: ModelForm<IOriginCisi>;
  title: string = 'Procedencia Cisi';
  edit: boolean = false;
  originCisi: IOriginCisi;
  originCisis = new DefaultSelect<IOriginCisi>();

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private originCisiService: OiriginCisiService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.orignCisiForm = this.fb.group({
      id: [null],
      detail: [
        null,
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(40),
        ],
      ],
    });

    if (this.originCisi != null) {
      this.edit = true;
      this.orignCisiForm.setValue({
        id: this.originCisi.id,
        detail: this.originCisi.detail,
      });
    }
  }

  getData(params: ListParams) {
    this.originCisiService.getAll(params).subscribe(data => {
      this.originCisis = new DefaultSelect(data.data, data.count);
    });
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    if (this.orignCisiForm.valid) {
      if (this.edit) {
        this.update();
      } else {
        this.create();
      }
    }
  }

  create() {
    this.loading = true;
    this.originCisiService.create(this.orignCisiForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    this.loading = true;
    this.originCisiService
      .update(this.originCisi.id, this.orignCisiForm.value)
      .subscribe({
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
