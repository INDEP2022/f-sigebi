import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IComerClients } from 'src/app/core/models/ms-customers/customers-model';
import { IComerEvent } from 'src/app/core/models/ms-event/event.model';
import { ComerClientsService } from 'src/app/core/services/ms-customers/comer-clients.service';
import { ComerUsuauTxEventService } from 'src/app/core/services/ms-event/comer-usuautxevento.service';
import { SecurityService } from 'src/app/core/services/ms-security/security.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { secondFormatDateToDate2 } from 'src/app/shared/utils/date';
@Component({
  selector: 'app-even-permission-control-modal',
  templateUrl: './even-permission-control-modal.component.html',
  styles: [
    `
      .bg-gray {
        background-color: white !important;
      }
    `,
  ],
})
export class EvenPermissionControlModalComponent
  extends BasePage
  implements OnInit
{
  title: string = 'CONTROL DE PERMISOS A EVENTOS';
  edit: boolean = false;

  comerUserForm: ModelForm<any>;
  comerUser: any;

  today: Date;

  idE: IComerEvent;
  cve: IComerEvent;

  users = new DefaultSelect<IComerClients>();

  event: any;
  disabledSend: boolean = true;
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private comerUsuauTxEventService: ComerUsuauTxEventService,
    private comerClientsService: ComerClientsService,
    private usersService: UsersService,
    private securityService: SecurityService
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
      date: [new Date(), [Validators.required]],
    });
    if (this.comerUser != null) {
      this.edit = true;

      console.log('date', secondFormatDateToDate2(this.comerUser.date));

      this.comerUserForm.patchValue({
        idEvent: this.comerUser.eventId,
        username: this.comerUser.user,
        date: secondFormatDateToDate2(this.comerUser.date),
      });

      // this.getDate(this.comerUser.date)
    } else {
      if (this.event) {
        this.comerUserForm.patchValue({
          idEvent: this.event.id_evento,
        });
      }
    }
  }

  getUsers(params: ListParams) {
    this.securityService.getAllUsersTracker(params).subscribe(
      data => {
        console.log('data', data);
        let result = data.data.map((item: any) => {
          item['userAndName'] = item.user + ' - ' + item.name;
        });
        Promise.all(result).then(item => {
          this.users = new DefaultSelect(data.data, data.count);
        });
      },
      err => {
        this.users = new DefaultSelect();
        // this.userChange(false)
        this.loading = false;
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
    console.log(this.comerUserForm.get('date').value);
    if (!this.comerUserForm.get('date').value) {
      this.alert('warning', 'Debe Especificar la Fecha', '');
      this.comerUserForm.get('date').markAsTouched();
      return;
    }
    let params = {
      eventId: this.comerUserForm.value.idEvent,
      user: this.comerUserForm.value.username,
      date: this.returnParseDate_(this.comerUserForm.value.date),
    };
    this.usersService.createComerUsersAutXEvent(params).subscribe({
      next: response => {
        this.handleSuccess();
        this.close();
      },
      error: err => {
        if (err.error.message == 'Datos duplicados. ID duplicado.') {
          this.alert('warning', 'Ya Existe un Registro con estos Datos', '');
        } else {
          this.handleError();
        }
      },
    });
  }

  update() {
    if (!this.comerUserForm.get('date').value) {
      this.alert('warning', 'Debe Especificar la Fecha', '');
      this.comerUserForm.get('date').markAsTouched();
      return;
    }
    let params = {
      eventId: this.comerUserForm.value.idEvent,
      user: this.comerUserForm.value.username,
      date: this.returnParseDate_(this.comerUserForm.value.date),
    };
    this.usersService.updateComerUsersAutXEvent(params).subscribe({
      next: response => {
        this.handleSuccess();
        this.close();
      },
      error: err => {
        this.handleError();
      },
    });
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.alert('success', `Permiso de Evento ${message} Correctamente`, '');
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }

  handleError() {
    const message: string = this.edit ? 'Actualizar' : 'Guardar';
    this.alert(
      'error',
      `Error al Intentar ${message} el Permiso de Evento`,
      ''
    );
  }

  returnParseDate_(data: Date) {
    console.log('DATEEEE', data);
    const formattedDate = moment(data).format('YYYY-MM-DD');
    return formattedDate;
  }

  dateConvert(date: string): Date {
    if (date != 'null' && date != undefined) {
      console.log(date);
      // const dates = new Date(date);
      // const datePipe = new DatePipe('en-US');
      // const formatTrans = datePipe.transform(dates, 'dd/MM/yyyy', 'UTC');
      const partesFecha1 = date.split('-');
      const dateConvert = new Date(
        Number(partesFecha1[2]),
        Number(partesFecha1[1]) - 1,
        Number(partesFecha1[0])
      );
      return dateConvert;
    } else {
      return null;
    }
  }

  userChange($event: any) {
    console.log($event);
    if (!$event) this.getUsers(new ListParams());
  }
}
