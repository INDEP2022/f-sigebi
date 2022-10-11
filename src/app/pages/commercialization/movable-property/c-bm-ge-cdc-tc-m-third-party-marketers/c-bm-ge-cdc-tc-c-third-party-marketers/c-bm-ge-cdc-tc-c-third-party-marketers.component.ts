import { Component, OnInit } from '@angular/core';
import { BasePage } from 'src/app/core/shared/base-page';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { EVENT_TYPE_THIRD_COLUMNS } from './event-types-third-columns';
import { THIRD_PARTY_MARKETERS_COLUMNS } from './third-party-marketers-columns';
import { THIRD_PARTY_MARKETERS2_COLUMNS } from './third-party-marketers2-columns';


@Component({
  selector: 'app-c-bm-ge-cdc-tc-c-third-party-marketers',
  templateUrl: './c-bm-ge-cdc-tc-c-third-party-marketers.component.html',
  styles: [
  ]
})
export class CBmGeCdcTcCThirdPartyMarketersComponent extends BasePage implements OnInit {

  settings1 = {...TABLE_SETTINGS};
  settings2 = {...TABLE_SETTINGS};
  settings3 = {...TABLE_SETTINGS};

  data2 : any;
  data3 : any;
  constructor() {
    super();
    this.settings1.columns = THIRD_PARTY_MARKETERS_COLUMNS;
    this.settings1.actions.add = false;
    this.settings1.actions.edit = false;
    this.settings1.actions.delete = false;

    this.settings2.columns = THIRD_PARTY_MARKETERS2_COLUMNS;
    this.settings2.actions.add = false;
    this.settings2.actions.edit = false;
    this.settings2.actions.delete = false;

    this.settings3.columns = EVENT_TYPE_THIRD_COLUMNS;
    this.settings3.actions.add = false;
    this.settings3.actions.edit = false;
    this.settings3.actions.delete = false;
  }

  ngOnInit(): void {
  }

  //Tabla1
  data1 = [
    {
      id: '1',
      nomRazon: 'DAE',
      rutCalculo: 'CALCULO X RANGO'
    },
    {
      id: '2',
      nomRazon: 'EBAY',
      rutCalculo: 'CALCULO RANGO ESP'
    },
    {
      id: '3',
      nomRazon: 'VENTURA',
      rutCalculo: 'CALCULO TOTAL'
    },
    {
      id: '4',
      nomRazon: 'DAE 2010',
      rutCalculo: 'CALCULO TOTAL'
    },
  ]

}
