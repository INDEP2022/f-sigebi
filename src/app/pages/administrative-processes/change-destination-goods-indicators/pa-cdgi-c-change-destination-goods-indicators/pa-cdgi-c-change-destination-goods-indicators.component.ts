import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { GoodTrackerService } from 'src/app/core/services/ms-good-tracker/good-tracker.service';
import { GoodFinderService } from 'src/app/core/services/ms-good/good-finder.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { IGlobalVars } from 'src/app/shared/global-vars/models/IGlobalVars.model';
import { GlobalVarsService } from 'src/app/shared/global-vars/services/global-vars.service';
import { GOODS_TACKER_ROUTE } from 'src/app/utils/constants/main-routes';
import { SelectLabelGoodComponent } from '../select-label-good/select-label-good.component';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-pa-cdgi-c-change-destination-goods-indicators',
  templateUrl: './pa-cdgi-c-change-destination-goods-indicators.component.html',
  styles: [],
})
export class PaCdgiCChangeDestinationGoodsIndicatorsComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup = new FormGroup({});

  params = new BehaviorSubject<ListParams>(new ListParams());
  columnFilters: any = [];
  totalItems: number = 0;
  source: LocalDataSource = new LocalDataSource();

  rel_bienes: any = null;
  goodsTracker: any = null;
  valRastreador: boolean = false;
  total: any;

  ngGlobal: IGlobalVars = null;

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private goodFinderService: GoodFinderService,
    private globalVarsService: GlobalVarsService,
    private router: Router,
    private goodTrackerService: GoodTrackerService
  ) {
    super();

    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: 'Cambiar Indicador',
        edit: true,
        delete: false,
        add: false,
        position: 'right',
      },
      hideSubHeader: false,
      columns: { ...COLUMNS },
      selectMode: 'multi',
    };
  }

  ngOnInit(): void {
    console.log('rel_bienes', this.rel_bienes);

    this.prepareForm();

    this.source
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
              case 'id':
                searchFilter = SearchFilter.EQ;
                break;
              case 'description':
                searchFilter = SearchFilter.LIKE;
                break;
              case 'status':
                searchFilter = SearchFilter.EQ;
                break;
              case 'labelNumber':
                searchFilter = SearchFilter.EQ;
                break;

              default:
                searchFilter = SearchFilter.LIKE;
                break;
            }
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.params
            .pipe(takeUntil(this.$unSubscribe))
            .subscribe(() => this.searchData());
        }
      });

    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.searchData());

    this.globalVarsService
      .getGlobalVars$()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: global => {
          this.ngGlobal = global;
          if (this.ngGlobal.REL_BIENES != null) {
            console.log('REL_BIENES ', this.ngGlobal.REL_BIENES);
            this.rel_bienes = this.ngGlobal.REL_BIENES;
            this.ngGlobal.REL_BIENES = null;
          }
        },
      });

    if (this.rel_bienes != null) {
      this.backRastreador(this.rel_bienes);
    }
  }

  private prepareForm() {
    this.form = this.fb.group({
      labelGood: [null, []],
    });
  }

  searchData(goodNumbers?: any) {
    this.loading = true;

    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };

    if (goodNumbers) {
      console.log('goodNumbers', goodNumbers);

      let goodNumbersConcat = '';
      for (let i = 0; i < goodNumbers.length; i++) {
        goodNumbersConcat += goodNumbers[i].goodNumber + ', ';
      }

      goodNumbersConcat = goodNumbersConcat.slice(0, -2);

      console.log(goodNumbersConcat);

      params['filter.id'] = `$in:${goodNumbersConcat}`;
    }

    this.goodFinderService.goodFinder(params).subscribe({
      next: resp => {
        this.source.load(resp.data);
        this.source.refresh();
        this.totalItems = resp.count;
        this.loading = false;
      },
      error: error => {
        this.loading = false;
      },
    });
  }

  callRastreador() {
    this.loadFromGoodsTracker();
  }

  async loadFromGoodsTracker() {
    const global = await this.globalVarsService.getVars();
    this.globalVarsService.updateSingleGlobal('REL_BIENES', 0, global);
    this.router.navigate([GOODS_TACKER_ROUTE], {
      queryParams: {
        origin: 'FACTADBCAMBIOETIQ',
      },
    });
  }

  addGoodRastreador(good: any) {
    console.log('addgoodRastreador,', good);
  }

  backRastreador(global: any) {
    this.goodTrackerService.PaInsGoodtmptracker_(global).subscribe({
      next: res => {
        this.valRastreador = true;
        console.log('respuesta TMPTRAKER', res);
        console.log('tamaño', res.count);
        this.searchData(res.data);

        /*let obj = {
          goodNumber: [],
        };

        let result = response.data.map(item => {
          obj.goodNumber.push(item.goodNumber);
        });

        Promise.all(result).then(resp => {
          this.goodsTracker = obj;
          console.log('this.goodstracker', this.goodsTracker);
          console.log('this.goodstracker tamaño', this.goodsTracker.length);
          
        });*/
      },
      error: err => {},
    });
  }

  assignIndicator() {
    const NVAL = 0;
    const BN_VALID = 0;

    const label = this.form.controls['labelGood'].value;

    if (label == null) {
      this.alertInfo(
        'warning',
        'Atención',
        'Debe especificar el indicador de destino'
      );
    }
  }

  openForm(data: any) {
    console.log('data', data.labelNumber);
    const labelNumber = data.labelNumber;
    const goodData = data;

    let config: ModalOptions = {
      initialState: {
        labelNumber,
        goodData,
        callback: (next: boolean) => {
          if (next) this.searchData();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(SelectLabelGoodComponent, config);
  }
}
