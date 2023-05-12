import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IUserTurn } from 'src/app/core/models/user-turn/user-turn.model';
import { ProgrammingRequestService } from 'src/app/core/services/ms-programming-request/programming-request.service';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { UsersSelectedToTurnComponent } from '../../../shared-request/users-selected-to-turn/users-selected-to-turn.component';
import { userData } from '../../perform-programming/perform-programming-form/data-perfom-programming';

@Component({
  selector: 'app-schedule-reception-form',
  templateUrl: './schedule-reception-form.component.html',
  styles: [],
})
export class ScheduleReceptionFormComponent implements OnInit {
  requestForm: ModelForm<any>;
  loading: boolean = false;
  users = new DefaultSelect(userData);
  date = new Date();
  nameUser: string = '';
  typeUser: string = 'INDEP';
  checked: string = 'checked';
  userName: string = '';
  nickName: string = '';
  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private programmingRequestService: ProgrammingRequestService,
    private router: Router,
    private bsModalRef: BsModalRef
  ) {}

  ngOnInit(): void {
    this.prepareForm();
    this.getUserInfo();
    this.getUserSelect(new ListParams());
  }

  getUserInfo() {
    this.programmingRequestService.getUserInfo().subscribe((data: any) => {
      this.nameUser = data.name;
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
    this.loading = true;
    this.requestForm.get('creationUser').setValue(this.nameUser);
    console.log('Enviar', this.requestForm.value);
    this.loading = false;
  }

  getUserSelect(user: ListParams) {}

  openModalSelectUser() {
    let config: ModalOptions = {
      initialState: {
        request: this.requestForm.value,
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
