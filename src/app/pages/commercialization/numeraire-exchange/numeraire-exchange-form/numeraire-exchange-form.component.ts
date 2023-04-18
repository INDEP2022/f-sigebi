import { animate, style, transition, trigger } from '@angular/animations';
import { CurrencyPipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, catchError, forkJoin, map, of } from 'rxjs';
import { GoodEndpoints } from 'src/app/common/constants/endpoints/ms-good-endpoints';
import {
  generateUrlOrPath,
  getUser,
  readFile,
  showQuestion,
  showToast,
} from 'src/app/common/helpers/helpers';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { IGood } from 'src/app/core/models/ms-good/good';
import { NumeraryService } from 'src/app/core/services/ms-numerary/numerary.service';
import { ScreenStatusService } from 'src/app/core/services/ms-screen-status/screen-status.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { TableExpensesComponent } from '../components/table-expenses/table-expenses.component';
import { NUMERAIRE_COLUMNS } from './numeraire-exchange-columns';

interface IFormNumeraire {
  screenKey: FormControl<string>;
  spentPlus: FormControl<string>;
  description: FormControl<string>;
  amountevta: FormControl<string>;
  typeConv: FormControl<string>;
  spentId: FormControl<string>;
  // totalAmount: FormControl<number>;
  status: FormControl<string>;
  identificator: FormControl<string>;
  processExt: FormControl<string>;
  ivavta: FormControl<string>;
  commission: FormControl<string>;
  ivacom: FormControl<string>;
  goodId: FormControl<string>;
  delegationNumber: FormControl<string>;
  subDelegationNumber: FormControl<string>;
  flier: FormControl<string>;
  fileNumber: FormControl<string>;
  user: FormControl<string>;
  bankNew: FormControl<string>;
  moneyNew: FormControl<string>;
  accountNew: FormControl<string>;
  comment: FormControl<string>;
  expAssociated: FormControl<string>;
  dateNew: FormControl<string>;

  invoiceFile: FormControl<string>;
  deposit: FormControl<string>;
}
@Component({
  selector: 'app-numeraire-exchange-form',
  templateUrl: './numeraire-exchange-form.component.html',
  styles: ['::ng-deep .ws-pre{white-space: pre-wrap;}'],
  providers: [CurrencyPipe],
  animations: [
    trigger('OnGoodSelected', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('500ms', style({ opacity: 0 }))]),
    ]),
  ],
})
export class NumeraireExchangeFormComponent extends BasePage {
  @ViewChild(TableExpensesComponent) tableExpense: TableExpensesComponent;
  form: FormGroup = new FormGroup<IFormNumeraire>({
    screenKey: new FormControl('FACTADBCAMBIONUME', [Validators.required]),
    amountevta: new FormControl(null, [Validators.required]),
    typeConv: new FormControl(null, [Validators.required]),
    status: new FormControl(null, [Validators.required]),
    identificator: new FormControl(null, [Validators.required]),
    ivavta: new FormControl(null, [Validators.required]),
    commission: new FormControl(null, [Validators.required]),
    ivacom: new FormControl(null, [Validators.required]),
    goodId: new FormControl(null, [Validators.required]),
    user: new FormControl(getUser(), [Validators.required]),
    bankNew: new FormControl(null, [Validators.required]),
    moneyNew: new FormControl(null, [Validators.required]),
    accountNew: new FormControl(null, [Validators.required]),
    dateNew: new FormControl(null, [Validators.required]),
    spentId: new FormControl(null, [Validators.required]), //TODO: por asignar
    spentPlus: new FormControl(null, [Validators.required]),
    description: new FormControl(null, [Validators.required]),
    // totalAmount: new FormControl(0, [Validators.required]),
    processExt: new FormControl(null, [Validators.required]),
    delegationNumber: new FormControl(null, [Validators.required]),
    subDelegationNumber: new FormControl(null, [Validators.required]),
    flier: new FormControl(null, [Validators.required]),
    fileNumber: new FormControl(null, [Validators.required]),
    comment: new FormControl(null, [Validators.required]),
    expAssociated: new FormControl(null, [Validators.required]),

    invoiceFile: new FormControl(null, [Validators.required]),
    deposit: new FormControl(null, [Validators.required]),
  });

