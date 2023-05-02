import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
  idProgramming: number = 0;
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private programmingService: ProgrammingRequestService,
    public router: Router
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
      id: this.idProgramming,
      startDate: this.form.get('startDate').value,
      endDate: this.form.get('endDate').value,
      msgSise: this.form.get('observation').value,
    };

    return this.programmingService
      .updateProgramming(this.idProgramming, formData)
      .subscribe(data => {
        console.log('actualizado', data);
        this.close();
        this.router.navigate([
          'pages/request/programming-request/return-to-programming',
          this.idProgramming,
        ]);
      });
  }

  close() {
    this.modalRef.hide();
  }
}
