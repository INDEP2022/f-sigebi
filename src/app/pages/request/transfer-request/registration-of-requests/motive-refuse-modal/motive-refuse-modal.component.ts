import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { IRequest } from 'src/app/core/models/requests/request.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { TaskService } from 'src/app/core/services/ms-task/task.service';
import { RequestService } from 'src/app/core/services/requests/request.service';
import { BasePage } from 'src/app/core/shared';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-motive-refuse-modal',
  templateUrl: './motive-refuse-modal.component.html',
  styles: [],
})
export class MotiveRefuseModalComponent extends BasePage implements OnInit {
  dataRequest: any;
  id: any;
  form: FormGroup = new FormGroup({});
  //loading: boolean = false;
  goodfinderService: any;
  process: string = '';
  idTask: any;

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private requestService: RequestService,
    private bsModelRef: BsModalRef,
    private authService: AuthService,
    public route: ActivatedRoute,
    private taskService: TaskService
  ) {
    super();
  }

  ngOnInit(): void {
    console.log(this.dataRequest);
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      rejectionComment: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
  }

  confirm() {
    this.update();
  }

  update() {
    const obj: IRequest = {
      rejectionComment: this.form.controls['rejectionComment'].value,
    };
    this.requestService.update(this.dataRequest.id, obj).subscribe({
      next: data => {
        this.handleSuccess();
        this.updateGoodStatus('VERIFICAR_CUMPLIMIENTO', 'ROP');
        this.closeTask();
      },
      error: error => (this.loading = false),
    });
  }

  handleSuccess() {
    const message: string = 'Guardado';
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }

  close() {
    this.modalRef.hide();
  }

  //Obtenemos el tipo de proceso//
  processView() {
    this.route.data.forEach((item: any) => {
      this.process = item.process;
    });
  }

  async updateGoodStatus(newProcessStatus: string, status: string = null) {
    const user = this.authService.decodeToken();
    let body: any = { request: 0, status: '', process: '' };
    body.request = Number(this.dataRequest.id);
    body.status = newProcessStatus; //good.processStatus
    body.process = this.process;
    body.statusGood = status; // good.status

    if (
      this.process === 'process-approval' &&
      newProcessStatus === 'APROBADO'
    ) {
      body.process = 'process-approval';
      body.programChangeStatus = 'SOLICITUD_TRANSFERENCIA';
      body.user = user.username;
    }
    const resultado = await this.updateProcessStatus(body);
  }

  updateProcessStatus(body: any) {
    return new Promise((resolve, reject) => {
      this.goodfinderService.updateStatusProcess(body).subscribe({
        next: resp => {
          resolve(true);
        },
        error: error => {
          reject('Error al actualizar los estados');
          console.log('Error al actualizar los estados ', error);
          this.onLoadToast(
            'error',
            'Error al actualizar el estado de los Bienes',
            ''
          );
        },
      });
    });
  }

  closeTask() {
    const body: any = {};
    body.id = this.idTask;
    body.State = 'FINALIZADA';

    this.taskService.update(this.idTask, body).subscribe({
      next: resp => {
        console.log('Tarea Cerrada');
      },
      error: errir => {
        console.log('Error al cerrar');
      },
    });
  }
}
