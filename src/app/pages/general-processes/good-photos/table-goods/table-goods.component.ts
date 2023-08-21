import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';

import { catchError, takeUntil, takeWhile, tap, throwError } from 'rxjs';
import { FileUploadModalComponent } from 'src/app/@standalone/modals/file-upload-modal/file-upload-modal.component';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { SocketService } from 'src/app/common/socket/socket.service';
import { GoodTrackerService } from 'src/app/core/services/ms-good-tracker/good-tracker.service';
import { FilePhotoSaveZipService } from 'src/app/core/services/ms-ldocuments/file-photo-save-zip.service';
import { BasePageWidhtDinamicFiltersExtra } from 'src/app/core/shared/base-page-dinamic-filters-extra';
import { FullService } from 'src/app/layouts/full/full.service';
import { environment } from 'src/environments/environment';
import { GoodPhotosService } from '../services/good-photos.service';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-table-goods',
  templateUrl: './table-goods.component.html',
  styleUrls: ['./table-goods.component.scss'],
})
export class TableGoodsComponent
  extends BasePageWidhtDinamicFiltersExtra
  implements OnInit
{
  @Input() selectedGoodsByQueryParams: number[] = [];
  @Input() set reset(value: number) {
    if (value > 0) {
      this.data.setFilter([], true, false);
      this.getData();
    }
  }
  @ViewChild('table') table: ElementRef;
  goodTemp: any;
  toggleInformation = true;
  selecteds = 0;
  constructor(
    private modalService: BsModalService,
    private dataService: GoodPhotosService,
    private goodTrackerService: GoodTrackerService,
    private socketService: SocketService,
    private fullService: FullService,
    private filePhotoSaveZipService: FilePhotoSaveZipService
  ) {
    super();
    // this.haveInitialCharge = false;
    this.ilikeFilters = [
      'description',
      'descriptionDelegation',
      'descriptionSubdelegation',
    ];
    this.settings = {
      ...this.settings,
      columns: COLUMNS,
      actions: null,
    };
    this.service = this.dataService;
  }

  userRowSelect(row: any) {
    console.log(row.data);
    console.log(this.table);
    this.goodTemp = row.data;
  }

  get selectedGood() {
    return this.dataService.selectedGood;
  }

  set selectedGood(value) {
    this.dataService.selectedGood = value;
  }

  get selectedGoods() {
    return this.dataService.selectedGoods;
  }

  showPhotos() {
    this.selectedGood = this.goodTemp;
    this.dataService.showEvent.next(true);
  }

  private subscribePhotos(token: string) {
    return this.socketService.exportGoodsTrackerPhotos(token).pipe(
      catchError(error => {
        return throwError(() => error);
      }),
      tap((res: any) => {
        this.fullService.generatingFileFlag.next({
          progress: res.percent,
          showText: true,
        });
        if (res.percent == 100 && res.path) {
          this.alert('success', 'Archivo Descargado Correctamente', '');
          const url = `${environment.API_URL}ldocument/${environment.URL_PREFIX}${res.path}`;
          console.log({ url });
          window.open(url, '_blank');
        }
      }),
      takeWhile((res: any) => res.percent <= 100 && !res.path)
    );
  }

  download() {
    let goodNumber = this.selectedGoods;
    console.log(this.selectedGoods);
    this.alert(
      'info',
      'Aviso',
      'La Descarga está en Proceso, favor de Esperar'
    );
    this.goodTrackerService
      .getPhotos({
        clasifGood: {
          selecSsstype: null,
          selecSstype: null,
          selecStype: null,
          selecType: null,
          clasifGoodNumber: null,
          typeNumber: null,
          subTypeNumber: null,
          ssubTypeNumber: null,
        },
        parval: {
          status: null,
          proExtDom: null,
          label: null,
          goodNumber,
          inventorySiabiId: null,
          invCurrentSiabi: null,
          propertyCisiId: null,
          goodFatherMenageNumber: null,
          tDescription: null,
          tAttribute: null,
          actKey: null,
          dictum: null,
          tValueIni: null,
          tValueFin: null,
          proceedingsNumber: null,
          identifier: null,
          photoDate: null,
          destinationDateIni: null,
          destinationDateFin: null,
          statusChange: null,
          processChange: null,
          changeDateIni: null,
          changeDateFin: null,
          expTransfereeNumber: null,
          alienationProcessNumber: null,
          chkIrregular: null,
          chkListGood: null,
          chkListExpe: null,
          photography: null,
        },
        notification: {
          previousAscertainment: null,
          criminalCase: null,
          flierNumber: null,
          flierType: null,
          judgedNumber: null,
          minpubNumber: null,
          nameIndicated: null,
          externalOfficeDate: null,
          receptionDate: null,
          receptionEndDate: null,
          protectionKey: null,
          touchPenaltyKey: null,
          externalOfficeKey: null,
        },
        global: {
          gstSelecProced: null,
          selecAuthority: null,
          caTransfereeNumber: null,
          caStationNumber: null,
          caAuthorityNumber: null,
          selecStation: null,
          csTransfereeNumber: null,
          csStationNumber: null,
          selecTransferee: null,
          ctTransfereeNumber: null,
          gstSelecStore: null,
          selecStore: null,
          cstStoreNumber: null,
          gstSelecEntfed: null,
          selecEntfed: null,
          otKey: null,
          gstSelecEntfedOne: null,
          selecEntfedTwo: null,
          otKeyOne: null,
          gstSelecDeleg: null,
          selecDeleg: null,
          delegationNumber: null,
          relGoods: null,
          relExpe: null,
        },
      })
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: res => {
          if (res) {
            const $sub = this.subscribePhotos(res.token).subscribe();
          }
        },
      });
  }

  override async extraOperationsGetData() {
    this.items = await this.data.getAll();
  }

  openZipUploader() {
    const config = {
      ...MODAL_CONFIG,
      initialState: {
        accept: '.zip',
        uploadFiles: false,
        service: this.filePhotoSaveZipService,
        identificator: this.selectedGoods,
        multiple: false,
        titleFinishUpload: 'Imagenes Cargadas Correctamente',
        questionFinishUpload: '¿Desea subir más imagenes?',
        callback: (refresh: boolean) => {
          if (refresh && this.selectedGoods.includes(this.selectedGood.id)) {
            this.dataService.showEvent.next(true);
          }
          // console.log(refresh);
          // this.fileUploaderClose(refresh);
        },
      },
    };
    this.modalService.show(FileUploadModalComponent, config);
  }

  override getParams() {
    // debugger;
    let newColumnFilters = this.columnFilters;
    if (
      this.selectedGoodsByQueryParams &&
      this.selectedGoodsByQueryParams.length > 0
    ) {
      newColumnFilters['filter.id'] = '$in:' + this.selectedGoodsByQueryParams;
    }
    return {
      ...this.params.getValue(),
      ...newColumnFilters,
    };
  }
}
