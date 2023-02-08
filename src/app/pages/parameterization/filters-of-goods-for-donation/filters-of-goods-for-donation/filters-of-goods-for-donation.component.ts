import { Component, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { IDonationGood } from 'src/app/core/models/ms-donation/donation.model';
import { DonationService } from 'src/app/core/services/ms-donationgood/donation.service';
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
  data: IListResponse<IDonationGood> = {} as IListResponse<IDonationGood>;

  constructor(
    private modalService: BsModalService,
    private donationServ: DonationService
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
      if (next) {
        console.log('ejectutado');
      }
    });
  }

  openForm(allotment?: any) {
    let config: ModalOptions = {
      initialState: {
        allotment,
        callback: (next: boolean) => {
          if (next) this.getPagination();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ModalGoodForDonationComponent, config);
  }

  getPagination(params?: ListParams) {
    this.donationServ.getAll(this.params.getValue()).subscribe({
      next: response => {
        if (response.data.length > 0) {
          response.data.map(donation => {
            donation.statusDesc = donation.status.description;
            donation.tagId = donation.tag.id;
            donation.tagDesc = donation.tag.description;
          });
        }
        this.data = response;
        this.data.count = 4;
      },
      error: err => {},
    });
  }

  deleteDonation(event: string) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        this.donationServ.delete(event).subscribe({
          next: () => {
            this.onLoadToast('success', 'Eliminado correctamente', '');
            this.getPagination();
          },
          error: err => {
            this.onLoadToast('error', 'Alerta', err.error.message);
          },
        });
      }
    });
  }
}
