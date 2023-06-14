import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { ILabelOKey } from 'src/app/core/models/catalogs/label-okey.model';
import { LabelOkeyService } from 'src/app/core/services/catalogs/label-okey.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from '../../../../core/shared/patterns';

@Component({
  selector: 'app-label-okey-form',
  templateUrl: './label-okey-form.component.html',
  styles: [],
})
export class LabelOkeyFormComponent extends BasePage implements OnInit {
  labelOKey: ILabelOKey;
  title: string = 'etiqueta bien';
  edit: boolean = false;
  labelOkeyForm: ModelForm<ILabelOKey>;
  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private labelOkeyService: LabelOkeyService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.labelOkeyForm = this.fb.group({
      description: [
        null,
        [
          Validators.required,
          Validators.maxLength(30),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
    });
    if (this.labelOKey != null) {
      this.edit = true;
      this.labelOkeyForm.patchValue(this.labelOKey);
    }
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    this.loading = true;
    this.labelOkeyService.create(this.labelOkeyForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    this.loading = true;
    this.labelOkeyService
      .update(this.labelOKey.id, this.labelOkeyForm.value)
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  handleSuccess() {
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }

  close() {
    this.modalRef.hide();
  }
}
