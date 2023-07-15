import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IProReconcilesGood } from 'src/app/core/models/catalogs/bank-account.model';
import { GoodSssubtypeService } from 'src/app/core/services/catalogs/good-sssubtype.service';
import { RecordAccountStatementsAccountsService } from 'src/app/core/services/catalogs/record-account-statements-accounts.service';
import { RecordAccountStatementsService } from 'src/app/core/services/catalogs/record-account-statements.service';
import { TvalTable5Service } from 'src/app/core/services/catalogs/tval-table5.service';
import { BankAccountService } from 'src/app/core/services/ms-bank-account/bank-account.service';
import { ConfiscatedProcessService } from 'src/app/core/services/ms-confiscation/confiscation-process.service';
import { GoodProcessService } from 'src/app/core/services/ms-good/good-process.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import {
  NUMERARY_MASSIVE_CONCILIATION_COLUMNS,
  NUMERARY_MASSIVE_CONCILIATION_COLUMNS2,
} from './numerary-massive-conciliation-columns';
import { ComerDetailsService } from 'src/app/core/services/ms-coinciliation/comer-details.service';

@Component({
  selector: 'app-numerary-massive-conciliation',
  templateUrl: './numerary-massive-conciliation.component.html',
  styles: [],
})
export class NumeraryMassiveConciliationComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup;
  form2: FormGroup;
  dataGoods: LocalDataSource = new LocalDataSource();
  dataGoods2: LocalDataSource = new LocalDataSource();
  dataAccountPaginated: number;

  bankAccountData = new DefaultSelect();
  bankCode: string;
  banks = new DefaultSelect();

  currentDataF2 = new DefaultSelect();
  banksDataF2 = new DefaultSelect();
  bankAccountDataF2 = new DefaultSelect();

  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  columnFilters: any = [];
  accountDate: number;

  dataClassGood = new DefaultSelect();

  currentData = new DefaultSelect();

  public override settings: any = {
    columns: NUMERARY_MASSIVE_CONCILIATION_COLUMNS,
    hideSubHeader: false,
    noDataMessage: 'No se encontrarón registros',
    actions: {
      add: false,
      delete: false,
      edit: false,
    },
  };

  public settings2: any = {
    columns: NUMERARY_MASSIVE_CONCILIATION_COLUMNS2,
    noDataMessage: 'No se encontrarón registros',
    hideSubHeader: false,
    actions: {
      add: false,
      delete: false,
      edit: false,
    },
  };

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private recordAccountStatementsAccountsService: RecordAccountStatementsAccountsService,
    private recordAccountStatementsService: RecordAccountStatementsService,
    private tvalTable5Service: TvalTable5Service,
    private godClassService: GoodSssubtypeService,
    //Servicios GF
    private accountBankService: BankAccountService,
    private goodService: GoodService,
    private goodProcessService: GoodProcessService,
    private tmpVal5Service: ComerDetailsService
  ) {
    super();
  }

  private prepareForm() {
    this.form = this.fb.group({
      goodClasification: [null],
      bank: [null],
      bankAccount: [null],
      current: [null],
      deposit: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      dateTesofe: [null],
      dateOf: [null],
      dateAt: [null],
      description: [null],
      statusGood: [null],
    });
  }

  private prepareForm2() {
    this.form2 = this.fb.group({
      bank: [null, Validators.nullValidator],
      bankAccount: [null, Validators.nullValidator],
      deposit: [null, Validators.nullValidator],
      current: [null, Validators.nullValidator],
    });
  }

  ngOnInit(): void {
    this.prepareForm();
    this.prepareForm2();
    // this.searchBanks(new ListParams());
    /* this.searchDataAccount(); */

    /* this.dataGoods
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            switch (filter.field) {
              case 'dateMotion':
                searchFilter = SearchFilter.EQ;
                break;
              case 'deposit':
                searchFilter = SearchFilter.EQ;
                break;
              case 'withdrawal':
                searchFilter = SearchFilter.EQ;
                break;
              case 'cveConcept':
                searchFilter = SearchFilter.ILIKE;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }
            if (filter.search !== '') {
              console.log(filter.search);
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params.value.page = 1;
          this.params = this.pageFilter(this.params);
          this.searchDataAccount();
        }
      }); */
    /* this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.searchDataAccount()); */

    //Añadido por GF
    this.changeClassGood(); //Setea la moneda suscribiendose al valor de classgood
    this.getClassGoods(); //Trae todos las clasificaciones que cumplan con los filtros
    this.getAccountsBank(); //Trae los bancos suscribiendose al valor de moneda
    this.getCveCurrency(); //Trae la lista de monedas para la forma2
    this.getBanks2(); //Se suscribe al valor de moneda en la forma2 y trae los bancos
    this.getAccountsBank2(); //
  }

  //Gets form 1

  get goodClasification() {
    return this.form.get('goodClasification');
  }

  get current() {
    return this.form.get('current');
  }

  get bank() {
    return this.form.get('bank');
  }

  get bankAccount() {
    return this.form.get('bankAccount');
  }

  get deposit() {
    return this.form.get('deposit');
  }

  get description() {
    return this.form.get('description');
  }

  get statusGood() {
    return this.form.get('statusGood');
  }

  //Gets form 2
  get current2() {
    return this.form2.get('current');
  }

  get bank2() {
    return this.form2.get('bank');
  }

  get bankAccount2() {
    return this.form2.get('bankAccount');
  }

  get deposit2() {
    return this.form2.get('deposit');
  }

  //Busca el número de clasificación
  getClassGoods() {
    const paramsF = new FilterParams();
    paramsF.addFilter('numType', 7);
    paramsF.addFilter('numSubType', 1);
    paramsF.addFilter('numSsubType', 3, SearchFilter.NOT);
    paramsF.addFilter('numClasifGoods', '1424,1426,1590', SearchFilter.NOTIN);
    this.godClassService.getAllSssubtype(paramsF.getFilterParams()).subscribe(
      res => {
        this.dataClassGood = new DefaultSelect(res.data, res.count);
      },
      err => {
        this.dataClassGood = new DefaultSelect();
      }
    );
  }

  //Selecciona la moneda según el número de clasificación
  changeClassGood() {
    this.goodClasification.valueChanges.subscribe(res => {
      console.log(res);
      if (res != null) {
        const classGood = res.numClasifGoods.toString();
        if (['1424', '1607', '1608', '1609'].includes(classGood)) {
          this.current.setValue('MN');
          this.getBanks();
        } else if (classGood == '1426') {
          this.current.setValue('USD');
          this.getBanks();
        } else if (classGood == '1590') {
          this.current.setValue('EUR');
          this.getBanks();
        } else {
          this.alert(
            'warning',
            'El clasificador no corresponde a una cuenta bancaria',
            ''
          );
        }
      } else {
        this.current.reset();
      }
    });
  }

  //Trae la lista de bancos
  getBanks() {
    const paramsF = new FilterParams();
    paramsF.addFilter('cveCurrency', this.current.value);
    paramsF.addFilter('accountType', 'CONCENTRADORA');
    this.accountBankService.getCveBankFilter(paramsF.getParams()).subscribe(
      res => {
        console.log(res);
        this.banks = new DefaultSelect(res.data, res.count);
      },
      err => {
        console.log(err);
      }
    );
  }

  //Trae la lista de bancos en la segunda forma
  getBanks2() {
    this.current2.valueChanges.subscribe(res => {
      if (res != null) {
        console.log(res);
        const paramsF = new FilterParams();
        paramsF.addFilter('cveCurrency', res.cve_moneda);
        paramsF.addFilter('accountType', 'CONCENTRADORA');
        this.accountBankService.getCveBankFilter(paramsF.getParams()).subscribe(
          res => {
            console.log(res);
            this.banksDataF2 = new DefaultSelect(res.data, res.count);
          },
          err => {
            console.log(err);
          }
        );
      } else {
        this.banksDataF2 = new DefaultSelect();
        this.bank2.reset();
      }
    });
  }

  //Trae cuentas bancarias
  getAccountsBank() {
    this.bank.valueChanges.subscribe(res => {
      if (res != null) {
        console.log(res);
        const paramsF = new FilterParams();
        paramsF.addFilter('cveCurrency', this.current.value);
        paramsF.addFilter('accountType', 'CONCENTRADORA');
        paramsF.addFilter('cveBank', res.cveBank);
        this.accountBankService.getCveBankFilter(paramsF.getParams()).subscribe(
          res => {
            console.log(res);
            this.bankAccountData = new DefaultSelect(res.data, res.count);
          },
          err => {
            console.log(err);
          }
        );
      } else {
        this.bankAccount.reset();
        this.bankAccountData = new DefaultSelect();
      }
    });
  }

  //Trae cuentas bancarias de la forma 2
  getAccountsBank2() {
    this.bank2.valueChanges.subscribe(res => {
      if (res != null) {
        console.log(res);
        const paramsF = new FilterParams();
        paramsF.addFilter('cveCurrency', this.current2.value.cve_moneda);
        paramsF.addFilter('accountType', 'CONCENTRADORA');
        paramsF.addFilter('cveBank', res.cveBank);
        this.accountBankService.getCveBankFilter(paramsF.getParams()).subscribe(
          res => {
            console.log(res);
            this.bankAccountDataF2 = new DefaultSelect(res.data, res.count);
          },
          err => {
            console.log(err);
          }
        );
      } else {
        this.bankAccount2.reset();
        this.bankAccountDataF2 = new DefaultSelect();
      }
    });
  }

  //Trae la lista de monedas para el segundo form
  getCveCurrency() {
    this.accountBankService.getListCurrencyCve({ currency: null }).subscribe(
      res => {
        console.log(res);
        this.currentDataF2 = new DefaultSelect(res.data, res.count);
      },
      err => {
        console.log(err);
      }
    );
  }

  //Buscador de datos de cuentas bancarias
  searchGoodBankAccount() {
    // let body: IProReconcilesGood;
    const bank = this.bank2.value;
    const bankAccount = this.bankAccount2.value;
    const currency = this.current2.value;

    console.log(bank);
    const body: IProReconcilesGood = {
      bankKey: bank != null ? bank.cveBank : null,
      accountKey: bankAccount != null ? bankAccount.cveAccount : null,
      currencyKey: currency != null ? currency.cve_moneda : null,
      deposit: this.deposit2.value,
      startDate: this.form.get('dateOf').value,
      endDate: this.form.get('dateAt').value,
    };

    console.log(body);

    this.accountBankService.searchByFilterNumeraryMassive(body).subscribe(
      res => {
        console.log(res);
        this.dataGoods2.load(res.result);
        console.log(this.dataGoods2['data']);
      },
      err => {
        console.log(err);
      }
    );
  }

  //Selecciona los bienes filtrador
  searchFilterGood() {
    this.loading = true;
    this.tmpVal5Service.deleteAllTable().subscribe(
      res => {
        const noClass = this.goodClasification.value;
        const val1 = this.current.value;
        const val4 = this.bank.value;
        const val6 = this.bankAccount.value;
        const val2 = this.deposit.value;

        const paramsF = new FilterParams();

        noClass != null
          ? paramsF.addFilter('goodClassNumber', noClass.numClasifGoods)
          : '';
        val1 != null ? paramsF.addFilter('val1', val1) : '';
        val4 != null ? paramsF.addFilter('val4', val4.cveBank) : '';
        val6 != null ? paramsF.addFilter('val6', val6.cveAccount) : '';
        val2 != null ? paramsF.addFilter('val2', val2) : '';

        this.goodService.getAllFilter(paramsF.getParams()).subscribe(
          res => {
            console.log(res);
            this.dataGoods.load(res.data);
            this.totalItems = res.count;

            const arrayNumbers = res.data.map((e: any) => {
              return e.goodId;
            });

            const arrayStatus = res.data.map((e: any) => {
              return e.status;
            });

            console.log(arrayNumbers);
            console.log(arrayStatus);

            const model = {
              goodNumber: arrayNumbers,
              arrayStatus: arrayStatus,
              dateMasiv: '',
            };

            this.goodProcessService.pupReconcilied(model).subscribe(
              res => {
                console.log(res)
                this.loading = false;
              },
              err => {
                console.log(err)
                this.loading = false;
              }
            );
          },
          err => {
            console.log(err);
            this.loading = false;
          }
        );
      },
      err => {
        this.loading = false;
      }
    );
  }

  //Muestra descripcion y estatus del bien
  selectRowGood(e: any) {
    console.log(e);
    console.log(e.data.description);
    console.log(e.data.status);
    this.description.setValue(e.data.description);
    this.statusGood.setValue(e.data.status);
  }

  /*   deselectRowGood(){
    this.description.reset()
    this.statusGood.reset()
  } */

  // Trae toda la información que se pasa a las tablas
  /*   searchDataAccount() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.recordAccountStatementsAccountsService
      .getDataAccountConciliation(params)
      .subscribe({
        next: response => {
          this.loading = true;
          const transformedData = response.data.map(item => ({
            ...item,
          }));
          this.dataGoods = new LocalDataSource(transformedData);
          this.totalItems = response.count;
          this.loading = false;
        },
        error: (err: any) => {
          this.loading = false;
          this.alert(
            'warning',
            'No existen movimientos de la cuenta seleccionada',
            ``
          );
        },
      });
  } */

  // Trae la lista de bancos por defecto
  /* searchBanks(params: ListParams) {
    this.recordAccountStatementsService
      .getAll(this.params.getValue())
      .subscribe({
        next: (response: { data: any[]; count: number }) => {
          this.banks = new DefaultSelect(response.data, response.count);
          this.loading = false;
        },
        error: (err: any) => {
          this.loading = false;
          this.alert('warning', 'No existen bancos', ``);
        },
      });
  } */

  // Permite buscar los bancos por nombre
  onSearchName(inputElement: any) {
    const name = inputElement.value;
    setTimeout(() => {
      this.recordAccountStatementsService
        .getAllDinamicName(name, this.params.getValue())
        .subscribe({
          next: (response: { data: any[]; count: number }) => {
            this.banks = new DefaultSelect(response.data, response.count);
            this.loading = false;
          },
          error: (err: any) => {
            this.loading = false;
            this.alert('warning', 'No existen bancos', ``);
          },
        });
    }, 3000);
  }

  // Asigna el valor del banco seleccionado a la función "searchBankAccount"
  onBankSelectChange(value: any) {
    // this.cleandInfoDate();
    this.bankAccountData = new DefaultSelect();
    if (value && value.bankCode) {
      const bankCode = value.bankCode;
      this.searchBankAccount(bankCode);
    } else {
      this.cleandInfoAll();
    }
  }

  // Toma el banco seleccionado y busca todas las cuentas pertenecientes a ese banco
  searchBankAccount(bankCode: string) {
    this.bankCode = bankCode;
    this.recordAccountStatementsAccountsService
      .getById(bankCode, this.params.getValue())
      .subscribe({
        next: response => {
          this.bankAccountData = new DefaultSelect(
            response.data,
            response.count
          );
          this.loading = false;
        },
        error: (err: any) => {
          this.loading = false;
          this.alert('warning', 'No existen cuentas', ``);
        },
      });
  }

  onClearSelection() {
    this.searchBankAccount(this.bankCode);
  }

  //
  onSearchAccount(inputElement: any) {
    const account = inputElement.value;
    setTimeout(() => {
      this.recordAccountStatementsAccountsService
        .getById2(this.bankCode, account, this.params.getValue())
        .subscribe({
          next: response => {
            const filteredAccounts = response.data.filter(item =>
              item.accountNumber.includes(account)
            );
            this.bankAccountData = new DefaultSelect(
              filteredAccounts,
              response.count
            );
            this.loading = false;
          },
          error: (err: any) => {
            this.loading = false;
            this.alert('warning', 'No existen bancos', ``);
          },
        });
    }, 3000);
  }

  // Establece los valores en los inputs de datos de la cuenta seleccionada
  onBankAccountSelectChange(value: any) {
    this.form.get('current').reset();
    this.form2.get('current').reset();
    const accountNumber = value.accountNumber;
    this.accountDate = value.accountNumber;

    // Obtener los valores correspondientes de la cuenta seleccionada
    let currency = value.cveCurrency;
    // this.current = currency;
    this.searchCurrent(currency);

    // Quitar las comillas simples del valor de currency, si existen
    currency = currency.replace(/'/g, '');
  }

  // Permite buscar la descripcion de la moneda
  searchCurrent(currency: string) {
    if (currency === `'M'`) {
      this.form.get('current').setValue(currency);
      this.form2.get('current').setValue(currency);
    } else {
      let currenct = currency.replace(/'/g, '');
      this.tvalTable5Service.getCurrent(currenct).subscribe({
        next: response => {
          let current = response.data;
          let currentAccount = current[0].otvalor02;
          let currentAccount2 = current[0].otvalor01;
          if (currentAccount === 'M' || currentAccount === 'MM') {
            currentAccount = 'PESO MEXICANO';
          }
          this.form.get('current').setValue(currentAccount);
          this.form2.get('current').setValue(currentAccount);
          this.loading = false;
        },
      });
    }
  }

  cleandInfoAll() {
    this.form.reset();
    this.totalItems = 0;
    // this.searchBanks(new ListParams());
  }

  cleandInfoDate() {
    this.form.get('bankAccount').reset();
    this.form.get('deposit').reset();
    this.form.get('current').reset();
  }
}
