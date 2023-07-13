import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, takeUntil, tap, throwError } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IBank } from 'src/app/core/models/catalogs/bank.model';
import { IRefPayDepositary } from 'src/app/core/models/ms-depositarypayment/ms-depositarypayment.interface';
import { ISegUsers } from 'src/app/core/models/ms-users/seg-users-model';
import { BankService } from 'src/app/core/services/catalogs/bank.service';
import { MsDepositaryPaymentService } from 'src/app/core/services/ms-depositarypayment/ms-depositarypayment.service';
//import { MassiveDepositaryService } from 'src/app/core/services/ms-massivedepositary/massivedepositary.service';
import { MassiveDepositaryService } from 'src/app/core/services/ms-massivedepositary/massivedepositary.service';
import { MassiveGoodService } from 'src/app/core/services/ms-massivegood/massive-good.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NgSelectElementComponent } from 'src/app/shared/components/select-element-smarttable/ng-select-element';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import * as XLSX from 'xlsx';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-depositary-payment-charges',
  templateUrl: './depositary-payment-charges.component.html',
  styleUrls: ['./depositary-payment-charges.component.scss'],
})
export class DepositaryPaymentChargesComponent
  extends BasePage
  implements OnInit
{
  @ViewChild('uploadFile') fileUpload: ElementRef<any>;
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

  users$ = new DefaultSelect<ISegUsers>();
  formgetCveBank: string;
  formgetCodeBank: number;

  constructor(
    private fb: FormBuilder,
    private Service: MsDepositaryPaymentService,
    private router: Router,
    private massiveGoodService: MassiveGoodService,
    private usersService: UsersService,
    private bankService: BankService,
    private massiveDepositaryService: MassiveDepositaryService
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
        ...COLUMNS,
        validSystem: {
          title: 'Válido',
          sort: false,
          type: 'custom',
          showAlways: true,
          renderComponent: NgSelectElementComponent,
          onComponentInitFunction: (instance: NgSelectElementComponent) => (
            (instance.data = this.options), this.onSelectValid(instance)
          ),
        },
        //...COLUMNS_EXTRAS,
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
      next: (data: any) => {
        const index = this.data.findIndex(x => x.payId == data.row.payId);
        this.data[index].validSystem = data.toggle.value;
      },
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
      event: [null, null],
      cve_bank: [null, [Validators.required]],
      loand: [null, null],
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
        console.log('<<<<<<  this.data  >>>>>>');
        console.log(this.data);
        console.log('<<<<<<  this.data  >>>>>>');
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

  openFile() {
    this.alertQuestion(
      'warning',
      'Asegurese que el excel sea el correcto',
      ''
    ).then(result => {
      this.fileUpload.nativeElement.value = '';
      if (result.isDismissed) {
        return;
      }
      document.getElementsByName('fileExcel')[0].click();
    });
  }

  async ReadExcel(event: any) {
    let file = event.target.files[0];

    const result = await this.excelIsCorret(event.target.files[0]);
    this.fileUpload.nativeElement.value = '';
    if (result == false) {
      this.alertInfo('error', 'El archivo cargado no es correcto!', '');
      return;
    }
    if (this.form.get('cve_bank').valid) {
      //let file = event.target.files[0];
      const formData = new FormData();
      formData.append('file', file);
      const cve_bank = this.form.get('cve_bank').value;

      this.massiveDepositaryService
        .pupBurdenDataCSV(formData, cve_bank)
        .subscribe({
          next: resp => {
            console.log(resp.ArrayData);
            this.insertRefPaymentDepositaria(resp.ArrayData);
          },
          error: eror => {
            this.onLoadToast(
              'error',
              'Error',
              'Ocurrio un error : ' + eror.error.message
            );
          },
        });
    } else {
      this.onLoadToast(
        'warning',
        'Información',
        'Se requiere la información del banco'
      );
    }
  }

  btnPaymentDispersion() {
    if (this.form.get('numberGood').value) {
      const idBien = this.form.get('numberGood').value;
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

    /*loadItemsJson
MANDA A LLAMAR LA P�GINA
FCONDEPOCONCILPAG
src\app\pages\juridical-processes\depositary\payment-dispersal-process\conciliation-depositary-payments

*/
  }

  async onSearch() {
    if (!this.form.get('numberGood').value) {
      this.alertInfo('info', 'El No. de bien es requerido', '');
      return;
    }
    this.cleanFild();
    this.ItemsJson = this.loadItemsJson.filter(
      X => X.noGood === this.form.get('numberGood').value
    );

    console.log(this.ItemsJson[0]);
    this.form.get('event').setValue(this.ItemsJson[0].description);
    this.form.get('cve_bank').setValue(this.ItemsJson[0].cve_bank);
    this.form.get('loand').setValue(this.ItemsJson[0].amount);
    if (this.ItemsJson[0]) {
      this.formgetCveBank = this.ItemsJson[0].cve_bank;
      this.formgetCodeBank = this.ItemsJson[0].code;
    }
    //console.warn(JSON.stringify(this.ItemsJson[0]));

    this.filterParams.getValue().removeAllFilters();
    this.filterParams
      .getValue()
      .addFilter('noGood', this.form.get('numberGood').value, SearchFilter.EQ);

    this.loadTablaDispersiones();
  }

  cleanFild() {
    this.form.get('event').setValue('');
    this.form.get('cve_bank').setValue('');
    this.form.get('loand').setValue('');
  }

  getUsers($params: ListParams) {
    let params = new FilterParams();
    params.page = $params.page;
    params.limit = $params.limit;
    params.search = $params.text;
    this.getAllUsers($params).subscribe();
  }

  getAllUsers(params: ListParams) {
    params.limit = 40;
    return this.bankService.getAll(params).pipe(
      catchError(error => {
        this.users$ = new DefaultSelect([], 0, true);
        return throwError(() => error);
      }),
      tap(response => {
        response.data.map((item: any) => {
          item['bankDescription'] = item.bankCode + '-' + item.name;
        });
        this.users$ = new DefaultSelect(response.data, response.count);
      })
    );
  }

  /*   Evento que se ejecuta para llenar los campos con el nombre de los destinatarios
========================================================================================*/
  getDescUser(event: IBank) {
    this.formgetCveBank = event.bankCode;
    this.formgetCodeBank = event.code;
  }

  setDataTableFromExcel(excelData: any) {
    return {
      movementNumber: excelData.MOV,
      movement: excelData.CODIGO,
      sucursal: excelData.SUCURSAL,
      referenceori: excelData.REFERENCIA_ORI,
      date: this.milisegundoToDate(excelData.FECHA),
      reference: excelData.REFERENCIA,
      amount: excelData.ABONO,
    };
  }

  milisegundoToDate(milis: any) {
    console.log('ENTRA FECHA =>> ' + milis);
    let fecha = new Date(milis);
    console.log('SALE FECHA =>> ' + fecha);
    console.log(
      'FECHA =>> ' +
        fecha.getFullYear() +
        '-' +
        (fecha.getMonth() + 1) +
        '-' +
        fecha.getDate()
    );
    return (
      fecha.getFullYear() + '-' + (fecha.getMonth() + 1) + '-' + fecha.getDate()
    );
  }

  setDataResult(result: any[]) {
    this.data = result.map((excelData: any) => {
      return {
        movementNumber: excelData.NO_MOVIMIENTO,
        movement: excelData.CODIGO,
        sucursal: excelData.SUCURSAL,
        referenceori: excelData.REFERENCIAORI,
        date: this.milisegundoToDate(excelData.FECHA),
        reference: excelData.REFERENCIA,
        amount: excelData.MONTO,
        cve_bank: excelData.CVE_BANCO,
        result: excelData.RESULTADO,
        validSystem: excelData.VAL,
        noGood: excelData.NO_BIEN,
      };
    });
  }

  /* Metodo para verificar excel
  =============================== */
  excelIsCorret(file: any) {
    return new Promise((resolve, reject) => {
      let fileReader = new FileReader();
      fileReader.readAsBinaryString(file);
      this.fileUpload.nativeElement.value = '';
      fileReader.onload = e => {
        var workbook = XLSX.read(fileReader.result, { type: 'binary' });

        var buffer = new Buffer(fileReader.result.toString());
        var string = buffer.toString('base64');

        var sheetNames = workbook.SheetNames;

        this.ExcelData = XLSX.utils.sheet_to_json(
          workbook.Sheets[sheetNames[0]]
        );

        console.log('this.ExcelData =>>>>  ', this.ExcelData);
        const value = Object.keys(this.ExcelData[0]);

        if (
          (value[0] != 'MOV' &&
            value[1] != 'CODIGO' &&
            value[3] != 'FECHA' &&
            value[4] != 'SUCURSAL' &&
            value[5] != 'ABONO',
          value[6] != 'GARANTIA')
        ) {
          resolve(false);
        } else {
          resolve(true);
        }

        /*this.data = [];
  
        this.data = this.ExcelData.map((data: any) =>
          this.setDataTableFromExcel(data)
        );*/
      };
    });
  }
  /* Metodo para limpiar el formulario
  ====================================== */
  cleanForm() {
    this.form.reset();
    this.data = [];
    this.fileUpload.nativeElement.value = '';
  }

  /* Metodo de guardado de la data cargada
  ========================================== */

  insertRefPaymentDepositaria(data: any[]) {
    let newData: any = [];
    data.map(async (item: any, _i: number) => {
      const index = _i + 1;
      let body: IRefPayDepositary = {
        movementNumber: item.NO_MOVIMIENTO,
        reference: item.REFERENCIA != null ? item.REFERENCIA : '0',
        referenceori: item.REFERENCIAORI != null ? item.REFERENCIAORI : '0',
        date: item.FECHA,
        amount: item.MONTO,
        description: item.DESCPAGO,
        cve_bank: item.CVE_BANCO,
        code: item.CODIGO,
        sucursal: item.SUCURSAL,
        result: item.RESULTADO,
        system_val_date: new Date(),
        noGood: item.NO_BIEN,
        validSystem: item.VAL,
        type: item.TIPO,
        entryorderid: 0,
        reconciled: null,
        registrationDate: null,
        oiDate: null,
        appliedto: null,
        client_id: null,
        registerNumber: 0,
        sent_oi: null,
        invoice_oi: null,
        indicator: 0,
      };
      const result = await this.saveRefPayDepositaryData(body);
      if (result) {
        newData.push(result);

        if (data.length == index) {
          this.data = newData;
          this.onLoadToast('success', 'El archivo ha sido dado de alta', '');
        }
      }
    });
  }
  //this.setDataResult(resp.ArrayData)
  saveRefPayDepositaryData(data: IRefPayDepositary) {
    return new Promise((resolve, reject) => {
      console.log(data);
      this.Service.postRefPayDepositories(data).subscribe({
        next: resp => {
          resolve(resp);
        },
      });
    });
  }
}
