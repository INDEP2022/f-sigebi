import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { CPCCatFinancialIndicatorsModalComponent } from '../c-p-c-cat-financial-indicators-modal/c-p-c-cat-financial-indicators-modal.component';
import { FINANCIAL_INDICATORS_COLUMNS } from './financial-indicators-columns';

@Component({
  selector: 'app-c-p-c-cat-financial-indicators',
  templateUrl: './c-p-c-cat-financial-indicators.component.html',
  styleUrls: [],
})
export class CPCCatFinancialIndicatorsComponent
  extends BasePage
  implements OnInit
{
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  columns: any[] = [];

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
      columns: { ...FINANCIAL_INDICATORS_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.getPagination();
  }

  data = [
    {
      id: 1,
      name: 'SOLVENCIA',
      description: 'SOLVENCIA',
      formule: '( ACTCIRCULANTE )/ ( PASCIRCULANTE )',
      formuleCheck: true,
    },
    {
      id: 2,
      name: 'LIQUIDEZ',
      description: 'LIQUIDEZ',
      formule: '( ( ACTCIRCULANTE )- ( INVENTARIOS ))/ ( PASCIRCULANTE )',
      formuleCheck: true,
    },
    {
      id: 3,
      name: 'CAPTRABAJO',
      description: 'CAPITAL DE TRABAJO',
      formule: ' ( ACTCIRCULANTE )- ( PASCIRCULANTE )',
      formuleCheck: true,
    },
    {
      id: 4,
      name: 'PERCOBROS',
      description: 'PERIODO DE COBROS (DIAS)',
      formule: ' ( ( CLIENTES )* ( PERIODO ))/ ( VTASNETAS )',
      formuleCheck: true,
    },
  ];

  getPagination() {
    this.columns = this.data;
    this.totalItems = this.columns.length;
  }

  openModal(context?: Partial<CPCCatFinancialIndicatorsModalComponent>) {
    const modalRef = this.modalService.show(
      CPCCatFinancialIndicatorsModalComponent,
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

  openForm(allotment?: any) {
    this.openModal({ allotment });
  }

  getData() {
    this.loading = true;
    this.columns = this.data;
    this.totalItems = this.data.length;
    this.loading = false;
  }
}
