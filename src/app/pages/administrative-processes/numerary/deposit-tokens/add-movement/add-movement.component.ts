import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-add-movement',
  templateUrl: './add-movement.component.html',
  styles: [],
})
export class AddMovementComponent extends BasePage implements OnInit {
  title: string = 'Agregar Movimiento de Cuenta';
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
  dateMovem: Date;
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private accountMovementService: AccountMovementService,
    private numeraryService: NumeraryService,
    private token: AuthService,
    private parametersService: ParametersService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getCategory(new ListParams());
    this.getBanks(new ListParams());
  }

  prepareForm() {
    this.form = this.fb.group({
      bank: [null, [Validators.required]],
      // account: [null, Validators.nullValidator],
      // accountType: [null, Validators.nullValidator],
      deposit: [null, [Validators.required]],
      // square: [null, Validators.nullValidator],
      dateCalculationInterests: [null],
      dateMovement: [null, [Validators.required]],
      category: [null, [Validators.required]],
      // balanceOf: [null, Validators.nullValidator],
      // balanceAt: [null, Validators.nullValidator],
    });
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
    this.form.get('dateCalculationInterests').setValue('');
    // this.dateMovem = event.target.value;
  }
  close() {
    this.modalRef.hide();
  }

  saveRegister() {
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
        this.alert('success', 'Movimiento Creado Correctamente', '');
      },
      error: err => {
        this.alert(
          'error',
          'Error al Crear un Nuevo Movimiento',
          err.error.message
        );
      },
    });
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
}
