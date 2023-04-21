import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IDictationXGood1 } from 'src/app/core/models/ms-dictation/dictation-x-good1.model';
import { DictationXGood1Service } from 'src/app/core/services/ms-dictation/dictation-x-good1.service';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-goods-dialog',
  templateUrl: './goods-dialog.component.html',
  styles: [],
})
export class GoodsDialogComponent extends BasePage implements OnInit {
  dictationXGoodForm: ModelForm<IDictationXGood1>;
  dictationXGood: IDictationXGood1;

  title: string = 'Bien';
  edit: boolean = false;

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private dictationXGoodService: DictationXGood1Service
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.dictationXGoodForm = this.fb.group({
      amountDict: [null],
      descriptionDict: [''],
      id: [null, Validators.required],
      ofDictNumber: [null, Validators.required],
      proceedingsNumber: [null, Validators.required],
      typeDict: [''],
    });

    if (this.dictationXGood != null) {
      this.edit = true;
      this.dictationXGoodForm.patchValue(this.dictationXGood);
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
    this.dictationXGoodService.create(this.dictationXGoodForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    this.loading = true;

    this.dictationXGoodService.update(this.dictationXGoodForm.value).subscribe({
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
