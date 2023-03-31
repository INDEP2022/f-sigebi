import { animate, style, transition, trigger } from '@angular/animations';
import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
// import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
// import { showToast } from 'src/app/common/helpers/helpers';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { IGood } from 'src/app/core/models/ms-good/good';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { TableExpensesComponent } from '../components/table-expenses/table-expenses.component';

@Component({
  selector: 'app-numeraire-exchange-form',
  templateUrl: './numeraire-exchange-form.component.html',
  styles: [],
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
export class NumeraireExchangeFormComponent extends BasePage implements OnInit {
  @ViewChild(TableExpensesComponent) tableExpense: TableExpensesComponent;
  form: FormGroup = new FormGroup({
    id: new FormControl(null, [Validators.required]),
    salePrice: new FormControl(null, [Validators.required]),
    saleTaxPercent: new FormControl(16, [Validators.required]),
    saleTax: new FormControl(null, [Validators.required]),
    commissionPercent: new FormControl(null, [Validators.required]),
    commission: new FormControl(null, [Validators.required]),
    commissionTaxPercent: new FormControl(null, [Validators.required]),
    commissionTax: new FormControl(null, [Validators.required]),
    account: new FormControl(null, [Validators.required]),
    depositDate: new FormControl(null, [Validators.required]),
    depositReference: new FormControl(null, [
      Validators.required,
      Validators.pattern(STRING_PATTERN),
    ]),
    depositAmount: new FormControl(null, [Validators.required]),
    conversionType: new FormControl(null, [Validators.required]),
    expenses: new FormControl(null, [Validators.required]),
  });
  fileForm: FormGroup = new FormGroup({
    file: new FormArray([], [Validators.required]),
  });
  good: any;
  hasExpenses: boolean = false;
  toggleExpenses: boolean = true;
  adding: boolean = false;
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  selectedGood: IGood = null;
  selectedBank: any = null;
  // expenseTypeTest = [
  //   {
  //     id: 3107,
  //     description: 'SERVICIO DE AGUA',
  //   },
  //   {
  //     id: 3201,
  //     description: 'ARRENDAMIENTO DE SERVICIO Y LOCALES',
  //   },
  //   {
  //     id: 3305,
  //     description: 'CAPACITACIONES',
  //   },
  //   {
  //     id: 3306,
  //     description: 'SERVICIOS DE INFORMÁTICA',
  //   },
  //   {
  //     id: 3408,
  //     description: 'COMISIONES POR VENTAS',
  //   },
  // ];
  numeraireSettings = {
    columns: {
      number_good: { title: 'N° Bien' },
      description: { title: 'Descripción' },
      salePrice: { title: 'Precio de venta' },
      saleTax: { title: 'Iva Venta' },
      commission: { title: 'Comisión' },
      commissionTax: { title: 'Iva Comisión' },
      expenseTotal: { title: 'Gasto Total' },
      appraisalAmount: { title: 'Importe Avaluó' },
      status: { title: 'Estatus' },
      identification: { title: 'Ident.' },
      extDomine: { title: 'Ext. Dominio' },
      commentNewGood: { title: 'Comentario nuevo bien' },
    },
    selectedRowIndex: -1,
    actions: false,
    editable: false,
  };

  numeraireColumns: any[] = [];
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

  // individualGoodTestData: any = [
  //   {
  //     id: 1,
  //     code: 'ASEG',
  //     description: 'NUMERARIO FÍSICO POR LA CANTIDAD DE US$200.00',
  //     appraisal: 200,
  //     status: 'Bien entregado en Administración',
  //     domain: 'ASEGURADO',
  //     converted: false,
  //   },
  //   {
  //     id: 2,
  //     code: 'BIEN',
  //     description: 'BIEN DE EJEMPLO POR LA CANTIDAD DE US$500.00',
  //     appraisal: 500,
  //     status: 'Bien entregado en Administración',
  //     domain: 'ASEGURADO',
  //     converted: false,
  //   },
  //   {
  //     id: 3,
  //     code: 'GOOD',
  //     description: 'BIEN PARA PRUEBAS POR LA CANTIDAD DE US$100.00',
  //     appraisal: 100,
  //     status: 'Bien entregado en Administración',
  //     domain: 'ASEGURADO',
  //     converted: false,
  //   },
  //   {
  //     id: 4,
  //     code: 'ASEG',
  //     description: 'NUMERARIO FÍSICO POR LA CANTIDAD DE US$700.00',
  //     appraisal: 700,
  //     status: 'Bien entregado en Administración',
  //     domain: 'ASEGURADO',
  //     converted: false,
  //   },
  //   {
  //     id: 5,
  //     code: 'BIEN',
  //     description: 'BIEN PARA PROBAR INTERFAZ POR LA CANTIDAD DE US$50.00',
  //     appraisal: 50,
  //     status: 'Bien entregado en Administración',
  //     domain: 'ASEGURADO',
  //     converted: false,
  //   },
  // ];

  // accountsTestData = [
  //   {
  //     id: 'BANAMEX1',
  //     number: 7522422,
  //     currency: 'M',
  //     description: 'BANAMEX PARA DEPÓSITOS DE LA SUBASTA PÚBLICA No. 1',
  //   },
  //   {
  //     id: 'BANAMEX2',
  //     number: 7522842,
  //     currency: 'M',
  //     description: 'BANAMEX PARA DEPÓSITOS DE LA SUBASTA PÚBLICA No. 2',
  //   },
  //   {
  //     id: 'BANAMEX3',
  //     number: 7529231,
  //     currency: 'M',
  //     description: 'BANAMEX PARA DEPÓSITOS DE LA SUBASTA PÚBLICA No. 3',
  //   },
  //   {
  //     id: 'BANAMEX4',
  //     number: 7249315,
  //     currency: 'M',
  //     description: 'BANAMEX PARA DEPÓSITOS DE LA SUBASTA PÚBLICA No. 4',
  //   },
  //   {
  //     id: 'BANAMEX5',
  //     number: 7823647,
  //     currency: 'M',
  //     description: 'BANAMEX PARA DEPÓSITOS DE LA SUBASTA PÚBLICA No. 5',
  //   },
  // ];

  expenseTestData = [
    {
      id: 3000,
      description: 'PASAJES NACIONALES',
      amount: 12000,
    },
  ];

  expenses: any[] = [];

  constructor(private excelService: ExcelService) {
    super();
  }

  ngOnInit(): void {
    // this.expenseSettings.columns = EXPENSE_COLUMNS;
    // this.expenseSettings.columns = {
    //   ...this.expenseSettings.columns,
    //   description: {
    //     title: 'Descripción',
    //     sort: false,
    //     type: 'html',
    //     width: '50%',
    //     editor: {
    //       type: 'custom',
    //       component: TableSelectComponent,
    //     },
    //   },
    // };
    // this.numeraireSettings.columns = NUMERAIRE_COLUMNS;
    // this.params
    //   .pipe(takeUntil(this.$unSubscribe))
    //   .subscribe(() => this.getSearch());
  }

  selectGood(event: any) {
    this.selectedGood = event;
  }

  multiCalculate(event: any): void {
    this.formatCurrency2(event);
    const {
      // salePrice,
      saleTaxPercent,
      commissionPercent,
      commissionTaxPercent,
    } = this.form.value;
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
    // console.log(event.target.value);
    // var regex = new RegExp('^[0-9,.]+$');
    // // let regex = new RegExp('^$d{1,3}(,d{3})*(.d+)?$');
    // var key = String.fromCharCode(
    //   !event.charCode ? event.which : event.charCode
    // );
    // if (!regex.test(event.target.value)) {
    //   event.preventDefault();
    //   return false;
    // }
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
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(files[0]);
    fileReader.onload = () => this.readCsv(fileReader.result);
  }

  readCsv(binaryExcel: string | ArrayBuffer) {
    try {
      this.loading = true;
      this.numeraireColumns = this.excelService.getData(binaryExcel);
      this.totalItems = this.numeraireColumns.length;
      this.loading = false;
    } catch (error) {
      this.onLoadToast('error', 'Ocurrio un error al leer el archivo', 'Error');
    }
  }

  exchange() {
    this.form.controls['expenses'].setValue(this.expenseTestData);
    console.log(this.form.value);
  }

  getAttributes() {
    this.loading = true;
    // this.attributes
    //   .getAll(this.params.getValue())
    //   .subscribe({
    //     next: response => {
    //       this.attributes = response.data;
    //       this.totalItems = response.count;
    //       this.loading = false;
    //     },
    //     error: error => (this.loading = false),
    //   });
  }

  selectAccount(account: any) {
    this.selectedBank = account;
  }

  formatNumber(n: string) {
    // format number 1000000 to 1,234,567
    return n.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  formatCurrency2(event: any, blur: boolean = false) {
    // appends $ to value, validates decimal side
    // and puts cursor back in right position.
    // event.target.value = this.currencyPipe.transform(event.target.value, '$');

    // return;

    // get input value
    var input_val = event.target.value;

    if (input_val === '') {
      return;
    }

    // original length
    var original_len = input_val.length;

    // initial caret position
    // var caret_pos = event.prop("selectionStart");

    // check for decimal
    if (input_val.indexOf('.') >= 0) {
      // get position of first decimal
      // this prevents multiple decimals from
      // being entered
      var decimal_pos = input_val.indexOf('.');

      // split number by decimal point
      var left_side = input_val.substring(0, decimal_pos);
      var right_side = input_val.substring(decimal_pos);

      // add commas to left side of number
      left_side = this.formatNumber(left_side);

      // validate right side
      right_side = this.formatNumber(right_side);

      // On blur make sure 2 numbers after decimal
      if (blur) {
        right_side += '00';
      }

      // Limit decimal to only 2 digits
      right_side = right_side.substring(0, 2);

      // join number by .
      input_val = '$' + left_side + '.' + right_side;
    } else {
      // no decimal entered
      // add commas to number
      // remove all non-digits
      input_val = this.formatNumber(input_val);
      input_val = '$' + input_val;

      // final formatting
      if (blur) {
        input_val += '.00';
      }
    }

    // send updated string to input
    // input.val(input_val);
    event.target.value = input_val;

    this.form.get('salePrice').markAllAsTouched();

    // put caret back in the right position
    // var updated_len = input_val.length;
    // caret_pos = updated_len - original_len + caret_pos;
    // input[0].setSelectionRange(caret_pos, caret_pos);
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