  fileForm: FormGroup = new FormGroup({
    file: new FormArray([], [Validators.required]),
  });
  toggleExpenses: boolean = true;
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  selectedGood: IGood = null;
  selectedBank: any = null;
  numeraireSettings = {
    columns: NUMERAIRE_COLUMNS,
    selectedRowIndex: -1,
    actions: false,
    editable: false,
  };

  sourcesMassive = new LocalDataSource();
  fileName: string = 'Seleccionar archivo';

  formHelpivavtaPercent = new FormControl(null);
  formHelpcommissionPercent = new FormControl(null);
  formHelpcommissionTaxPercent = new FormControl(null);

  pathGoods = generateUrlOrPath(GoodEndpoints.Good, GoodEndpoints.Good, true);

  conversionTypes = [
    {
      value: 'CBD',
      text: 'Bien decomisado cambiado a numerario por enajenación',
    },
    {
      text: 'Bien decomisado cambiado a numerario por siniestro',
      value: 'CDS',
    },
    {
      text: 'Bien asegurado cambiado a numerario por enajenación.',
      value: 'CNE1',
    },
    {
      text: 'Bien asegurado cambiado a numerario por siniestro.',
      value: 'CNS',
    },
    {
      text: 'Bien generado por pago parcial por siniestro',
      value: 'BBB',
    },
  ];

  readonly NAME_CURRENT_FORM = 'FACTADBCAMBIONUME';

  constructor(
    private excelService: ExcelService,
    private numeraryService: NumeraryService,
    private statusScreenService: ScreenStatusService
  ) {
    super();
  }

  getDataForTableExpenses(): { spentId: any[]; spentImport: any[] } {
    const expense = this.tableExpense.getExpense();
    let convertExpense: { spentId: any[]; spentImport: any[] } = {
      spentId: [],
      spentImport: [],
    };
    expense.forEach(element => {
      convertExpense.spentId.push({
        element: element.id,
      });
      convertExpense.spentImport.push({
        element: element.import,
      });
    });
    return convertExpense;
  }

  changeGood(event: any) {
    this.selectedGood = event;
    this.form.controls['status'].setValue(event?.status || null);
    this.form.controls['identificator'].setValue(event?.identificator || null);
    this.form.controls['processExt'].setValue(event?.extDomProcess || null);
    this.form.controls['delegationNumber'].setValue(
      event?.delegationNumber?.id
    );
    this.form.controls['subDelegationNumber'].setValue(
      event?.subDelegationNumber?.id
    );
    this.form.controls['flier'].setValue(event?.flyerNumber || null);
    this.form.controls['fileNumber'].setValue(event?.expediente?.id || null);
    this.form.controls['expAssociated'].setValue(
      event?.associatedFileNumber || null
    );
    if (event?.goodId) {
      this.validateGood(event.goodId);
    }
  }

  validateGood(good: number) {
    const validate1 = this.statusScreenService
      .getStatus({
        whereIn: true,
        screen: this.NAME_CURRENT_FORM,
        count: true,
        good,
      })
      .pipe(
        map((res: any) => {
          if (res.data && Array.isArray(res.data) && res.data.length > 0) {
            try {
              return { isAvailable: Boolean(parseInt(res.data[0].count)) };
            } catch (error) {
              return { isAvailable: false };
            }
          }
          return { isAvailable: false };
        }),
        catchError(() => {
          return of({ isAvailable: false });
        })
      );
    const validate2 = this.statusScreenService
      .getStatus({
        whereIn: true,
        good,
        count: false,
        screen: this.NAME_CURRENT_FORM,
      })
      .pipe(
        map((res: any) => {
          if (res.data && Array.isArray(res.data) && res.data.length > 0) {
            return { isValidNumerary: true };
          }
          return { isValidNumerary: false };
        }),
        catchError(() => {
          return of({ isValidNumerary: false });
        })
      );
    forkJoin([validate1, validate2]).subscribe({
      next: (res: any[]) => {
        const isAvailable = res[0].isAvailable;
        const isValidNumerary = res[1].isValidNumerary;
        console.log({ isAvailable, isValidNumerary });
        if (
          (isValidNumerary && isAvailable) ||
          (isValidNumerary && !isAvailable)
        ) {
          showToast({
            text: 'El bien consultado también puede ser convertido a numerario por valores y divisas. \n Verifique su tipo de conversión antes de continuar con el proceso',
          });
        }
        if (!isValidNumerary && !isAvailable) {
          showToast({
            text: 'Estatus, identificador o clasificador inválido para cambio a numerario/valores y divisas',
            icon: 'warning',
          });
        }
      },
      error: error => {
        console.log(error);
      },
    });
  }

