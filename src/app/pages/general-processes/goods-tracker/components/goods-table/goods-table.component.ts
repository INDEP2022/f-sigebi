import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import {
  BehaviorSubject,
  catchError,
  forkJoin,
  map,
  switchMap,
  take,
  takeUntil,
  throwError,
} from 'rxjs';
import { DocumentsListComponent } from 'src/app/@standalone/documents-list/documents-list.component';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ITrackedGood } from 'src/app/core/models/ms-good-tracker/tracked-good.model';
import { GoodTrackerService } from 'src/app/core/services/ms-good-tracker/good-tracker.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
import { GlobalVarsService } from 'src/app/shared/global-vars/services/global-vars.service';
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
  ngGlobal: any = null;
  $trackedGoods = this.store.select(getTrackedGoods);
  includeLoading: boolean = false;

  constructor(
    private modalService: BsModalService,
    private sanitizer: DomSanitizer,
    private activatedRoute: ActivatedRoute,
    private store: Store,
    private router: Router,
    private location: Location,
    private goodTrackerService: GoodTrackerService,
    private globalVarService: GlobalVarsService
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

  ngOnInit(): void {
    this.globalVarService
      .getGlobalVars$()
      .pipe(takeUntil(this.$unSubscribe), take(1))
      .subscribe({
        next: global => {
          this.ngGlobal = global;
        },
      });
  }

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
      return;
    }

    if (this.origin == GOOD_TRACKER_ORIGINS.DestructionManagement) {
      this.router.navigate([
        '/pages/executive-processes/destruction-authorization-management',
      ]);
      return;
    }
    this.location.back();
  }

  include() {
    if (this.selectedGooods.length == 0) {
      this.onLoadToast('info', 'Info', 'Debe seleccionar almenos un bien');
      return;
    }
    const goodIds = this.selectedGooods.map(good => good.goodNumber);
    this.includeLoading = true;
    this.getTmpNextVal()
      .pipe(
        switchMap(identificator => {
          const $obs = goodIds.map(goodNumber =>
            this.saveTmpGood(identificator, goodNumber)
          );
          return forkJoin($obs).pipe(map(() => identificator));
        })
      )
      .subscribe({
        next: identificator => {
          this.includeLoading = false;
          this.globalVarService.updateGlobalVars({
            ...this.ngGlobal,
            REL_BIENES: identificator,
          });
          this.backTo();
        },
        error: error => {
          this.includeLoading = false;
          this.onLoadToast('error', 'Error', 'Ocurrió un error');
        },
      });
  }

  saveTmpGood(identificator: number, goodNumber: number | string) {
    return this.goodTrackerService.createTmpTracker({
      identificator,
      goodNumber: Number(goodNumber),
    });
  }

  getTmpNextVal() {
    return this.goodTrackerService.getIdentifier().pipe(
      catchError(error => {
        this.onLoadToast('error', 'Error', 'Ocurrió un error');
        return throwError(() => error);
      }),
      map((response: any) => response.nextval)
    );
  }
}
