import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ExcelService } from '../../../../../common/services/excel.service';
import { JSON_TO_CSV } from '../../../../admin/home/constants/json-to-csv';
import { UploadExpedientFormComponent } from '../../shared-component-gss/upload-expedient-form/upload-expedient-form.component';
import { UploadImagesFormComponent } from '../../shared-component-gss/upload-images-form/upload-images-form.component';

var data = [
  {
    id: 1,
    noManagement: '154654',
    noInventory: '000147',
    description: 'AUTO ZERO KILOMETOS TOYOTA SUBARUN',
    quantity: 1,
    unity: 'PIEZA',
    quantityMissingDamaged: '',
    statusRestitution: '',
    replacementDate: '',
    resultEvaluation: 'NO CUMPLE',
    statusAsset: 'FALTANTE',
    typeRestitution: 'EN ESPERA',
  },
  {
    id: 2,
    noManagement: '154654',
    noInventory: '000147',
    description: 'AUTO ZERO KILOMETOS TOYOTA SUBARUN',
    unity: 'PIEZA',
    quantityMissingDamaged: '',
    statusRestitution: '',
    replacementDate: '',
    resultEvaluation: 'NO CUMPLE',
    statusAsset: 'FALTANTE',
    typeRestitution: 'EN ESPERA',
  },
];

@Component({
  selector: 'app-list-assets-approved-form',
  templateUrl: './list-assets-approved-form.component.html',
  styleUrls: ['./list-assets-approved-form.component.scss'],
})
export class ListAssetsApprovedFormComponent implements OnInit {
  @Input() willSave: boolean = false;
  @Input() typeTask: string = '';
  bsModalRef: BsModalRef;
  assetsArray: any[] = [];
  assetsSelected: any[] = [];
  jsonToCsv = JSON_TO_CSV;

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private excelService: ExcelService
  ) {}

  ngOnInit(): void {
    this.assetsArray = data;
  }

  uploadExpedient() {
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

  approve() {
    //cambiar el select input a aprobado en la tabla
  }

  refuse() {
    //  cambiar el select input a rechazar en la tabla
  }

  selectOne(event: any, asset: any) {
    if (event.target.checked == true) {
      this.assetsSelected.push(asset);
    } else {
      let index = this.assetsSelected.indexOf(
        this.assetsArray.find(x => x.id == asset.id)
      );
      this.assetsSelected.splice(index, 1);
    }
    //console.log(this.assetsSelected);
    //const items:any = {item1: this.assetsSelected}
    //this.store.dispatch(add({items}))
  }

  //preguntar si el formulario y los datos que se guardaran son similare
  //para sampling-assets-form y este
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
