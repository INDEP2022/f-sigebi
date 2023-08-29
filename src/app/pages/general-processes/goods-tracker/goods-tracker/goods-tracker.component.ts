import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import { format } from 'date-fns';
import { BehaviorSubject, firstValueFrom, skip, take, takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { SocketService } from 'src/app/common/socket/socket.service';
import { ITrackedGood } from 'src/app/core/models/ms-good-tracker/tracked-good.model';
import { GoodTrackerService } from 'src/app/core/services/ms-good-tracker/good-tracker.service';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { ResetTrackerFilter } from '../store/goods-tracker.actions';
import { getTrackerFilter } from '../store/goods-tracker.selector';
import {
  FilterMatchTracker,
  OperatorValues,
  TrackerValues,
} from '../utils/constants/filter-match';
import { GoodTrackerMap } from '../utils/good-tracker-map';
import { GOODS_TRACKER_CRITERIAS } from '../utils/goods-tracker-criterias.enum';
import { GoodTrackerForm } from '../utils/goods-tracker-form';

@Component({
  selector: 'app-goods-tracker',
  templateUrl: './goods-tracker.component.html',
  styleUrls: ['./goods-tracker.component.scss'],
})
export class GoodsTrackerComponent extends BasePage implements OnInit {
  @ViewChild('scrollTable') scrollTable: ElementRef<HTMLDivElement>;
  filterCriterias = GOODS_TRACKER_CRITERIAS;
  form = this.fb.group(new GoodTrackerForm());
  formCheckbox = this.fb.group({
    goodIrre: [false],
    lookPhoto: [false],
  });
  showTable: boolean = false;
  params = new FilterParams();
  totalItems: number = 0;
  _params = new BehaviorSubject(new ListParams());
  goods: ITrackedGood[] = [];
  subloading: boolean = false;
  filters = new GoodTrackerMap();
  selectedGooods: ITrackedGood[] = [];
  $trackerFilter = this.store.select(getTrackerFilter);

  constructor(
    private fb: FormBuilder,
    private goodTrackerService: GoodTrackerService,
    private notificationService: NotificationService,
    private socketService: SocketService,
    private store: Store
  ) {
    super();
  }

  async ngOnInit() {
    this._params
      .pipe(takeUntil(this.$unSubscribe), skip(1))
      .subscribe(async next => {
        const form = this.form.value;
        const filledFields = Object.values(form).filter(value => {
          if (Array.isArray(value)) {
            return value.length > 0;
          }
          return value ? true : false;
        });
        if (!filledFields.length) {
          this.getAllGoods();
          return;
        }
        this.getGoods(next);
      });

    const state = await this.getFilterState();
    if (state) {
      this.store.dispatch(ResetTrackerFilter());
      this.form.patchValue({ ...state.getRawValue() });
      this.searchGoods();
    }
  }

  getFilterState() {
    return firstValueFrom(this.$trackerFilter.pipe(take(1)));
  }

  async searchGoods(params?: any) {
    this.selectedGooods = [];
    this.params.removeAllFilters();
    const _params = new ListParams();
    this._params.next(_params);
    // this.getGoods();
    this.showTable = true;
  }

  getOperator(key: string) {
    return OperatorValues[key] ?? SearchFilter.EQ;
  }

  getKeyParam(key: string) {
    const match = FilterMatchTracker as any;
    return match[key] ?? null;
  }

  getValue(value: any, key: string) {
    let _val;
    const customVal = TrackerValues[key];
    _val = value;
    if (customVal) {
      _val = customVal;
    }
    if (Array.isArray(_val)) {
      if (_val.length === 0) {
        return null;
      }
      const x = _val
        .filter(x => x?.length > 0)
        .join(',')
        .replaceAll(',,', ',');
      return x.replaceAll(',,', ',');
    }
    return _val;
  }

  getAllGoods(params?: ListParams) {
    this.loading = true;
    this.filters = new GoodTrackerMap();
    this.mapFilters();
    this.scrollTable.nativeElement.scrollIntoView();
    this.goodTrackerService.getAll(params ?? new ListParams()).subscribe({
      next: res => {
        this.loading = false;
        this.goods = res.data as any;
        this.totalItems = res.count;
      },
      error: error => {
        this.loading = false;
        // this.alert('error', 'Error', 'Ocurrio un error al obtener los datos');
        this.goods = [];
        this.totalItems = 0;
      },
    });
  }

  getGoods(params?: ListParams) {
    this.loading = true;
    this.filters = new GoodTrackerMap();
    this.mapFilters();
    this.scrollTable.nativeElement.scrollIntoView();
    this.goodTrackerService
      .trackGoods(this.filters, params ?? new ListParams())
      .subscribe({
        next: res => {
          console.log(res);

          this.loading = false;
          this.goods = res.data;
          this.totalItems = res.count;
        },
        error: error => {
          this.loading = false;
          // this.alert('error', 'Error', 'Ocurrio un error al obtener los datos');
          this.goods = [];
          this.totalItems = 0;
        },
      });
  }

  mapFilters() {
    const form = this.form.getRawValue();

    // Filtros clasificador
    this.clasificationFilter();
    // --Filtros de datos del bien
    this.goodDataFilter();
    // Filtros de notificacion expediente y dictamen
    this.expNotDicFilter();
    // Filtros de actas
    this.certificatesFilter();
    // Filtro transferente emisora autoridad
    this.transferFilter();

    const {
      warehouse,
      cordination,
      autorityState,
      goodState,
      gabinete,
      inventario,
    } = form;
    this.filters.gabinete = gabinete ?? null;
    this.filters.inventario = inventario?.length ? inventario : null;
    if (warehouse.length) {
      this.filters.global.gstSelecStore = 'S';
      this.filters.global.cstStoreNumber = warehouse;
    } else {
      this.filters.global.cstStoreNumber = null;
    }

    if (autorityState.length) {
      this.filters.global.gstSelecEntfed = 'S';
      this.filters.global.otKey = autorityState;
    } else {
      this.filters.global.otKey = null;
    }

    if (goodState.length) {
      this.filters.global.gstSelecEntfedOne = 'S';
      this.filters.global.otKeyOne = goodState;
    } else {
      this.filters.global.otKeyOne = null;
    }

    if (cordination.length) {
      this.filters.global.gstSelecDeleg = 'S';
      this.filters.global.delegationNumber = cordination;
    } else {
      this.filters.global.delegationNumber = null;
    }

    if (this.formCheckbox.controls.goodIrre.value) {
      this.filters.parval.chkIrregular = 'S';
    }
  }

  transferFilter() {
    const form = this.form.getRawValue();
    const { transfers, transmitters, autorities } = form;

    const all = [...transfers, ...transmitters, ...autorities];
    if (!transmitters.length && !autorities.length) {
      if (transfers.length) {
        this.filters.global.gstSelecProced = 'S';
        this.filters.global.selecTransferee = 'S';
        this.filters.global.ctTransfereeNumber = transfers.map(t => Number(t));
      } else {
        this.filters.global.ctTransfereeNumber = null;
      }
      return;
    }
    if (!autorities.length) {
      if (transfers.length) {
        this.filters.global.gstSelecProced = 'S';
        this.filters.global.selecTransferee = 'S';
        this.filters.global.csTransfereeNumber = transfers.map(t => Number(t));
      } else {
        this.filters.global.csTransfereeNumber = null;
      }

      if (transmitters.length) {
        this.filters.global.selecStation = 'S';
        this.filters.global.csStationNumber = transmitters;
      } else {
        this.filters.global.csStationNumber = null;
      }
      return;
    }
    if (all.length) {
      this.filters.global.gstSelecProced = 'S';
    }
    if (transfers.length) {
      this.filters.global.selecTransferee = 'S';
      this.filters.global.caTransfereeNumber = transfers.map(t => Number(t));
    } else {
      this.filters.global.caTransfereeNumber = null;
    }
    if (transmitters.length) {
      this.filters.global.selecStation = 'S';
      this.filters.global.caStationNumber = transmitters;
    } else {
      this.filters.global.caStationNumber = null;
    }
    if (autorities.length) {
      this.filters.global.selecAuthority = 'S';
      this.filters.global.caAuthorityNumber = autorities;
    } else {
      this.filters.global.caAuthorityNumber = null;
    }
  }

  certificatesFilter() {
    const form = this.form.getRawValue();
    const {
      receptionFrom,
      receptionTo,
      devolutionDateFrom,
      devolutionDateTo,
      statusChaangeTo,
      statusChangeFrom,
      certificate,
      receptionStatus,
      eventNum,
      historicalProcess,
    } = form;
    this.filters.notification.receptionDate = receptionFrom
      ? format(new Date(receptionFrom), 'yyyy-MM-dd')
      : null;
    this.filters.notification.receptionEndDate = receptionTo
      ? format(new Date(receptionTo), 'yyyy-MM-dd')
      : null;
    this.filters.parval.destinationDateIni = devolutionDateFrom
      ? format(new Date(devolutionDateFrom), 'yyyy-MM-dd')
      : null;
    this.filters.parval.destinationDateFin = devolutionDateTo
      ? format(new Date(devolutionDateTo), 'yyyy-MM-dd')
      : null;
    this.filters.parval.changeDateIni = statusChangeFrom
      ? format(new Date(statusChangeFrom), 'yyyy-MM-dd')
      : null;
    this.filters.parval.changeDateFin = statusChaangeTo
      ? format(new Date(statusChaangeTo), 'yyyy-MM-dd')
      : null;
    this.filters.parval.actKey = certificate;
    this.filters.parval.statusChange =
      receptionStatus.length > 0 ? receptionStatus : null;
    this.filters.parval.alienationProcessNumber = eventNum;
    this.filters.parval.processChange = historicalProcess
      ? [historicalProcess]
      : null;
  }

  expNotDicFilter() {
    const form = this.form.getRawValue();
    const {
      expedientNum,
      flyerNum,
      judgeNum,
      flyerType,
      officeDate,
      protection,
      criminalCase,
      publicMin,
      extOfficeNum,
      previusInvestigation,
      dictum,
      criminalCause,
      indicatedName,
    } = form;
    this.filters.parval.proceedingsNumber = expedientNum.length
      ? expedientNum
      : null;
    this.filters.notification.flierNumber = flyerNum.length ? flyerNum : null;
    this.filters.notification.judgedNumber = judgeNum;
    this.filters.notification.flierType = flyerType;
    this.filters.notification.externalOfficeDate = officeDate
      ? format(new Date(officeDate), 'yyyy-MM-dd')
      : null;
    this.filters.notification.protectionKey = protection;
    this.filters.notification.touchPenaltyKey = criminalCase;
    this.filters.notification.minpubNumber = publicMin;
    this.filters.notification.externalOfficeKey = extOfficeNum;
    this.filters.notification.previousAscertainment = previusInvestigation;
    this.filters.parval.dictum = dictum;
    this.filters.notification.nameIndicated = indicatedName;
    this.filters.notification.criminalCase = criminalCause;
  }

  clasificationFilter() {
    const form = this.form.getRawValue();
    const { types, subtypes, ssubtypes, sssubtypes } = form;
    if (types.length) {
      this.filters.clasifGood.selecType = 'S';
      this.filters.clasifGood.typeNumber = types.map(type => type.id);
    }
    if (subtypes.length) {
      this.filters.clasifGood.selecStype = 'S';
      this.filters.clasifGood.subTypeNumber = subtypes.map(
        subtype => subtype.id
      );
    }

    if (ssubtypes.length) {
      this.filters.clasifGood.selecSstype = 'S';
      this.filters.clasifGood.ssubTypeNumber = ssubtypes.map(
        ssubtype => ssubtype.id
      );
    }

    if (sssubtypes.length) {
      this.filters.clasifGood.selecSsstype = 'S';
      this.filters.clasifGood.clasifGoodNumber = sssubtypes;
    }
  }

  goodDataFilter() {
    const form = this.form.getRawValue();
    const {
      goodNum,
      process,
      targetIdentifier,
      photoDate,
      status,
      withPhoto,
      menageFather,
      identifier,
      valueFrom,
      valueTo,
      siabiInventory,
      cisiInventory,
      description,
      attributes,
      movableIventory,
    } = form;

    this.filters.parval.goodNumber = goodNum?.length ? goodNum : null;
    this.filters.parval.proExtDom = process?.length ? process : null;
    this.filters.parval.label = targetIdentifier;
    this.filters.parval.photoDate = photoDate
      ? format(new Date(photoDate), 'yyyy-MM-dd')
      : null;
    this.filters.parval.status = status.length ? status : null;
    this.filters.parval.photography = withPhoto;
    this.filters.parval.goodFatherMenageNumber = menageFather;
    this.filters.parval.identifier = identifier;
    this.filters.parval.tValueIni = valueFrom;
    this.filters.parval.tValueFin = valueTo;
    this.filters.parval.inventorySiabiId = siabiInventory;
    this.filters.parval.propertyCisiId = cisiInventory;
    this.filters.parval.tDescription = description;
    this.filters.parval.tAttribute = attributes;
    this.filters.parval.invCurrentSiabi = movableIventory;
  }

  getAll() {
    this.showTable = true;
    this.params.removeAllFilters();
    this.getGoods();
  }

  resetFilters() {
    this.form = this.fb.group(new GoodTrackerForm());
    // this.searchGoods();
    this.goods = [];
    this.totalItems = 0;
  }
}
