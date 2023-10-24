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
    private userService: UsersService
  ) {
    super();
  }

  ngOnInit(): void {
    this.user = this.authService.decodeToken();
  }

  async validate() {
    const { userV, passwordV, event } = this.form.value;
    const aux = await this.comerEvent(event);

    const aux_auto = await this.validateUser(userV, passwordV, aux);

    if (aux_auto == 1) {
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
    const { user, domain } = await this.getUserXCancel(userv);

    if (!user && !domain) {
      return 0;
    }

    if (domain == 'C') {
      null;
    } else if (domain == 'R') {
      const aux_auto = await this.viewDelegationUser(user, aux);
      if (aux_auto == 0) {
        return 0;
      }
    }

    // se revisara esto
    //const aux_con = await this.valConection()
    //return aux_con
    return 1 || 0;
  }

  async viewDelegationUser(user: string, delegation: number) {
    return firstValueFrom(
      this.comerInvoiceService.procedureGenerate(null).pipe(
        map(() => 0),
        catchError(() => of(0))
      )
    );
  }

  async getUserXCancel(user: string) {
    const filter = new FilterParams();
    filter.addFilter('user', user, SearchFilter.EQ);
    return firstValueFrom(
      this.userService.getUseXEvent(filter.getParams()).pipe(
        map(resp => resp[0] ?? [{}]),
        catchError(() => of([{}]))
      )
    );
  }

  close() {
    this.modalRef.hide();
  }
}
