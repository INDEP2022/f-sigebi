import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { GUIDELINES_COLUMNS } from '../guidelines/guidelines-columns';
import { IGuideline } from './../../../../core/models/requests/guidelines.model';
import { GuidelinesService } from 'src/app/core/services/guidelines/guideline.service';

@Component({
  selector: 'app-guidelines-view',
  templateUrl: './guidelines-view.component.html',
  styleUrls: ['./guidelines-view.component.scss'],
})
export class GuidelinesViewComponent extends BasePage implements OnInit {
  @Input() requestId: number;
  guidelinesInfo: any = {};
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  guidelinesColumns: any[] = [];
  guidelinesSettings = {
    ...TABLE_SETTINGS,
    actions: false,
  };

  loadGuidelines = [];

  guidelinesData = [
    {
      id: 1,
      guideline: 'ACTA DE TRANSFERENCIA INDEP',
      firstRevision: 'N/A',
      firstRevisionObserv: '',
      secondRevision: 'N/A',
      secondRevisionObserv: '',
    },
    {
      id: 2,
      guideline: 'SOLICITUD DE PAGO RESARCIMIENTO (INSTRUCCIÓN DE PAGO ANCEA)',
      firstRevision: 'N/A',
      firstRevisionObserv: '',
      secondRevision: 'N/A',
      secondRevisionObserv: '',
    },
    {
      id: 3,
      guideline: 'COPIA CERTIFICADA DE LA RESOLUCIÓN EMITIDA POR LA AUTORIDAD QUE ORDENE EL PAGO DE RESARCMIENTO',
      firstRevision: 'N/A',
      firstRevisionObserv: '',
      secondRevision: 'N/A',
      secondRevisionObserv: '',
    },
    {
      id: 4,
      guideline: 'DOCUMENTO EN EL CUAL SE INDICA EL MONTO A PAGAR',
      firstRevision: 'N/A',
      firstRevisionObserv: '',
      secondRevision: 'N/A',
      secondRevisionObserv: '',
    },
  ];

  constructor(private guidelinesService: GuidelinesService) {
    super();
    this.guidelinesSettings.columns = GUIDELINES_COLUMNS;
  }

  ngOnInit(): void {
    this.getGuidelines();
  }

  getData(data) {
    this.guidelinesColumns = data;
    this.totalItems = this.guidelinesColumns.length;
  }

  getGuidelines() {

    const params = new ListParams();
    params['filter.applicationId'] = `$eq:${this.requestId}`;
    this.guidelinesService.getGuidelines(params).subscribe({
      next: resp => {
        this.loadGuidelines = resp.data;

        if (this.loadGuidelines.length > 0) {

          this.guidelinesData.forEach(element => {

            let item = this.loadGuidelines.find(x => x.lineamentId == element.id);

            element.firstRevision = item.meetsRevision1;
            element.secondRevision = item.meetsRevision2;
            element.firstRevisionObserv = item.missingActionsRev1;
            element.secondRevisionObserv = item.missingActionsRev2;

          });

          this.guidelinesInfo = this.loadGuidelines[0];

          this.guidelinesInfo.firstRevisionDate = new Date(this.loadGuidelines[0].dateCreation);
          this.guidelinesInfo.secondRevisionDate = new Date(this.loadGuidelines[0].dateModification);
          this.guidelinesInfo.observations = this.loadGuidelines[0].missingActionsRev1;

        }



        this.getData(this.guidelinesData);

      },
      error: err => {
        this.getData([]);
      }
    });
  }

}
