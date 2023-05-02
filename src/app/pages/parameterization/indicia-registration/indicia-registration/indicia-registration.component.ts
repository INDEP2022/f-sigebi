import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IIndiciados } from 'src/app/core/models/catalogs/indiciados.model';
import { IndiciadosService } from 'src/app/core/services/catalogs/indiciados.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { ModalIndiciaRegistrationComponent } from '../modal-indicia-registration/modal-indicia-registration.component';

@Component({
  selector: 'app-indicia-registration',
  templateUrl: './indicia-registration.component.html',
  styles: [],
})
export class IndiciaRegistrationComponent extends BasePage implements OnInit {
  paragraphs: IIndiciados[] = [];
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private modalService: BsModalService,
    private indicatedService: IndiciadosService
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
      columns: {
        id: {
          title: 'Número indiciado',
          type: 'number',
          sort: false,
        },
        name: {
          title: 'Nombre',
          type: 'string',
          sort: false,
        },
        noRegistration: {
          title: 'Número de registro',
          type: 'number',
          sort: false,
        },
        curp: {
          title: 'Curp',
          type: 'string',
          sort: false,
        },
        consecutive: {
          title: 'Consecutivo',
          type: 'number',
          sort: false,
        },
      },
    };
    this.settings.actions.add = false;
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
    };
  }

  ngOnInit(): void {
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            /*SPECIFIC CASES*/
            filter.field == 'id'
              ? (searchFilter = SearchFilter.EQ)
              : (searchFilter = SearchFilter.ILIKE);
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.getIndicated();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getIndicated());
  }

  getIndicated() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.indicatedService.getAll(params).subscribe({
      next: response => {
        this.paragraphs = response.data;
        this.data.load(this.paragraphs);
        this.data.refresh();
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  public openForm(indicated?: IIndiciados) {
    let config: ModalOptions = {
      initialState: {
        indicated,
        callback: (next: boolean) => {
          if (next) this.getIndicated();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ModalIndiciaRegistrationComponent, config);
  }

  delete(event: any) {
    console.log(event);
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.indicatedService.remove(event.id).subscribe({
          next: () => {
            this.onLoadToast('success', 'Se ha eliminado', '');
            this.getIndicated();
          },
          error: err => this.onLoadToast('error', err.error.message, ''),
        });
      }
    });
  }
}
