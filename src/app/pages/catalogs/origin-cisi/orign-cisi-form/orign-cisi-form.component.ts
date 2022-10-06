import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { IOriginCisi } from 'src/app/core/models/catalogs/origin-cisi.model';
import { OiriginCisiService } from 'src/app/core/services/catalogs/origin-cisi.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { ModelForm } from '../../../../core/interfaces/ModelForm';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { FormBuilder, Validators } from '@angular/forms';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';

@Component({
  selector: 'app-orign-cisi-form',
  templateUrl: './orign-cisi-form.component.html',
  styles: [
  ]
})
export class OrignCisiFormComponent extends BasePage implements OnInit {

  form: ModelForm<IOriginCisi>;
  title: string = 'Procedencia Cisi';
  edit: boolean = false;
  originCisi: IOriginCisi;
  origins = new DefaultSelect<IOriginCisi>();
  @Output() refresh = new EventEmitter<true>();
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private originCisiService: OiriginCisiService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      id: [null],
      detail: [null, [Validators.required]],
     
    });
    if (this.originCisi != null) {
      this.edit = true;
      this.form.patchValue(this.originCisi);
    }
  }

  getData(params: ListParams) {
    this.originCisiService.getAll(params).subscribe(data => {
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
    this.originCisiService.create(this.form.value()).subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  update() {
    this.loading = true;
    this.originCisiService
      .update(
        this.originCisi.id,
        this.form.value()
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
    this.refresh.emit(true);
    this.modalRef.hide();
  }


}
