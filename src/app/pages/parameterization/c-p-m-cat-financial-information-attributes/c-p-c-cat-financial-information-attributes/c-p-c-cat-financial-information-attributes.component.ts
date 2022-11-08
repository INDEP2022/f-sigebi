import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { CPCCatFinancialInformationAttributesModalComponent } from '../c-p-c-cat-financial-information-attributes-modal/c-p-c-cat-financial-information-attributes-modal.component';
import { FINANCIAL_INFO_ATTR_COLUMNS } from './financial-information-attributes-columns';

@Component({
  selector: 'app-c-p-c-cat-financial-information-attributes',
  templateUrl: './c-p-c-cat-financial-information-attributes.component.html',
  styles: [],
})
export class CPCCatFinancialInformationAttributesComponent
  extends BasePage
  implements OnInit
{
  columns: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(private modalService: BsModalService) {
    super();
    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: false,
        position: 'right',
      },
      columns: { ...FINANCIAL_INFO_ATTR_COLUMNS },
    };
  }

  data = [
    {
      name: 'ACTCIRCULANTE',
      description: 'ACTIVO CIRCULANTE',
      type: 'ACTIVO',
      subType: 'GENÉRICO',
    },
    {
      name: 'ACTDIFERIDO',
      description: 'ACTIVO DIFERIDO',
      type: 'ACTIVO',
      subType: 'GENÉRICO',
    },
    {
      name: 'ACTFIJO',
      description: 'ACTIVO FIJO',
      type: 'ACTIVO',
      subType: 'GENÉRICO',
    },
    {
      name: 'ACTUALIZA',
      description: 'ACTUALIZACIONES',
      type: 'CAPITAL CONTABLE',
      subType: 'GENÉRICO',
    },
  ];

  ngOnInit(): void {
    this.getPagination();
  }

  openForm(allotment?: any) {
    this.openModal({ allotment });
  }

  openModal(
    context?: Partial<CPCCatFinancialInformationAttributesModalComponent>
  ) {
    const modalRef = this.modalService.show(
      CPCCatFinancialInformationAttributesModalComponent,
      {
        initialState: { ...context },
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      }
    );
    modalRef.content.refresh.subscribe(next => {
      if (next) this.getData();
    });
  }

  getData() {
    this.loading = true;
    this.columns = this.data;
    this.totalItems = this.data.length;
    this.loading = false;
  }

  getPagination() {
    this.columns = this.data;
    this.totalItems = this.columns.length;
  }
}
