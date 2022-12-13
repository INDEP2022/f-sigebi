import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { COLUMNS } from './columns';
import { ModalNotTransferredComponent } from './modal-not-transferred/modal-not-transferred.component';

@Component({
  selector: 'app-goods-not-transferred',
  templateUrl: './goods-not-transferred.component.html',
  styles: [],
})
export class GoodsNotTransferredComponent extends BasePage implements OnInit {
  @Input() goodsList: any;
  @Output() goods = new EventEmitter<any>();
  columns: any[] = [];

  data: any[] = [
    {
      numberGood: '1',
      typeRelevant: 'TIPO 1',
      description: 'DESCRIPCION DEL NUMERO 1',
      unitOfMeasure: 'PIEZA',
      quantity: '23',
    },
    {
      numberGood: '2',
      typeRelevant: 'TIPO 2',
      description: 'DESCRIPCION DEL NUMERO 2',
      unitOfMeasure: 'PIEZA',
      quantity: '26',
    },
  ];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(private modalService: BsModalService) {
    super();
    this.settings.columns = COLUMNS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.getPagination();
  }

  openModal(context?: Partial<ModalNotTransferredComponent>) {
    const modalRef = this.modalService.show(ModalNotTransferredComponent, {
      initialState: { ...context },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
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
        this.onLoadToast('success', 'Eliminado correctamente', '');
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
