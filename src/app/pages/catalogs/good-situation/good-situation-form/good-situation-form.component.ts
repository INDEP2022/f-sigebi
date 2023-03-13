import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IGoodSituation } from 'src/app/core/models/catalogs/good-situation.model';
import { GoodSituationService } from 'src/app/core/services/catalogs/good-situation.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-good-situation-form',
  templateUrl: './good-situation-form.component.html',
  styles: [],
})
export class GoodSituationFormComponent extends BasePage implements OnInit {
  goodSituation: IGoodSituation;
  edit: boolean = false;
  goodSituationForm: ModelForm<IGoodSituation>;
  title = 'Situación Bien';

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private goodSituationService: GoodSituationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.goodSituationForm = this.fb.group({
      situation: [null, [Validators.required]],
      descSituation: [
        null,
        [
          Validators.required,
          Validators.maxLength(300),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      status: [null, [Validators.required, Validators.maxLength(3)]],
    });

    if (this.goodSituation != null) {
      this.edit = true;
      this.goodSituationForm.patchValue(this.goodSituation);
    }
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    this.loading = true;

    this.goodSituationService
      .create(this.goodSituationForm.getRawValue())
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  update() {
    this.goodSituationService
      .update(
        this.goodSituation.situation,
        this.goodSituationForm.getRawValue()
      )
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  close() {
    this.modalRef.hide();
  }

  handleSuccess() {
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
