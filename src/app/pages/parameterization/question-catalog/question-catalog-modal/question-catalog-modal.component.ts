import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
//models
import { IQuestion } from 'src/app/core/models/catalogs/question.model';
//services
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { QuestionService } from 'src/app/core/services/catalogs/question.service';

@Component({
  selector: 'app-question-catalog-modal',
  templateUrl: './question-catalog-modal.component.html',
  styles: [],
})
export class QuestionCatalogModalComponent extends BasePage implements OnInit {
  questionForm: ModelForm<IQuestion>;
  questionI: IQuestion;
  title: string = 'Catálogo de preguntas';
  edit: boolean = false;

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private questionService: QuestionService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.questionForm = this.fb.group({
      id: [
        null,
        [
          Validators.maxLength(8),
          Validators.minLength(1),
          Validators.pattern(NUMBERS_PATTERN),
        ],
      ],
      text: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      maximumScore: [null, [Validators.required]],
      type: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      // noResponse: [null, [Validators.required]],
      // initValue: [null, [Validators.required]],
      // resValue: [null, [Validators.required]],
      // resText: [
      //   null,
      //   [Validators.required, Validators.pattern(STRING_PATTERN)],
      // ],
    });
    if (this.questionI != null) {
      this.edit = true;
      // console.log(this.questionI);
      this.questionForm.patchValue(this.questionI);
    }
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  close() {
    this.modalRef.hide();
  }

  create() {
    this.loading = true;
    console.log(this.questionForm.value);
    this.questionService.create(this.questionForm.value).subscribe(
      data => this.handleSuccess(),
      error => (this.loading = false)
    );
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizada' : 'Guardada';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }

  update() {
    this.loading = true;

    this.questionService
      .update(this.questionI.id, this.questionForm.value)
      .subscribe(
        data => this.handleSuccess(),
        error => (this.loading = false)
      );
  }
}
