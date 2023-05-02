import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { GUIDELINES_COLUMNS } from '../guidelines/guidelines-columns';
import { IGuideline } from './../../../../core/models/requests/guidelines.model';

@Component({
  selector: 'app-guidelines-view',
  templateUrl: './guidelines-view.component.html',
  styleUrls: ['./guidelines-view.component.scss'],
})
export class GuidelinesViewComponent extends BasePage implements OnInit {
  @Input() requestId: number;
  guidelinesInfo: IGuideline;
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  guidelinesColumns: any[] = [];
  guidelinesSettings = {
    ...TABLE_SETTINGS,
    actions: false,
  };

  guidelinesTestData = [
    {
      guideline: 'ACTA DE TRANSFERENCIA SAE',
      firstRevision: 'SI',
      firstRevisionObserv: 'EJEMPLO OBSERVACION 1',
      secondRevision: 'N/A',
      secondRevisionObserv: 'EJEMPLO OBSERVACION 2',
    },
    {
      guideline: 'SOLICITUD DE PAGO RESARCIMIENTO (INSTRUCCIÓN DE PAGO ANCEA)',
      firstRevision: '',
      firstRevisionObserv: '',
      secondRevision: '',
      secondRevisionObserv: '',
    },
    {
      guideline:
        'COPIA CERTIFICADA DE LA RESOLUCIÓN EMITIDA POR LA AUTORIDAD QUE ORDENE EL PAGO DE RESARCMIENTO',
      firstRevision: '',
      firstRevisionObserv: '',
      secondRevision: '',
      secondRevisionObserv: '',
    },
    {
      guideline: 'DOCUMENTO EN EL CUAL SE INDICA EL MONTO A PAGAR',
      firstRevision: '',
      firstRevisionObserv: '',
      secondRevision: '',
      secondRevisionObserv: '',
    },
  ];

  constructor() {
    super();
    this.guidelinesSettings.columns = GUIDELINES_COLUMNS;
  }

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.guidelinesColumns = this.guidelinesTestData;
    this.totalItems = this.guidelinesColumns.length;
    this.guidelinesInfo = {
      firstRevisionDate: '14/07/2018',
      secondRevisionDate: '16/11/2018',
      observations: 'EJEMPLO OBSERVACIONES',
    };
  }
}
