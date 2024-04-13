import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IBankAccount } from 'src/app/core/models/catalogs/bank-account.model';
import { IBank } from 'src/app/core/models/catalogs/bank.model';
import { BankService } from 'src/app/core/services/catalogs/bank.service';
import { BankAccountService } from 'src/app/core/services/ms-bank-account/bank-account.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-banks-catalog',
  templateUrl: './banks-catalog.component.html',
  styles: [],
})
export class BanksCatalogComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  title: 'Cuenta de Banco';
  sought_bank: boolean = true;
  edit: boolean = false;
  rowSelecc: boolean = false;
  data: IBankAccount;
  columnFilters: any = [];
  formData: IBankAccount;
  account: string = null;
  params = new BehaviorSubject<ListParams>(new ListParams());
  filterParams = new BehaviorSubject<FilterParams>(new FilterParams());
  accounts = new DefaultSelect<IBank>();
  banks = new DefaultSelect<IBank>();
  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private bankServ: BankAccountService,
    private service: BankService,
    private serviceAccount: BankAccountService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm(): void {
    this.form = this.fb.group({
      cveBank: [null, [Validators.required]],
      nameBank: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      accountNumber: [null],
      cveAccount: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(30),
        ],
      ],
      bankName: [null],
      square: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      branch: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      accountType: [null, []],
      delegationNumber: [null],
      accountNumberTransfer: [null],
      square_I: [{ value: '', disabled: true }],
      branch_I: [{ value: '', disabled: true }],
      cveCurrency: [null, [Validators.maxLength(15)]],
      accountType_I: [{ value: '', disabled: true }],
      bank_I: [{ value: '', disabled: true }],
      cveInterestCalcRate: ['CETES'],
      registerNumber: [null],
      isReference: [null],
    });
    if (this.data) {
      this.edit = true;
      this.form.patchValue(this.data);
      console.log(this.data);
      this.form.controls['nameBank'].setValue(this.data.cveBank);
      this.getBanksFilter(this.data.banco.name);
      this.getAccountsFilter(new ListParams(), this.data.accountNumberTransfer);
      if (this.form.controls['accountType'].value === 'CONCENTRADORA') {
        this.rowSelecc = true;
        this.params.getValue()['filter.accountNumber'] =
          this.data.accountNumber;
        this.params.getValue()['filter.accountNumberTransfer'] =
          this.data.accountNumberTransfer;
        /*let params1 = {
          ...this.params.getValue(),
        };
        this.bankServ.getAll(params1).subscribe({
          next: resp => {
            console.log(resp);
            this.setProperties(resp.data);
          },
          error: err => {
            let error = '';
            /*if (err.status === 0) {
              error = 'Revise su conexión de Internet.';
              this.onLoadToast('error', 'Error', error);
            } else {
              this.onLoadToast('error', 'Error', err.error.message);
            }
          },
        });*/

        this.bankServ
          .getById({
            accountNumber: this.form.controls['accountNumberTransfer'].value,
          })
          .subscribe({
            next: resp => {
              console.log(resp);
              this.setProperties(resp);
            },
            error: err => {
              let error = '';
              /*if (err.status === 0) {
                error = 'Revise su conexión de Internet.';
                this.onLoadToast('error', 'Error', error);
              } else {
                this.onLoadToast('error', 'Error', err.error.message);
              }*/
            },
          });
      }
      console.log(this.form);
      setTimeout(() => {
        this.getBanks(new ListParams());
        this.getAccounts(new ListParams());
      }, 1000);
    }
  }

  confirm() {
    console.log(this.form.value);
    if (this.form.valid) {
      this.form.controls['nameBank'].disable();
      const data = this.form.value;
      delete data.bankName;
      console.log(data);
      this.loading = true;
      if (this.edit) {
        const id = this.form.get('accountNumber').value;
        let body: IBankAccount = {
          accountNumber: this.form.controls['accountNumber'].value,
          accountNumberTransfer:
            this.form.controls['accountNumberTransfer'].value,
          registerNumber: this.form.controls['registerNumber'].value,
          delegationNumber: this.form.controls['delegationNumber'].value,
          cveAccount: this.form.controls['cveAccount'].value,
          accountType: this.form.controls['accountType'].value,
          cveCurrency: this.form.controls['cveCurrency'].value,
          square: this.form.controls['square'].value,
          branch: this.form.controls['branch'].value,
          cveInterestCalcRate: this.form.controls['cveInterestCalcRate'].value,
          cveBank: this.form.controls['cveBank'].value,
          isReference: this.form.controls['isReference'].value,
        };
        console.log(body);
        this.bankServ.update1(body).subscribe({
          next: () => {
            this.alert(
              'success',
              'Cuenta de Banco',
              'Actualizada Correctamente'
            );
            this.close();
          },
          error: err => {
            this.onLoadToast('error', err.error.message, '');
            this.loading = false;
          },
        });
      } else {
        let body: IBankAccount = {
          accountNumber: this.form.controls['accountNumber'].value,
          accountNumberTransfer:
            this.form.controls['accountNumberTransfer'].value,
          registerNumber: this.form.controls['registerNumber'].value,
          delegationNumber: this.form.controls['delegationNumber'].value,
          cveAccount: this.form.controls['cveAccount'].value,
          accountType: this.form.controls['accountType'].value,
          cveCurrency: this.form.controls['cveCurrency'].value,
          square: this.form.controls['square'].value,
          branch: this.form.controls['branch'].value,
          cveInterestCalcRate: this.form.controls['cveInterestCalcRate'].value,
          cveBank: this.form.controls['cveBank'].value,
          isReference: this.form.controls['isReference'].value,
        };
        this.bankServ.create(body).subscribe({
          next: () => {
            this.alert('success', 'Cuenta de Banco', 'Guardada Correctamente');
            this.close();
          },
          error: err => {
            this.onLoadToast('error', err.error.message, '');
            this.loading = false;
          },
        });
      }
    } else {
      this.alert('warning', 'Debe de llenar los campos requeridos', '');
    }
  }
  getBanks(params: ListParams) {
    const field = `filter.name`;
    if (params.text !== '' && params.text !== null) {
      this.columnFilters[field] = `${SearchFilter.ILIKE}:${params.text}`;
    } else {
      delete this.columnFilters[field];
    }
    let paramsValue = { ...params, ...this.columnFilters };
    this.service.getAll(paramsValue).subscribe({
      next: resp => {
        this.banks = new DefaultSelect(resp.data, resp.count);
      },
      error: err => {
        let error = '';
        if (err.status === 0) {
          error = 'Revise su conexión de Internet.';
        } else {
          error = err.message;
        }
        this.onLoadToast('error', 'No se encontraron registros', '');
      },
    });
  }
  getBanksFilter(params: string) {
    const field = `filter.name`;
    let paramss = new ListParams();
    if (params) {
      this.columnFilters[field] = `${SearchFilter.ILIKE}:${params}`;
    } else {
      delete this.columnFilters[field];
    }
    let paramsValue = { ...paramss, ...this.columnFilters };
    this.service.getAll(paramsValue).subscribe({
      next: resp => {
        this.banks = new DefaultSelect(resp.data, resp.count);
      },
      error: err => {
        let error = '';
        if (err.status === 0) {
          error = 'Revise su conexión de Internet.';
        } else {
          error = err.message;
        }
        this.onLoadToast('error', 'No se encontraron registros', '');
      },
    });
  }
  getAccounts(params: ListParams) {
    this.filterParams.getValue().removeAllFilters();
    this.filterParams.getValue().page = params.page;
    this.filterParams
      .getValue()
      .addFilter('cveAccount', params.text, SearchFilter.ILIKE);
    this.serviceAccount
      .getAllWithFilters(this.filterParams.getValue().getParams())
      .subscribe({
        next: resp =>
          (this.accounts = new DefaultSelect(resp.data, resp.count)),
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
  getAccountsFilter(params: ListParams, data: string) {
    this.filterParams.getValue().removeAllFilters();
    this.filterParams.getValue().page = params.page;
    this.filterParams
      .getValue()
      .addFilter('accountNumberTransfer', data, SearchFilter.EQ);
    this.serviceAccount
      .getAllWithFilters(this.filterParams.getValue().getParams())
      .subscribe({
        next: resp =>
          (this.accounts = new DefaultSelect(resp.data, resp.count)),
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
  onBanksChange(type: any) {
    this.form.controls['cveBank'].setValue(type.bankCode);
  }
  getRowSelec(data: string) {
    console.log(data);
    if (data === 'CONCENTRADORA') {
      this.rowSelecc = true;
    } else {
      this.rowSelecc = false;
    }
  }

  setProperties(data: IBankAccount) {
    console.log(data);
    //this.account = data.cveAccount;
    this.form.get('accountNumberTransfer').patchValue(data.cveAccount);
    this.form.get('square_I').patchValue(data.square);
    this.form.get('branch_I').patchValue(data.branch);
    this.form.get('cveCurrency').patchValue(data.cveCurrency);
    this.form.get('bank_I').patchValue(data.cveBank);
    this.form.get('accountType_I').patchValue(data.accountType);
  }
  close() {
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
