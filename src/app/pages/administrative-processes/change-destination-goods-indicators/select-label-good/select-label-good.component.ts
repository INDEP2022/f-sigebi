import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { BasePage } from 'src/app/core/shared';

@Component({
  selector: 'app-select-label-good',
  templateUrl: './select-label-good.component.html',
  styleUrls: ['./select-label-good.component.css'],
})
export class SelectLabelGoodComponent extends BasePage implements OnInit {
  form: ModelForm<any>;
  labelNumber: any;
  path: string = '';

  constructor(private modalRef: BsModalRef, private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    console.log('labelNumber', this.labelNumber);
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      labelGood: [null],
    });
    /*if (this.affair != null) {
      this.edit = true;
      this.affairForm.patchValue(this.affair);
    }*/
  }

  close() {
    this.modalRef.hide();
  }
}
