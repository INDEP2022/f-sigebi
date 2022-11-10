import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-clarification-form-tab',
  templateUrl: './clarification-form-tab.component.html',
  styles: [],
})
export class ClarificationFormTabComponent extends BasePage implements OnInit {
  clarificationForm: ModelForm<any>;
  title: string = 'Aclaración';
  edit: boolean = false;
  selectTypeClarification = new DefaultSelect<any>();
  selectClarification = new DefaultSelect<any>();
  docClarification: any[];

  constructor(private fb: FormBuilder, private modalRef: BsModalRef) {
    super();
  }

  ngOnInit(): void {
    //si tipo de aclaracion es Aclaracion se muestra este input
    this.edit = true;

    //verificar si se puede seleccionar muchas aclaraciones para editar y si es a si, que pasa
    // si son diferentes tipos de aplaracioens
    console.log(this.docClarification);

    this.initForm();
  }

  initForm(): void {
    this.clarificationForm = this.fb.group({
      typeClarification: [null],
      clarification: [null],
      reason: [null],
    });

    if (this.docClarification != undefined) {
      this.edit = true;
      //bloquear tipo de claracion cuando se edite

      /* this.clarificationForm.patchValue({
        ...this.clarificationForm,
        typeClarification: this.docClarification.typeClarification,
        reason: this.docClarification.reason,
      });
      this.clarificationForm.controls['typeClarification'].disable(); */
    }
  }

  getTypeClarification(event: any): void {}

  getClarification(event: any): void {}

  confirm(): void {}

  close(): void {
    this.modalRef.hide();
  }
}
