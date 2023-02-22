import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { CatFinancialIndicatorsModalComponent } from '../cat-financial-indicators-modal/cat-financial-indicators-modal.component';
import { FINANCIAL_INDICATORS_COLUMNS } from './financial-indicators-columns';
//models
import { IFinancialIndicators } from 'src/app/core/models/catalogs/financial-indicators-model';
//services
import { FinancialIndicatorsService } from 'src/app/core/services/catalogs/financial-indicators-service';

@Component({
  selector: 'app-cat-financial-indicators',
  templateUrl: './cat-financial-indicators.component.html',
  styleUrls: [],
})
export class CatFinancialIndicatorsComponent
  extends BasePage
  implements OnInit
{
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  financialIndicators: IFinancialIndicators[] = [];

  constructor(
    private modalService: BsModalService,
    private financialIndicatorsService: FinancialIndicatorsService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: false,
        position: 'right',
      },
      columns: { ...FINANCIAL_INDICATORS_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getAttributesFinancialInfo());
  }

  getAttributesFinancialInfo() {
    this.loading = true;
    this.financialIndicatorsService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.financialIndicators = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(financialIndicators?: IFinancialIndicators) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      financialIndicators,
      callback: (next: boolean) => {
        if (next) this.getAttributesFinancialInfo();
      },
    };
    this.modalService.show(CatFinancialIndicatorsModalComponent, modalConfig);
  }

  showDeleteAlert(financialIndicators: IFinancialIndicators) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(financialIndicators.id);
      }
    });
  }

  delete(id: number) {
    this.financialIndicatorsService.remove(id).subscribe({
      next: () => this.getAttributesFinancialInfo(),
    });
  }
}
