import { Component, OnInit, ViewChild } from '@angular/core';
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
import { GoodProcessService } from 'src/app/core/services/ms-good/good-process.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
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

  @ViewChild('table', { static: false }) table: any;

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private goodFinderService: GoodFinderService,
    private globalVarsService: GlobalVarsService,
    private router: Router,
    private goodTrackerService: GoodTrackerService,
    private goodService: GoodService,
    private goodProcessService: GoodProcessService
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
      return;
    }

    this.alertQuestion(
      'question',
      'Se cambiará el indicador a los bienes seleccionados',
      `¿Continuar?`
    ).then(question => {
      if (question.isConfirmed) {
        for (let i = 0; i < this.registerSelected; i++) {
          const goodData = this.selectedRows[i];

          this.changeIndicataors(goodData);
        }
        this.table.isAllSelected = false;
        this.searchData();
      }
    });
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

  selectedRows: any;
  activeButton: boolean = false;
  registerSelected: number = 0;
  goodsids: string = '';

  onSelectedRows(event) {
    this.selectedRows = event.selected;
    console.log(this.selectedRows);

    if (this.selectedRows.length != 0) {
      this.registerSelected = this.selectedRows.length;
      this.activeButton = true;

      for (let i = 0; i < this.registerSelected; i++) {
        this.goodsids = this.goodsids + this.selectedRows[i].goodId + ', ';
      }
    } else {
      this.registerSelected = 0;
      this.activeButton = false;
      this.goodsids = '';
    }
  }

  changeIndicataors(goodData1: any) {
    const labelGood = this.form.controls['labelGood'].value;

    console.log('ID de etiqueta seleccionado:_ ', labelGood);

    let objGood1 = {
      goodNumber: Number(goodData1.id),
      label: Number(labelGood),
      classificationOfGoodsNumber: Number(goodData1.goodClassNumber),
    };
    console.log('ObjGood', objGood1);

    this.goodProcessService.validInitiationLabel(objGood1).subscribe({
      next: resp => {
        console.log('respuesta de validinitiationLabel', resp);
        //this.alert('warning','Atención',resp.data);
        this.changeLabel(goodData1);
      },
      error: error => {
        console.log('respuesta de error validinitiationLabel', error);
        this.alert('warning', `El Bien: ${goodData1.id}`, error.error.message);
      },
    });
  }

  changeLabel(goodData2: any) {
    const labelGood = this.form.controls['labelGood'].value;

    let objGood2 = {
      id: goodData2.id,
      goodId: goodData2.id,
      labelNumber: labelGood,
    };
    console.log('ObjGood', objGood2);

    this.goodService.update(objGood2).subscribe({
      next: resp => {
        console.log('Actualizado: ', resp);
        //this.alert('success', 'Etiqueta Actualizada', '');
      },
      error: error => {
        console.log('No se actualizó: ', error);
        this.alert(
          'warning',
          `No se logró cambiar la etiqueta del Bien: ${goodData2.id}`,
          'Revisar la información del Bien a modificar'
        );
      },
    });
  }
}
