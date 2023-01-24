import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IOrigin } from 'src/app/core/models/catalogs/origin.model';
import { OriginService } from 'src/app/core/services/catalogs/origin.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { KEYGENERATION_PATTERN } from '../../../../core/shared/patterns';

@Component({
  selector: 'app-origin-form',
  templateUrl: './origin-form.component.html',
  styles: [],
})
export class OriginFormComponent extends BasePage implements OnInit {
  form: ModelForm<IOrigin>;
  title: string = 'Procedencia';
  edit: boolean = false;
  origin: IOrigin;
  origins = new DefaultSelect<IOrigin>();
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private originService: OriginService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      id: [null],
      idTransferer: [null, [Validators.required]],
      keyTransferer: [null, [Validators.required]],
      description: [null, [Validators.required]],
      type: [null, [Validators.required]],
      address: [null, [Validators.required]],
      city: [null, [Validators.required]],
      idCity: [null, [Validators.required]],
      keyEntityFederative: [
        null,
        [Validators.required, Validators.pattern(KEYGENERATION_PATTERN)],
      ],
    });
    if (this.origin != null) {
      this.edit = true;
      this.form.patchValue(this.origin);
    }
  }

  getData(params: ListParams) {
    this.originService.getAll(params).subscribe(data => {
      this.origins = new DefaultSelect(data.data, data.count);
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
    this.originService.create(this.form.getRawValue()).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    this.loading = true;
    this.originService
      .update(this.origin.id, this.form.getRawValue())
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
