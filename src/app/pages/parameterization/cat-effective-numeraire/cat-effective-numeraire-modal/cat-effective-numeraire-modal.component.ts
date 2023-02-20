import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
//models
import { INumeraryCategories } from 'src/app/core/models/catalogs/numerary-categories-model';
//Services
import { NumeraryCategoriesService } from 'src/app/core/services/catalogs/numerary-categories.service';

@Component({
  selector: 'app-cat-effective-numeraire-modal',
  templateUrl: './cat-effective-numeraire-modal.component.html',
  styles: [],
})
export class CatEffectiveNumeraireModalComponent
  extends BasePage
  implements OnInit
{
  numeraryCategoriesForm: ModelForm<INumeraryCategories>;
  numeraryCategories: INumeraryCategories;
  title: string = 'Categoria para numerario de efectivo';
  edit: boolean = false;

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private numeraryCategoriesService: NumeraryCategoriesService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.numeraryCategoriesForm = this.fb.group({
      id: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      description: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      enterExit: [null, [Validators.required]],
      noRegistration: [null],
    });
    if (this.numeraryCategories != null) {
      this.edit = true;
      console.log(this.numeraryCategories);
      this.numeraryCategoriesForm.patchValue(this.numeraryCategories);
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
    this.numeraryCategoriesService
      .create(this.numeraryCategoriesForm.value)
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  update() {
    this.loading = true;
    this.numeraryCategoriesService
      .update(this.numeraryCategories.id, this.numeraryCategoriesForm.value)
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
