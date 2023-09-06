import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { GenericService } from 'src/app/core/services/catalogs/generic.service';
import { GoodTypeService } from 'src/app/core/services/catalogs/good-type.service';
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';
import { ProgrammingRequestService } from 'src/app/core/services/ms-programming-request/programming-request.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { IprogrammingDelivery } from 'src/app/pages/siab-web/sami/receipt-generation-sami/receipt-table-goods/ireceipt';
import { IGoodDelivery } from '../../scheduling-deliveries/scheduling-deliveries-form/good-delivery.interface';
import { SCHEDULING_DELIVERIES_COLUMNS } from './columns/scheduling-deliveries-columns';

@Component({
  selector: 'app-event-detail-form',
  templateUrl: './event-detail-form.component.html',
  styles: [
    `
      a.text-color:hover,
      a.text-color:active {
        color: #9d2449;
        cursor: pointer;
      }
    `,
  ],
})
export class EventDetailFormComponent extends BasePage implements OnInit {
  @Input() op: number;
  paragraphs = new LocalDataSource();
  searchForm: FormGroup = new FormGroup({});
  showDetails: boolean = true;
  showSearch: boolean = false;
  totalItems: number = 0;
  nameTypeEvent: string = '';
  nameStore: string = '';
  programmingDeliveryInfo: IprogrammingDelivery;
  params = new BehaviorSubject<ListParams>(new ListParams());
  constructor(
    private fb: FormBuilder,
    private programmingService: ProgrammingRequestService,
    private goodTypeService: GoodTypeService,
    private genericService: GenericService,
    private goodsQueryService: GoodsQueryService
  ) {
    super();

    this.settings = {
      ...this.settings,
      columns: SCHEDULING_DELIVERIES_COLUMNS,
      edit: { editButtonContent: 'Documentos' },
    };
  }

  ngOnInit(): void {
    this.prepareForm();
    this.showGoodDeliveryProg();
    this.getInfoProgrammingDelivery();
  }

  getInfoProgrammingDelivery() {
    const params = new BehaviorSubject<ListParams>(new ListParams());
    params.getValue()['filter.id'] = 16896;
    this.programmingService
      .getProgrammingDelivery(params.getValue())
      .subscribe({
        next: response => {
          console.log('Programaciones de entrega', response);
          if (response.data[0].startDate)
            response.data[0].startDate = moment(
              response.data[0].startDate
            ).format('DD/MM/YYYY HH:mm:ss');
          if (response.data[0].endDate)
            response.data[0].endDate = moment(response.data[0].endDate).format(
              'DD/MM/YYYY HH:mm:ss'
            );

          if (response.data[0].typeEvent) {
            this.getNameTypeEvent(response.data[0].typeEvent);
          }

          if (response.data[0].store) {
            this.getNameStore(response.data[0].store);
          }
          this.programmingDeliveryInfo = response.data[0];
        },
        error: error => {},
      });
  }

  getNameTypeEvent(typeEvent: number) {
    const params = new BehaviorSubject<ListParams>(new ListParams());
    params.getValue()['filter.name'] = 'Evento Entregas';
    params.getValue()['filter.keyId'] = typeEvent;
    this.genericService.getAll(params.getValue()).subscribe({
      next: response => {
        console.log('tipo evento', response);
        this.nameTypeEvent = response.data[0].description;
      },
      error: error => {},
    });
  }

  getNameStore(store: number) {
    const params = new BehaviorSubject<ListParams>(new ListParams());
    params.getValue()['filter.organizationCode'] = store;
    this.goodsQueryService.getCatStoresView(params.getValue()).subscribe({
      next: response => {
        console.log('almacenes', response);
        this.nameStore = response.data[0].name;
      },
      error: error => {},
    });
  }

  showGoodDeliveryProg() {
    const params = new BehaviorSubject<ListParams>(new ListParams());
    params.getValue()['filter.programmingDeliveryId'] = 16896;
    this.programmingService
      .getGoodsProgrammingDelivery(params.getValue())
      .subscribe({
        next: async response => {
          const showTypeGood: any = await this.showTypeGood(response.data);
          this.paragraphs.load([showTypeGood]);
          this.totalItems = response.count;
        },
        error: error => {},
      });
  }

  showTypeGood(infoGood: IGoodDelivery[]) {
    return new Promise((resolve, reject) => {
      infoGood.map(async good => {
        const infoTypeGood: any = await this.getGoodType(good.typeGood);
        if (infoTypeGood) {
          good.typeGoodName = infoTypeGood;

          resolve(good);
        }

        //good.typeGoodName = infoTypeGood;
        //resolve(good);
      });
    });
  }

  getGoodType(goodTypeNumber: number) {
    return new Promise((resolve, reject) => {
      const params = new BehaviorSubject<ListParams>(new ListParams());
      params.getValue()['filter.id'] = goodTypeNumber;
      this.goodTypeService.getAll(params.getValue()).subscribe({
        next: response => {
          resolve(response.data[0].nameGoodType);
        },
        error: error => {},
      });
    });
  }

  prepareForm() {
    this.searchForm = this.fb.group({
      numberGestion: [null],
      numberSae: [null],
      numberInventory: [null],
      goodDescription: [null, [Validators.pattern(STRING_PATTERN)]],
      item: [null, [Validators.pattern(STRING_PATTERN)]],
      quantityGoods: [null],
      typeGood: [null, [Validators.pattern(STRING_PATTERN)]],
      unitOfMeasurement: [null],
      origin: [null, [Validators.pattern(STRING_PATTERN)]],
    });
  }

  showDocument() {
    alert('Documentos');
  }
}
