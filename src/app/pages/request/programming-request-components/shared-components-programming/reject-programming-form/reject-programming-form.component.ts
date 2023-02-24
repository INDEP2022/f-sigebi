import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { addDays } from 'date-fns';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { minDate } from 'src/app/common/validations/date.validators';
import { ProgrammingRequestService } from 'src/app/core/services/ms-programming-request/programming-request.service';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-reject-programming-form',
  templateUrl: './reject-programming-form.component.html',
  styles: [],
})
export class RejectProgrammingFormComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private programmingService: ProgrammingRequestService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    const fiveDays = addDays(new Date(), 5);
    this.form = this.fb.group({
      startDate: [null, [Validators.required, minDate(new Date())]],
      endDate: [null, [Validators.required, minDate(new Date(fiveDays))]],
      observation: [null, [Validators.required]],
    });
  }

  confirm() {
    const formData = {
      id: 8409,
      startDate: this.form.get('startDate').value,
      endDate: this.form.get('endDate').value,
      msgSise: this.form.get('observation').value,
    };

    return this.programmingService
      .updateProgramming(8409, formData)
      .subscribe(data => {
        console.log('actualizado', data);
      });
  }

  close() {
    this.modalRef.hide();
  }
}
