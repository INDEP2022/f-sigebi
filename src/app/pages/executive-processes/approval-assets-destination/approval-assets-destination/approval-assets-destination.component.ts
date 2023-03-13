import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN } from 'src/app/core/shared/patterns';
import { ASSETS_DESTINATION_COLUMNS } from './approval-assets-destination-columns';
//Models
import { IGood } from 'src/app/core/models/ms-good/good';
//Services
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';

@Component({
  selector: 'app-approval-assets-destination',
  templateUrl: './approval-assets-destination.component.html',
  styleUrls: ['./approval-assets-destination.scss'],
})
export class ApprovalAssetsDestinationComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup = new FormGroup({});
  show = false;

  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;

  data: LocalDataSource = new LocalDataSource();

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
      mode: '',
      columns: { ...ASSETS_DESTINATION_COLUMNS },
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
          Validators.required,
          Validators.maxLength(10),
          Validators.minLength(1),
          Validators.pattern(NUMBERS_PATTERN),
        ],
      ],
      preliminaryInquiry: [{ value: null, disabled: true }],
      criminalCase: [{ value: null, disabled: true }],
      circumstantialRecord: [{ value: null, disabled: true }],
      keyPenalty: [{ value: null, disabled: true }],
    });
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
          this.alert('info', 'No se encontrarón registros', '');
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
}