  getFile(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (files.length != 1)
      throw 'No seleccionó ningún archivo o seleccionó más de la cantidad permitida (1)';

    readFile(files[0], 'BinaryString').then(data => {
      this.readCsv(data.result);
    });

    const fileReader = new FileReader();
    fileReader.readAsBinaryString(files[0]);
    fileReader.onload = () => this.readCsv(fileReader.result);
  }

  readCsv(binaryExcel: string | ArrayBuffer) {
    try {
      this.loading = true;
      const dataCvs = this.excelService.getData(binaryExcel);
      this.sourcesMassive.load(dataCvs);
      console.log(dataCvs);
      this.totalItems = dataCvs.length;
      this.loading = false;
    } catch (error) {
      this.loading = false;
      showToast({ icon: 'error', text: 'Ocurrió un error al leer el archivo' });
    }
  }

  validateCvs(data: any[]): Promise<any> {
    const goodKey = 'goodId';
    const goodIds = data.map((item: any) => item[goodKey]);
    return new Promise((resolve, reject) => {
      this.numeraryService
        .validateCvs({
          goodIds,
          vcScreen: this.form.get('FACTADBCAMBIONUME').value,
        })
        .subscribe({
          next: (res: any) => {
            return resolve('error');
          },
          error: (error: any) => {
            return reject(error);
          },
        });
    });
  }

  selectAccount(account: any) {
    this.selectedBank = account;
    this.form.get('moneyNew').setValue(account?.cveCurrency || null);
    this.form.get('accountNew').setValue(account?.cveAccount || null);
  }

  saveInServer(): void {
    this.validateForm().then(isValid => {
      console.log(isValid);
      console.log(this.form.value);
      if (!isValid) {
        return;
      }
    });
  }

  saveInSerServerMassive(): void {}

  saveNumeraireExchange(): void {
    const sumExpense = this.getExpensesSum();
  }

  getExpensesSum() {
    const expense = this.tableExpense.getExpense();
    if (expense.length < 1) {
      return 0;
    }
    return expense.reduce((a, b) => a + b.import, 0);
  }

  checkedMovBan = false;
  validateForm(): Promise<boolean> {
    const { typeConv, goodId, bankNew, amountevta } = this.form.value;
    const message: string[] = [];
    if (!goodId) {
      message.push(
        'Debe especificar el bien que se quiere cambiar a numerario'
      );
    }

    if (this.checkedMovBan && !bankNew) {
      message.push('Debe especificar el banco');
    }

    if (!typeConv) {
      message.push('No ha seleccionado el tipo de conversión');
    }

    if (message.length > 0) {
      showToast({
        html: message.join('\n'),
        customClass: 'ws-pre',
        icon: 'warning',
        text: '',
      });
      return Promise.resolve(false);
    }

    if (!amountevta) {
      return showQuestion({
        title: 'Confirmación',
        text: 'El nuevo bien se generara con un precio de venta de 1.\n ¿Seguro que desea cambiar el bien a numerario?',
        confirmButtonText: 'Si, continuar',
        cancelButtonText: 'No, cancelar',
      }).then(result => {
        if (result.isConfirmed) {
          this.form.controls['amountevta'].setValue(1);
          return Promise.resolve(true);
        }
        return Promise.resolve(false);
      });
    }

    return showQuestion({
      title: 'Confirmación',
      text: '¿Seguro que desea cambiar el bien a numerario?',
      confirmButtonText: 'Si, continuar',
      cancelButtonText: 'No, cancelar',
    }).then(result => {
      if (result.isConfirmed) {
        return Promise.resolve(true);
      }
      return Promise.resolve(false);
    });
  }

  changeDeposit(event: any): void {
    this.form.controls['invoiceFile'].setValue(event?.InvoiceFile || null);
    this.form.controls['deposit'].setValue(event?.deposit || null);
  }

  changeGenerateMvBan(event: any): void {
    console.log(event);
    this.checkedMovBan = event.target.checked;
  }
}
