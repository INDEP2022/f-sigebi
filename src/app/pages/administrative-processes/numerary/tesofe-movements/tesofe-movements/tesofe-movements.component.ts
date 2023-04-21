import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  FilterParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IBankAccount } from 'src/app/core/models/catalogs/bank-account.model';
import { IBank } from 'src/app/core/models/catalogs/bank.model';
import { TvalTable1Data } from 'src/app/core/models/catalogs/dinamic-tables.model';
import { IAccountMovement } from 'src/app/core/models/ms-account-movements/account-movement.model';
import { DynamicTablesService } from 'src/app/core/services/dynamic-catalogs/dynamic-tables.service';
import { AccountMovementService } from 'src/app/core/services/ms-account-movements/account-movement.service';
import { BankAccountService } from 'src/app/core/services/ms-bank-account/bank-account.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import Swal from 'sweetalert2';
import { TesofeMovementsModalComponent } from '../tesofe-movements-modal/tesofe-movements-modal.component';
import { TESOFE_MOVEMENTS_COLUMNS } from './tesofe-movements-columns';

@Component({
  selector: 'app-tesofe-movements',
  templateUrl: './tesofe-movements.component.html',
  styles: [],
})
export class TesofeMovementsComponent extends BasePage implements OnInit {
  form: FormGroup;
  data1: any[] = [];
  filterParams = new BehaviorSubject<FilterParams>(new FilterParams());

  //filterParams = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  @Input() bankField: string = 'bank';
  @Output() cveBank: string;

  @Input() objDeposito: IAccountMovement;
  @Input() modalDone: boolean;
  @Input() refresh: boolean;

  private Value: string;

  private cuentaBank$: Subject<string>;

  banks = new DefaultSelect<IBank>();
  @Output() stringBank: Observable<string> = new Observable();
  @Output() properties: EventEmitter<IBankAccount> =
    new EventEmitter<IBankAccount>();
  listaDatos: IBankAccount[];
  ArregloDatosTabla: IAccountMovement[] = [];
  showBtnAdd: boolean = false;
  objBankToModal: IBankAccount;

  constructor(
    private fb: FormBuilder,
    private service: BankAccountService,
    private currencyService: DynamicTablesService,
    private movementService: AccountMovementService,
    private modalService: BsModalService
  ) {
    super();
    this.cuentaBank$ = new Subject();

    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: true,
        position: 'right',
      },
      columns: TESOFE_MOVEMENTS_COLUMNS,
    };
  }

  ngOnInit(): void {
    this.cuentaBank$.subscribe(X => {
      this.Value = X;
      this.ArregloDatosTabla = [];
    });

    this.filterParams.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      if (this.Value) this.loadTableInfo(this.Value);
    });
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      bank: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      account: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      currency: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      cveBank: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      nameBank: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      accountNumberTransfer: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      cuentasAsociadas: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
  }

  getBankCode() {
    let s: IBankAccount[];
    this.listaDatos = s;
    this.ArregloDatosTabla = [];
    let params = new FilterParams();
    params.addFilter('cveBank', this.form.value.cveBank, SearchFilter.EQ);
    this.service.getCveBank(params.getParams()).subscribe({
      next: resp => {
        this.listaDatos = [...resp.data];
      },
      error: err => {
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
  /**=======================================================
     EJECUTA LA CARGA DE LA CUENTA DEL BANCO Y LA MONEDA
    =======================================================*/
  loadInfo(account: IBankAccount) {
    this.loading = true;
    this.form.get('account').setValue('');
    this.form.get('currency').setValue('');
    this.objBankToModal = account;

    this.form
      .get('account')
      .setValue(
        '     Núm. de Cuenta:     ' +
          account.cveAccount +
          '     ||     Clave del Banco:     ' +
          account.cveBank +
          '     ||     Tipo:     ' +
          account.accountType
      );

    this.monedas(account.cveCurrency);
    this.loadTableInfo(account.accountNumber);
  }

  /**=======================================================
     OBTIENE LA DESCRIPCIÓN DEL TIPO DE MONEDA
    =======================================================*/
  monedas(moneda: string) {
    let movement: TvalTable1Data[] = [];
    let tipoMoneda: TvalTable1Data[] = [];
    let moned: string = '';
    this.currencyService.getTvalTable5ByTable(3).subscribe(data => {
      movement = data.data;
      tipoMoneda = movement.filter(x => x.otKey1 === moneda);
      if (tipoMoneda[0] !== null && tipoMoneda.length > 0) {
        this.form.get('currency').setValue(tipoMoneda[0].otValue01);
      }
    });
  }

  /**==================================================================
     OBTIENE TODOS LOS REGISTROS PRA LLENAR LA TABLA DE MOVIEMIENTOS
    =================================================================*/
  loadTableInfo(numCuenta: string) {
    this.cuentaBank$.next(numCuenta);
    this.ArregloDatosTabla = [];

    // this.filterParams.getValue().removeAllFilters();
    this.filterParams
      .getValue()
      .addFilter('numberAccount', numCuenta, SearchFilter.EQ);

    this.showBtnAdd = true;

    this.movementService
      .getAllFiltered(this.filterParams.getValue().getParams())
      .subscribe({
        next: resp => {
          this.ArregloDatosTabla = [...resp.data];
          this.totalItems = resp.count;
          this.loading = false;
        },
        error: err => {
          let error = '';
          if (err.status === 0) {
            error = 'Revise su conexión de Internet.';
            this.showBtnAdd = false;
            this.loading = false;
            this.onLoadToast('error', 'Error', error);
          } else {
            this.onLoadToast('error', 'Error', err.error.message);
            this.showBtnAdd = false;
            this.loading = false;
          }
        },
      });
  }
  /**=======================================================
     ABRE LA VENTANA MODAL PARA AGREGAR UN NUEVO REGISTRO
    =======================================================*/
  loadModal() {
    let movimiento: IAccountMovement;
    this.openModal(false, this.objBankToModal, movimiento);
  }

  /**=======================================================
     ABRE LA VENTANA MODAL PARA INSERTAR O EDITAR
    =======================================================*/
  openModal(
    newOrEdit: boolean,
    objBank: IBankAccount,
    movimiento: IAccountMovement
  ) {
    const modalConfig = { ...MODAL_CONFIG, class: 'modal-dialog-centered' };
    modalConfig.initialState = {
      newOrEdit,
      objBank,
      movimiento,
      callback: (next: boolean) => {
        if (next) this.loadTableInfo(objBank.cveAccount);
      },
    };
    this.modalService.show(TesofeMovementsModalComponent, modalConfig);
  }

  /**=======================================================
     ABRE LA VENTANA MODAL PARA ACTUALIZAR UN REGISTRO
    =======================================================*/
  edit(filaCuenta: IAccountMovement) {
    this.openModal(true, this.objBankToModal, filaCuenta);
  }

  /**=======================================================
                  BORRAR UN REGISTRO
    =======================================================*/
  deleteQuestion(event: IAccountMovement) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(event);
        Swal.fire('Borrado', '', 'success');
      }
    });
  }

  delete(event: IAccountMovement) {
    let datosTest = {
      numberAccount: event.accountNumber.accountNumber,
      numberMotion: event.numberMotion,
    };
    this.movementService.eliminar(datosTest).subscribe({
      next: () => {
        this.loadTableInfo(
          Number(event.accountNumber.accountNumber).toString()
        );
      },
      error: err => {
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
