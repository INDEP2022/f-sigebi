import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  FilterParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IRefPayDepositary } from 'src/app/core/models/ms-depositarypayment/ms-depositarypayment.interface';
import { MsDepositaryPaymentService } from 'src/app/core/services/ms-depositarypayment/ms-depositarypayment.service';
import { MassiveGoodService } from 'src/app/core/services/ms-massivegood/massive-good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { NgSelectElementComponent } from 'src/app/shared/components/select-element-smarttable/ng-select-element';
import * as XLSX from 'xlsx';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-depositary-payment-charges',
  templateUrl: './depositary-payment-charges.component.html',
  styles: [],
})
export class DepositaryPaymentChargesComponent
  extends BasePage
  implements OnInit
{
  data: any[];

  form: FormGroup;

  get numberGood() {
    return this.form.get('numberGood');
  }
  get event() {
    return this.form.get('event');
  }
  get bank() {
    return this.form.get('bank');
  }
  get loand() {
    return this.form.get('loand');
  }

  totalItems: number = 0;
  options: any[];

  filterParams = new BehaviorSubject<FilterParams>(new FilterParams());

  loadItemsJson: IRefPayDepositary[] = [];
  ItemsJson: IRefPayDepositary[] = [];
  itemsJsonInterfaz: IRefPayDepositary[] = [];
  ExcelData: any;
  @Input() toggle: EventEmitter<any> = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private Service: MsDepositaryPaymentService,
    private router: Router,
    private massiveGoodService: MassiveGoodService
  ) {
    super();
    this.settings.columns = COLUMNS;
    this.settings.actions = false;
    this.options = [
      { value: 'S', label: 'Si' },
      { value: 'R', label: 'Rechazado' },
      { value: 'N', label: 'No Invalido' },
      { value: 'A', label: 'Aplicado' },
      { value: 'B', label: 'Pago de Bases' },
      { value: 'D', label: 'Devuelto' },
      { value: 'C', label: 'Contabilizado' },
      { value: 'P', label: 'Penalizado' },
      { value: 'Z', label: 'Devuelto al Cliente' },
    ];

    this.settings = {
      ...this.settings,
      actions: false,
      columns: {
        sent_oi: {
          title: 'Valido',
          sort: false,
          type: 'custom',
          showAlways: true,
          /*
            valuePrepareFunction: (isSelected:string, row:any) =>
              this.isSelectedValid(row),*/
          renderComponent: NgSelectElementComponent,
          onComponentInitFunction: (instance: NgSelectElementComponent) => (
            (instance.data = this.options), this.onSelectValid(instance)
          ),
        },
        ...COLUMNS,
      },
    };
  }

  ngOnInit(): void {
    this.loadCargaBienes();
    this.buildForm();
    this.filterParams.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      if (this.form.get('numberGood').value) this.loadTablaDispersiones();
    });
  }
  isSelectedValid(_row: any) {
    console.log(_row);
  }
  onSelectValid(instance: NgSelectElementComponent) {
    instance.toggle.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: data => console.log(data.toggle),
    });
  }
  /**
   * @method: metodo para iniciar el formulario
   * @author:  Alexander Alvarez
   * @since: 27/09/2022
   */
  private buildForm() {
    this.form = this.fb.group({
      numberGood: [null, [Validators.required]],
      event: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      cve_bank: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      loand: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
    });
  }

  loadCargaBienes() {
    this.Service.getRefPayDepositories().subscribe({
      next: resp => {
        this.loadItemsJson = resp.data;
        console.log(' ' + resp.count);
        console.log(JSON.stringify(this.loadItemsJson));
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

  loadTablaDispersiones() {
    this.loading = true;
    this.Service.getRefPayDepositories(
      this.filterParams.getValue().getParams()
    ).subscribe({
      next: resp => {
        this.data = resp.data;
        this.totalItems = resp.count;
        this.loading = false;
      },
      error: err => {
        let error = '';
        this.loading = false;
        if (err.status === 0) {
          error = 'Revise su conexión de Internet.';
          this.onLoadToast('error', 'Error', error);
        } else {
          this.onLoadToast('error', 'Error', err.error.message);
        }
      },
    });
  }

  getDatosCSV() {
    this.massiveGoodService.getDatosCSV().subscribe({
      next: datos => {
        alert('  datos   getDatosCSV)');
      },
      error: errorDatos => {
        alert('ERROR => ' + errorDatos.error.message);
      },
    });
  }

  ReadExcel(event: any) {
    let file = event.target.files[0];

    let fileReader = new FileReader();
    fileReader.readAsBinaryString(file);

    fileReader.onload = e => {
      var workbook = XLSX.read(fileReader.result, { type: 'binary' });
      var buffer = new Buffer(fileReader.result.toString());
      var string = buffer.toString('base64');
      console.log('workbook => ' + string);
      var sheetNames = workbook.SheetNames;
      this.ExcelData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNames[0]]);
      console.log(this.ExcelData);
    };
  }

  btnPaymentDispersion() {
    if (this.form.get('numberGood').valid) {
      const { idBien } = this.form.get('numberGood').value;
      this.router.navigate(
        [
          '/pages/juridical/depositary/payment-dispersion-process/conciliation-depositary-payments',
        ],
        {
          queryParams: {
            p_nom_bien: idBien,
            origin: 'FCONDEPOCARGAPAG',
          },
        }
      );
    }

    /*
MANDA A LLAMAR LA P�GINA
FCONDEPOCONCILPAG
src\app\pages\juridical-processes\depositary\payment-dispersal-process\conciliation-depositary-payments

*/
  }

  onSearch() {
    this.cleanFild();
    // alert(this.form.get('numberGood').value);
    // console.warn(JSON.stringify(this.loadItemsJson));

    this.ItemsJson = this.loadItemsJson.filter(
      X => X.noGood === this.form.get('numberGood').value
    );
    console.error(JSON.stringify(this.ItemsJson[0]));
    this.form.get('event').setValue(this.ItemsJson[0].description);
    this.form.get('cve_bank').setValue(this.ItemsJson[0].cve_bank);
    this.form.get('loand').setValue(this.ItemsJson[0].amount);
    console.warn(JSON.stringify(this.ItemsJson[0]));

    this.filterParams.getValue().removeAllFilters();
    this.filterParams
      .getValue()
      .addFilter('noGood', this.form.get('numberGood').value, SearchFilter.EQ);

    this.loadTablaDispersiones();
  }

  cleanFild() {
    alert('Limpia');
    this.form.get('event').setValue('');
    this.form.get('cve_bank').setValue('');
    this.form.get('loand').setValue('');
  }
}
