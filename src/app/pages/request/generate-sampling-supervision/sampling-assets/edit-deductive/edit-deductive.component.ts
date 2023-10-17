import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { IDeductive } from 'src/app/core/models/catalogs/deductive.model';
import { BasePage } from 'src/app/core/shared';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-edit-deductive',
  templateUrl: './edit-deductive.component.html',
  styles: [],
})
export class EditDeductiveComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  deductive: IDeductive;
  constructor(private fb: FormBuilder, private modalRef: BsModalRef) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      observations: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
  }

  confirm() {
    this.alertQuestion(
      'question',
      'Confirmación',
      '¿Desea guardar el comentario a la deductiva?'
    ).then(question => {
      if (question.isConfirmed) {
        this.deductive.observations = this.form.get('observations').value;
        this.modalRef.content.callback(true, this.deductive);
        this.close();
      }
    });
  }

  close() {
    this.modalRef.hide();
  }
}
