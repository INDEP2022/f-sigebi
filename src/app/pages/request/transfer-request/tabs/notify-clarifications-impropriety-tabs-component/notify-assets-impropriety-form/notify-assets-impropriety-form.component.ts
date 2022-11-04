import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-notify-assets-impropriety-form',
  templateUrl: './notify-assets-impropriety-form.component.html',
  styles: [],
})
export class NotifyAssetsImproprietyFormComponent
  extends BasePage
  implements OnInit
{
  title: string = 'Aclaración';
  clarificationForm: ModelForm<any>;
  clarification: any;
  //en el caso de que una aclaracion llege sin documentacion
  withDocumentation: boolean = false;

  constructor(private fb: FormBuilder, private modalRef: BsModalRef) {
    super();
  }

  ngOnInit(): void {
    console.log(this.clarification);
    this.initForm();
  }

  initForm(): void {
    this.clarificationForm = this.fb.group({
      receiver: [null, [Validators.required]],
      senderCharge: [null, [Validators.required]],
      receiverCharge: [null],
      keyClarification: [null],
      idTransmitter: [null],
      clarification: [null, [Validators.required]],
      consistent: [null, [Validators.required]],
      finalParagraph: [null],
      initialParagraph: [null],
      observations: [null],
      captureUserArea: [null],
      emailNotifiSat: [null],
      nameSender: [null],
    });
  }

  confirm() {
    console.log(this.clarificationForm.value);
  }

  close() {
    this.modalRef.hide();
  }
}
