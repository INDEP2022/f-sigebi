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
  styles: [],
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

      // Test the function
      const dateStr = this.comerUser.date;
      const formattedDate = this.formatDate(dateStr);
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
          idEvent: this.event.id,
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

  async formatDate(dateStr: any) {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const [day, month, year] = dateStr.split('-').map(Number);

    if (isNaN(day) || isNaN(month) || isNaN(year)) {
      throw new Error(
        'Invalid date format. Please provide a date in the format dd-mm-yyyy'
      );
    }

    const d = new Date(year, month - 1, day);
    const dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][
      d.getDay()
    ];
    const timezoneOffset = -d.getTimezoneOffset();
    const timezoneOffsetHours = Math.floor(Math.abs(timezoneOffset) / 60)
      .toString()
      .padStart(2, '0');
    const timezoneOffsetMinutes = Math.abs(timezoneOffset % 60)
      .toString()
      .padStart(2, '0');
    const timezone =
      timezoneOffset >= 0
        ? `GMT+${timezoneOffsetHours}:${timezoneOffsetMinutes}`
        : `GMT-${timezoneOffsetHours}:${timezoneOffsetMinutes}`;
    const formattedDate = `${dayOfWeek} ${months[month - 1]} ${day
      .toString()
      .padStart(2, '0')} ${year} 00:00:00 ${timezone} (hora de Venezuela)`;

    return formattedDate;
  }
}
