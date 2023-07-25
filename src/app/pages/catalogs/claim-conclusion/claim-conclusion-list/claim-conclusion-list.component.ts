import { Component, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';

import { LocalDataSource } from 'ng2-smart-table';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IClaimConclusion } from 'src/app/core/models/catalogs/claim-conclusion.model';
import { ClaimConclusionService } from 'src/app/core/services/catalogs/claim-conclusion.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { ClaimConclusionFormComponent } from '../claim-conclusion-form/claim-conclusion-form.component';
import { CLAIMCONCLUSION_COLUMS } from './claim-conclusion-columns';

@Component({
  selector: 'app-claim-conclusion-list',
  templateUrl: './claim-conclusion-list.component.html',
  styles: [],
})
export class ClaimConclusionListComponent extends BasePage implements OnInit {
  paragraphs: IClaimConclusion[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];

  constructor(
    private claimConclusionService: ClaimConclusionService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = CLAIMCONCLUSION_COLUMS;
    this.settings.actions.delete = true;
    this.settings.actions.add = false;
    this.settings.hideSubHeader = false;
  }

  ngOnInit(): void {
    this.totalItems = 0;
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            console.log(filter);
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            filter.field == 'id' || filter.field == 'flag'
              ? (searchFilter = SearchFilter.EQ)
              : (searchFilter = SearchFilter.ILIKE);
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
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
    this.claimConclusionService.getAll(params).subscribe({
      next: response => {
        this.paragraphs = response.data;
        this.data.load(response.data);
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(claimConclusion?: IClaimConclusion) {
    let config: ModalOptions = {
      initialState: {
        claimConclusion,
        callback: (next: boolean) => {
          if (next) this.getExample();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ClaimConclusionFormComponent, config);
  }

  delete(claimConclusion: IClaimConclusion) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        this.deleteReg(claimConclusion.id);
      }
    });
  }

  deleteReg(id: string | number) {
    this.claimConclusionService.remove(id).subscribe({
      next: response => {
        this.alert(
          'success',
          'Conclusión de Siniestro',
          'Borrado Correctamente'
        ),
          this.getExample();
      },
      error: err => {
        this.alert(
          'warning',
          'Conclusión de Registro',
          'No se puede eliminar el objeto debido a una relación con otra tabla.'
        );
      },
    });
  }
}
