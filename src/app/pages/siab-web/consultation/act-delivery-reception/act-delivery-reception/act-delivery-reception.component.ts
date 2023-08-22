import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ProceedingsDeliveryReceptionService } from 'src/app/core/services/ms-proceedings/proceedings-delivery-reception.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN } from 'src/app/core/shared/patterns';
import { ACT_DELIVERY_RECEPTION_COLUMNS } from './act-delivery-reception-columns';

@Component({
  selector: 'app-act-delivery-reception',
  templateUrl: './act-delivery-reception.component.html',
  styles: [],
})
export class ActDeliveryReceptionComponent extends BasePage implements OnInit {
  //form: FormGroup;
  form: FormGroup = new FormGroup({});

  data1: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  totalItems: number = 0;
  columnFilters: any = [];
  constructor(
    private fb: FormBuilder,
    private proceedingsDeliveryReceptionService: ProceedingsDeliveryReceptionService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      hideSubHeader: false,
      columns: ACT_DELIVERY_RECEPTION_COLUMNS,
    };
  }

  ngOnInit(): void {
    this.prepareForm();
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
              case 'rank':
                searchFilter = SearchFilter.EQ;
                break;
              case 'expediente':
                searchFilter = SearchFilter.EQ;
                break;
              case 'no_acta':
                searchFilter = SearchFilter.EQ;
                break;
              case 'fecha':
                //filter.search = this.returnParseDate(filter.search);
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
          this.getData();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getData());
  }

  private prepareForm() {
    this.form = this.fb.group({
      recordsSearchCriteria: [
        null,
        [
          Validators.required,
          Validators.pattern(NUMBERS_PATTERN),
          Validators.maxLength(15),
        ],
      ],
    });
  }

  /*search() {
    const criteria = this.form.get('recordsSearchCriteria').value;
    console.log(criteria);
    
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getData(criteria));
  }*/

  getData() {
    /*if (idExp) {
      this.params.getValue()['filter.txtCriterio'] = `$eq:${idExp}`;
    }*/
    this.loading = true;
    let param = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.proceedingsDeliveryReceptionService.getSearchActa(param).subscribe({
      next: resp => {
        console.log(resp.data);
        this.totalItems = resp.count;
        this.data.load(resp.data);
        this.data.refresh();
        //console.log(this.totalItems2, resp);
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

  rowsSelected(event: any) {
    console.log(event.data);
  }

  /*reset(){
    this.form.get('recordsSearchCriteria').setValue('');
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getData());
  }*/
}
