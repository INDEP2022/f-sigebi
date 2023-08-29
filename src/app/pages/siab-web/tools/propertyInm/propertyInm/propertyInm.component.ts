import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { GoodSssubtypeService } from 'src/app/core/services/catalogs/good-sssubtype.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
import { REAL_STATE_COLUMNS } from './propertyInm-columns';

//import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-propertyInd',
  templateUrl: './propertyInm.component.html',
  styles: [],
})
export class PropertyInmComponent extends BasePage implements OnInit {
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  array: any = [];
  constructor(private goodSssubtypeService: GoodSssubtypeService) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      hideSubHeader: false,
      columns: {
        ...REAL_STATE_COLUMNS,
        seleccion: {
          title: 'Selección',
          type: 'custom',
          renderComponent: CheckboxElementComponent,
          onComponentInitFunction: (instance: CheckboxElementComponent) =>
            this.onSelectDelegation(instance),
          sort: false,
          filter: false,
        },
      },
    };
  }

  onSelectDelegation(instance: CheckboxElementComponent) {
    instance.toggle.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: data => {
        //this.selectDelegation(data.row, data.toggle),
        console.log(data.toggle, data.row.numClasifGoods);
        if (data.toggle == true) {
        }

        const existe = this.array.some(
          (objeto: any) => objeto.id === data.row.numClasifGoods
        );
        console.log(existe);
        if (existe) {
          const index = this.array.findIndex(
            (objeto: any) => objeto.id === data.row.id
          );
          console.log(index);
          this.array.splice(index, 1);
        } else {
          this.array.push(data.row.numClasifGoods);
        }
        console.log(this.array);
      },
    });
  }

  ngOnInit(): void {
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
              case 'numClasifGoods':
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
          this.getDataAll();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getDataAll());
  }

  getDataAll() {
    let param = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.goodSssubtypeService.getAll(param).subscribe({
      next: resp => {
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

  rowsSelected(event: any) {
    //console.log(event.isSelected);
  }

  generateReport() {}

  /*data: any = [
    {
      clasific: 'test',
      description: 'test123123'
    },
    {
      clasific: 'test1',
      description: 'test123123'
    },
    {
      clasific: 'test2',
      description: 'test123123'
    }
  ]*/
}
