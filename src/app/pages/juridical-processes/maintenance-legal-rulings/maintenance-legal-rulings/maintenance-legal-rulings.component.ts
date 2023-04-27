/** BASE IMPORT */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { IUsrRelBitacora } from 'src/app/core/models/ms-audit/usr-rel-bitacora.model';
import { ISegUsers } from 'src/app/core/models/ms-users/seg-users-model';
import { UsrRelLogService } from 'src/app/core/services/ms-audit/usrrel-log.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared/base-page';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */

@Component({
  selector: 'app-maintenance-legal-rulings',
  templateUrl: './maintenance-legal-rulings.component.html',
  styleUrls: ['./maintenance-legal-rulings.component.scss'],
})
export class MaintenanceLegalRulingComponent
  extends BasePage
  implements OnInit, OnDestroy
{
  public form: FormGroup;
  user: ISegUsers;
  params = new BehaviorSubject<FilterParams>(new FilterParams());

  constructor(
    private usrRelLogService: UsrRelLogService,
    private fb: FormBuilder,
    private usersService: UsersService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getUser(new ListParams());
    this.loading = true;
  }

  private prepareForm() {
    this.form = this.fb.group({
      justificacion: ['', Validators.required],
    });
  }

  rulingsData(value: any) {
    console.log(value);
  }

  moreInformationData(value: any) {
    console.log(value);
  }

  getUser(params: ListParams) {
    this.params = new BehaviorSubject<FilterParams>(new FilterParams());
    let data = this.params.value;
    data.page = params.page;
    data.limit = params.limit;

    data.addFilter('id', localStorage.getItem('username'));

    this.usersService.getAllSegUsers(data.getParams()).subscribe({
      next: data => {
        this.user = data.data[0];
      },
      error: err => {
        this.loading = false;
      },
    });
  }

  documentData(value: any) {
    console.log(value);
  }

  send() {
    if (!this.form.get('justificacion').value.trim()) {
      this.alert('info', 'Es necesario ingresar la justificación.', '');
    }

    const req: IUsrRelBitacora = {
      observed: this.form.get('justificacion').value,
      observedDate: new Date(),
      detiUser: '',
      sessionId: null,
      sidId: '',
      user: '',
      userrequired: '',
    };

    this.usrRelLogService.create(req).subscribe({
      next: data => {
        this.alert('success', 'Se ha creado la bitácora correctamente.', '');
      },
      error: err => {
        this.loading = false;
      },
    });
  }
}
