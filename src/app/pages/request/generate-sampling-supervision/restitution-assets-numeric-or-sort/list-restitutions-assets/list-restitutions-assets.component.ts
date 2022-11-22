import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ExcelService } from '../../../../../common/services/excel.service';
import { ModelForm } from '../../../../../core/interfaces/model-form';
import { JSON_TO_CSV } from '../../../../admin/home/constants/json-to-csv';
import { UploadExpedientFormComponent } from '../../shared-component-gss/upload-expedient-form/upload-expedient-form.component';
import { UploadImagesFormComponent } from '../../shared-component-gss/upload-images-form/upload-images-form.component';
import { DataCaptureForEntryOrderFormComponent } from '../data-capture-for-entry-order-form/data-capture-for-entry-order-form.component';

var data = [
  {
    id: 1,
    noManagement: '154654',
    noInventory: '000147',
    description: 'AUTO ZERO KILOMETOS TOYOTA SUBARUN',
    quantity: 1,
    unity: 'PIEZA',
    typeRestitution: '',
    dateRestitution: '',
    quantityMissingDamaged: '1',
  },
  {
    id: 2,
    noManagement: '154654',
    noInventory: '000147',
    description: 'AUTO ZERO KILOMETOS TOYOTA SUBARUN',
    quantity: 1,
    unity: 'PIEZA',
    typeRestitution: '',
    dateRestitution: '',
    quantityMissingDamaged: '2',
  },
];

@Component({
  selector: 'app-list-restitutions-assets',
  templateUrl: './list-restitutions-assets.component.html',
  styleUrls: ['./list-restitutions-assets.component.scss'],
})
export class ListRestitutionsAssetsComponent implements OnInit {
  assetsArray: Array<any> = [];
  assetForm: ModelForm<any>;
  assetsSelected: any[] = [];
  bsModalRef: BsModalRef;
  jsonToCsv = JSON_TO_CSV;

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private excelService: ExcelService
  ) {}

  ngOnInit(): void {
    this.assetsArray = data;

    this.assetForm = this.fb.group({
      date: [''],
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
      this.assetsSelected.push(data);
    } else {
      let index = this.assetsSelected.indexOf(
        this.assetsArray.find(x => x.id == asset.id)
      );
      this.assetsSelected.splice(index, 1);
    }
    console.log(this.assetsSelected);
  }

  numeric(): void {
    //actualiza los bienes para restitucion numerica

    let config: ModalOptions = {
      initialState: {
        data: '',
        typeComponent: '',
        callback: (next: boolean) => {
          //if (next){ this.getData();}
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(DataCaptureForEntryOrderFormComponent, config);
  }

  inSort(): void {
    //actualiza el tipo de restitucion
    console.log(this.assetsSelected);
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
}
