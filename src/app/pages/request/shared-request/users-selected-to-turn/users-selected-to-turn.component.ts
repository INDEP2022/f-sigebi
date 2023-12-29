import { Component, EventEmitter, inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  FilterParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { UserProcessService } from 'src/app/core/services/ms-user-process/user-process.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { TURN_SELECTED_COLUMNS } from '../../request-in-turn/request-in-turn-selected/request-in-turn-selected-columns';

var users: any[] = [
  {
    id: 1,
    user: 'Jose',
    email: 'jose@gmail.com',
    otro: 'otro dato',
  },
  {
    id: 2,
    user: 'Mari',
    email: 'maroa@gmail.com',
    otro: 'otro dato',
  },
  {
    id: 3,
    user: 'Noe',
    email: 'Noe@gmail.com',
    otro: 'otro dato',
  },
];

@Component({
  selector: 'app-users-selected-to-turn',
  templateUrl: './users-selected-to-turn.component.html',
  styles: [],
})
export class UsersSelectedToTurnComponent extends BasePage implements OnInit {
  title: string = 'SELECCIONE EL USUARIO A TURNAR';
  paragraphs: any[] = [];
  params = new BehaviorSubject<FilterParams>(new FilterParams());
  public event: EventEmitter<any> = new EventEmitter();
  totalItems: number = 0;
  //typeTurn: string;
  request: any;
  op: any;
  user: any;
  officeCentral: boolean = false;

  typeUser: string = '';

  delegationUserLog: string = '';
  role: string = '';
  process: string = '';
  typeUserSelect: string = '';

  //injections
  deleRegionalId: any;
  validBtn: any = false;
  idUser: any;
  storeData: any;
  private userProcessService = inject(UserProcessService);
  private readonly authService = inject(AuthService);
  constructor(public modalRef: BsModalRef, public fb: FormBuilder) {
    super();
    this.settings.columns = TURN_SELECTED_COLUMNS;
    this.settings.actions = {
      columnTitle: 'Acciones',
      position: 'right',
      add: false,
      edit: false,
      delete: false,
    };
  }

  ngOnInit(): void {
    if (this.process == 'schedule') {
      this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(data => {
        this.getAllUsersSchedule(
          this.typeUserSelect,
          this.delegationUserLog,
          this.role
        );
      });
    } else {
      this.typeUser = this.request.targetUserType;
      this.storeData = this.authService.decodeToken();
      this.deleRegionalId = this.storeData.delegacionreg;
      this.role = this.storeData.puesto;

      this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(data => {
        this.getAllUsers();
      });
    }
  }

  getAllUsers() {
    this.loading = true;
    if (this.officeCentral == false) {
      this.params.value.addFilter('employeeType', this.typeUser);
      this.params.value.addFilter(
        'regionalDelegation',
        this.deleRegionalId,
        SearchFilter.ILIKE
      );
    } else {
      this.params.value.addFilter('department', 0);
    }

    const filter = this.params.getValue().getParams();

    this.userProcessService.getAll(filter).subscribe({
      next: resp => {
        resp.data.map((item: any) => {
          item['fullName'] = item.firstName + ' ' + item.lastName;
        });

        resp.data.sort(function (a: any, b: any) {
          return a.fullName - b.fullName;
        });

        this.paragraphs = resp.data;
        this.totalItems = resp.count;
        this.loading = false;
        this.validBtn = false;
      },
      error: error => {
        this.loading = false;
      },
    });
  }

  getAllUsersSchedule(typeUser: string, delegation: string, role: string) {
    this.loading = true;

    this.params.value.addFilter('employeeType', typeUser);
    this.params.value.addFilter(
      'regionalDelegation',
      delegation,
      SearchFilter.ILIKE
    );

    const filter = this.params.getValue().getParams();

    this.userProcessService.getAll(filter).subscribe({
      next: resp => {
        resp.data.map((item: any) => {
          item['fullName'] = item.firstName + ' ' + item.lastName;
        });

        resp.data.sort(function (a: any, b: any) {
          return a.fullName - b.fullName;
        });
        console.log('usuarios', resp);
        this.paragraphs = resp.data;
        this.totalItems = resp.count;
        this.loading = false;
        this.validBtn = false;
      },
      error: error => {
        console.log('error', error);
        this.loading = false;
      },
    });
  }

  selectedRow(user: any) {
    if (user.isSelected) {
      this.user = user.data;
      this.idUser = user.data.id;
      this.validBtn = true;
    } else {
      this.user = { id: null, fullName: null };
      this.idUser = null;
      this.validBtn = false;
    }
  }
  triggerEvent(item: any) {
    this.event.emit(item);
  }

  confirm(): void {
    this.triggerEvent(this.user);
    this.close();
    this.modalRef.content.callback(this.user);
  }

  close(): void {
    this.modalRef.hide();
  }
}
