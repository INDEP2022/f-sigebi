import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { BasePage } from 'src/app/core/shared/base-page';

import { LocalDataSource } from 'ng2-smart-table';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IImageMedia } from '../../../../core/models/catalogs/image-media.model';
import { ImageMediaService } from '../../../../core/services/catalogs/image-media.service';
import { ImageMediaFormComponent } from '../image-media-form/image-media-form.component';
import { IMAGE_MEDIA_COLUMNS } from './image-media-columns';

@Component({
  selector: 'app-image-media-list',
  templateUrl: './image-media-list.component.html',
  styles: [],
})
export class ImageMediaListComponent extends BasePage implements OnInit {
  columns: IImageMedia[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  columnFilters: any = [];
  data: LocalDataSource = new LocalDataSource();

  constructor(
    private imageMediaService: ImageMediaService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = IMAGE_MEDIA_COLUMNS;
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
            switch (filter.field) {
              case 'id':
                searchFilter = SearchFilter.EQ;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }
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
    this.imageMediaService.getAll(params).subscribe({
      next: response => {
        this.columns = response.data;
        this.totalItems = response.count;
        this.data.load(response.data);
        this.data.refresh();
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openModal(context?: Partial<ImageMediaFormComponent>) {
    const modalRef = this.modalService.show(ImageMediaFormComponent, {
      initialState: { ...context },
      class: 'modal-md modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe(next => {
      if (next) this.getExample();
    });
  }

  openForm(imageMedia?: IImageMedia) {
    this.openModal({ imageMedia });
  }

  delete(batch: IImageMedia) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        this.remove(batch.id);
      }
    });
  }

  remove(id: number) {
    this.imageMediaService.remove(id).subscribe({
      next: () => {
        this.getExample(),
          this.alert('success', 'Medio Imágen', 'Borrado Correctamente');
      },
      error: error => {
        this.alert(
          'warning',
          'Medio Imágen',
          'No se puede eliminar el objeto debido a una relación con otra tabla.'
        );
      },
    });
  }
}
