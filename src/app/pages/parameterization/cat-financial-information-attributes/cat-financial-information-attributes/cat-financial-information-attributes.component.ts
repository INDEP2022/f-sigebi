import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { CatFinancialInformationAttributesModalComponent } from '../cat-financial-information-attributes-modal/cat-financial-information-attributes-modal.component';
import { FINANCIAL_INFO_ATTR_COLUMNS } from './financial-information-attributes-columns';
//Models
import { IAttributesFinancialInfo } from 'src/app/core/models/catalogs/attributes-financial-info-model';
//Services
import { AttributesInfoFinancialService } from 'src/app/core/services/catalogs/attributes-info-financial-service';

@Component({
  selector: 'app-cat-financial-information-attributes',
  templateUrl: './cat-financial-information-attributes.component.html',
  styles: [],
})
export class CatFinancialInformationAttributesComponent
  extends BasePage
  implements OnInit
{
  attributesFinancialInfo: IAttributesFinancialInfo[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private modalService: BsModalService,
    private attributesInfoFinancialService: AttributesInfoFinancialService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: true,
        position: 'right',
      },
      columns: { ...FINANCIAL_INFO_ATTR_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getAttributesFinancialInfo());
  }

  getAttributesFinancialInfo() {
    this.loading = true;
    this.attributesInfoFinancialService
      .getAll(this.params.getValue())
      .subscribe({
        next: response => {
          this.attributesFinancialInfo = response.data;
          this.totalItems = response.count;
          this.loading = false;
        },
        error: error => (this.loading = false),
      });
  }

  openForm(attributesFinancialInfo?: IAttributesFinancialInfo) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      attributesFinancialInfo,
      callback: (next: boolean) => {
        if (next) this.getAttributesFinancialInfo();
      },
    };
    this.modalService.show(
      CatFinancialInformationAttributesModalComponent,
      modalConfig
    );
  }

  showDeleteAlert(attributesFinancialInfo: IAttributesFinancialInfo) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(attributesFinancialInfo.id);
      }
    });
  }

  delete(id: number) {
    this.attributesInfoFinancialService.remove(id).subscribe({
      next: () => this.getAttributesFinancialInfo(),
    });
  }
}
