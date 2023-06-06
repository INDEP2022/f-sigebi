import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IRegulatory } from 'src/app/core/models/catalogs/regulatory.model';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  POSITVE_NUMBERS_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { ModelForm } from '../../../../core/interfaces/model-form';
import { RegulatoryService } from '../../../../core/services/catalogs/regulatory.service';
import { DefaultSelect } from '../../../../shared/components/select/default-select';

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
  fechaActual: string;
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private regulatoryService: RegulatoryService
  ) {
    super();
    const fecha = new Date();
    this.fechaActual = fecha.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      id: [null],
      fractionId: [
        null,
        [Validators.required, Validators.pattern(POSITVE_NUMBERS_PATTERN)],
      ],
      numero: [
        null,
        [Validators.required, Validators.pattern(POSITVE_NUMBERS_PATTERN)],
      ],
      descripcion: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      validar_ef: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      validar_ec: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      usuario_creacion: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      fecha_creacion: [null],
      usuario_modificacion: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      fecha_modificacion: [null],
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
    console.log('id', this.form.value.id_fraccion);

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
