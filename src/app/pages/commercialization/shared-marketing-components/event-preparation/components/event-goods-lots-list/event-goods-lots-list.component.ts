import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import {
  BehaviorSubject,
  catchError,
  debounceTime,
  distinctUntilChanged,
  takeUntil,
  tap,
  throwError,
} from 'rxjs';
import { IComerGoodXLot } from 'src/app/common/constants/endpoints/ms-comersale/comer-good-x-lot.model';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  FilterParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IComerLot } from 'src/app/core/models/ms-prepareevent/comer-lot.model';
import { ComerGoodsXLotService } from 'src/app/core/services/ms-comersale/comer-goods-x-lot.service';
import { BasePage } from 'src/app/core/shared';
import Swal from 'sweetalert2';
import { GroundsStatusModalComponent } from '../../grounds-status-modal/grounds-status-modal.component';
import { ComerEventForm } from '../../utils/forms/comer-event-form';
import { IEventPreparationParameters } from '../../utils/interfaces/event-preparation-parameters';
import { EVENT_LOT_GOODS_LIST_COLUMNS } from '../../utils/table-columns/event-lot-goods-list-columns';

@Component({
  selector: 'event-goods-lots-list',
  templateUrl: './event-goods-lots-list.component.html',
  styles: [],
})
export class EventGoodsLotsListComponent
  extends BasePage
  implements OnInit, OnChanges
{
  @Input() eventForm: FormGroup<ComerEventForm>;
  @Input() parameters: IEventPreparationParameters;
  @Input() params = new BehaviorSubject(new FilterParams());
  @Input() lot: IComerLot;
  totalItems = 0;
  lotGoods = new LocalDataSource();
  get controls() {
    return this.eventForm.controls;
  }
  constructor(
    private comerGoodsXLotService: ComerGoodsXLotService,
    private modalService: BsModalService
  ) {
    super();
    this.settings = {
      ...this.settings,
      columns: EVENT_LOT_GOODS_LIST_COLUMNS,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        edit: false,
        delete: true,
        add: false,
        position: 'right',
      },
    };
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['lot']) {
      const params = new FilterParams();
      this.params.next(params);
    }
  }

  ngOnInit(): void {
    this.columnsFilter().subscribe();
    this.params
      .pipe(
        takeUntil(this.$unSubscribe),
        tap(params => {
          if (!this.lot) {
            this.lotGoods.load([]);
            this.lotGoods.refresh();
            this.totalItems = 0;
            return;
          }
          this.getLotGoods(params).subscribe();
        })
      )
      .subscribe();
  }

  columnsFilter() {
    return this.lotGoods.onChanged().pipe(
      distinctUntilChanged(),
      debounceTime(500),
      takeUntil(this.$unSubscribe),
      tap(dataSource => this.buildColumnFilter(dataSource))
    );
  }

  buildColumnFilter(dataSource: any) {
    const params = new FilterParams();
    if (dataSource.action == 'filter') {
      const filters = dataSource.filter.filters;
      filters.forEach((filter: any) => {
        const columns = this.settings.columns as any;
        const operator = columns[filter.field]?.operator;
        if (!filter.search) {
          return;
        }
        params.addFilter(
          filter.field,
          filter.search,
          operator || SearchFilter.EQ
        );
      });
      this.params.next(params);
    }
  }

  getLotGoods(params: FilterParams) {
    this.loading = true;
    params.addFilter('idLot', this.lot.id);
    params.sortBy = 'goodNumber:ASC';
    return this.comerGoodsXLotService
      .getAllFilterPostQuery(params.getParams())
      .pipe(
        catchError(error => {
          this.loading = false;
          this.lotGoods.load([]);
          this.lotGoods.refresh();
          this.totalItems = 0;
          return throwError(() => error);
        }),
        tap(response => {
          this.loading = false;
          this.lotGoods.load(response.data);
          this.lotGoods.refresh();
          this.totalItems = response.count;
        })
      );
  }

  async onRemoveGood(good: IComerGoodXLot) {
    const question = await this.alertQuestion(
      'question',
      '¿El bien deberá actualizarse a estatus REV?',
      '',
      'Si',
      'No'
    );
    const { isConfirmed, dismiss } = question;
    if (isConfirmed) {
      await this.revStatus();
      return;
    }

    if (dismiss == Swal.DismissReason.cancel) {
      await this.confirmRemoveGood(good);
      return;
    }
  }

  async revStatus() {
    let val = 0;
    const { eventTpId } = this.controls;
    if (eventTpId.value == 10) {
      val = this.validateStatus();
    }
    if (val != 0) {
      this.alert(
        'error',
        'Error',
        'No es posible enviar el bien , verifique el estatus del evento'
      );
      return;
    }

    this.callRev();
  }

  callRev() {
    //  Add_Parameter(pl_id, 'ESTATUS',TEXT_PARAMETER,VAR_T);
    //   Add_Parameter(pl_id, 'ID_EVENTO',TEXT_PARAMETER,VAR_EVENTO);
    //   Add_Parameter(pl_id, 'P_DIRECCION',TEXT_PARAMETER,:PARAMETER.P_DIRECCION);
    const { id, eventTpId } = this.controls;
    const estatus = [6, 10].includes(Number(eventTpId.value)) ? 'PRE' : 'CPV';
    const eventId = id.value;
    const direction = this.parameters.pDirection;
    this.modalService.show(GroundsStatusModalComponent, {
      ...MODAL_CONFIG,
    });
  }

  validateStatus() {
    // todo: implementar KEY-DELREC - PRIMER CONSULTA
    return 1;
  }

  async confirmRemoveGood(good: IComerGoodXLot) {
    const confirmQuestion = await this.alertQuestion(
      'question',
      '¿Esta seguro de eliminar el bien?',
      ''
    );
    const { isConfirmed } = confirmQuestion;
    if (isConfirmed) {
      this.removeGoods(good);
    }
    this.afterRemoveGoods();
  }

  /**BORRADO_DE_BIENES */
  removeGoods(good: IComerGoodXLot) {
    const { statusVtaId, eventTpId } = this.controls;
    const VALID_STATUSES = ['SOLV', 'VALV', 'VEN', 'CONC', 'CNE', 'DES'];
    if (VALID_STATUSES.includes(statusVtaId.value)) {
      this.alert(
        'error',
        'Error',
        'El bien no se puede eliminar porque este evento ya no esta en preparación'
      );
      return;
    }
    const isAssociated =
      [6, 10].includes(Number(eventTpId.value)) &&
      good.commercialEventId &&
      this.lot.statusVtaId != 'DES';
    if (isAssociated) {
      this.alert(
        'error',
        'Error',
        'El bien no se puede eliminar porque esta asociado a otro evento'
      );
      return;
    }
    // TODO: BORRADO_DE_BIENES && ACTU_MANDATO
    this.afterRemoveGoods();
  }

  afterRemoveGoods() {
    // TODO: IMPLEMENTAR KEY-DELREC SEGUNDA CONSULTA
  }
}
