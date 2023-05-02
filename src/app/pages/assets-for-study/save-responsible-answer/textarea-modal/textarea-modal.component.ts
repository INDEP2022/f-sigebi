import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from '../../../../core/interfaces/model-form';

@Component({
  selector: 'app-textarea-modal',
  templateUrl: './textarea-modal.component.html',
  styles: [],
})
export class TextareaModalComponent implements OnInit {
  suspendForm: ModelForm<any>;

  constructor(private bsModalRef: BsModalRef, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.suspendForm = this.fb.group({
      reasonSuspending: [null, Validators.required],
    });
  }

  close() {
    this.bsModalRef.hide();
  }

  finish(): void {}
}
