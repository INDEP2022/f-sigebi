import { animate, style, transition, trigger } from '@angular/animations';
import { CurrencyPipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
// import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import {
  readFile,
  showQuestion,
  showToast,
} from 'src/app/common/helpers/helpers';
// import { showToast } from 'src/app/common/helpers/helpers';
import { LocalDataSource } from 'ng2-smart-table';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { IGood } from 'src/app/core/models/ms-good/good';
import { NumeraryService } from 'src/app/core/services/ms-numerary/numerary.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { TableExpensesComponent } from '../components/table-expenses/table-expenses.component';

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
  form: FormGroup = new FormGroup({
    goodId: new FormControl(null, [Validators.required]),
    salePrice: new FormControl(null, [Validators.required]),
    saleTaxPercent: new FormControl(16, [Validators.required]),
    saleTax: new FormControl(null, [Validators.required]),
    commissionPercent: new FormControl(null, [Validators.required]),
    commission: new FormControl(null, [Validators.required]),
    commissionTaxPercent: new FormControl(null, [Validators.required]),
    commissionTax: new FormControl(null, [Validators.required]),
    bank: new FormControl(null, [Validators.required]),
    depositDate: new FormControl(null, [Validators.required]),
    depositReference: new FormControl(null, [
      Validators.required,
      Validators.pattern(STRING_PATTERN),
    ]),
    depositAmount: new FormControl(null, [Validators.required]),
    conversionType: new FormControl(null, [Validators.required]),
    expenses: new FormControl(null, [Validators.required]),
    ckk_movban: new FormControl(null),
    current: new FormControl(null),
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
    columns: {
      id: { title: 'N° Bien' },
      description: { title: 'Descripción' },
      salePrice: { title: 'Precio de venta' },
      saleTax: { title: 'Iva Venta' },
      commission: { title: 'Comisión' },
      commissionTax: { title: 'Iva Comisión' },
      totalExpenses: { title: 'Gasto Total' },
      appraisalAmount: { title: 'Importe Avaluó' },
      status: { title: 'Estatus' },
      identifier: { title: 'Ident.' },
      domain: { title: 'Ext. Dominio' },
      commentary: { title: 'Comentario nuevo bien' },
    },
    selectedRowIndex: -1,
    actions: false,
    editable: false,
  };

  readonly VC_PANTALLA = 'FACTADBCAMBIONUME';
  numeraireMassiveColumns = new LocalDataSource();
  fileName: string = 'Seleccionar archivo';

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

  constructor(
    private excelService: ExcelService,
    private numeraryService: NumeraryService
  ) {
    super();
  }

  selectGood(event: any) {
    this.selectedGood = event;
  }

  multiCalculate(event: any): void {
    this.formatCurrency2(event);
    const { saleTaxPercent, commissionPercent, commissionTaxPercent } =
      this.form.value;
    if (!event.target.value) {
      return;
    }
    const value = this.convertCurrencyToNumber(event.target.value);
    if (saleTaxPercent) {
      this.calculeTax(value, saleTaxPercent, 'saleTax');
    } else {
      this.form.controls['saleTax'].setValue(null);
    }
    if (commissionPercent) {
      this.calculeTax(value, commissionPercent, 'commission');
    } else {
      this.form.controls['commission'].setValue(null);
    }
    const commission = this.form.controls['commission'].value;
    if (commissionTaxPercent && commission) {
      this.calculeTax(
        this.convertCurrencyToNumber(commission),
        commissionTaxPercent,
        'commissionTax'
      );
    } else {
      this.form.controls['commissionTax'].setValue(null);
    }
  }

  convertCurrencyToNumber(currency: string): number {
    return Number(currency.replace(/[^0-9.-]+/g, ''));
  }

  validateCurrency(event: any): boolean {
    return true;
  }

  calculateSaleTax(event: any): void {
    if (!event.target.value || this.form.controls['salePrice'].invalid) {
      return;
    }
    const { salePrice } = this.form.value;
    const value = this.convertCurrencyToNumber(salePrice);
    this.calculeTax(value, event.target.value, 'saleTax');
  }

  calculateCommission() {
    const { salePrice, commissionPercent } = this.form.value;
    if (!commissionPercent || this.form.controls['salePrice'].invalid) {
      return;
    }
    const value = this.convertCurrencyToNumber(salePrice);
    this.calculeTax(value, commissionPercent, 'commission');
  }

  calculateCommissionTax() {
    const { commission, commissionTaxPercent } = this.form.value;
    if (!commissionTaxPercent || this.form.controls['commission'].invalid) {
      return;
    }
    const value = this.convertCurrencyToNumber(commission);
    this.calculeTax(value, commissionTaxPercent, 'commissionTax');
  }

  calculeTax(price: number, percent: number, formControlName: string): void {
    let tax = price * (percent / 100);
    let taxFormat = new Intl.NumberFormat('es-MX', {
      minimumFractionDigits: 2,
    }).format(tax);
    this.form.controls[formControlName].setValue(taxFormat);
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
      this.numeraireMassiveColumns.load(dataCvs);
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
        .validateCvs({ goodIds, vcScreen: this.VC_PANTALLA })
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
  }

  formatNumber(n: string) {
    return n.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  formatCurrency2(event: any, blur: boolean = false) {
    // get input value
    var input_val = event.target.value;

    if (input_val === '') {
      return;
    }

    // original length
    // var original_len = input_val.length;

    // check for decimal
    if (input_val.indexOf('.') >= 0) {
      var decimal_pos = input_val.indexOf('.');

      var left_side = input_val.substring(0, decimal_pos);
      var right_side = input_val.substring(decimal_pos);

      left_side = this.formatNumber(left_side);

      right_side = this.formatNumber(right_side);

      if (blur) {
        right_side += '00';
      }

      right_side = right_side.substring(0, 2);

      input_val = '$' + left_side + '.' + right_side;
    } else {
      input_val = this.formatNumber(input_val);
      input_val = '$' + input_val;

      if (blur) {
        input_val += '.00';
      }
    }
    event.target.value = input_val;
    this.form.get('salePrice').markAllAsTouched();
  }

  saveInServer(): void {
    this.validateForm().then(isValid => {
      if (!isValid) {
        return;
      }

      this.saveNumeraireExchange();
    });
  }

  saveNumeraireExchange(): void {
    const sumExpense = this.getExpensesSum();
  }

  validateNumeraire() {}

  getExpensesSum() {
    const expense = this.tableExpense.getExpense();
    if (expense.length < 1) {
      return 0;
    }
    return expense.reduce((a, b) => a + b.import, 0);
  }

  getImport() {
    const { salePrice, saleTax, commission, commissionTax } = this.form.value;
    const sumExpense = this.getExpensesSum();
    const totalImport = salePrice || 0 + saleTax || 0;
    const totalExpense =
      sumExpense + commission || 0 + commissionTax || 0 + saleTax || 0;
    const subTotalImport =
      totalImport - (commission || 0) - (commissionTax || 0) - sumExpense;

    let importec;
    if (Math.trunc(totalImport) !== totalImport) {
      importec = totalImport.toFixed(2).replace(/\.?0+$/, '');
    } else {
      importec = totalImport.toString();
    }
    if (Math.trunc(subTotalImport) !== subTotalImport) {
      importec = subTotalImport.toFixed(2).replace(/\.?0+$/, '');
    } else {
      importec = subTotalImport.toString();
    }
  }

  validateForm(): Promise<boolean> {
    const {
      conversionType,
      goodId,
      bank,
      ckk_movban,
      salePrice,
      saleTax,
      commission,
      commissionTax,
    } = this.form.value;
    const message: string[] = [];
    if (goodId) {
      message.push(
        'Debe especificar el bien que se quiere cambiar a numerario'
      );
    }

    if (ckk_movban && !bank) {
      message.push('Debe especificar el banco');
    }

    if (!conversionType) {
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

    if (!salePrice) {
      return showQuestion({
        title: 'Confirmación',
        text: 'El nuevo bien se generara con un precio de venta de 1.\n ¿Seguro que desea cambiar el bien a numerario?',
      }).then(result => {
        if (result.isConfirmed) {
          this.form.controls['salePrice'].setValue(1);
          return Promise.resolve(true);
        }
        return Promise.resolve(false);
      });
    }

    return showQuestion({
      title: 'Confirmación',
      text: '¿Seguro que desea cambiar el bien a numerario?',
    }).then(result => {
      if (result.isConfirmed) {
        return Promise.resolve(true);
      }
      return Promise.resolve(false);
    });
  }
}

`
selector de cuentas bancarias

SELECT ban.cve_banco, ban.nombre, 
       cue.no_cuenta, cue.cve_cuenta, cve_moneda
FROM   cuentas_bancarias cue, cat_bancos ban
WHERE  cue.cve_banco = ban.cve_banco
AND    cue.tipo_cuenta = 'CONCENTRADORA'
ORDER BY ban.nombre


-------------------------------------------------------------------------------------------


path = /accountmvmnt/api/v1/account-movements

SELECT 
  FEC_MOVIMIENTO = dateMotion,
  DEPOSITO = deposit, 
  FOLIO_FICHA = InvoiceFile, 
  NO_MOVIMIENTO = numberMotion, 
  NO_CUENTA = numberAccount, 
  CATEGORIA = category
FROM MOVIMIENTOS_CUENTAS
WHERE (ES_FICHA_DEPOSITO = isFileDeposit) = 'S'
AND (NO_BIEN = numberGood) IS NULL
AND (NO_CUENTA = numberAccount) = :BLK_CONTROL.DI_NO_CUENTA_DEPOSITO as una variable que no existe en el layout
asignar valor a una variable
FEC_MOVIMIENTO = BLK_CONTROL.TI_FECHA_NEW  -> fecha
DEPOSITO = BLK_CONTROL.DI_DEPOSITO -> importe
FOLIO_FICHA = BLK_CONTROL.TI_FICHA_NEW -> referencia
NO_MOVIMIENTO = BLK_CONTROL.DI_NO_MOVIMIENTO -> #campo fuera del layout
CATEGORIA = BLK_CONTROL.DI_CATEGORIA -> #campo fuera del layout

-------------------------------------------------------------------------------------------
para tabla de gastos

path = /spent/api/v1/expense-concept

select 
  no_concepto_gasto = id ,
  descripcion = descripiton
from concepto_gasto

-- item de la tabla de gastos
NO_CONCEPTO_GASTO = BLK_CTR.ID_GASTO
DESCRIPCION = BLK_CTR.DESCGASTO

`;
