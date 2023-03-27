import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { ITable } from 'src/app/core/models/catalogs/dinamic-tables.model';
import { ITdescCve } from 'src/app/core/models/ms-parametergood/tdesccve-model';
import { TdescCveService } from 'src/app/core/services/ms-parametergood/tdesccve.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  KEYGENERATION_PATTERN,
  NUMBERS_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-register-key-one-modal',
  templateUrl: './register-key-one-modal.component.html',
  styles: [],
})
export class RegisterKeyOneModalComponent extends BasePage implements OnInit {
  tdescCveForm: ModelForm<ITdescCve>;
  tdescCve: ITdescCve;
  idCve: ITable;

  title: string = 'Registro de claves para tablas logicas con una clave';
  edit: boolean = false;

  _id: any;

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private tdescCveService: TdescCveService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForom();
  }

  private prepareForom() {
    this.tdescCveForm = this.fb.group({
      id: [null, []],

      dsKey1: [null, [Validators.pattern(KEYGENERATION_PATTERN)]],
      swFormat1: [null, [Validators.pattern(STRING_PATTERN)]],
      longMin1: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      longMax1: [null, [Validators.pattern(NUMBERS_PATTERN)]],
    });
    if (this.tdescCve != null) {
      this.edit = true;
      this.tdescCveForm.patchValue(this.tdescCve);
    } else {
      (this.edit = false),
        this.tdescCveForm.controls['id'].setValue(this.idCve.table);
    }
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    if (
      this.tdescCveForm.controls['longMax1'].value >
      this.tdescCveForm.controls['longMin1'].value
    ) {
      this.edit ? this.update() : this.create();
    } else {
      this.alertQuestion(
        'warning',
        'La longitud máxima no puede ser menor a longitud mínima',
        'Favor de corregir'
      ).then(question => {
        if (question.isConfirmed) {
        }
      });
    }
  }

  create() {
    this.loading = true;
    this.tdescCveService.create2(this.tdescCveForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (
        (this.loading = false),
        this.onLoadToast('warning', this.title, `${error.error.message}`)
      ),
    });
  }

  update() {
    this.loading = true;
    this.tdescCveService
      .update2(this.tdescCve.id, this.tdescCveForm.value)
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
