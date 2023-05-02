import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';

import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IZoneGeographic } from 'src/app/core/models/catalogs/zone-geographic.model';
import { ZoneGeographicService } from 'src/app/core/services/catalogs/zone-geographic.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { ZoneGeographicFormComponent } from '../zone-geographic-form/zone-geographic-form.component';
import { ZONEGEOGRAPHIC_COLUMS } from './zone-geographic-columnc';

@Component({
  selector: 'app-zone-geographic-list',
  templateUrl: './zone-geographic-list.component.html',
  styles: [],
})
export class ZoneGeographicListComponent extends BasePage implements OnInit {
  paragraphs: IZoneGeographic[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  constructor(
    private zoneGeographicService: ZoneGeographicService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = ZONEGEOGRAPHIC_COLUMS;
    this.settings.actions.delete = true;
    this.settings.actions.add = false;
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
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            filter.field == 'id' ||
            filter.field == 'contractNumber' ||
            filter.field == 'vat' ||
            filter.field == 'status' ||
            filter.field == 'version'
              ? (searchFilter = SearchFilter.EQ)
              : (searchFilter = SearchFilter.ILIKE);
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.getExample();
        }
      });

    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());
  }

  getExample() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.zoneGeographicService.getAll(params).subscribe({
      next: response => {
        this.paragraphs = response.data;
        this.totalItems = response.count || 0;
        this.data.load(response.data);
        this.data.refresh();
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(zoneGeographic?: IZoneGeographic) {
    let config: ModalOptions = {
      initialState: {
        zoneGeographic,
        callback: (next: boolean) => {
          if (next) this.getExample();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ZoneGeographicFormComponent, config);
  }

  delete(zoneGeographic: IZoneGeographic) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.zoneGeographicService.remove(zoneGeographic.id).subscribe({
          next: response => {
            this.onLoadToast('success', 'Exito', 'Eliminado Correctamente');
            this.getExample();
          },
          error: err => {
            this.onLoadToast('error', 'Error', 'Intente nuevamente');
          },
        });
      }
    });
  }
}
