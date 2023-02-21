import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, map, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IThirdPartyCompany } from 'src/app/core/models/catalogs/third-party-company.model';
import { BasePage } from 'src/app/core/shared/base-page';
//Columns
import { COMI_XTHIRC_COLUMNS, THIRD_COLUMNS, TYPE_EVENT_THIRD_COLUMNS } from './columns';
//Services
import { ThirdPartyService } from 'src/app/core/services/ms-thirdparty/thirdparty.service';
//Models
import { IComiXThird, IThirdParty, ITypeEventXtercomer } from 'src/app/core/models/ms-thirdparty/third-party.model';
import { TypeEventXterComerService } from 'src/app/core/services/ms-thirdparty/type-events-xter-comer.service';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { ComiXThirdService } from 'src/app/core/services/ms-thirdparty/comi-xthird.service';

@Component({
  selector: 'app-third-party-marketers',
  templateUrl: './third-party-marketers.component.html',
  styles: [],
})
export class ThirdPartyMarketersComponent extends BasePage implements OnInit {

  data: any;
  params = new BehaviorSubject<ListParams>(new ListParams());
  params2 = new BehaviorSubject<ListParams>(new ListParams());
  params3 = new BehaviorSubject<ListParams>(new ListParams());

  totalItems: number = 0;
  totalItems2: number = 0;
  totalItems3: number = 0;

  thirdPartyList: IThirdParty[] = [];
  typeEventList: ITypeEventXtercomer[] = [];
  amountList: IComiXThird[] = [];

  thirPartys: IThirdParty;
  typeEvents: ITypeEventXtercomer;
  amounts: IComiXThird;
  
  settings2;
  settings3;
  
  constructor(private thirdPartyService:ThirdPartyService, private typeEventXterComerService:TypeEventXterComerService, private comiXThirdService:ComiXThirdService) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...THIRD_COLUMNS },
    }; 
    
    this.settings2 = {
      ...this.settings,
      actions: false,
      columns: { ...TYPE_EVENT_THIRD_COLUMNS },
    };

    this.settings3 = {
      ...this.settings,
      actions: false,
      columns: { ...COMI_XTHIRC_COLUMNS },
    };

  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getThirdPartyAll());
  }

  getThirdPartyAll(){
    this.loading = true;
    this.thirdPartyService.getAll(this.params.getValue()).subscribe({
      next: response => {
        console.log(response);
        this.thirdPartyList = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        console.log(error);
      },
    });
  }

  rowsSelected(event: any) {
    this.totalItems2 = 0;
    this.typeEventList = [];
    this.thirPartys = event.data;
    this.params2
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getTypeEvent(this.thirPartys));
  }

  getTypeEvent(thirdParty: IThirdParty){
  this.loading = true;
      this.typeEventXterComerService
        .getById(thirdParty.id).pipe(map((data2:any) => {
            let list: IListResponse<ITypeEventXtercomer> = {} as IListResponse<ITypeEventXtercomer>;
            const array2: ITypeEventXtercomer[] = [{...data2}]
            list.data = array2;
            return list;
        }))
        .subscribe({
          next: response => {
            console.log(response);
            this.typeEventList = response.data;
            this.totalItems2 = response.count;
            this.loading = false;
          },
          error: error => (this.loading = false),
        });
    }

    rowsSelected2(event: any) {
    this.totalItems3 = 0;
    this.amountList = [];
    this.typeEvents = event.data;
    this.params3
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getAmount(this.typeEvents));
  }

  getAmount(typeEvent: ITypeEventXtercomer){
    this.loading = true;
    this.comiXThirdService
      .getById(typeEvent.thirdPartyId)
      .subscribe({
        next: response => {
          console.log(response);
          this.amountList = response.data;
          this.totalItems3 = response.count;
          this.loading = false;
        },
        error: error => (this.loading = false),
      });
  }

}
