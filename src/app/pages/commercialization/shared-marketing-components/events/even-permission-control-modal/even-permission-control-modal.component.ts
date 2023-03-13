import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IComerClients } from 'src/app/core/models/ms-customers/customers-model';
import { IComerUsuaTxEvent } from 'src/app/core/models/ms-event/comer-usuatxevent-model';
import { IComerEvent } from 'src/app/core/models/ms-event/event.model';
import { ComerClientsService } from 'src/app/core/services/ms-customers/comer-clients.service';
import { ComerUsuauTxEventService } from 'src/app/core/services/ms-event/comer-usuautxevento.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-even-permission-control-modal',
  templateUrl: './even-permission-control-modal.component.html',
  styles: [],
})
export class EvenPermissionControlModalComponent
  extends BasePage
  implements OnInit
{
  title: string = 'CONTROL DE PERMISOS A EVENTOS';
  edit: boolean = false;

  comerUserForm: ModelForm<IComerUsuaTxEvent>;
  comerUser: IComerUsuaTxEvent;

  today: Date;

  idE: IComerEvent;
  cve: IComerEvent;

  users = new DefaultSelect<IComerClients>();

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private comerUsuauTxEventService: ComerUsuauTxEventService,
    private comerClientsService: ComerClientsService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.comerUserForm = this.fb.group({
      idEvent: [null, [Validators.required]],
      username: [null, [Validators.required]],
      date: [null, [Validators.required]],
    });
    if (this.comerUser != null) {
      this.edit = true;
      console.log('Editar Evento:', this.comerUser.idEvent);
      this.comerUserForm.patchValue(this.comerUser);
    } else {
      console.log('Nuevo', this.idE);
    }
  }

  getUsers(params: ListParams) {
    this.comerClientsService.getAll(params).subscribe(
      data => {
        this.users = new DefaultSelect(data.data, data.count);
      },
      err => {
        let error = '';
        if (err.status === 0) {
          error = 'Revise su conexión de Internet.';
        } else {
          error = err.message;
        }
        this.onLoadToast('error', 'Error', error);
      },
      () => {}
    );
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    this.loading = true;
    this.comerUsuauTxEventService.create(this.comerUserForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    this.loading = true;
    this.comerUsuauTxEventService.update(this.comerUserForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizada' : 'Guardada';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
