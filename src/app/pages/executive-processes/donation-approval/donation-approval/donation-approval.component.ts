import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DONATION_APPROVAL_COLUMNS } from './donation-approval-columns';
//Models
import { IGood } from 'src/app/core/models/ms-good/good';
//Services
import { LocalDataSource } from 'ng2-smart-table';
import { IExpedient } from 'src/app/core/models/ms-expedient/expedient';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-donation-approval',
  templateUrl: './donation-approval.component.html',
  styleUrls: ['./donation-approval.scss'],
})
export class DonationApprovalComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});

  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;

  data: LocalDataSource = new LocalDataSource();

  expedientSelec = new DefaultSelect<IExpedient>();

  rowSelected: boolean = false;
  selectedRow: any = null;

  constructor(
    private fb: FormBuilder,
    private goodService: GoodService,
    private expedientService: ExpedientService,
    private datePipe: DatePipe
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...DONATION_APPROVAL_COLUMNS },
      mode: '',
      rowClassFunction: (row: any) => {
        if (row.data.estatus.active === '1') {
          return 'text-success';
        } else {
          return 'text-danger';
        }
      },
    };
  }

  ngOnInit(): void {
    this.prepareForm();
    // this.getPagination();
  }

  private prepareForm() {
    this.form = this.fb.group({
      idExpedient: [
        null,
        [
          Validators.maxLength(10),
          Validators.minLength(1),
          Validators.pattern(NUMBERS_PATTERN),
        ],
      ],
      preliminaryInquiry: [null, []],
      criminalCase: [null, Validators.pattern(STRING_PATTERN)],
      circumstantialRecord: [null, Validators.pattern(STRING_PATTERN)],
      keyPenalty: [null, Validators.pattern(STRING_PATTERN)],
    });
  }

  //Seleccionar expediente
  getExpedient(lparams: ListParams) {
    const params = new FilterParams();
    params.page = lparams.page;
    params.limit = lparams.limit;
    if (lparams?.text.length > 0)
      params.addFilter('preliminaryInquiry', lparams.text, SearchFilter.LIKE);

    this.expedientService.getExpedientList(params.getParams()).subscribe({
      next: data => {
        this.expedientSelec = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.expedientSelec = new DefaultSelect();
      },
    });
  }

  //Evento cuando se selecciona un item del select
  onValuesChange(expedientChange: IExpedient) {
    this.form.controls['idExpedient'].setValue(expedientChange.id);
    this.form.controls['criminalCase'].setValue(expedientChange.criminalCase);
    this.form.controls['circumstantialRecord'].setValue(
      expedientChange.circumstantialRecord
    );
    this.form.controls['keyPenalty'].setValue(
      expedientChange.circumstantialRecord
    );
    this.expedientSelec = new DefaultSelect();

    this.getExpedientById();
  }

  getExpedientById(): void {
    let _id = this.form.controls['idExpedient'].value;
    this.loading = true;
    this.expedientService.getById(_id).subscribe(
      response => {
        //TODO: Validate Response
        if (response !== null) {
          this.form.patchValue(response);
          this.form.updateValueAndValidity();
          this.getGoodsByExpedient(response.id);
        } else {
          //TODO: CHECK MESSAGE
          this.alert('info', 'No se encontraron registros', '');
        }

        this.loading = false;
      },
      error => (this.loading = false)
    );
  }

  getGoodsByExpedient(id: string | number): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getGoods(id));
  }
  getGoods(id: string | number): void {
    this.goodService.getByExpedient(id, this.params.getValue()).subscribe(
      response => {
        //console.log(response);
        let data = response.data.map((item: IGood) => {
          //console.log(item);
          item.promoter = item.userPromoterDecoDevo?.id;
          let dateDecoDev = item.scheduledDateDecoDev;
          let dateTeso = item.tesofeDate;
          item.scheduledDateDecoDev = this.datePipe.transform(
            dateDecoDev,
            'yyyy-MM-dd'
          );
          item.tesofeDate = this.datePipe.transform(dateTeso, 'yyyy-MM-dd');
          return item;
        });
        this.data.load(data);
        this.totalItems = response.count;
        this.loading = false;
      },
      error => (this.loading = false)
    );
  }

  settingsChange($event: any): void {
    this.settings = $event;
  }

  selectRow(row: any) {
    console.log(row);
    this.selectedRow = row;
    this.rowSelected = true;
  }

  resetScreen() {
    window.scrollTo(0, 0);
    this.form.reset();
  }
}
