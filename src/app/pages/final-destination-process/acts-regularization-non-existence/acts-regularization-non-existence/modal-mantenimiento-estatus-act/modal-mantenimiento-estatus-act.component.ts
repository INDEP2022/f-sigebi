import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ScreenStatusService } from 'src/app/core/services/ms-screen-status/screen-status.service';
import { BasePage } from 'src/app/core/shared';
import { AddAndUpdateComponent } from './add-and-update/add-and-update.component';
import { COLUMNSESTATUS } from './columns';

@Component({
  selector: 'app-modal-mantenimiento-estatus-act',
  templateUrl: './modal-mantenimiento-estatus-act.component.html',
  styles: [],
})
export class ModalMantenimientoEstatusActComponent
  extends BasePage
  implements OnInit
{
  data: LocalDataSource = new LocalDataSource();
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  columnFilters: any[] = [];
  constructor(
    private modalRef: BsModalRef,
    private screenStatusService: ScreenStatusService,
    private modalService: BsModalService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        position: 'right',
        add: false,
        edit: false,
        delete: true,
      },
      delete: {
        deleteButtonContent:
          '<i class="fa fa-trash text-danger mx-2 ml-5"></i>',
        confirmDelete: true,
      },
    };
    this.settings.columns = COLUMNSESTATUS;
    this.settings.hideSubHeader = false;
  }

  ngOnInit(): void {
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;

            const search: any = {
              status: () => (searchFilter = SearchFilter.ILIKE),
              description: () => (searchFilter = SearchFilter.ILIKE),
            };

            search[filter.field]();

            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getData();
        }
      });
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      this.getData();
    });
  }

  getData() {
    let params: any = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    params['filter.screenKey'] = `$eq:FACTDESACTASRIF`;
    this.screenStatusService.getAllFiltered(params).subscribe({
      next: (response: any) => {
        console.log(response);
        this.data.load(response.data);
        this.data.refresh();
        this.totalItems = response.count;
      },
      error: () => {
        this.data.load([]);
        this.data.refresh();
        this.totalItems = 0;
      },
    });
  }
  add() {
    const modalConfig = {
      initialState: {},
      class: 'modal-xl modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    let modalRef = this.modalService.show(AddAndUpdateComponent, modalConfig);
    modalRef.content.onSave.subscribe(async (next: any) => {
      this.getData();
    });
  }
  close() {
    this.modalRef.hide();
  }

  deleteD(data: any) {
    this.alertQuestion(
      'question',
      'Se eliminará el Estatus por Pantalla',
      '¿Desea continuar?'
    ).then(async question => {
      if (question.isConfirmed) {
        this.screenStatusService.deleteStatusXScreen(data.data.id).subscribe({
          next: data => {
            this.alert(
              'success',
              'Estatus por pantalla eliminado correctamente',
              ''
            );
            this.getData();
          },
          error: error => {
            this.alert('warning', 'No se pudo eliminar el registro', '');
          },
        });
      }
    });
  }
}
