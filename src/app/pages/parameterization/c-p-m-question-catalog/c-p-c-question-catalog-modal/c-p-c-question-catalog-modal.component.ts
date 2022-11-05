import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-c-p-c-question-catalog-modal',
  templateUrl: './c-p-c-question-catalog-modal.component.html',
  styles: [],
})
export class CPCQuestionCatalogModalComponent
  extends BasePage
  implements OnInit
{
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
      noQuestion: [null, [Validators.required]],
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
