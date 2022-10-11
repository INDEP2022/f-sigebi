import { Component, OnInit } from '@angular/core';
import { IResponseRepuve } from 'src/app/core/models/catalogs/response-repuve.model';
import { BasePage } from 'src/app/core/shared/base-page';
import { ModelForm } from '../../../../core/interfaces/ModelForm';
import { DefaultSelect } from '../../../../shared/components/select/default-select';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, Validators } from '@angular/forms';
import { ResponseRepuveService } from '../../../../core/services/catalogs/response-repuve.service';
import { ListParams } from '../../../../common/repository/interfaces/list-params';

@Component({
  selector: 'app-response-repuve-form',
  templateUrl: './response-repuve-form.component.html',
  styles: [
  ]
})
export class ResponseRepuveFormComponent extends BasePage implements OnInit {

  form: ModelForm<IResponseRepuve>;
  title: string = 'Respuesta Repuve';
  edit: boolean = false;
  responseRepuve: IResponseRepuve;
  responseRepuves = new DefaultSelect<IResponseRepuve>();
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private responseRepuveService: ResponseRepuveService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      id: [null],
      description: [null, [Validators.required]],
    });
    if (this.responseRepuve != null) {
      this.edit = true;
      this.form.patchValue(this.responseRepuve);
    }
  }

  getData(params: ListParams) {
    this.responseRepuveService.getAll(params).subscribe(data => {
      this.responseRepuves = new DefaultSelect(data.data, data.count);
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
    this.responseRepuveService
      .create(this.form.getRawValue())
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  update() {
    this.loading = true;
    this.responseRepuveService
      .update(
        this.responseRepuve.id,
        this.form.getRawValue()
      )
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
