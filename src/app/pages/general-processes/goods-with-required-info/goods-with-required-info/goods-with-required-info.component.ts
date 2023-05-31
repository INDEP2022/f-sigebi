import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { GoodService } from 'src/app/core/services/good/good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { GOODS_WITH_REQUIRED_INFO_COLUMNS } from './goods-with-required-info-columns';

@Component({
  selector: 'app-goods-with-required-info',
  templateUrl: './goods-with-required-info.component.html',
  styles: [],
})
export class GoodsWithRequiredInfoComponent extends BasePage implements OnInit {
  attribGoodBad: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  @Output() customEvent = new EventEmitter<string>();

  constructor(
    private fb: FormBuilder,
    private goodService: GoodService,
    public router: Router
  ) {
    super();
    //this.settings.actions = false;
    //this.settings.columns = GOODS_WITH_REQUIRED_INFO_COLUMNS;
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        edit: false,
        delete: false,
        add: false,
        position: 'right',
      },
      columns: { ...GOODS_WITH_REQUIRED_INFO_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.attribGoodBad
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            filter.field == 'id'
              ? (searchFilter = SearchFilter.EQ)
              : (searchFilter = SearchFilter.ILIKE);
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.getAttribGoodBad();
        }
      });

    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getAttribGoodBad());
  }

  getAttribGoodBad() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.goodService.getAttribGoodBadAll(params).subscribe({
      next: resp => {
        console.log(resp);
        this.totalItems = resp.count || 0;
        this.attribGoodBad.load(resp.data);
        this.attribGoodBad.refresh();
        this.loading = false;
        //resp.data;
      },
      error: error => {
        this.loading = false;
      },
    });
  }

  openGood(data: any): void {
    console.log(data);
    //console.log(localStorage.setItem(`Task`, JSON.stringify(data)));
    localStorage.setItem(`Task`, JSON.stringify(data));

    if (data.requestId !== null && data.urlNb !== null) {
      let url = `${`/pages/general-processes/goods-characteristics`}`;
      console.log(url);
      this.customEvent.emit('Hola');
      //console.log()
      this.router.navigateByUrl(url);
    } else {
      this.alert('warning', 'No disponible', 'Tarea no disponible');
    }
  }
}
