import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { userData } from '../../perform-programming/perform-programming-form/data-perfom-programming';
import { ProgrammingRequestService } from '../../service/programming-request.service';
import { SearchUserFormComponent } from '../search-user-form/search-user-form.component';

@Component({
  selector: 'app-schedule-reception-form',
  templateUrl: './schedule-reception-form.component.html',
  styles: [],
})
export class ScheduleReceptionFormComponent implements OnInit {
  scheduleForm: FormGroup = new FormGroup({});
  loading: boolean = false;
  users = new DefaultSelect(userData);
  date = new Date();
  nameUser: string = '';
  typeUser: string = 'T.E';
  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private programmingRequestService: ProgrammingRequestService
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
    this.scheduleForm = this.fb.group({
      radio: ['T.E'],
      userId: [null, [Validators.required]],
      check: [false],
    });
  }

  selectTypeUser(event: Event) {
    this.typeUser = (event.target as HTMLInputElement).value;
  }

  confirm() {
    alert('Please enter');
  }

  getUserSelect(user: ListParams) {}

  searchUser() {
    const typeUser = this.typeUser;
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };

    config.initialState = {
      typeUser,
      callback: (data: any) => {
        if (data) {
        }
      },
    };

    const searchUser = this.modalService.show(SearchUserFormComponent, config);
  }
}
