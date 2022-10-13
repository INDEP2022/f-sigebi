import { Component, OnInit } from '@angular/core';
import { IRegulatory } from 'src/app/core/models/catalogs/regulatory.model';
import { ModelForm } from '../../../../core/interfaces/ModelForm';
import { DefaultSelect } from '../../../../shared/components/select/default-select';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, Validators } from '@angular/forms';
import { RegulatoryService } from '../../../../core/services/catalogs/regulatory.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';

@Component({
  selector: 'app-regulatoy-form',
  templateUrl: './regulatoy-form.component.html',
  styles: [],
})
export class RegulatoyFormComponent extends BasePage implements OnInit {
  form: ModelForm<IRegulatory>;
  title: string = 'Regulacion';
  edit: boolean = false;
  regulatory: IRegulatory;
  racks = new DefaultSelect<IRegulatory>();
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private regulatoryService: RegulatoryService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      id: [null],
      id_fraccion: [null, [Validators.required]],
      numero: [null, [Validators.required]],
      descripcion: [null, [Validators.required]],
      validar_ef: [null, [Validators.required]],
      validar_ec: [null, [Validators.required]],
      usuario_creacion: [null, [Validators.required]],
      fecha_creacion: [null, [Validators.required]],
      usuario_modificacion: [null, [Validators.required]],
      fecha_modificacion: [null, [Validators.required]],
      version: [null, [Validators.required]],
    });
    if (this.regulatory != null) {
      this.edit = true;
      this.form.patchValue(this.regulatory);
    }
  }

  getData(params: ListParams) {
    this.regulatoryService.getAll(params).subscribe(data => {
      this.racks = new DefaultSelect(data.data, data.count);
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
    this.regulatoryService.create(this.form.getRawValue()).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    this.loading = true;
    this.regulatoryService
      .update(this.regulatory.id, this.form.getRawValue())
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
