import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { ISiseProcess } from 'src/app/core/models/catalogs/sise-process.model';
import { SiseProcessService } from 'src/app/core/services/catalogs/sise-process.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-sise-process-form',
  templateUrl: './sise-process-form.component.html',
  styles: [],
})
export class SiseProcessFormComponent extends BasePage implements OnInit {
  form: ModelForm<ISiseProcess>;
  title: string = 'Proceso Sise';
  edit: boolean = false;
  sisi: ISiseProcess;
  siseProcess = new DefaultSelect<ISiseProcess>();
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private siseProcessService: SiseProcessService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      id: [null],
      description: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
    if (this.sisi != null) {
      this.edit = true;
      this.form.patchValue(this.sisi);
    }
  }

  getData(params: ListParams) {
    this.siseProcessService.getAll(params).subscribe(data => {
      this.siseProcess = new DefaultSelect(data.data, data.count);
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
    this.siseProcessService.create(this.form.getRawValue()).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    this.loading = true;
    this.siseProcessService
      .update(this.sisi.id, this.form.getRawValue())
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
