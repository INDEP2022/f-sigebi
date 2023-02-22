import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { ModalGoodForDonationComponent } from '../modal-good-for-donation/modal-good-for-donation.component';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-filters-of-goods-for-donation',
  templateUrl: './filters-of-goods-for-donation.component.html',
  styles: [],
})
export class FiltersOfGoodsForDonationComponent
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
        delete: true,
        position: 'right',
      },
      columns: { ...COLUMNS },
    };
  }

  ngOnInit(): void {
    this.getPagination();
  }

  openModal(context?: Partial<ModalGoodForDonationComponent>) {
    const modalRef = this.modalService.show(ModalGoodForDonationComponent, {
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

  data = [
    {
      goodStatus: 'DRR',
      descriptionStatus: 'DESCRIPCION DEL ESTATUS',
      targetIndicator: 'DDD',
      targetIndicatorDesc: 'DESCRIPCION DEL INDICADOR',
    },
    {
      goodStatus: 'DRR',
      descriptionStatus: 'DESCRIPCION DEL ESTATUS',
      targetIndicator: 'DDD',
      targetIndicatorDesc: 'DESCRIPCION DEL INDICADOR',
    },
  ];

  delete(event: any) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        this.onLoadToast('success', 'Eliminado correctamente', '');
      }
    });
  }
}
