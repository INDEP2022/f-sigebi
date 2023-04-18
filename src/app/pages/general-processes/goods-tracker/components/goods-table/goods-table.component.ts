import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, take, takeUntil } from 'rxjs';
import { DocumentsListComponent } from 'src/app/@standalone/documents-list/documents-list.component';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ITrackedGood } from 'src/app/core/models/ms-good-tracker/tracked-good.model';
import { BasePage } from 'src/app/core/shared/base-page';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
import { SetTrackedGoods } from '../../store/goods-tracker.actions';
import { getTrackedGoods } from '../../store/goods-tracker.selector';
import {
  GOOD_TRACKER_ORIGINS,
  GOOD_TRACKER_ORIGINS_TITLES,
} from '../../utils/constants/origins';
import { ViewPhotosComponent } from '../view-photos/view-photos.component';
import { GP_GOODS_COLUMNS } from './goods-columns';

@Component({
  selector: 'goods-table',
  templateUrl: './goods-table.component.html',
  styles: [],
})
export class GoodsTableComponent extends BasePage implements OnInit {
  pdfurl = 'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf';
  @Input() goods: ITrackedGood[] = [];
  @Input() totalItems: number = 0;
  @Input() params: BehaviorSubject<ListParams>;
  @Input() override loading: boolean = false;
  private selectedGooods: ITrackedGood[] = [];
  origin: string = null;
  $trackedGoods = this.store.select(getTrackedGoods);

  constructor(
    private modalService: BsModalService,
    private sanitizer: DomSanitizer,
    private activatedRoute: ActivatedRoute,
    private store: Store,
    private router: Router,
    private location: Location
  ) {
    super();
    this.settings.actions = false;
    this.settings.columns = GP_GOODS_COLUMNS;
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: params => {
          const origin = params['origin'];
          this.origin = origin;
          this.setColumnsFromOrigin();
        },
      });
  }

  setColumnsFromOrigin() {
    if (this.isValidOrigin()) {
      this.settings = {
        ...this.settings,
        actions: false,
        columns: {
          name: {
            title: '',
            sort: false,
            type: 'custom',
            showAlways: true,
            valuePrepareFunction: (isSelected: boolean, row: ITrackedGood) =>
              this.isGoodSelected(row),
            renderComponent: CheckboxElementComponent,
            onComponentInitFunction: (instance: CheckboxElementComponent) =>
              this.onGoodSelect(instance),
          },
          ...GP_GOODS_COLUMNS,
        },
      };
    }
  }

  onGoodSelect(instance: CheckboxElementComponent) {
    instance.toggle.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: data => this.goodSelectedChange(data.row, data.toggle),
    });
  }

  isGoodSelected(_good: ITrackedGood) {
    const exists = this.selectedGooods.find(
      good => good.goodNumber == _good.goodNumber
    );
    return !exists ? false : true;
  }

  private isValidOrigin() {
    return (
      this.origin !== null &&
      Object.values(GOOD_TRACKER_ORIGINS).includes(
        this.origin as unknown as GOOD_TRACKER_ORIGINS
      )
    );
  }

  goodSelectedChange(good: ITrackedGood, selected: boolean) {
    if (selected) {
      this.selectedGooods.push(good);
    } else {
      this.selectedGooods = this.selectedGooods.filter(
        _good => _good.goodNumber != good.goodNumber
      );
    }
    if (this.isValidOrigin()) {
      this.store.dispatch(
        SetTrackedGoods({ trackedGoods: this.selectedGooods })
      );
    }
    this.$trackedGoods.pipe(take(1)).subscribe(obs => {
      console.log(obs);
    });
  }

  ngOnInit(): void {}

  viewImages() {
    const modalConfig = MODAL_CONFIG;
    this.modalService.show(DocumentsListComponent, modalConfig);
  }

  openPrevPdf() {
    let config: ModalOptions = {
      initialState: {
        documento: {
          urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfurl),
          type: 'pdf',
        },
        callback: (data: any) => {
          console.log(data);
        },
      }, //pasar datos por aca
      class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
      ignoreBackdropClick: true, //ignora el click fuera del modal
    };
    this.modalService.show(PreviewDocumentsComponent, config);
  }

  viewPhotos() {
    const modalConfig = MODAL_CONFIG;
    this.modalService.show(ViewPhotosComponent, modalConfig);
  }

  backToText() {
    if (this.isValidOrigin()) {
      return GOOD_TRACKER_ORIGINS_TITLES[this.origin as GOOD_TRACKER_ORIGINS];
    }
    return '';
  }

  backTo() {
    if (this.origin == GOOD_TRACKER_ORIGINS.GoodsLocation) {
      this.router.navigate(['/pages/administrative-processes/location-goods']);
    } else {
      this.location.back();
    }
  }
}
