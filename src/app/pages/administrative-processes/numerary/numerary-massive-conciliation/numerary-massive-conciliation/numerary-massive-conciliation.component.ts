import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { format } from 'date-fns';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IProReconcilesGood } from 'src/app/core/models/catalogs/bank-account.model';
import { ISearchNumerary } from 'src/app/core/models/ms-numerary/numerary.model';
import { GoodSssubtypeService } from 'src/app/core/services/catalogs/good-sssubtype.service';
import { RecordAccountStatementsAccountsService } from 'src/app/core/services/catalogs/record-account-statements-accounts.service';
import { RecordAccountStatementsService } from 'src/app/core/services/catalogs/record-account-statements.service';
import { TvalTable5Service } from 'src/app/core/services/catalogs/tval-table5.service';
import { BankAccountService } from 'src/app/core/services/ms-bank-account/bank-account.service';
import { ComerDetailsService } from 'src/app/core/services/ms-coinciliation/comer-details.service';
import { GoodProcessService } from 'src/app/core/services/ms-good/good-process.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { NumeraryService } from 'src/app/core/services/ms-numerary/numerary.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import {
  clearGoodCheck,
  goodCheck,
  newGoodCheck,
  NUMERARY_MASSIVE_CONCILIATION_COLUMNS,
  NUMERARY_MASSIVE_CONCILIATION_COLUMNS2,
} from './numerary-massive-conciliation-columns';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { NumerarySolicitudeComponent } from '../numerary-solicitude/numerary-solicitude.component';

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

  loading2: boolean = false;

  public override settings: any = {
    rowClassFunction: (row: { data: { VISUAL_ATTRIBUTE: any } }) =>
      row.data.VISUAL_ATTRIBUTE == 'VA_VERDE'
        ? 'bg-success text-white'
        : 'bg-dark text-white',
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
    private tmpVal5Service: ComerDetailsService,
    private numeraryService: NumeraryService
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
      total: [null],
      totalDateTesofe: [null],
      totalWithoutTesofe: [null],
      deposit: [null, Validators.nullValidator],
      current: [null, Validators.nullValidator],
      proposal: [null],
      currencyDeposit: [null]
    });
  }

  ngOnInit(): void {
    this.prepareForm();
    this.prepareForm2();

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
    clearGoodCheck();
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
            // this.dataGoods.load(res.data);
            this.totalItems = res.count;

            const arrayNumbers = res.data.map((e: any) => {
              return e.goodId;
            });

            const arrayStatus = res.data.map((e: any) => {
              return e.status;
            });

            const fec = this.form.get('dateTesofe').value;

            const model = {
              goodNumber: arrayNumbers,
              arrayStatus: arrayStatus,
              dateMasiv: fec == null ? '' : format(fec, 'dd-MM-yyyy'),
            };

            this.goodProcessService.pupReconcilied(model).subscribe(
              res => {
                console.log(res);
                this.dataGoods.load(res.data);
                this.loading = false;
              },
              err => {
                console.log(err);
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
    console.log(e.data.RSPTAQUERY.descripcion);
    console.log(e.data.RSPTAQUERY.estatus);
    this.description.setValue(e.data.RSPTAQUERY.descripcion);
    this.statusGood.setValue(e.data.RSPTAQUERY.estatus);
  }

  //Boton Actualiza
  updateButton() {
    this.loading = true;
    const fec = this.form.get('dateTesofe').value;
    if (goodCheck.length < 1) {
      this.alert('warning', 'No hay bienes seleccionados', '');
      this.loading = false;
    } else if (fec == null) {
      this.alert('warning', 'No seleccionó un fecha Tesofe', '');
      this.loading = false;
    } else {
      console.log(goodCheck);
      const arrayNumbers = goodCheck.map((e: any) => {
        return e.RSPTAQUERY.no_bien;
      });

      const arrayStatus = goodCheck.map((e: any) => {
        return e.RSPTAQUERY.estatus;
      });

      const model = {
        goodNumber: arrayNumbers,
        arrayStatus: arrayStatus,
        dateMasiv: format(this.form.get('dateTesofe').value,'dd-MM-yyyy'),
      };

      this.accountBankService
        .updateAccountMovFec({
          noGoods: arrayNumbers,
          fecTesofe: fec,
        })
        .subscribe(
          res => {
            this.goodProcessService.pupReconcilied(model).subscribe(
              res => {
                console.log(res);

                this.dataGoods.load(this.dataGoods['data'].map((e:any) => {
                  if(arrayNumbers.includes(e.RSPTAQUERY.no_bien)){
                    return res['data'].find((item:any) => item.RSPTAQUERY.no_bien == e.RSPTAQUERY.no_bien)
                  }else{
                    return e
                  }
                }));
                
                this.alert('success', 'Actualización realizada', '');
                this.loading = false;
              },
              err => {
                console.log(err);
                this.loading = false;
              }
            );
          },
          err => {
            console.log(err);
          }
        );
    }
  }

  validateDateddmmyyyy(date: string) {
    const splitData = date.indexOf('-');
    const splitSlash = date.indexOf('/');
    console.log(splitData);
    if (splitData == 2) {
      const arrayData = date.split('-');
      const newDate = `${arrayData[2]}-${arrayData[1]}-${arrayData[0]}`;
      return { rpta: format(new Date(newDate), 'yyyy-MM-dd') };
    } else if (splitSlash == 2) {
      const arrayData = date.split('/');
      const newDate = `${arrayData[2]}-${arrayData[1]}-${arrayData[0]}`;
      return { rpta: format(new Date(newDate), 'yyyy-MM-dd') };
    } else {
      return { rpta: 'No tiene formato dd-mm-yyyy' };
    }
  }

  //Funcion de boton conciliar

  //Boton conciliar
  reconcileButton() {
    console.log('Entró');

    this.loading = true;
    if (goodCheck.length < 1) {
      this.alert('warning', 'No hay bienes seleccionados', '');
      this.loading = false;
    } else {
      this.loading = false;
      for (let item of goodCheck) {
        const date = this.validateDateddmmyyyy(item.RSPTAQUERY.val5);
        console.log(item);

        if (!isNaN(Date.parse(item.RSPTAQUERY.val5))) {
          if (!isNaN(parseInt(item.RSPTAQUERY.val2))) {
            const model: ISearchNumerary = {
              conciled: 'S',
              goodNumber: item.RSPTAQUERY.no_bien,
              fileNum: item.RSPTAQUERY.no_expediente,
              val1: item.RSPTAQUERY.val1,
              val2: parseInt(item.RSPTAQUERY.val2),
              val4: item.RSPTAQUERY.val4,
              val5: format(new Date(item.RSPTAQUERY.val5), 'yyyy-MM-dd'),
              val6: item.RSPTAQUERY.val6,
              fecTesofe: item.BFEC_TESOFE,
            };
            console.log(model);
            this.numeraryService.pupSearchNumerary(model).subscribe(
              res => {
                console.log(res);
              },
              err => {
                console.log(err);
              }
            );
          } else {
            this.alert(
              'error',
              'Fallo al tranformar la cantidad numerica del importe',
              ''
            );
            return;
          }
        } else {
          const date = this.validateDateddmmyyyy(item.RSPTAQUERY.val5);
          if (date.rpta != 'No tiene formato dd-mm-yyyy') {
            if (!isNaN(parseInt(item.RSPTAQUERY.val2))) {
              const model: ISearchNumerary = {
                conciled: 'S',
                goodNumber: item.RSPTAQUERY.no_bien,
                fileNum: item.RSPTAQUERY.no_expediente,
                val1: item.RSPTAQUERY.val1,
                val2: parseInt(item.RSPTAQUERY.val2),
                val4: item.RSPTAQUERY.val4,
                val5: format(new Date(date.rpta), 'yyyy-MM-dd'),
                val6: item.RSPTAQUERY.val6,
                fecTesofe: item.BFEC_TESOFE,
              };
              console.log(model);
              this.numeraryService.pupSearchNumerary(model).subscribe(
                res => {
                  console.log(res);
                },
                err => {
                  console.log(err);
                }
              );
            } else {
              this.alert(
                'error',
                'Fallo al tranformar la cantidad numerica del importe',
                ''
              );
              return;
            }
          } else {
            this.alert(
              'error',
              'Fallo al generar formato estandar para fecha',
              ''
            );
            return;
          }
        }
      }
    }
  }

  //Botón para desconciliar
  disconnectButton() {
    if (goodCheck.length > 0) {
      try {
        for (let item of goodCheck) {
          if (item.BCONCILIADO == 'CONCILIADO') {
            const arrayNumbers = goodCheck.map((e: any) => {
              return e.RSPTAQUERY.no_bien;
            });
            const arrayStatus = this.dataGoods['data'].map((e: any) => {
              return e.RSPTAQUERY.estatus;
            });
            const newArrayNumbers = this.dataGoods['data'].map((e: any) => {
              return e.RSPTAQUERY.no_bien
            })

            this.accountBankService
              .updateAccountMovExp({ noGoods: arrayNumbers })
              .subscribe(
                res => {
                  const newgoodCheck = goodCheck.filter(
                    valor => valor.RSPTAQUERY.no_bien != item.RSPTAQUERY.no_bien
                  );

                  newGoodCheck(newgoodCheck);

                  const fec = this.form.get('dateTesofe').value;
                  const model = {
                    goodNumber: newArrayNumbers,
                    arrayStatus: arrayStatus,
                    dateMasiv: fec == null ? '' : fec,
                  };
                  this.goodProcessService.pupReconcilied(model).subscribe(
                    res => {
                      console.log(res);
                      this.dataGoods.load(res.data);
                    },
                    err => {
                      console.log(err);
                      this.loading = false;
                    }
                  );
                },
                err => {
                  console.log(err);
                }
              );
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.alert('success', 'Desconciliación realizada', '');
        this.loading = false;
      }
    } else {
      this.alert('warning', 'No se seleccionó ningún Bien', '');
    }
  }

  //Boton asociar
  openAsociate(){
    let modalConfig:ModalOptions = {
      initialState: {
        callback: (data:any) => {
            if(data != null || data != undefined){
              this.form2.get('proposal').setValue(data.motionNumber)
              this.form2.get('currencyDeposit').setValue(data.amountAssign)
            }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    }
    this.modalService.show(NumerarySolicitudeComponent, modalConfig)
  }
}
