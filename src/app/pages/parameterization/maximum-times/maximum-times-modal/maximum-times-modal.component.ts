import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IMaximumTimes } from 'src/app/core/models/catalogs/maximum-times-model';
import { MaximumTimesService } from 'src/app/core/services/catalogs/maximum-times.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-maximum-times-modal',
  templateUrl: './maximum-times-modal.component.html',
  styles: [],
})
export class MaximumTimesModalComponent extends BasePage implements OnInit {
  maximumTimesForm: ModelForm<IMaximumTimes>;
  maximumTimes: IMaximumTimes;
  title: string = 'Tiempo Máximo Para Cierre Actas Devolución';
  edit: boolean = false;
  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private modalRef: BsModalRef,
    private maximumTimesService: MaximumTimesService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.maximumTimesForm = this.fb.group({
      certificateType: [null, [Validators.required]],
      tmpMax: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      activated: [null, [Validators.required]],
      user: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      date: [null, [Validators.required]],
    });
    if (this.maximumTimes != null) {
      console.log('editar');
      this.edit = true;
      this.maximumTimesForm.patchValue(this.maximumTimes);
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
    let form = {
      id: this.datePipe.transform(
        this.maximumTimesForm.controls['idDate'].value,
        'yyyy-MM-dd'
      ),
      idDate: this.maximumTimesForm.controls['idDate'].value,
      description: this.maximumTimesForm.controls['description'].value,
    };
    console.log(form);
    this.maximumTimesService.create(this.maximumTimesForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }
  update() {
    this.loading = true;
    this.maximumTimesService
      .update(
        this.maximumTimes.certificateType.toString(),
        this.maximumTimesForm.value
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
