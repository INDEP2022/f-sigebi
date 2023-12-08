import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
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
  selector: 'app-autorization-modal2',
  templateUrl: './autorization-modal2.component.html',
  styles: [],
})
export class AutorizationModal2Component extends BasePage implements OnInit {
  title: string = 'Verificación';
  user: TokenInfoModel;
  form: FormGroup;
  showPassword: boolean = false;
  bills: any;
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
  }

  async validate() {
    const { userV, passwordV, event } = this.form.value;
    // const aux = await this.comerEvent(event);

    const aux_auto = await this.validateUser(userV, passwordV, this.bills);
    console.log('aux_auto', aux_auto);
    // if (aux_auto == 1) {
    this.modalRef.content.callback(aux_auto);
    this.modalRef.hide();
    // }
  }

  async validateUser(userv: string, password: string, bills: any) {
    const data: any = await this.getUserXCancel(userv);
    console.log('DATA', data);
    if (!data.user && !data.domain) {
      return 0;
    }

    if (data.domain == 'C') {
      null;
    } else if (data.domain == 'R') {
      // -- VALIDA QUE EL USUARIO SEA DE LA MISMA REGIONAL QUE LA FACTURA A CANCELAR -- //
      for (const invoice of bills) {
        const aux_auto = await this.viewDelegationUser(
          userv,
          invoice.delegationNumber
        );
        if (aux_auto == 0) {
          this.alert(
            'warning',
            'El usuario no tiene atributos sobre la regional de la factura: ' +
              invoice.billId,
            ''
          );
          return 0;
        }
      }
    }

    // se revisara esto
    // AUX_CONN := VAL_CONNECT(PUSER, PPASS)
    //const aux_con = await this.valConection()
    //return aux_con
    return 1;
  }

  async getUserXCancel(user: string) {
    const filter = new FilterParams();
    filter.addFilter('user', user.toUpperCase(), SearchFilter.EQ);
    return new Promise((resolve, reject) => {
      this.userService.getUseXEvent(filter.getParams()).subscribe({
        next: resp => {
          resolve(resp.data[0]);
        },
        error: err => {
          resolve({ user: null, domain: null });
        },
      });
    });
    // return firstValueFrom(
    //   this.userService.getUseXEvent(filter.getParams()).pipe(
    //     map(resp => resp[0] ?? [{}]),
    //     catchError(() => of([{}]))
    //   )
    // );
  }

  async viewDelegationUser(user: string, delegation: number) {
    let params = new FilterParams();
    params.addFilter('user', user, SearchFilter.EQ);
    params.addFilter('delegationNumber', delegation, SearchFilter.EQ);
    params.addFilter('assigned', 'S', SearchFilter.EQ);
    return new Promise((resolve, reject) => {
      this.securityService
        .getAllUsersAccessTracking(params.getParams())
        .subscribe({
          next: value => {
            resolve(1);
          },
          error: err => {
            resolve(0);
          },
        });
    });
  }

  close() {
    this.modalRef.hide();
  }
}
