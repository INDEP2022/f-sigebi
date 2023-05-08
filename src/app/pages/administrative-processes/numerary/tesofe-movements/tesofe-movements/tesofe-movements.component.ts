import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  FilterParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { IAccountMovement } from 'src/app/core/models/ms-account-movements/account-movement.model';
import { AccountMovementService } from 'src/app/core/services/ms-account-movements/account-movement.service';
import { BankAccountService } from 'src/app/core/services/ms-bank-account/bank-account.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { BankAccount } from '../list-banks/bank';
import { ListBanksComponent } from '../list-banks/list-banks.component';
import { TesofeMovementsModalComponent } from '../tesofe-movements-modal/tesofe-movements-modal.component';
import { TESOFE_MOVEMENTS_COLUMNS } from './tesofe-movements-columns';

@Component({
  selector: 'app-tesofe-movements',
  templateUrl: './tesofe-movements.component.html',
  styles: [],
})
export class TesofeMovementsComponent extends BasePage implements OnInit {
  form: FormGroup;
  filterParams = new BehaviorSubject<FilterParams>(new FilterParams());
  no_cuenta: number;
  dataAcount: IListResponse<IAccountMovement> =
    {} as IListResponse<IAccountMovement>;
  dataSelect: BankAccount;

  constructor(
    private fb: FormBuilder,
    private service: BankAccountService,
    private movementService: AccountMovementService,
    private modalService: BsModalService
  ) {
    super();

    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: false,
        delete: true,
        position: 'right',
      },
      columns: TESOFE_MOVEMENTS_COLUMNS,
    };
  }

  ngOnInit(): void {
    this.prepareForm();
    this.filterParams.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: () => {
        if (this.no_cuenta) this.getMovementsAccount();
      },
    });
  }

  prepareForm() {
    this.form = this.fb.group({
      cve_banco: [null],
      nombre: [{ value: null, disabled: true }],
      cve_cuenta: [{ value: null, disabled: true }],
      no_cuenta: [{ value: null, disabled: true }],
      cve_moneda: [{ value: null, disabled: true }],
      desc_moneda: [{ value: null, disabled: true }],
    });
  }

  openList() {
    const modalConfig = {
      ...MODAL_CONFIG,
      class: 'modal-lg modal-dialog-centered',
    };
    modalConfig.initialState = {
      callback: (next: boolean, data: BankAccount) => {
        if (next) {
          this.form.patchValue(data);
          this.no_cuenta = data.no_cuenta;
          this.dataSelect = data;
          this.dataAcount = {} as IListResponse<IAccountMovement>;
          this.filterParams.getValue().removeAllFilters();
          this.filterParams.getValue().page = 1;
          this.filterParams
            .getValue()
            .addFilter('numberAccount', this.no_cuenta, SearchFilter.EQ);
          this.getMovementsAccount();
        }
      },
    };
    this.modalService.show(ListBanksComponent, modalConfig);
  }

  getMovementsAccount() {
    this.loading = true;
    this.service
      .getAllWithFiltersAccount(
        this.filterParams
          .getValue()
          .getParams()
          .concat('&sortBy=dateMotion:DESC')
      )
      .subscribe({
        next: resp => {
          this.dataAcount = resp;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  loadModal() {
    this.openModal(false, this.dataSelect);
  }

  openModal(newOrEdit: boolean, bank: BankAccount) {
    const modalConfig = { ...MODAL_CONFIG, class: 'modal-dialog-centered' };
    modalConfig.initialState = {
      newOrEdit,
      bank,
      callback: (next: boolean) => {
        if (next) this.getMovementsAccount();
      },
    };
    this.modalService.show(TesofeMovementsModalComponent, modalConfig);
  }

  deleteQuestion(event: IAccountMovement) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(event);
      }
    });
  }

  delete(event: IAccountMovement) {
    let data = {
      numberAccount: event.numberAccount,
      numberMotion: event.numberMotion,
    };
    this.movementService.eliminar(data).subscribe({
      next: () => {
        this.onLoadToast(
          'success',
          'Movimiento cuenta eliminado correctamente',
          ''
        );
        this.getMovementsAccount();
      },
      error: (err: any) => {
        let error = '';
        if (err.status === 0) {
          error = 'Revise su conexión de Internet.';
          this.onLoadToast('error', 'Error', error);
        } else {
          this.onLoadToast('error', 'Error', err.error.message);
        }
      },
    });
  }
}
