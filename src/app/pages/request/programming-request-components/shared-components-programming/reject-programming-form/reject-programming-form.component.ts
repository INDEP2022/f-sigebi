import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { addDays } from 'date-fns';
import * as moment from 'moment';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { minDate } from 'src/app/common/validations/date.validators';

import { Iprogramming } from 'src/app/core/models/good-programming/programming';

import { ITask } from 'src/app/core/models/ms-task/task-model';
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
  programming: Iprogramming;
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

  getProgrammingData() {}

  prepareForm() {
    const fiveDays = addDays(new Date(), 5);
    this.form = this.fb.group({
      startDate: [null, [Validators.required, minDate(new Date())]],
      endDate: [null, [Validators.required, minDate(new Date(fiveDays))]],
      observation: [null, [Validators.required]],
    });

    this.programmingService.getProgrammingId(this.idProgramming).subscribe({
      next: response => {
        response.startDate = moment(response.startDate).format(
          'DD/MMMM/YYYY, h:mm:ss a'
        );

        response.endDate = moment(response.endDate).format(
          'DD/MMMM/YYYY, h:mm:ss a'
        );

        this.form.patchValue(response);
      },
      error: error => {},
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
            next: async resp => {
              const openTaskPerfomProg = await this.openTaskPerfomProg();
              if (openTaskPerfomProg == true) {
                this.router.navigate(['/pages/siab-web/sami/consult-tasks']);
                this.close();
              }
            },
            error: error => {
              this.onLoadToast('error', 'Error', 'No se pudo crear la tarea');
            },
          });
        },
        error: error => {},
      });
  }

  openTaskPerfomProg() {
    return new Promise((resolve, reject) => {
      const task = JSON.parse(localStorage.getItem('Task'));
      const params = new BehaviorSubject<ListParams>(new ListParams());
      const taskForm: ITask = {
        State: null,
      };
      this.taskService.update(task.id, taskForm).subscribe({
        next: response => {
          resolve(true);
        },
        error: error => {
          resolve(false);
        },
      });
    });
  }

  close() {
    this.modalRef.hide();
  }
}
