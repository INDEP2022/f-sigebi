import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { CAPTURE_LINES_COLUMNS, EVENT_COLUMNS } from './capture-lines-columns';

@Component({
  selector: 'app-capture-lines-main',
  templateUrl: './capture-lines-main.component.html',
  styles: [],
})
export class CaptureLinesMainComponent extends BasePage implements OnInit {
  selectedEvent: any[] = [];
  eventParams = new BehaviorSubject<ListParams>(new ListParams());
  clParams = new BehaviorSubject<ListParams>(new ListParams());
  eventTotalItems: number = 0;
  clTotalItems: number = 0;
  eventColumns: any[] = [];
  clColumns: any[] = [];
  eventSettings = {
    ...TABLE_SETTINGS,
    hideSubHeader: false,
    actions: false,
  };
  clSettings = {
    ...TABLE_SETTINGS,
    hideSubHeader: false,
    actions: false,
  };

  eventTestData = [
    {
      event: 1010,
      cve: 'GR1261O',
      bmxClient: 'GTE884',
      userCreate: 'AMORALES',
      date: '14/09/2021',
    },
    {
      event: 2020,
      cve: 'GR1261O',
      bmxClient: 'GTE884',
      userCreate: 'RVILLEDA',
      date: '14/09/2021',
    },
    {
      event: 3030,
      cve: 'GR1261O',
      bmxClient: 'GTE884',
      userCreate: 'VMENDOZA',
      date: '14/09/2021',
    },
    {
      event: 4040,
      cve: 'GR1261O',
      bmxClient: 'GTE884',
      userCreate: 'PALVAREZ',
      date: '14/09/2021',
    },
    {
      event: 5050,
      cve: 'GR1261O',
      bmxClient: 'GTE884',
      userCreate: 'JMONCADA',
      date: '14/09/2021',
    },
  ];

  clTestData = [
    {
      palette: 1,
      captureLine: 'GSG5189Q9HIPB04',
    },
    {
      palette: 2,
      captureLine: 'LBNGEG61648HT21',
    },
    {
      palette: 3,
      captureLine: 'IBMS9213RSBN44HT',
    },
    {
      palette: 4,
      captureLine: 'MINEW842RSBN914E',
    },
    {
      palette: 5,
      captureLine: 'PANU9341BRAH6574',
    },
  ];

  constructor(private excelService: ExcelService) {
    super();
    this.eventSettings.columns = EVENT_COLUMNS;
    this.clSettings.columns = CAPTURE_LINES_COLUMNS;
  }

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.eventColumns = this.eventTestData;
    this.eventTotalItems = this.eventColumns.length;
  }

  selectEvent(event: any[]) {
    this.selectedEvent = event;
  }

  execute() {
    this.clColumns = this.clTestData;
    this.clTotalItems = this.clColumns.length;
  }

  exportToExcel() {
    const filename: string = 'Líneas_de_Captura';
    this.excelService.export(this.clColumns, { filename });
  }
}
