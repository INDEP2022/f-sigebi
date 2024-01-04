import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import * as moment from 'moment';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ISampleGood } from 'src/app/core/models/ms-goodsinv/sampling-good-view.model';
import { SamplingGoodService } from 'src/app/core/services/ms-sampling-good/sampling-good.service';
import { BasePage, TABLE_SETTINGS } from 'src/app/core/shared';
import { ExcelService } from '../../../../../common/services/excel.service';
import { ModelForm } from '../../../../../core/interfaces/model-form';
import { JSON_TO_CSV } from '../../../../admin/home/constants/json-to-csv';
import { ShowDocumentsGoodComponent } from '../../../shared-request/expedients-tabs/sub-tabs/good-doc-tab/show-documents-good/show-documents-good.component';
import { PhotographyFormComponent } from '../../../shared-request/photography-form/photography-form.component';
import { LIST_RESTITUTION_COLUMNS } from './list-restitution-columns';

@Component({
  selector: 'app-list-restitutions-assets',
  templateUrl: './list-restitutions-assets.component.html',
  styleUrls: ['./list-restitutions-assets.component.scss'],
})
export class ListRestitutionsAssetsComponent
  extends BasePage
  implements OnInit
{
  assetsArray: Array<any> = [];
  assetForm: ModelForm<any>;
  assetsSelected: any[] = [];
  bsModalRef: BsModalRef;
  jsonToCsv = JSON_TO_CSV;
  paragraphs = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  @Input() idSample: number = 0;
  @Input() filterObject: any;
  @Input() disabledButton: boolean;
  @Input() checkAgainGoods: boolean;
  totalItems: number = 0;
  columns = LIST_RESTITUTION_COLUMNS;
  goodsModified: any = [];
  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private excelService: ExcelService,
    private samplingService: SamplingGoodService
  ) {
    super();
    this.settings = {
      ...TABLE_SETTINGS,
      actions: false,
      selectMode: 'multi',
    };
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getGoodsSampling());
    this.settings.columns = LIST_RESTITUTION_COLUMNS;
  }

  ngOnChanges() {
    if (
      this.filterObject != false &&
      this.filterObject &&
      !this.checkAgainGoods
    ) {
      if (this.filterObject.noManagement)
        this.params.getValue()['filter.goodId'] =
          this.filterObject.noManagement;

      if (this.filterObject.noInventory)
        this.params.getValue()['filter.inventoryNumber'] =
          this.filterObject.noInventory;

      if (this.filterObject.descriptionAsset)
        this.params.getValue()['filter.description'] =
          this.filterObject.descriptionAsset;

      this.params
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe(() => this.getGoodsSampling());
    } else if (this.filterObject == false && !this.checkAgainGoods) {
      this.params = new BehaviorSubject<ListParams>(new ListParams());
      this.params
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe(() => this.getGoodsSampling());
    }

    if (this.checkAgainGoods)
      this.params
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe(() => this.getGoodsSampling());
  }

  setRepositionDate(descriptionInput: any) {
    this.paragraphs['data'].map((item: any) => {
      if (item.repositionDate === descriptionInput.data.repositionDate) {
        item.repositionDate = descriptionInput.text;

        this.addGoodModified(item);
      }
    });
  }

  addGoodModified(good: any) {
    const index = this.goodsModified.indexOf(good);
    if (index != -1) {
      this.goodsModified[index] = good;
      if (this.goodsModified[index].repositionDate == '') {
        this.goodsModified[index].repositionDate = null;
      }
    } else {
      this.goodsModified.push(good);
    }
  }

  getGoodsSampling() {
    if (this.checkAgainGoods == false) {
      this.params.getValue()['filter.sampleId'] = this.idSample;
      this.params.getValue()['filter.evaluationResult'] = 'NO CUMPLE';
      this.params.getValue()['filter.indVerification'] = 'Y';

      this.samplingService.getSamplingGoods(this.params.getValue()).subscribe({
        next: response => {
          const info = response.data.map(item => {
            if (item.repositionDate)
              item.repositionDate = moment(item.repositionDate).format(
                'DD/MM/YYYY'
              );
            return item;
          });
          this.paragraphs.load(info);
          this.totalItems = response.count;
        },
        error: error => {},
      });
    }
    if (this.checkAgainGoods == true) {
      this.params.getValue()['filter.sampleId'] = this.idSample;
      this.params.getValue()['filter.evaluationResult'] = 'NO CUMPLE';
      this.params.getValue()['filter.indVerification'] = 'Y';
      this.params.getValue()['filter.restitutionStatus'] = 'RECHAZAR';

      this.samplingService.getSamplingGoods(this.params.getValue()).subscribe({
        next: response => {
          console.log('sd', response);
          const info = response.data.map(item => {
            if (item.repositionDate)
              item.repositionDate = moment(item.repositionDate).format(
                'DD/MM/YYYY'
              );
            return item;
          });
          this.paragraphs.load(info);
          this.totalItems = response.count;
        },
        error: error => {},
      });
    }
  }

  updateMyDate(event: any) {}

  uploadExpedient(): void {
    if (this.assetsSelected.length > 0) {
      let config = {
        ...MODAL_CONFIG,
        class: 'modalSizeXL modal-dialog-centered',
      };

      config.initialState = {
        sampleGood: this.assetsSelected,
        typeDoc: 'good',
        process: 'sampling-assets',
        callback: (next: boolean) => {},
      };

      this.modalService.show(ShowDocumentsGoodComponent, config);
    } else {
      this.alert('warning', 'Acción Invalida', 'Seleccione un bien');
    }
    /*//if (this.assetsSelected.length == 0) return;
    this.openModals(UploadExpedientFormComponent, ''); */
  }

  uploadImages(): void {
    if (this.assetsSelected.length > 0) {
      let config = {
        ...MODAL_CONFIG,
        class: 'modalSizeXL modal-dialog-centered',
      };

      config.initialState = {
        sampleGood: this.assetsSelected,
        typeDoc: 'good',
        process: 'sampling-assets',
        callback: (next: boolean) => {},
      };

      this.modalService.show(PhotographyFormComponent, config);
    } else {
      this.alert('warning', 'Acción Invalida', 'Seleccione un bien');
    }
    //if (this.listAssetsCopiedSelected.length == 0) return;
    //this.openModals(UploadImagesFormComponent, '');
  }

  exportCsv() {
    const filename: string = 'Nombre del archivo';
    this.excelService.export(this.jsonToCsv, { type: 'csv', filename });
  }

  selectOne(event: any, asset: any): void {
    if (event.target.checked == true) {
      //this.assetsSelected.push(data);
    } else {
      let index = this.assetsSelected.indexOf(
        this.assetsArray.find(x => x.id == asset.id)
      );
      this.assetsSelected.splice(index, 1);
    }
  }

  numerari(): void {
    if (this.assetsSelected.length > 0) {
      this.alertQuestion(
        'question',
        'Confirmación',
        '¿Desea actualizar el bien?'
      ).then(async question => {
        if (question.isConfirmed) {
          const updateGood = await this.updateGoodSample(
            this.assetsSelected,
            'NUMERARIO',
            'PENDIENTE_NUMERARIO'
          );
          if (updateGood) {
            this.alert('success', 'Correcto', 'Bien actualizado correctamente');
            this.getGoodsSampling();
          }
        }
      });
    } else {
      this.alert(
        'warning',
        'Acción Invalida',
        'Se requiere seleccionar al menos un bien'
      );
    }
  }

  selectGoods(event: any) {
    this.assetsSelected = event.selected;
  }

  async inSort(): Promise<void> {
    if (this.assetsSelected.length > 0) {
      this.alertQuestion(
        'question',
        'Confirmación',
        '¿Desea actualizar el bien?'
      ).then(async question => {
        if (question.isConfirmed) {
          const updateGood = await this.updateGoodSample(
            this.assetsSelected,
            'EN ESPECIE',
            'PENDIENTE_ESPECIE'
          );
          if (updateGood) {
            this.alert('success', 'Correcto', 'Bien actualizado correctamente');
            this.getGoodsSampling();
          }
        }
      });
    } else {
      this.alert(
        'warning',
        'Acción Invalida',
        'Se requiere seleccionar un bien'
      );
    }
  }

  updateGoodSample(
    assetsSelected: ISampleGood[],
    typeRestitution: string,
    goodStatus: string
  ) {
    return new Promise((resolve, reject) => {
      assetsSelected.map((good: any, i: number) => {
        let index = i + 1;
        const sampleGood: ISampleGood = {
          sampleGoodId: good.sampleGoodId,
          typeRestitution: typeRestitution,
          goodStatus: goodStatus,
        };
        this.samplingService.editSamplingGood(sampleGood).subscribe({
          next: () => {
            if (assetsSelected.length == index) {
              resolve(true);
            }
          },
        });
      });
    });
  }

  openModals(component: any, data?: any): void {
    let config: ModalOptions = {
      initialState: {
        data: '',
        typeComponent: 'verify-noncompliance',
        callback: (next: boolean) => {
          //if (next){ this.getData();}
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.bsModalRef = this.modalService.show(component, config);

    //this.bsModalRef.content.event.subscribe((res: any) => {
    //cargarlos en el formulario
    //console.log(res);
    //this.assetsForm.controls['address'].get('longitud').enable();
    //this.requestForm.get('receiUser').patchValue(res.user);
    //});
  }

  saveInfoGood() {
    this.paragraphs.getElements().then(data => {
      data.map(item => {
        const sampleGood: ISampleGood = {
          sampleGoodId: item.sampleGoodId,
          repositionDate: item.repositionDate,
        };
        this.samplingService.editSamplingGood(sampleGood).subscribe({
          next: response => {
            this.alert('success', 'Correcto', 'Bien actualizado correctamente');
          },
        });
      });
    });
  }
}
