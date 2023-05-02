import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { catchError, map, switchMap, tap, throwError } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IManagementArea } from 'src/app/core/models/ms-proceduremanagement/ms-proceduremanagement.interface';
import { ISegUsers } from 'src/app/core/models/ms-users/seg-users-model';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { ProcedureManagementService } from 'src/app/core/services/proceduremanagement/proceduremanagement.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { CONFIRM_SAVE } from '../../utils/work-mailbox-messages';

@Component({
  selector: 'app-save-modal-mailbox',
  templateUrl: './save-modal-mailbox.component.html',
  styles: [],
})
export class SaveModalMailboxComponent extends BasePage implements OnInit {
  users$ = new DefaultSelect<ISegUsers>();
  areas$ = new DefaultSelect<IManagementArea>();

  selectedRow: any = {};

  filterForm: FormGroup = this.fb.group({
    managementArea: [null],
    user: [null],
  });

  columnFilters: any = [];
  dataTable: LocalDataSource = new LocalDataSource();

  get managementAreaF() {
    return this.filterForm.controls['managementArea'];
  }

  get user() {
    this.dataTable.count;
    return this.filterForm.controls['user'];
  }

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private procedureManagementService: ProcedureManagementService,
    private modalRef: BsModalRef
  ) {
    super();
  }

  ngOnInit(): void {}

  getUsers($params: ListParams) {
    //console.log($params);
    let params = new FilterParams();
    params.page = $params.page;
    params.limit = $params.limit;
    const area = this.managementAreaF.value;
    params.search = $params.text;
    //params.addFilter('name', $params.text, SearchFilter.LIKE);
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

  userChange(user: any) {
    //console.log(user);
    if (user == undefined) {
      delete this.columnFilters['filter.turnadoiUser'];
    }
    const params = new ListParams();
    //console.log(params)
    this.filterForm.controls['managementArea'].setValue(null);
    this.areas$ = new DefaultSelect([], 0, true);
    this.getGroupWork(params, true);
    const _user = this.user.value;
    //console.log(_user);
    const _area = this.managementAreaF.value;
    if (_user && _area) {
      this.setDefaultValuesByArea(_area, _user);
    }
  }

  setDefaultValuesByArea(area: IManagementArea, user: any) {
    //console.log({ area, user });
    //this.filterForm.controls['managementArea'].setValue(area);
    const params = new FilterParams();
    params.addFilter('managementArea', area.id);
    params.addFilter('user', user.id);
  }

  getAreas(params: FilterParams) {
    return this.procedureManagementService
      .getManagamentArea(params.getParams())
      .pipe(
        catchError(error => {
          this.areas$ = new DefaultSelect([], 0, true);
          return throwError(() => error);
        }),
        tap(resp => {
          //console.log(resp);
          this.areas$ = new DefaultSelect(resp.data, resp.count);
          //if (resp.data.length > 0)
          //this.filterForm.controls['managementArea'].setValue(resp.data[0]);
        })
      );
  }

  getGroupWork($params: ListParams, reset?: boolean) {
    if (reset) {
      $params.page = 1;
    }
    const _params = new FilterParams();
    const params = new FilterParams();
    _params.limit = 100;
    params.page = $params.page;
    params.limit = $params.limit;
    params.addFilter('description', $params.text, SearchFilter.LIKE);
    //params.search = $params.text;

    const user = this.user.value;
    //console.log(user)
    if (user) {
      _params.addFilter('user', user.id);
      this.getAllManagementGroupAreas(_params)
        .pipe(
          map(response => response.data.map(group => group.managementArea)),
          switchMap(areas => {
            if (areas.length > 0) {
              params.addFilter('id', areas.join(','), SearchFilter.IN);
            }
            return this.getAreas(params);
          })
        )
        .subscribe({
          next: () => {},
          error: error => {
            this.areas$ = new DefaultSelect();
            this.filterForm.controls['managementArea'].setValue(null);
          },
        });
    } else {
      this.getAreas(params).subscribe();
    }
  }

  getAllManagementGroupAreas(params: FilterParams) {
    return this.procedureManagementService.getManagamentGroupWork(
      params.getParams()
    );
  }

  areaChange(area: IManagementArea) {
    //console.log(area);
    const user = this.user.value;
    const _area = this.managementAreaF.value;
    if (user && _area) {
      this.setDefaultValuesByArea(_area, user);
    }
  }

  close() {
    this.modalRef.hide();
  }

  async confirm() {
    const result = await this.alertQuestion(
      'question',
      'Advertencia',
      CONFIRM_SAVE
    );

    if (result.isConfirmed) {
      if (this.managementAreaF.value && this.user.value) {
        this.savePaperwork('1').subscribe();
      } else {
        this.savePaperwork('2').subscribe();
      }
    }
  }

  savePaperwork(option: string) {
    const { processNumber, areaATurn, userATurn } = this.selectedRow;
    let body;
    if (option === '1') {
      body = {
        status: this.managementAreaF.value.id + 'I',
        userTurned: this.user.value.id,
        situation: 1,
      };
    } else {
      body = {
        status: areaATurn + 'I',
        userTurned: userATurn,
        situation: 1,
      };
    }

    return this.procedureManagementService.update(processNumber, body).pipe(
      catchError(error => {
        this.onLoadToast(
          'error',
          'Error',
          'Ocurrio un error al enviar el trámite'
        );
        return throwError(() => error);
      }),
      tap(() => {
        this.onLoadToast('success', 'El trámite se envío correctamente', '');
        this.modalRef.content.callback(true);
        this.close();
      })
    );
  }
}
