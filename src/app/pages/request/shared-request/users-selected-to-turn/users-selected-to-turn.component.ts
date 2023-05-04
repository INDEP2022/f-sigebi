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
  title: string = '¿DESEA TURNAR LA SOLICITUD SELECCIONADA?';
  paragraphs: any[] = [];
  params = new BehaviorSubject<FilterParams>(new FilterParams());
  public event: EventEmitter<any> = new EventEmitter();
  totalItems: number = 0;
  //typeTurn: string;
  request: any;
  user: any;
  typeUser: string = '';
  //injections
  private userProcessService = inject(UserProcessService);
  deleRegionalId: any;
  validBtn: any = false;
  idUser: any;
  storeData: any;
  constructor(
    private authService: AuthService,
    public modalRef: BsModalRef,
    public fb: FormBuilder
  ) {
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
    this.typeUser = this.request.targetUserType;
    this.storeData = this.authService.decodeToken();

    this.deleRegionalId = this.storeData.delegacionreg;

    // let str = "DELEGACIÓN REGIONAL METROPOLITANA";
    // let arr = str.split(" "); // Divide la cadena en un array utilizando el espacio como separador
    // arr.splice(arr.indexOf("DELEGACIÓN"), 1); // Elimina la palabra "DELEGACIÓN" del array
    // let nuevaCadena = arr.join(" "); // Convierte el array en una nueva cadena utilizando el espacio como separador
    // console.log(nuevaCadena);

    console.log('aaa', this.deleRegionalId);
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(data => {
      this.getAllUsers();
    });
  }

  getAllUsers() {
    this.loading = true;

    this.params.value.addFilter('employeeType', this.typeUser);
    this.params.value.addFilter(
      'regionalDelegation',
      this.deleRegionalId.substring(11),
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

        this.paragraphs = resp.data;
        this.totalItems = resp.count;
        this.loading = false;
      },
      error: error => {
        console.log(error);
        this.loading = false;
      },
    });
  }

  selectedRow(user: any) {
    if (this.idUser == user.data.id) {
      this.idUser = '';
      this.validBtn = false;
    } else {
      this.validBtn = true;
      this.idUser = user.data.id;
    }

    this.user = user.data;
  }
  triggerEvent(item: any) {
    this.event.emit(item);
  }

  confirm(): void {
    this.triggerEvent(this.user);
    this.close();
  }

  close(): void {
    this.modalRef.hide();
  }
}
