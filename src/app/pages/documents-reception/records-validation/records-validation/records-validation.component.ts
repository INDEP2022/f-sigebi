import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { KEYGENERATION_PATTERN } from 'src/app/core/shared/patterns';
import { ProceedingsValidationsService } from './../../../../core/services/ms-proceedings/proceedings-validations.service';
import { RECORDS_VALDIATION_COLUMNS } from './records-validation-columns';

@Component({
  selector: 'app-records-validation',
  templateUrl: './records-validation.component.html',
  styles: [],
})
export class RecordsValidationComponent extends BasePage implements OnInit {
  form: FormGroup;
  fileNumber: number;
  proceedingsNumb: number;
  proceedingsCve: string;
  dataTable: LocalDataSource = new LocalDataSource();
  correctRecords: number = 0;
  recordsCount: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  columnFilters: any = [];
  filterParams = new BehaviorSubject<FilterParams>(new FilterParams());

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private proceedingsValidationsService: ProceedingsValidationsService
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: false,
      columns: RECORDS_VALDIATION_COLUMNS,
      rowClassFunction: (row: any) => {
        if (row.data.statusValue === '1') {
          return 'bg-success text-white';
        } else {
          return 'bg-danger text-white';
        }
      },
    };
  }

  ngOnInit(): void {
    const exist = this.filterParams.getValue().getFilterParams();
    if (exist) {
      const filters = exist.split('&');
      filters.map(fil => {
        const partsFilter = fil.split('=');
        this.columnFilters[partsFilter[0]] = partsFilter[1];
      });
    }

    this.dataTable
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;

            switch (filter.field) {
              case 'valSec':
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

          this.getInfo();
        }
      });

    this.prepareForm();
    this.getParams();
    this.setForm();

    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      this.getInfo();
    });
  }

  getParams() {
    this.activatedRoute.params.subscribe(params => {
      this.fileNumber = params['fileNumber'];
      console.log(this.fileNumber);
      this.proceedingsNumb = params['proceedingsNumb'];
      this.proceedingsCve = params['proceedingsCve'];
    });
  }

  setForm() {
    this.form.patchValue({
      proceedingsNumb: this.proceedingsNumb,
      proceedingsCve: this.proceedingsCve,
    });
  }

  getInfo() {
    this.loading = true;
    let data: any[] = [];

    const params = {
      ...this.params.getValue(),
      'filter.actaNumber': `$eq:${this.proceedingsNumb}`,
      ...this.columnFilters,
    };
    const params2 = {
      ...this.params.getValue(),
      'filter.actaNumber': `$eq:${this.proceedingsNumb}`,
      'filter.valStatus': `$eq:1`,
      ...this.columnFilters,
    };

    this.proceedingsValidationsService.getAll(params).subscribe({
      next: resp => {
        for (let validation of resp.data) {
          let temp: any = {};
          (temp.valSec = validation.valSec),
            (temp.valDescription =
              validation.valDescription.charAt(0).toUpperCase() +
              validation.valDescription.substring(1).toLowerCase()),
            (temp.valResult =
              validation.valResult.charAt(0).toUpperCase() +
              validation.valResult.substring(1).toLowerCase()),
            (temp.statusValue = validation.valStatus);
          data.push(temp);
        }

        this.dataTable.load(data);
        this.recordsCount = resp.count;

        this.totalItems = resp.count;
        this.loading = false;
      },
      error: err => {
        if (err.status <= 404) {
          this.onLoadToast(
            'info',
            'Información',
            'No existen validadores para esta acta'
          );
          this.loading = false;
        }
      },
    });

    this.proceedingsValidationsService.getAll(params2).subscribe({
      next: resp => {
        this.correctRecords = resp.count;
        this.loading = false;
      },
      error: err => {
        this.loading = false;
      },
    });
  }

  prepareForm() {
    this.form = this.fb.group({
      proceedingsNumb: [
        null,
        [Validators.required, Validators.pattern(KEYGENERATION_PATTERN)],
      ],
      proceedingsCve: [
        null,
        [Validators.required, Validators.pattern(KEYGENERATION_PATTERN)],
      ],
    });
  }

  OnDestroy() {
    console.log('Saliendo');
  }
}
