import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { BasePage } from 'src/app/core/shared/base-page';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
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

  constructor(
    private imageMediaService: ImageMediaService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = IMAGE_MEDIA_COLUMNS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());
  }

  getExample() {
    this.loading = true;
    this.imageMediaService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.columns = response.data;
        this.totalItems = response.count;
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
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
      }
    });
  }
}
