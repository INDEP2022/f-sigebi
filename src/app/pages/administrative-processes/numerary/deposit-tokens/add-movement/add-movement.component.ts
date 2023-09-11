import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { format, parse } from 'date-fns';
import * as moment from 'moment';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { AccountMovementService } from 'src/app/core/services/ms-account-movements/account-movement.service';
import { NumeraryService } from 'src/app/core/services/ms-numerary/numerary.service';
import { ParametersService } from 'src/app/core/services/ms-parametergood/parameters.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_POINT_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-add-movement',
  templateUrl: './add-movement.component.html',
  styles: [],
})
export class AddMovementComponent
  extends BasePage
  implements OnInit, AfterViewInit
{
  title: string = 'Movimiento de Cuenta';
  data1: LocalDataSource = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  filter1 = new BehaviorSubject<FilterParams>(new FilterParams());
  paramsList = new BehaviorSubject<ListParams>(new ListParams());
  noCuenta: any;
  columnFilters: any = [];
  rowData: any;
  form: FormGroup;
  banks = new DefaultSelect<any>();
  categories = new DefaultSelect<any>();
  maxDate = new Date();
  dateMovem: string;
  data: any;
  valEdit: boolean;
  minDate: Date = new Date();
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private accountMovementService: AccountMovementService,
    private numeraryService: NumeraryService,
    private token: AuthService,
    private parametersService: ParametersService,
    private datePipe: DatePipe
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getCategory(new ListParams());
    this.getBanks(new ListParams());
  }
  dateMovemRespDeposito: any;
  dateMovemRespTesofe: any;

  prepareForm() {
    this.form = this.fb.group({
      bank: [null, [Validators.required]],
      deposit: [
        null,
        [
          Validators.required,
          Validators.max(999999999999999),
          Validators.pattern(NUMBERS_POINT_PATTERN),
        ],
      ],
      dateCalculationInterests: [''],
      dateMovement: ['', [Validators.required]],
      category: [null],
    });
    console.log('this.data', this.data);
    if (this.data) {
      this.minDate = this.data.motiondate;
      // const date1: string = this.datePipe.transform(this.data.calculationinterestsdate, 'yyyy-MM-dd');
      const motionDate = new Date(this.data.motiondate);
      const calculationinterestsdate = new Date(
        this.data.calculationinterestsdate
      );
      motionDate.setDate(motionDate.getDate() + 1);
      calculationinterestsdate.setDate(calculationinterestsdate.getDate() + 1);
      this.dateMovem = this.datePipe.transform(motionDate, 'dd-MM-yyyy');

      if (this.data.calculationinterestsdate) {
        this.dateMovem2 = this.datePipe.transform(
          calculationinterestsdate,
          'dd-MM-yyyy'
        );
      } else {
        this.dateMovem2 = null;
      }

      this.dateMovemRespDeposito = this.dateMovem;
      this.dateMovemRespTesofe = this.dateMovem2;
      this.form.patchValue({
        bank: this.data.cveAccount,
        deposit: this.data.deposit,
        dateCalculationInterests: new Date(this.data.calculationinterestsdate),
        dateMovement: new Date(this.data.motiondate),
        category: this.data.category,
      });

      this.form.controls['bank'].setValue(this.data.bankAndNumber);

      this.getCategoryUpdate(this.data.category);
    }
  }

  getDataMovements() {
    this.loading = true;
    let params = {
      ...this.paramsList.getValue(),
      ...this.columnFilters,
    };
    params['filter.numberAccount'] = `$eq:${this.noCuenta}`;
    this.accountMovementService.getAllFiltered(params).subscribe({
      next: async (response: any) => {
        this.data1.load(response.data);
        this.data1.refresh();
        this.totalItems = response.count;
        this.loading = false;
      },
      error: err => {
        this.data1.load([]);
        this.data1.refresh();
        this.totalItems = 0;
        this.loading = false;
      },
    });
  }

  onDateChange(event: any) {
    console.log('Fecha seleccionada:', this.dateMovem);
    // Realiza las acciones deseadas al cambiar la fecha
  }

  dateMovement(event: any) {
    console.log('ev', event);

    console.log('dateMovem', this.dateMovem);
    // this.form.get('dateCalculationInterests').setValue('');
    // if () {

    // }
    // this.dateMovem2 = null;1
    // this.dateMovem = event.target.value;
  }

  close() {
    this.modalRef.hide();
  }

  save() {
    if (this.valEdit) {
      this.updateRegister();
    } else {
      this.saveRegister();
    }
  }

  saveRegister() {
    console.log(
      Date.parse(this.form.value.dateCalculationInterests),
      'aaa',
      Date.parse(this.form.value.dateMovement)
    );
    if (
      Date.parse(this.form.value.dateCalculationInterests) <
      Date.parse(this.form.value.dateMovement)
    ) {
      this.alert(
        'warning',
        'La Fecha TESOFE no puede ser menor a la Fecha Depósito',
        ''
      );
      return;
    }
    console.log('VALUE', this.form.value);
    const SYSDATE = new Date();
    const USER = this.token.decodeToken().preferred_username;
    const CATEGORY = this.form.value.category;
    const BANK = this.form.value.bank;

    let obj: any = {
      withdrawal: null,
      category: CATEGORY.initialCategory,
      deposit: this.form.value.deposit,
      placeMotion: null,
      pierced: null,
      dateMotion: this.returnParseDate_(this.form.value.dateMovement),
      numberProceedings: null,
      numberAccount: BANK.no_cuenta,
      InvoiceFile: null,
      genderTransfer: null,
      postTransfer: null,
      cveConcept: null,
      userinsert: USER,
      dateTransfer: null,
      ispartialization: null,
      dateInsertion: SYSDATE,
      userTransfer: null,
      passDiverse: null,
      numberGood: null,
      numberMotionTransfer: null,
      postDiverse: null,
      dateCalculationInterests: this.returnParseDate_(
        this.form.value.dateCalculationInterests
      ),
      isFileDeposit: 'S',
      numberReturnPayCheck: null,
    };
    console.log('EN', obj);

    this.accountMovementService.create(obj).subscribe({
      next: response => {
        console.log('response', response);
        this.modalRef.content.callback(true);
        this.close();
        this.alert('success', 'Movimiento creado correctamente', '');
      },
      error: err => {
        this.alert(
          'error',
          'Error al crear un nuevo movimiento',
          err.error.message
        );
      },
    });
  }

  async updateRegister() {
    if (
      !(await this.compararFechas(
        this.form.value.dateCalculationInterests,
        this.form.value.dateMovement
      ))
    ) {
      this.alert(
        'warning',
        'La Fecha TESOFE no puede ser menor a la Fecha Depósito',
        ''
      );
      return;
    }
    // console.log('VALUE', this.form.value);
    const SYSDATE = new Date();
    const USER = this.token.decodeToken().preferred_username;
    const CATEGORY = this.form.value.category;
    const BANK = this.form.value.bank;
    console.log(
      this.form.value.dateMovement,
      '=======',
      this.dateMovemRespDeposito
    );
    let obj: any = {
      category: this.data.category,
      deposit: this.form.value.deposit,
      dateMotion:
        this.form.value.dateMovement == this.dateMovemRespDeposito
          ? this.convertirFecha(this.form.value.dateMovement)
          : this.returnParseDate_(this.form.value.dateMovement),
      // this.convertirFecha(this.dateMovem),
      numberAccount: this.data.accountnumber,
      numberMotion: this.data.motionnumber,
      dateCalculationInterests:
        this.form.value.dateCalculationInterests == this.dateMovemRespTesofe
          ? this.convertirFecha(this.form.value.dateCalculationInterests)
          : this.returnParseDate_(this.form.value.dateCalculationInterests),
      // this.convertirFecha(this.dateMovem2),
    };
    console.log('EN', obj);

    this.accountMovementService.update(obj).subscribe({
      next: response => {
        console.log('response', response);
        this.modalRef.content.callback(true);
        this.close();
        this.alert('success', 'Movimiento actualizado correctamente', '');
      },
      error: err => {
        this.alert(
          'error',
          'Error al actualizar el movimiento',
          err.error.message
        );
      },
    });
  }

  async compararFechas(fecha1: any, fecha2: any) {
    console.log(fecha1, 'eeeee', fecha2);
    let fecha11 = null;
    let fecha22 = null;

    if (fecha1)
      // FECHA TESOFE //
      fecha11 =
        fecha1 == this.dateMovemRespTesofe
          ? this.datePipe.transform(fecha1, 'yyyy-dd-MM')
          : this.datePipe.transform(fecha1, 'yyyy-MM-dd');
    console.log('fecha11', fecha11);
    // if (fecha2) // FECHA DEL DEPOSITO //
    //   fecha22 = (fecha2 == this.dateMovemRespDeposito) ? this.datePipe.transform(new Date(fecha2), 'yyyy-dd-MM') : this.datePipe.transform(fecha2, 'yyyy-MM-dd');
    // console.log(fecha11, 'iiii', fecha22);
    const fecha1_ = Date.parse(fecha11);
    const fecha2_ = Date.parse(fecha2);
    // console.log(fecha1_, 'ooooo', fecha2_);

    if (fecha1_ < fecha2_) {
      return false;
    } else {
      return true;
    }
  }

  getBanks(lparams: ListParams) {
    const params = new FilterParams();

    params.page = lparams.page;
    params.limit = lparams.limit;

    let params__ = '';
    if (lparams?.text.length > 0)
      if (!isNaN(parseInt(lparams?.text))) {
        console.log('SI');
        params__ = `?filter.cve_cuenta=${lparams.text}`;
        // params.addFilter('no_cuenta', lparams.text);
      } else {
        console.log('NO');

        params__ = `?filter.cve_banco=${lparams.text}`;
        // params.addFilter('cve_banco', lparams.text);
      }

    // this.hideError();
    return new Promise((resolve, reject) => {
      this.accountMovementService.getDataBank(params__).subscribe({
        next: response => {
          console.log('ress1', response);
          let result = response.data.map(item => {
            item['bankAndNumber'] =
              item.cve_cuenta + ' - ' + item.cve_banco + ' - ' + item.nombre;
          });

          Promise.all(result).then((resp: any) => {
            this.banks = new DefaultSelect(response.data, response.count);
            this.loading = false;
          });
        },
        error: err => {
          this.banks = new DefaultSelect();
          console.log(err);
        },
      });
    });
  }

  getCategory(lparams: ListParams) {
    const params = new FilterParams();

    params.page = lparams.page;
    params.limit = lparams.limit;
    params.addFilter('category', lparams.text, SearchFilter.ILIKE);
    params.addFilter('certificateType', 'DEPOSITO', SearchFilter.ILIKE);

    // this.hideError();
    return new Promise((resolve, reject) => {
      this.parametersService
        .getCategorzacionAutomNumerario(params.getParams())
        .subscribe({
          next: (response: any) => {
            console.log('response', response);
            let result = response.data.map(async (item: any) => {
              item['categoryAndDesc'] =
                item.initialCategory + ' - ' + item.certificateType;
            });

            Promise.all(result).then((resp: any) => {
              this.categories = new DefaultSelect(
                response.data,
                response.count
              );
              this.loading = false;
            });
          },
          error: err => {
            this.categories = new DefaultSelect();
            console.log(err);
          },
        });
    });
  }

  returnParseDate_(data: Date) {
    console.log('DATEEEE', data);
    const formattedDate = moment(data).format('YYYY-MM-DD');
    return data ? formattedDate : null;
  }

  convertirFecha_(fecha: any) {
    // Parsea la fecha en su formato actual
    const fechaParseada = parse(fecha, 'dd-MM-yyyy', new Date());

    // Formatea la fecha al formato deseado (yyyy-MM-dd)
    return format(fechaParseada, 'yyyy-MM-dd');
  }

  returnParseDateUpdate(data: string) {
    console.log('DATEEEE', data);

    const formattedDate = this.datePipe.transform(data, 'yyyy-MM-dd');
    return data ? formattedDate : null;
  }
  convertirFecha(fecha: any) {
    // Divide la fecha en sus componentes
    console.log('fecha', fecha);
    if (fecha) {
      var partes = fecha.split('-');

      // Reorganiza los componentes en el formato deseado
      var fechaFormateada = partes[2] + '-' + partes[1] + '-' + partes[0];

      return fechaFormateada;
    } else {
      return null;
    }
  }
  dateMovem2: string;
  dateMovement2(event: any) {
    console.log('event22', event);
  }

  getCategoryUpdate(cat: any) {
    const params = new FilterParams();

    params.addFilter('category', cat, SearchFilter.EQ);
    params.addFilter('certificateType', 'DEPOSITO', SearchFilter.ILIKE);

    return new Promise((resolve, reject) => {
      this.parametersService
        .getCategorzacionAutomNumerario(params.getParams())
        .subscribe({
          next: (response: any) => {
            console.log('response', response);
            let result = response.data.map(async (item: any) => {
              item['categoryAndDesc'] =
                item.initialCategory + ' - ' + item.certificateType;
            });

            Promise.all(result).then((resp: any) => {
              this.form
                .get('category')
                .setValue(response.data[0].categoryAndDesc);
            });
          },
          error: err => {
            // this.form.get('category').setValue('');
          },
        });
    });
  }
}
