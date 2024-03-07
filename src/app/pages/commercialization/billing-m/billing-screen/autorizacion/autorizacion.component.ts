import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { catchError, firstValueFrom, map, of } from 'rxjs';
import {
  FilterParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { TokenInfoModel } from 'src/app/core/models/authentication/token-info.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { ComerInvoiceService } from 'src/app/core/services/ms-invoice/ms-comer-invoice.service';
import { ComerEventService } from 'src/app/core/services/ms-prepareevent/comer-event.service';
import { SecurityService } from 'src/app/core/services/ms-security/security.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared';
import { BillingsService } from '../../services/services';

@Component({
  selector: 'app-autorizacion',
  templateUrl: './autorizacion.component.html',
  styles: [],
})
export class AutorizacionComponent extends BasePage implements OnInit {
  title: string = 'Verificación';
  user: TokenInfoModel;
  form: FormGroup;
  showPassword: boolean = false;
  constructor(
    private modalRef: BsModalRef,
    private comerEventService: ComerEventService,
    private comerInvoiceService: ComerInvoiceService,
    private authService: AuthService,
    private userService: UsersService,
    private securityService: SecurityService,
    private datePipe: DatePipe,
    private fb: FormBuilder,
    private billingsService: BillingsService
  ) {
    super();
  }

  ngOnInit(): void {
    this.user = this.authService.decodeToken();
    this.form = this.fb.group({
      userV: [null, Validators.required],
    });
    this.form.get('userV').setValue(this.user.preferred_username.toUpperCase());
  }

  async validate() {
    const { userV, passwordV, event } = this.form.value;

    const aux_auto = await this.validateUser(userV, passwordV);
    console.log('aux_auto', aux_auto);
    if (aux_auto == 1) {
      this.modalRef.content.callback(event);
      this.modalRef.hide();
    } else {
      this.modalRef.content.callback(null);
      this.modalRef.hide();
    }
  }

  async validateUser(userv: string, password: string) {
    const data = await this.checkUser(userv.toUpperCase());

    if (!data.aux_dominio && !data.aux_user) {
      this.alert('warning', 'El Usuario no puede autorizar cancelación', '');
      return 0;
    }

    return 1 || 0;
  }

  async viewDelegationUser(user: string, delegation: number) {
    return firstValueFrom(
      this.comerInvoiceService.procedureGenerate(null).pipe(
        map(() => 1),
        catchError(() => of(0))
      )
    );
  }

  async checkUser(user: string) {
    const filter = new FilterParams();
    filter.addFilter('user', user, SearchFilter.EQ);
    return firstValueFrom(
      this.userService.getComerUserXCan(filter.getParams()).pipe(
        map(resp => {
          return {
            aux_user: resp.data[0].user,
            aux_dominio: resp.data[0].domain,
          };
        }),
        catchError(() => of({ aux_user: null, aux_dominio: null }))
      )
    );
  }

  close() {
    this.modalRef.content.callback(null);
    this.modalRef.hide();
  }

  async validateRegUser(user: string, delegation: string) {
    const filter = new FilterParams();
    filter.addFilter('user', user, SearchFilter.EQ);
    return firstValueFrom(
      this.securityService.getViewDelegationUser_(user, delegation).pipe(
        map(resp => resp.aux_dele),
        catchError(() => of(0))
      )
    );
  }
}
