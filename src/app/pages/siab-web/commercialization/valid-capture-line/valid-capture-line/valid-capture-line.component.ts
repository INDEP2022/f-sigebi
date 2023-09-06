import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { CapturelineService } from 'src/app/core/services/ms-captureline/captureline.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN } from 'src/app/core/shared/patterns';
import { VALID_CAPTURE_LINE_COLUMNS } from './valid-captura-line-columns';

@Component({
  selector: 'app-valid-capture-line',
  templateUrl: './valid-capture-line.component.html',
  styles: [],
})
export class validCaptureLineComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  columns: any[] = [];
  totalItems: number = 0;

  data: LocalDataSource = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  columnFilters: any = [];

  idEvent: number;
  publicLot: number;
  idClient: number;

  constructor(
    private fb: FormBuilder,
    private capturelineService: CapturelineService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      hideSubHeader: false,
      columns: { ...VALID_CAPTURE_LINE_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.prepareForm();
    //this.getPagination();
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            /*SPECIFIC CASES*/
            switch (filter.field) {
              case 'caseNumber':
                searchFilter = SearchFilter.EQ;
                break;
              case 'noDocument':
                searchFilter = SearchFilter.EQ;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getData(this.idEvent, this.publicLot, this.idClient);
        }
      });
  }

  private prepareForm() {
    this.form = this.fb.group({
      typeEvent: [null, []],
      idEvent: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
      allotment: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
      idClient: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
    });
  }

  searchConsult() {
    this.idEvent = this.form.get('idEvent').value;
    this.publicLot = this.form.get('allotment').value;
    this.idClient = this.form.get('idClient').value;
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() =>
        this.getData(this.idEvent, this.publicLot, this.idClient)
      );
  }

  getData(idEvent?: number, publicLot?: number, idClient?: number) {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    let body = {
      idEventIn: idEvent,
      publicLotIn: publicLot,
      idClientIn: idClient,
    };
    this.capturelineService.getPaConsult(body, params).subscribe({
      next: resp => {
        console.log(resp);
        this.data.load(resp.data);
        this.data.refresh();
        this.totalItems = resp.count;
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        this.data.load([]);
        this.data.refresh();
        this.totalItems = 0;
      },
    });
  }
}
