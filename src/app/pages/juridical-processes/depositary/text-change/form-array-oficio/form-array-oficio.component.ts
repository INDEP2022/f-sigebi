import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { catchError, tap, throwError } from 'rxjs';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { ICopiesJobManagementDto } from 'src/app/core/models/ms-officemanagement/good-job-management.model';
import { ISegUsers } from 'src/app/core/models/ms-users/seg-users-model';
import { GoodsJobManagementService } from 'src/app/core/services/ms-office-management/goods-job-management.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-form-array-oficio',
  templateUrl: './form-array-oficio.component.html',
  styles: [],
})
export class FormArrayOficioComponent extends BasePage implements OnInit {
  options: any[];
  nrSelecttypePerson: string | number;
  nrSelecttypePerson_I: string | number;
  users$ = new DefaultSelect<ISegUsers>();
  @Input() formulario!: FormGroup;
  @Input() filtroPersonaExt: ICopiesJobManagementDto;
  nameUserDestinatario: ISegUsers;

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private serviceOficces: GoodsJobManagementService
  ) {
    super();
  }

  ngOnInit(): void {
    console.log(
      'filtroPersonaExt  =>  ' + JSON.stringify(this.filtroPersonaExt)
    );

    this.options = [
      { value: null, label: 'Seleccione un valor' },
      { value: 'E', label: 'PERSONA EXTERNA' },
      { value: 'I', label: 'PERSONA INTERNA' },
    ];

    this.formulario.get('typePerson').valueChanges.subscribe(value => {
      if (value === 'E') {
        this.formulario.get('senderUser').setValue(null);
      } else {
        this.formulario.get('senderUser').setValue('');
      }
    });
    this.formulario.get('typePerson_I').valueChanges.subscribe(value => {
      if (value === 'E') {
        this.formulario.get('senderUser_I').setValue(null);
      }
    });
  }

  getUsers($params: ListParams) {
    let params = new FilterParams();
    params.page = $params.page;
    params.limit = $params.limit;
    params.search = $params.text;
    this.getAllUsers(params).subscribe();
  }

  getAllUsers(params: FilterParams) {
    return this.usersService.getAllSegUsers(params.getParams()).pipe(
      catchError(error => {
        this.users$ = new DefaultSelect([], 0, true);
        return throwError(() => error);
      }),
      tap(response => {
        this.users$ = new DefaultSelect(response.data, response.count);
      })
    );
  }
}
