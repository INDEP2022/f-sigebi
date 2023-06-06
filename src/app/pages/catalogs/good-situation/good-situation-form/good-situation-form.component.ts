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
  goodSituationForm: ModelForm<IGoodSituation>;
  title = 'Situación Bien';
  edit: boolean = false;
  situation: any;
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

  private prepareForm() {
    this.goodSituationForm = this.fb.group({
      situation: [null],
      descSituation: [
        null,
        [Validators.maxLength(300), Validators.pattern(STRING_PATTERN)],
      ],
      status: [null, [Validators.maxLength(3)]],
    });
    if (this.situation != null) {
      this.edit = true;
      this.goodSituationForm.patchValue(this.situation);
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
    this.goodSituationService
      .create(this.goodSituationForm.getRawValue())
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  update() {
    this.loading = true;
    console.log('Update ', this.situation);
    this.goodSituationService
      .updateCatalogGoodSituation(
        this.situation.situation,
        this.goodSituationForm.getRawValue()
      )
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
