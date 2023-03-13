import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import {
  BehaviorSubject,
  catchError,
  map,
  switchMap,
  takeUntil,
  tap,
  throwError,
} from 'rxjs';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { IConfigvtadmun } from 'src/app/core/models/ms-parametercomer/configvtadmum.model';
import { ConfigvtadmunService } from 'src/app/core/services/ms-parametercomer/configvtadmun.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
import { PageSetupModalComponent } from '../page-setup-modal/page-setup-modal.component';
import { PAGE_SETUP_COLUMNS } from './page-setup-columns';

@Component({
  selector: 'app-page-setup',
  templateUrl: './page-setup.component.html',
  styles: [],
})
export class PageSetupComponent extends BasePage implements OnInit {
  totalItems: number = 0;
  params = new BehaviorSubject(new FilterParams());
  data: IConfigvtadmun[] = [];

  constructor(
    private modalService: BsModalService,
    private configvtadmunService: ConfigvtadmunService
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
        ...PAGE_SETUP_COLUMNS,
        visualiza: {
          title: 'Visualizar',
          sort: false,
          type: 'custom',
          valuePrepareFunction: (visualiza: string) =>
            visualiza == '1' ? true : false,
          renderComponent: CheckboxElementComponent<IConfigvtadmun>,
          onComponentInitFunction: (
            instance: CheckboxElementComponent<IConfigvtadmun>
          ) => this.onVisualizaChange(instance),
        },
      },
    };
  }

  ngOnInit(): void {
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: () => this.getData(),
    });
  }

  openForm(pageSetup?: IConfigvtadmun) {
    this.openModal({ pageSetup });
  }

  confirmDelete(pageSetup: IConfigvtadmun) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.remove(pageSetup);
      }
    });
  }

  remove(pageSetup: IConfigvtadmun) {
    this.loading = true;
    const { idColumn, idTable } = pageSetup;
    this.configvtadmunService.remove({ idColumn, idTable }).subscribe({
      next: () => {
        this.loading = false;
        this.onLoadToast('success', 'Registro eliminado', '');
        this.getData();
      },
      error: () => {
        this.loading = false;
        this.onLoadToast(
          'error',
          'Error',
          'Ocurrio un error al eliminar el registro'
        );
      },
    });
  }

  onVisualizaChange(checkboxEl: CheckboxElementComponent<IConfigvtadmun>) {
    checkboxEl.toggle
      .pipe(
        takeUntil(this.$unSubscribe),
        map(data => {
          const { row, toggle } = data;
          return { ...row, visualiza: toggle ? '1' : '0' };
        }),
        switchMap(config => this.updateConfig(config))
      )
      .subscribe();
  }

  openModal(context?: Partial<PageSetupModalComponent>) {
    const modalRef = this.modalService.show(PageSetupModalComponent, {
      initialState: context,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe(next => {
      if (next) this.getData();
    });
  }

  getData() {
    const params = this.params.getValue().getParams();
    this.loading = true;
    this.configvtadmunService.getAllFilter(params).subscribe({
      next: response => {
        this.loading = false;
        this.data = response.data;
        this.totalItems = response.count;
      },
      error: error => (this.loading = false),
    });
  }

  updateConfig(config: Partial<IConfigvtadmun>) {
    this.loading = true;
    return this.configvtadmunService.update(config).pipe(
      catchError(error => {
        this.loading = false;
        this.onLoadToast(
          'error',
          'Error',
          'Ocurrio un error al actualizar el registro'
        );
        return throwError(() => error);
      }),
      tap(() => {
        this.loading = false;
        this.onLoadToast('success', 'Registro actualizado', '');
        this.getData();
      })
    );
  }
}
