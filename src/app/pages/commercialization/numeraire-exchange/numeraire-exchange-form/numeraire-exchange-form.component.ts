import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { TableSelectComponent } from '../components/table-select/table-select.component';
import {
  EXPENSE_COLUMNS,
  NUMERAIRE_COLUMNS,
} from './numeraire-exchange-columns';

@Component({
  selector: 'app-numeraire-exchange-form',
  templateUrl: './numeraire-exchange-form.component.html',
  styles: [],
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
  numeraireExchangeForm: FormGroup = new FormGroup({});
  fileForm: FormGroup = new FormGroup({});
  good: any;
  hasExpenses: boolean = false;
  toggleExpenses: boolean = true;
  adding: boolean = false;
  goodItems = new DefaultSelect();
  accountItems = new DefaultSelect();
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  selectedGood: any = null;
  selectedAccount: any = null;
  createButton: string =
    '<span class="btn btn-success active font-size-12 me-2 mb-2 py-2 px-2">Agregar</span>';
  saveButton: string =
    '<span class="btn btn-info active font-size-12 me-2 mb-2 py-2 px-2">Actualizar</span>';
  cancelButton: string =
    '<span class="btn btn-warning active font-size-12 text-black me-2 mb-2 py-2 px-2 cancel">Cancelar</span>';
  expenseSettings = {
    ...TABLE_SETTINGS,
    selectedRowIndex: -1,
    mode: 'internal',
    hideSubHeader: false,
    filter: {
      inputClass: 'd-none',
    },
    attr: {
      class: 'table-bordered normal-hover',
    },
    add: {
      createButtonContent: this.createButton,
      cancelButtonContent: this.cancelButton,
      confirmCreate: true,
    },
    edit: {
      editButtonContent: '<i class="fa fa-pencil-alt text-warning mx-2"></i>',
      saveButtonContent: this.saveButton,
      cancelButtonContent: this.cancelButton,
      confirmSave: true,
    },
  };
  numeraireSettings = {
    ...TABLE_SETTINGS,
    selectedRowIndex: -1,
    actions: false,
  };
  filterRow: any;
  addOption: any;
  addRowElement: any;
  readOnlyInput: any;
  cancelBtn: any;
  cancelEvent: any;
  expenseColumns: any[] = [];
  numeraireColumns: any[] = [];
  fileName: string = 'Seleccionar archivo';

  individualGoodTestData: any = [
    {
      id: 1,
      code: 'ASEG',
      description: 'NUMERARIO FÍSICO POR LA CANTIDAD DE US$200.00',
      appraisal: 200,
      status: 'Bien entregado en Administración',
      domain: 'ASEGURADO',
      converted: false,
    },
    {
      id: 2,
      code: 'BIEN',
      description: 'BIEN DE EJEMPLO POR LA CANTIDAD DE US$500.00',
      appraisal: 500,
      status: 'Bien entregado en Administración',
      domain: 'ASEGURADO',
      converted: false,
    },
    {
      id: 3,
      code: 'GOOD',
      description: 'BIEN PARA PRUEBAS POR LA CANTIDAD DE US$100.00',
      appraisal: 100,
      status: 'Bien entregado en Administración',
      domain: 'ASEGURADO',
      converted: false,
    },
    {
      id: 4,
      code: 'ASEG',
      description: 'NUMERARIO FÍSICO POR LA CANTIDAD DE US$700.00',
      appraisal: 700,
      status: 'Bien entregado en Administración',
      domain: 'ASEGURADO',
      converted: false,
    },
    {
      id: 5,
      code: 'BIEN',
      description: 'BIEN PARA PROBAR INTERFAZ POR LA CANTIDAD DE US$50.00',
      appraisal: 50,
      status: 'Bien entregado en Administración',
      domain: 'ASEGURADO',
      converted: false,
    },
  ];

  accountsTestData = [
    {
      id: 'BANAMEX1',
      number: 7522422,
      currency: 'M',
      description: 'BANAMEX PARA DEPÓSITOS DE LA SUBASTA PÚBLICA No. 1',
    },
    {
      id: 'BANAMEX2',
      number: 7522842,
      currency: 'M',
      description: 'BANAMEX PARA DEPÓSITOS DE LA SUBASTA PÚBLICA No. 2',
    },
    {
      id: 'BANAMEX3',
      number: 7529231,
      currency: 'M',
      description: 'BANAMEX PARA DEPÓSITOS DE LA SUBASTA PÚBLICA No. 3',
    },
    {
      id: 'BANAMEX4',
      number: 7249315,
      currency: 'M',
      description: 'BANAMEX PARA DEPÓSITOS DE LA SUBASTA PÚBLICA No. 4',
    },
    {
      id: 'BANAMEX5',
      number: 7823647,
      currency: 'M',
      description: 'BANAMEX PARA DEPÓSITOS DE LA SUBASTA PÚBLICA No. 5',
    },
  ];

  expenseTestData = [
    {
      id: 3000,
      description: 'PASAJES NACIONALES',
      amount: 12000,
    },
  ];

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private excelService: ExcelService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getGoods({ page: 1, text: '' });
    this.getAccounts({ page: 1, text: '' });
    this.expenseSettings.columns = EXPENSE_COLUMNS;
    this.expenseSettings.columns = {
      ...this.expenseSettings.columns,
      description: {
        title: 'Descripción',
        sort: false,
        type: 'html',
        width: '50%',
        editor: {
          type: 'custom',
          component: TableSelectComponent,
        },
      },
    };
    this.numeraireSettings.columns = NUMERAIRE_COLUMNS;
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getSearch());
  }

  getSearch() {
    this.loading = true;
    console.log(this.params.getValue());
    this.loading = false;
  }

  private prepareForm(): void {
    this.numeraireExchangeForm = this.fb.group({
      id: [null, [Validators.required]],
      salePrice: [null, [Validators.required]],
      saleTaxPercent: [null, [Validators.required]],
      saleTax: [null, [Validators.required]],
      commissionPercent: [null, [Validators.required]],
      commission: [null, [Validators.required]],
      commissionTaxPercent: [null, [Validators.required]],
      commissionTax: [null, [Validators.required]],
      account: [null, [Validators.required]],
      depositDate: [null, [Validators.required]],
      depositReferece: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      depositAmount: [null, [Validators.required]],
      exchangeType: [null, [Validators.required]],
      expenses: this.fb.array([null]),
    });
    this.fileForm = this.fb.group({
      file: this.fb.array([null]),
    });
  }

  getGoods(params: ListParams) {
    if (params.text == '') {
      this.goodItems = new DefaultSelect(this.individualGoodTestData, 5);
    } else {
      const id = parseInt(params.text);
      const item = [this.individualGoodTestData.filter((i: any) => i.id == id)];
      this.goodItems = new DefaultSelect(item[0], 1);
    }
  }

  selectGood(event: any) {
    this.selectedGood = event;
    this.hideFilters();
  }

  hideFilters() {
    setTimeout(() => {
      let filterArray = document.getElementsByClassName('ng2-smart-filters');
      this.filterRow = filterArray.item(0);
      this.filterRow.classList.add('d-none');
      this.addOption = document
        .getElementsByClassName('ng2-smart-action-add-add')
        .item(0);
    }, 200);
  }

  getAccounts(params: ListParams) {
    if (params.text == '') {
      this.accountItems = new DefaultSelect(this.accountsTestData, 5);
    } else {
      const id = parseInt(params.text);
      const item = [this.accountsTestData.filter((i: any) => i.id == id)];
      this.accountItems = new DefaultSelect(item[0], 1);
    }
  }

  selectAccount(event: any) {
    this.selectedAccount = event;
  }

  formatCurrency(event: any) {
    console.log(event.target.value);
    event.preventDefault();
    let number = new Intl.NumberFormat('es-MX', {
      minimumFractionDigits: 2,
    }).format(event.target.value);
    event.target.value = number;
  }

  formatDecimals(event: any) {
    event.preventDefault();
    if (event.target.value > 999) return;
    let number = new Intl.NumberFormat('es-MX', {
      minimumFractionDigits: 2,
    }).format(event.target.value);
    event.target.value = number;
  }

  validateCurrency(event: any) {
    var regex = new RegExp('^[0-9,.]+$');
    var key = String.fromCharCode(
      !event.charCode ? event.which : event.charCode
    );
    if (!regex.test(key)) {
      event.preventDefault();
      return false;
    }
    return true;
  }

  calculateSaleTax() {
    let salePrice = this.numeraireExchangeForm.controls['salePrice'].value;
    let saleTaxPercent =
      this.numeraireExchangeForm.controls['saleTaxPercent'].value;
    if (
      salePrice !== null &&
      salePrice !== '' &&
      saleTaxPercent !== null &&
      saleTaxPercent !== 0 &&
      saleTaxPercent !== ''
    ) {
      salePrice = parseFloat(salePrice);
      saleTaxPercent = parseFloat(saleTaxPercent);
      let saleTax = salePrice * (saleTaxPercent / 100);
      let saleTaxFormat = new Intl.NumberFormat('es-MX', {
        minimumFractionDigits: 2,
      }).format(saleTax);
      this.numeraireExchangeForm.controls['saleTax'].setValue(saleTaxFormat);
    }
  }

  calculateCommission() {
    let commissionPercent =
      this.numeraireExchangeForm.controls['commissionPercent'].value;
    let salePrice = this.numeraireExchangeForm.controls['salePrice'].value;
    if (
      commissionPercent !== null &&
      commissionPercent !== 0 &&
      commissionPercent !== '' &&
      salePrice !== null &&
      salePrice !== 0 &&
      salePrice !== ''
    ) {
      commissionPercent = parseFloat(commissionPercent);
      let commission = salePrice * (commissionPercent / 100);
      let commissionFormat = new Intl.NumberFormat('es-MX', {
        minimumFractionDigits: 2,
      }).format(commission);
      this.numeraireExchangeForm.controls['commission'].setValue(
        commissionFormat
      );
    }
  }

  calculateCommissionTax() {
    let commissionTaxPercent =
      this.numeraireExchangeForm.controls['commissionTaxPercent'].value;
    let commission = this.numeraireExchangeForm.controls['commission'].value;
    if (
      commissionTaxPercent !== null &&
      commissionTaxPercent !== 0 &&
      commissionTaxPercent !== '' &&
      commission !== null &&
      commission !== 0 &&
      commission !== ''
    ) {
      commissionTaxPercent = parseFloat(commissionTaxPercent);
      let commissionTax = commission * (commissionTaxPercent / 100);
      let commissionTaxFormat = new Intl.NumberFormat('es-MX', {
        minimumFractionDigits: 2,
      }).format(commissionTax);
      this.numeraireExchangeForm.controls['commissionTax'].setValue(
        commissionTaxFormat
      );
    }
  }

  addRow() {
    this.adding = true;
    this.addOption.click();
    setTimeout(() => {
      this.addRowElement = document
        .querySelectorAll('tr[ng2-st-thead-form-row]')
        .item(0);
      this.addRowElement.classList.add('row-no-pad');
      this.addRowElement.classList.add('add-row-height');
      this.readOnlyInput = document
        .querySelectorAll('input[ng-reflect-name="id"]')
        .item(0);
      this.readOnlyInput.setAttribute('readonly', '');
      this.cancelBtn = document.querySelectorAll('.cancel').item(0);
      this.cancelEvent = this.handleCancel.bind(this);
      this.cancelBtn.addEventListener('click', this.cancelEvent);
    }, 300);
  }

  addEntry(event: any) {
    if (!event.newData.description || event.newData.amount == '') {
      this.alertTable();
      return;
    }
    event.newData.id = event.newData.description.id;
    event.newData.description = event.newData.description.description;
    event.confirm.resolve(event.newData);
    this.adding = false;
  }

  editEntry(event: any) {
    if (!event.newData.description || event.newData.amount == '') {
      this.alertTable();
      return;
    }
    event.newData.id = event.newData.description.id;
    event.newData.description = event.newData.description.description;
    event.confirm.resolve(event.newData);
  }

  handleCancel() {
    this.adding = false;
    this.cancelBtn = document.querySelectorAll('.cancel').item(0);
    this.cancelBtn.removeEventListener('click', this.cancelEvent);
  }

  alertTable() {
    this.onLoadToast(
      'error',
      'Campos incompletos',
      'Complete todos los campos para agregar un registro'
    );
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
    this.numeraireExchangeForm.controls['expenses'].setValue(
      this.expenseTestData
    );
    console.log(this.numeraireExchangeForm.value);
  }
}
