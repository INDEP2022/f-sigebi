import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { AccountMovementService } from 'src/app/core/services/ms-account-movements/account-movement.service';
import { NumeraryService } from 'src/app/core/services/ms-numerary/numerary.service';
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
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private accountMovementService: AccountMovementService,
    private numeraryService: NumeraryService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      bank: [null, Validators.nullValidator],
      account: [null, Validators.nullValidator],
      accountType: [null, Validators.nullValidator],
      currency: [null, Validators.nullValidator],
      square: [null, Validators.nullValidator],
      dateCalculationInterests: [null, Validators.nullValidator],
      dateMovement: [null, Validators.nullValidator],
      category: [null, Validators.nullValidator],
      balanceOf: [null, Validators.nullValidator],
      balanceAt: [null, Validators.nullValidator],
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
  dateMovem: Date;
  dateMovement(event: any) {
    this.dateMovem = event.target.value;
  }
  close() {
    this.modalRef.hide();
  }

  saveRegister() {
    let obj: any = {
      withdrawal: null,
      category: 'SSP',
      deposit: '1.00',
      numberMotion: '2863',
      placeMotion: null,
      pierced: null,
      dateMotion: '2000-09-08',
      numberProceedings: '647504',
      numberRecord: '86042',
      numberAccount: '2',
      InvoiceFile: null,
      genderTransfer: null,
      postTransfer: null,
      cveConcept: null,
      userinsert: 'AVALENCIA',
      dateTransfer: '2000-09-19',
      ispartialization: null,
      dateInsertion: '2000-09-19',
      userTransfer: null,
      passDiverse: null,
      numberGood: '2275409',
      numberMotionTransfer: null,
      postDiverse: null,
      dateCalculationInterests: '2000-09-19',
      isFileDeposit: 'S',
      numberReturnPayCheck: null,
    };
  }

  getBanks(lparams: ListParams) {
    const params = new FilterParams();

    params.page = lparams.page;
    params.limit = lparams.limit;
    params.addFilter('cveBank', lparams.text, SearchFilter.ILIKE);

    // this.hideError();
    return new Promise((resolve, reject) => {
      this.accountMovementService.getAccountBank(params.getParams()).subscribe({
        next: response => {
          this.banks = new DefaultSelect(response.data, response.count);
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

    // this.hideError();
    return new Promise((resolve, reject) => {
      this.numeraryService.getNumeraryCategories(params.getParams()).subscribe({
        next: (response: any) => {
          console.log('response', response);
          let result = response.data.map(async (item: any) => {
            item['categoryAndDesc'] = item.category + ' - ' + item.description;
          });

          Promise.all(result).then((resp: any) => {
            this.categories = new DefaultSelect(response.data, response.count);
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
}
