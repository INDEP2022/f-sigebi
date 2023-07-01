import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ParameterIndicatorsService } from 'src/app/core/services/catalogs/parameters-indicators.service';
import { MsIndicatorGoodsService } from 'src/app/core/services/ms-indicator-goods/ms-indicator-goods.service';
import { ProceedingsDetailDeliveryReceptionService } from 'src/app/core/services/ms-proceedings';
import { IParametersIndicators } from './../../../../../../core/models/catalogs/parameters-indicators.model';

@Component({
  selector: 'app-cants',
  templateUrl: './cants.component.html',
  styleUrls: ['./cants.component.scss'],
})
export class CantsComponent implements OnInit {
  @Input() id: string;
  @Input() typeProceeding: string;
  @Input() goodsCant: number;
  @Input() set updateData(value: any) {
    this.getData();
  }
  @Input() bienesRas: number = 0;
  @Input() expedientesRas: number = 0;
  @Input() dictamenesRas: number = 0;
  // form: FormGroup;
  files: number = 0;
  dictamenes: number = 0;
  proceedingIndicators: IParametersIndicators[];
  constructor(
    private fb: FormBuilder,
    private detailService: ProceedingsDetailDeliveryReceptionService,
    private indicatorGoodService: MsIndicatorGoodsService,
    private indicatorService: ParameterIndicatorsService
  ) {
    // this.form = this.fb.group({
    //   goods: [0],
    //   files: [0],
    //   dictamenes: [0],
    // });
  }

  ngOnInit(): void {
    // this.getData();
  }

  private getData() {
    if (this.id) {
      this.detailService.getExpedients(this.id, this.typeProceeding).subscribe({
        next: response => {
          this.files = +response;
          // this.form.get('files').setValue(response);
        },
      });
      const params = new ListParams();
      params.limit = 0;
      params['filter.typeActa'] = this.typeProceeding;
      this.indicatorService.getAll(params).subscribe({
        next: response => {
          // this.proceedingIndicators = response.data.filter(
          //   indicator => indicator.description === 'ENTREGA FISICA'
          // );
          // const indicator =
          //   this.proceedingIndicators.find(
          //     x => x.typeActa === this.typeProceeding
          //   ) ?? null;
          if (response.data && response.data.length > 0)
            this.indicatorGoodService
              .getCountDictationByAct(response.data[0].areaProcess, this.id)
              .subscribe({
                next: response => {
                  // console.log(response);
                  this.dictamenes = +response;
                  // this.form.get('dictamenes').setValue(response);
                },
              });
        },
      });
    }
  }
}
