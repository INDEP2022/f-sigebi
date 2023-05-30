import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { addDays } from 'date-fns';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { minDate } from 'src/app/common/validations/date.validators';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { ProgrammingRequestService } from 'src/app/core/services/ms-programming-request/programming-request.service';
import { TaskService } from 'src/app/core/services/ms-task/task.service';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-reject-programming-form',
  templateUrl: './reject-programming-form.component.html',
  styles: [],
})
export class RejectProgrammingFormComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  idProgramming: number = 0;
  task: any;
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private programmingService: ProgrammingRequestService,
    public router: Router,
    private authService: AuthService,
    private taskService: TaskService
  ) {
    super();
  }

  ngOnInit(): void {
    this.task = JSON.parse(localStorage.getItem('Task'));
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
      concurrentMsg: this.form.get('observation').value,
    };
    this.programmingService
      .updateProgramming(this.idProgramming, formData)
      .subscribe({
        next: () => {
          const user: any = this.authService.decodeToken();
          let body: any = {};

          body['idTask'] = this.task?.id;
          body['userProcess'] = user.username;
          body['type'] = 'SOLICITUD_PROGRAMACION';
          body['subtype'] = 'Aceptar_Programacion';
          body['ssubtype'] = 'REJECT';

          this.taskService.createTaskWitOrderService(body).subscribe({
            next: resp => {
              this.router.navigate(['/pages/siab-web/sami/consult-tasks']);
              this.close();
            },
            error: error => {
              console.log(error);
              this.onLoadToast('error', 'Error', 'No se pudo crear la tarea');
            },
          });
        },
        error: error => {
          console.log(error);
        },
      });
  }

  close() {
    this.modalRef.hide();
  }
}
