import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-question-catalog-modal',
  templateUrl: './question-catalog-modal.component.html',
  styles: [],
})
export class QuestionCatalogModalComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  allotment: any;
  title: string = 'Catálogo de preguntas';
  edit: boolean = false;
  @Output() refresh = new EventEmitter<true>();

  constructor(private fb: FormBuilder, private modalRef: BsModalRef) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      noQuestion: [
        null,
        [
          Validators.required,
          Validators.maxLength(8),
          Validators.minLength(1),
          Validators.pattern(NUMBERS_PATTERN),
        ],
      ],
      textQuestion: [null, [Validators.required]],
      maxScore: [null, [Validators.required]],
      typeQuestion: [null, [Validators.required]],
      noResponse: [null, [Validators.required]],
      initValue: [null, [Validators.required]],
      resValue: [null, [Validators.required]],
      resText: [null, [Validators.required]],
    });
    if (this.allotment != null) {
      this.edit = true;
      console.log(this.allotment);
      this.form.patchValue(this.allotment);
    }
  }

  close() {
    this.modalRef.hide();
  }
}
