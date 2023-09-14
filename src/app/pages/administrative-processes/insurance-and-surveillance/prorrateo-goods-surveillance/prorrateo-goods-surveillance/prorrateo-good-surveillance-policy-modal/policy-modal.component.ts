import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { IPolicyxSubtype } from 'src/app/core/models/ms-policy/policy.model';
import { PolicyService } from 'src/app/core/services/ms-policy/policy.service';
import { BasePage } from 'src/app/core/shared';

@Component({
  selector: 'app-prorrateo-good-surveillance-policy-modal',
  templateUrl: './policy-modal.component.html',
  styles: [],
})
export class ProrrateoGoodSurveillancePolicyModalComponent
  extends BasePage
  implements OnInit
{
  selectedRow: IPolicyxSubtype;
  form: FormGroup;
  newOrEdit: boolean;
  data: any;
  keyA: any;
  dateIni: any;
  id: number;
  title = 'Póliza';
  user: any;
  constructor(
    private fb: FormBuilder,
    private modal: BsModalRef,
    private policyService: PolicyService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  close() {
    this.modal.hide();
  }

  prepareForm() {
    this.form = this.fb.group({
      policyKeyId: [null, Validators.required],
      beginningDate: [null, Validators.required],
      typeNumberId: [null, Validators.required],
      subtypeNumberId: [null, Validators.required],
      ssubtypeNumberId: [null, Validators.required],
      sssubtypeNumberId: [null, Validators.required],
      concept: [null, Validators.required],
      currencyCousinKey: [null],
      currencySaKkey: [null],
      registrationNumber: [null, Validators.required],
      consecPol: [null, Validators.required],
    });
  }

  confirm() {
    if (this.form.invalid) return;
    if (this.newOrEdit) {
      //this.putGood();
    } else {
      this.insertPolicy();
    }
  }

  handleSuccess() {
    this.modal.content.callback(true);
    this.modal.hide();
  }

  insertPolicy() {
    this.newOrEdit = false;
    const dueDate = this.form.get('beginningDate').value;
    const formattedDueDate = this.formatDate(dueDate);
    console.log('Fecha', new Date(formattedDueDate));
    const model = {} as IPolicyxSubtype;
    model.policyKeyId = this.form.get('policyKeyId').value;
    model.beginningDate = formattedDueDate as any;
    model.typeNumberId = this.form.get('typeNumberId').value;
    model.subtypeNumberId = this.form.get('subtypeNumberId').value;
    model.ssubtypeNumberId = this.form.get('ssubtypeNumberId').value;
    model.sssubtypeNumberId = this.form.get('sssubtypeNumberId').value;
    model.concept = this.form.get('concept').value;
    model.currencyCousinKey = this.form.get('currencyCousinKey').value;
    model.currencySaKkey = this.form.get('currencySaKkey').value;
    model.registrationNumber = this.form.get('registrationNumber').value;
    model.consecPol = this.form.get('consecPol').value;

    console.log('MODEL: ', model);
    this.policyService.postPolicy(model).subscribe({
      next: () => {
        this.handleSuccess();
        this.onLoadToast('success', 'Registro creado con exito', '');
      },
      error: error => {
        this.onLoadToast('error', error.error.message, '');
      },
    });
  }

  formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();

    return `${year}-${month}-${day}`;
  }
}
