import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ISample } from 'src/app/core/models/ms-goodsinv/sample.model';
import { BasePage } from 'src/app/core/shared';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { ModelForm } from '../../../../../core/interfaces/model-form';

@Component({
  selector: 'app-type-signature-modal',
  templateUrl: './type-signature-modal.component.html',
  styles: [],
})
export class TypeSignatureModalComponent
  extends BasePage
  implements OnInit {
  signForm: ModelForm<any>;
  form: FormGroup = new FormGroup({});
  typeAnnex: string = '';
  minDate = new Date();
  checked: string = 'checked';
  idSample: number = 0;
  sampleInfo: ISample;

  formOnly = false;
  postSignatoryRuling: string;
  nameSignatoryRuling: string;
  typeSign: string;

  constructor(
    private fb: FormBuilder,
    private bsModalRef: BsModalRef
  ) {
    super();
  }

  ngOnInit(): void {

    this.initForm();

    this.signForm.get('name').setValue(this.nameSignatoryRuling);
    this.signForm.get('inCharge').setValue(this.postSignatoryRuling);
    this.signForm.get('tipeSign').setValue(this.typeSign);
  }

  initForm(): void {
    this.signForm = this.fb.group({
      name: [null, [Validators.pattern(STRING_PATTERN), Validators.required]],
      inCharge: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.required],
      ],
      tipeSign: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });

  }

  async acepted() {
    let data = this.signForm.getRawValue();
    this.bsModalRef.content.callback(data.name, data.inCharge, data.tipeSign);
    this.close();
  }


  close(): void {
    this.bsModalRef.hide();
  }
}
