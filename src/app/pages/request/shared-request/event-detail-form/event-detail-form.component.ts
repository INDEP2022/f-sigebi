import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { GoodTypeService } from 'src/app/core/services/catalogs/good-type.service';
import { ProgrammingRequestService } from 'src/app/core/services/ms-programming-request/programming-request.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
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
  params = new BehaviorSubject<ListParams>(new ListParams());
  constructor(
    private fb: FormBuilder,
    private programmingService: ProgrammingRequestService,
    private goodTypeService: GoodTypeService
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
          /*Promise.all(showTypeGood).then((info: any) => {
          }); */
          /*

          
          console.log('response', response); */
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
