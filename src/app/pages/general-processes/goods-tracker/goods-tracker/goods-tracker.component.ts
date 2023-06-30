import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { format } from 'date-fns';
import { BehaviorSubject, skip, takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ITrackedGood } from 'src/app/core/models/ms-good-tracker/tracked-good.model';
import { GoodTrackerService } from 'src/app/core/services/ms-good-tracker/good-tracker.service';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { BasePage } from 'src/app/core/shared/base-page';
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

  constructor(
    private fb: FormBuilder,
    private goodTrackerService: GoodTrackerService,
    private notificationService: NotificationService
  ) {
    super();
  }

  ngOnInit(): void {
    this._params.pipe(takeUntil(this.$unSubscribe), skip(1)).subscribe(next => {
      this.params.limit = next.limit;
      this.params.page = next.page;
      this.getGoods();
    });
  }

  async searchGoods(params: any) {
    this.params.removeAllFilters();
    const form = this.form.value;
    const filledFields = Object.values(form).filter(value => {
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return value ? true : false;
    });
    if (!filledFields.length) {
      this.alert(
        'warning',
        'Atención',
        'Debe ingresar almenos un parámetro de búsqueda'
      );
      return;
    }
    this.getGoods();
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

  getGoods() {
    this.loading = true;
    this.filters = new GoodTrackerMap();
    this.mapFilters();
    this.scrollTable.nativeElement.scrollIntoView();
    this.goodTrackerService
      .trackGoods(this.filters, this._params.getValue())
      .subscribe({
        next: res => {
          this.loading = false;
          this.goods = res.data;
          this.totalItems = res.count;
        },
        error: error => {
          this.loading = false;
          if (
            error.error.message ==
            'Debe colocar por lo menos un parámetro de búsqueda'
          ) {
            this.alert(
              'warning',
              'Atención',
              'Debe ingresar almenos un parámetro de búsqueda'
            );
            return;
          }
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

    const {
      transfers,
      transmitters,
      autorities,
      warehouse,
      cordination,
      autorityState,
      goodState,
    } = form;

    const all = [...transfers, ...transmitters, ...autorities];
    if (all.length) {
      this.filters.global.gstSelecProced = 'S';
    }
    //     selecAuthority;
    //     selecStation;
    // selecTransferee
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
    this.filters.parval.statusChange = receptionStatus
      ? [receptionStatus]
      : null;
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
}
