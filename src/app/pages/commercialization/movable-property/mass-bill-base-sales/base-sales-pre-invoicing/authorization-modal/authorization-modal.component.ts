import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
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
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'authorization-modal',
  templateUrl: './authorization-modal.component.html',
  styles: [],
})
export class AuthorizationSOIModalComponent extends BasePage implements OnInit {
  title: string = 'Verificación';
  user: TokenInfoModel;
  form: FormGroup;
  showPassword: boolean = false;
  constructor(
    private modalRef: BsModalRef,
    private comerInvoiceService: ComerInvoiceService,
    private authService: AuthService,
    private comerEventService: ComerEventService,
    private userService: UsersService,
    private securityService: SecurityService
  ) {
    super();
  }

  ngOnInit(): void {
    this.user = this.authService.decodeToken();
    this.form.get('userV').setValue(this.user.preferred_username.toUpperCase());
  }

  async validate() {
    const { userV, passwordV, event } = this.form.value;
    const aux = await this.comerEvent(event);

    const aux_auto = await this.validateUser(userV, passwordV, aux);
    console.log('aux_auto', aux_auto);
    if (aux_auto == 1) {
      this.modalRef.content.callback(event);
      this.modalRef.hide();
    } else {
      this.modalRef.content.callback(null);
      this.modalRef.hide();
    }
  }

  async comerEvent(event: string) {
    return firstValueFrom(
      this.comerEventService.geEventId(event).pipe(
        map(resp => resp.delegationNumber ?? 0),
        catchError(() => of(0))
      )
    );
  }

  async generateInvoiceSoi(data: any) {
    return firstValueFrom(
      this.comerInvoiceService.procedureGenerate(data).pipe(
        map(() => true),
        catchError(() => of(false))
      )
    );
  }

  async validateUser(userv: string, password: string, aux: number) {
    const data = await this.checkUser(userv.toUpperCase());

    if (!data.aux_dominio && !data.aux_user) {
      this.alert('warning', 'Usuario no autorizado', '');
      return 0;
    }

    if (data.aux_dominio == 'C') {
      null;
    } else if (data.aux_dominio == 'R') {
      // const aux_auto = await this.viewDelegationUser(userv, aux);
      const aux_auto = await this.validateRegUser(
        userv.toUpperCase(),
        this.user.department
      );
      if (aux_auto == 0) {
        this.alert(
          'warning',
          'El usuario no tiene atributos sobre la regional de la factura',
          ''
        );
        return 0;
      }
    }

    // se revisara esto
    // AUX_CONN := VAL_CONNECT(PUSER, PPASS)
    //const aux_con = await this.valConection()
    //return aux_con
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

  // async getUserXCancel(user: string) {
  //   const filter = new FilterParams();
  //   filter.addFilter('user', user.toUpperCase(), SearchFilter.EQ);
  //   return firstValueFrom(
  //     this.userService.getUseXEvent(filter.getParams()).pipe(
  //       map(resp => resp[0] ?? [{}]),
  //       catchError(() => of([{}]))
  //     )
  //   );
  // }

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
