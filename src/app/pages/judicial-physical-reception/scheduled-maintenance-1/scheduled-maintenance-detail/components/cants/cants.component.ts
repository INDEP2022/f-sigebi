import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ParameterIndicatorsService } from 'src/app/core/services/catalogs/parameters-indicators.service';
import { MsIndicatorGoodsService } from 'src/app/core/services/ms-indicator-goods/ms-indicator-goods.service';
import { ProceedingsDetailDeliveryReceptionService } from 'src/app/core/services/ms-proceedings';
import { IParametersIndicators } from './../../../../../../core/models/catalogs/parameters-indicators.model';

@Component({
  selector: 'app-cants',
  templateUrl: './cants.component.html',
  styles: [],
})
export class CantsComponent implements OnInit {
  @Input() id: string;
  @Input() typeProceeding: string;
  @Input() set updateData(value: any) {
    this.getData();
  }
  form: FormGroup;
  proceedingIndicators: IParametersIndicators[];
  constructor(
    private fb: FormBuilder,
    private detailService: ProceedingsDetailDeliveryReceptionService,
    private indicatorGoodService: MsIndicatorGoodsService,
    private indicatorService: ParameterIndicatorsService
  ) {
    this.form = this.fb.group({
      goods: [0],
      files: [0],
      dictamenes: [0],
    });
  }

  ngOnInit(): void {
    // this.getData();
  }

  private getData() {
    const params = new ListParams();
    params.limit = 100;
    this.indicatorService.getAll(params).subscribe({
      next: response => {
        this.proceedingIndicators = response.data.filter(
          indicator => indicator.description === 'ENTREGA FISICA'
        );
        const indicator =
          this.proceedingIndicators.find(
            x => x.typeActa === this.typeProceeding
          ) ?? null;
        if (indicator)
          this.indicatorGoodService
            .getCountDictationByAct(indicator.areaProcess, this.id)
            .subscribe({
              next: response => {
                this.form.get('dictamenes').setValue(response);
              },
            });
      },
    });
    if (this.id) {
      this.detailService.getExpedients(this.id).subscribe({
        next: response => {
          this.form.get('files').setValue(response);
        },
      });
    }
  }
}
