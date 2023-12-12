import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import * as moment from 'moment';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ISampleGood } from 'src/app/core/models/ms-goodsinv/sampling-good-view.model';
import { SamplingGoodService } from 'src/app/core/services/ms-sampling-good/sampling-good.service';
import { BasePage, TABLE_SETTINGS } from 'src/app/core/shared';
import { ExcelService } from '../../../../../common/services/excel.service';
import { ModelForm } from '../../../../../core/interfaces/model-form';
import { JSON_TO_CSV } from '../../../../admin/home/constants/json-to-csv';
import { UploadExpedientFormComponent } from '../../shared-component-gss/upload-expedient-form/upload-expedient-form.component';
import { UploadImagesFormComponent } from '../../shared-component-gss/upload-images-form/upload-images-form.component';
import { DataCaptureForEntryOrderFormComponent } from '../data-capture-for-entry-order-form/data-capture-for-entry-order-form.component';
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
  idSample: number = 0;
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
    this.idSample = 302;
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getGoodsSampling());
    this.settings.columns = LIST_RESTITUTION_COLUMNS;
    this.columns.repositionDate = {
      ...this.columns.repositionDate,
      onComponentInitFunction: (instance?: any) => {
        instance.input.subscribe((data: any) => {
          this.setRepositionDate(data);
        });
      },
    };
  }

  setRepositionDate(descriptionInput: any) {
    console.log('descriptionInput', descriptionInput);
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
    this.params.getValue()['filter.sampleId'] = this.idSample;
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

  updateMyDate(event: any) {
    console.log(event);
  }

  uploadExpedient(): void {
    //if (this.assetsSelected.length == 0) return;
    this.openModals(UploadExpedientFormComponent, '');
  }

  uploadImages(): void {
    //if (this.listAssetsCopiedSelected.length == 0) return;
    this.openModals(UploadImagesFormComponent, '');
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
    console.log(this.assetsSelected);
  }

  numerari(): void {
    if (this.assetsSelected.length > 0) {
      let config: ModalOptions = {
        initialState: {
          data: '',
          typeComponent: '',
          goodsSelect: this.assetsSelected,
          callback: async (next: boolean) => {
            if (next) {
              const updateGood = await this.updateGoodSample(
                this.assetsSelected,
                'NUMERARIO',
                'PENDIENTE_NUMERARIO'
              );
              if (updateGood) {
                this.alert(
                  'success',
                  'Correcto',
                  'Bien actualizado correctamente'
                );
                this.getGoodsSampling();
              }
            }
          },
        },
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      };
      this.modalService.show(DataCaptureForEntryOrderFormComponent, config);
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
      const updateGood = await this.updateGoodSample(
        this.assetsSelected,
        'EN ESPECIE',
        'PENDIENTE_ESPECIE'
      );
      if (updateGood) {
        this.alert('success', 'Correcto', 'Bien actualizado correctamente');
        this.getGoodsSampling();
      }
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
      assetsSelected.map(good => {
        const sampleGood: ISampleGood = {
          sampleGoodId: good.sampleGoodId,
          typeRestitution: typeRestitution,
          goodStatus: goodStatus,
        };
        this.samplingService.editSamplingGood(sampleGood).subscribe({
          next: () => {
            resolve(true);
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
            console.log('response', response);
            this.alert('success', 'Correcto', 'Bien actualizado correctamente');
          },
        });
      });
    });
  }
}
