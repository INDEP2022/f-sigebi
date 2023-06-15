import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { AppraiseService } from 'src/app/core/services/ms-appraise/appraise.service';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-data-valuations',
  templateUrl: './data-valuations.component.html',
  styles: [],
})
export class DataValuationsComponent extends BasePage implements OnInit {
  @Input() goodId: number;
  list: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(private readonly appraiseService: AppraiseService) {
    super();
    this.settings.columns = {
      noRequest: {
        title: 'No. Solicitud',
        type: 'number',
        sort: false,
      },
      valuationDate: {
        title: 'Fecha Avaluo',
        type: 'string',
        sort: false,
      },
      validityDate: {
        title: 'Fecha Vigencia',
        type: 'string',
        sort: false,
      },
      cost: {
        title: 'Costo',
        type: 'string',
        sort: false,
      },
      valuationValue: {
        title: 'Valor Avaluo',
        type: 'string',
        sort: false,
      },
      phisicValue: {
        title: 'Valor Fisico',
        type: 'string',
        sort: false,
      },
      comercializationValue: {
        title: 'Valor Comercializacion',
        type: 'string',
        sort: false,
      },
      landValue: {
        title: 'Valor Terreno',
        type: 'string',
        sort: false,
      },
      buildingValue: {
        title: 'Valor Const.',
        type: 'string',
        sort: false,
      },
      instValue: {
        title: 'Valor Inst.',
        type: 'string',
        sort: false,
      },
      oportunityValue: {
        title: 'Valor Oportunidad',
        type: 'string',
        sort: false,
      },
      unitValue: {
        title: 'Valor Unitario',
        type: 'string',
        sort: false,
      },
      maqEquiValue: {
        title: 'Valor Maq. Equipo',
        type: 'string',
        sort: false,
      },
    };
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.searchDataValuations(2409234));
  }

  searchDataValuations(idGood: number) {
    this.loading = true;
    this.params.getValue()['filter.noGood'] = `$eq:${idGood}`;
    this.params.getValue()['order'] = 'DESC';
    console.log(this.params.getValue());
    this.appraiseService.getAllAvaluoXGood(this.params.getValue()).subscribe({
      next: response => {
        console.log(response);
        this.list = response.data.map(apprise => {
          return {
            noRequest: apprise.requestXAppraisal.id,
            valuationDate: apprise.appraisalDate,
            validityDate: apprise.requestXAppraisal.requestDate,
            cost: apprise.cost,
            valuationValue: apprise.valueAppraisal,
            phisicValue: apprise.vPhysical,
            comercializationValue: apprise.vCommercial,
            landValue: apprise.vTerrain,
            buildingValue: apprise.vConst,
            instValue: apprise.vInst,
            oportunityValue: apprise.vOpportunity,
            unitValue: apprise.vUnitaryM2,
            maqEquiValue: apprise.vMachEquip,
          };
        });
        this.totalItems = response.count;
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        console.log(err);
      },
    });
  }
}
