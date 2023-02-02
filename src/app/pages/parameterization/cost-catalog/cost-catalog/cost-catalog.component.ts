import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { CostCatalogService } from '../cost-catalog.service';
import { ModalCostCatalogComponent } from '../modal-cost-catalog/modal-cost-catalog.component';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-cost-catalog',
  templateUrl: './cost-catalog.component.html',
  styles: [],
})
export class CostCatalogComponent extends BasePage implements OnInit {
  columns: any[] = [];
  dataTable: LocalDataSource = new LocalDataSource();
  data: any[] = [
    {
      keyServices: 'NUMERO 1',
      descriptionServices: 'DESCRIPCION DEL NUMERO 1',
      typeExpenditure: 'GASTO DE TIPO 1',
      unaffordable: true,
      cost: true,
      expenditure: false,
    },
    {
      keyServices: 'NUMERO 1',
      descriptionServices: 'DESCRIPCION DEL NUMERO 1',
      typeExpenditure: 'GASTO DE TIPO 1',
      unaffordable: true,
      cost: false,
      expenditure: true,
    },
  ];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private modalService: BsModalService,
    private catalogService: CostCatalogService
  ) {
    super();
    this.settings.columns = COLUMNS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.getPagination();
    this.searchParams();
  }

  searchParams() {
    this.params.subscribe({
      next: resp => {
        this.data = [];
        if (resp.text !== '') {
          this.catalogService.getCostCatalogForSearch(resp.text).subscribe({
            next: (searchModel: any) => {
              if (searchModel) {
                this.data.push({
                  keyServices: searchModel.code,
                  descriptionServices: searchModel.description,
                  typeExpenditure: searchModel.subaccount,
                  unaffordable:
                    searchModel.unaffordabilityCriterion === 'N' ? false : true,
                  cost: searchModel.cost !== 'GASTO' ? true : false,
                  expenditure: searchModel.cost === 'GASTO' ? true : false,
                });
              }
              this.dataTable.load(this.data);
            },
          });
        } else {
          this.getCostCatalog();
        }
      },
    });
  }

  getCostCatalog() {
    this.data = [];
    this.catalogService.getCostCatalog().subscribe({
      next: (resp: any) => {
        if (resp.data) {
          resp.data.forEach((item: any) => {
            this.data.push({
              keyServices: item.code,
              descriptionServices: item.description,
              typeExpenditure: item.subaccount,
              unaffordable:
                item.unaffordabilityCriterion === 'N' ? false : true,
              cost: item.cost !== 'GASTO' ? true : false,
              expenditure: item.cost === 'GASTO' ? true : false,
            });
          });
        }
        this.dataTable.load(this.data);
      },
    });
  }

  openModal(context?: Partial<ModalCostCatalogComponent>) {
    const modalRef = this.modalService.show(ModalCostCatalogComponent, {
      initialState: { ...context },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe(next => {
      if (next) this.getCostCatalog();
    });
  }

  openForm(allotment?: any) {
    this.openModal({ allotment });
  }

  // getData() {
  //   this.loading = true;
  //   this.columns = this.data;
  //   this.totalItems = this.data.length;
  //   this.loading = false;
  // }

  getPagination() {
    this.columns = this.data;
    this.totalItems = this.columns.length;
  }

  getDrawers() {
    this.loading = true;
    /*     this.drawerService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.paragraphs = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    }); */
  }

  delete(drawer: any) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.catalogService.deleteCostCatalog(drawer.keyServices).subscribe({
          next: (resp: any) => {
            if (resp) {
              this.onLoadToast('success', 'Eliminado correctamente', '');
              this.getCostCatalog();
            }
          },
        });
      }
      /*let { noDrawer, noBobeda } = drawer;
          const idBobeda = (noBobeda as ISafe).idSafe;
          noBobeda = idBobeda;
          this.drawerService.removeByIds({ noDrawer, noBobeda }).subscribe({
            next: data => this.getDrawers(),
            error: error => (this.loading = false),
        });
      } */
    });
  }
}
