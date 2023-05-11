import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IGoodProgramming } from 'src/app/core/models/good-programming/good-programming';
import { IUserTurn } from 'src/app/core/models/user-turn/user-turn.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { GenericService } from 'src/app/core/services/catalogs/generic.service';
import { ProgrammingGoodService } from 'src/app/core/services/ms-programming-request/programming-good.service';
import { ProgrammingRequestService } from 'src/app/core/services/ms-programming-request/programming-request.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { UsersSelectedToTurnComponent } from '../../../shared-request/users-selected-to-turn/users-selected-to-turn.component';
import { userData } from '../../perform-programming/perform-programming-form/data-perfom-programming';

@Component({
  selector: 'app-schedule-reception-form',
  templateUrl: './schedule-reception-form.component.html',
  styles: [],
})
export class ScheduleReceptionFormComponent extends BasePage implements OnInit {
  requestForm: ModelForm<any>;
  users = new DefaultSelect(userData);
  date: string = '';
  nameUser: string = '';
  typeUserLog: string = '';
  regionalDelegationNum: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  typeUser: string = 'INDEP';
  checked: string = 'checked';
  userName: string = '';
  nickName: string = '';
  delegationUser: string = '';
  typeEvent: string = '';
  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private programmingRequestService: ProgrammingRequestService,
    private router: Router,
    private bsModalRef: BsModalRef,
    private authService: AuthService,
    private programmingGoodService: ProgrammingGoodService,
    private genericService: GenericService
  ) {
    super();
    let now = moment();
    this.date = now.format();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getUserInfo();
    this.getUserSelect(new ListParams());
    this.userLogData();
    this.getTypeEvent();
  }

  parseDateNoOffset(date: string | Date): Date {
    const dateLocal = new Date(date);
    return new Date(
      dateLocal.valueOf() + dateLocal.getTimezoneOffset() * 60 * 1000
    );
  }

  getTypeEvent() {
    this.params.getValue()['filter.name'] = 'Tipo Evento';
    this.genericService.getAll(this.params.getValue()).subscribe({
      next: response => {
        console.log('tipo Evento', response);
        this.typeEvent = response.data[0].description;
      },
      error: error => {
        console.log(error);
      },
    });
  }

  userLogData() {
    let userLog = this.authService.decodeToken();
    this.delegationUser = userLog.delegacionreg;
  }

  getUserInfo() {
    this.programmingRequestService.getUserInfo().subscribe((data: any) => {
      console.log('data', data);
      this.nameUser = data.name;
      this.typeUserLog = data.employeetype;
      this.regionalDelegationNum = data.department;
    });
  }

  prepareForm() {
    this.requestForm = this.fb.group({
      creationUser: [null, [Validators.required]],
      targetUserType: ['TE'],
      date: this.date,
      typeEvent: 'Recepción Fisica',
    });
  }

  selectTypeUser(event: Event) {
    this.typeUser = (event.target as HTMLInputElement).value;
  }

  confirm() {
    this.alertQuestion(
      'question',
      'Turnar Solicitud',
      `¿Deseas turnar la solicitud a ${this.userName}?`
    ).then(question => {
      if (question.isConfirmed) {
        this.loading = true;
        this.requestForm.get('creationUser').setValue(this.nameUser);
        console.log('Enviar', this.requestForm.value);

        const programmingData: IGoodProgramming = {
          typeUser: this.typeUserLog,
          regionalDelegationNumber: this.regionalDelegationNum,
        };

        //SABER DONDE SE GUARDA EL USUARIO TURNADO//
        this.programmingGoodService
          .createProgramming(programmingData)
          .subscribe({
            next: response => {
              console.log('Guardado', response);
            },
            error: error => {},
          });

        this.loading = false;
      }
    });
  }

  getUserSelect(user: ListParams) {}

  openModalSelectUser() {
    const delegationUserLog = this.delegationUser;
    let config: ModalOptions = {
      initialState: {
        request: this.requestForm.value,
        delegationUserLog,
        callback: (user: IUserTurn) => {
          if (user) {
            console.log('user', user);
            this.userName = user.firstName + ' ' + user.lastName;
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(UsersSelectedToTurnComponent, config);
  }
}
