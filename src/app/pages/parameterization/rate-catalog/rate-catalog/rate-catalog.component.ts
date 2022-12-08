import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { ModalRatesCatalogComponent } from '../modal-rates-catalog/modal-rates-catalog.component';

@Component({
  selector: 'app-rate-catalog',
  templateUrl: './rate-catalog.component.html',
  styles: [],
})
export class RateCatalogComponent extends BasePage implements OnInit {
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
      columns: {
        currency: {
          title: 'Moneda',
          sort: false,
        },
        year: {
          title: 'Año',
          sort: false,
        },
        month: {
          title: 'Mes',
          sort: false,
        },
        rate: {
          title: 'Tasa (%)',
          sort: false,
        },
      },
    };
  }

  ngOnInit(): void {
    this.getPagination();
  }

  openModal(context?: Partial<ModalRatesCatalogComponent>) {
    const modalRef = this.modalService.show(ModalRatesCatalogComponent, {
      initialState: { ...context },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe(next => {
      if (next) {
        this.getData();
        this.onLoadToast('success', 'Guardado Correctamente', '');
      }
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
      currency: 'Dolar',
      year: '2022',
      month: 'Enero',
      rate: '20 %',
    },
    {
      currency: 'Peso Mexicano',
      year: '2022',
      month: 'Febrero',
      rate: '30 %',
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
