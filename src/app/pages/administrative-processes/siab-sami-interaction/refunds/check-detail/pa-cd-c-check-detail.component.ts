import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//Models
import { ICheck } from 'src/app/core/models/administrative-processes/siab-sami-interaction/check.model';

@Component({
  selector: 'app-pa-cd-c-check-detail',
  templateUrl: './pa-cd-c-check-detail.component.html',
  styles: [
  ]
})
export class PaCdCCheckDetailComponent extends BasePage implements OnInit {

  form: FormGroup = new FormGroup({});

  check: ICheck =null;
  edit: boolean = false;
  status: string = 'Nuevo';
  title: string = 'Cheque';

  @Output() data = new EventEmitter<{}>();

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm(): void {
    this.form = this.fb.group({
      checkNumber: [null, [Validators.required]],
      accountNumber: [null, [Validators.required]],
      /**NO DATA IN THE SERVER--IT IS REQUIRED**/
      bank: [null],
    });

    if (this.edit) {
      this.status = 'Actualizar';
      this.form.patchValue(this.check);
    }
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    let data={
      ...this.form.value
    };
    this.data.emit(data);
    this.modalRef.hide();
  }

}
