import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BasePage, TABLE_SETTINGS } from 'src/app/core/shared';
import { ExcelService } from '../../../../../common/services/excel.service';
import { ModelForm } from '../../../../../core/interfaces/model-form';
import { JSON_TO_CSV } from '../../../../admin/home/constants/json-to-csv';
import { listAssets } from '../../generate-formats-verify-noncompliance/store/actions';
import { Item } from '../../generate-formats-verify-noncompliance/store/item.module';
import { LIST_PAYMENT_VALIDATIONS } from '../../sampling-assets/sampling-assets-form/columns/list-validation';
import { LIST_VERIFY_NONCOMPLIANCE } from '../../sampling-assets/sampling-assets-form/columns/list-verify-noncompliance';
import { UploadExpedientFormComponent } from '../upload-expedient-form/upload-expedient-form.component';
import { UploadImagesFormComponent } from '../upload-images-form/upload-images-form.component';

var data = [
  {
    id: 1,
    noManagement: '154654',
    noInventory: '000147',
    description: 'AUTO ZERO KILOMETOS TOYOTA SUBARUN',
    quantity: 1,
    unity: 'PIEZA',
    resultEvaluation: 'NO CUMPLE',
    statusAsset: '',
    quantityMissingDamaged: '',
    observationsAsset: '',
  },
  {
    id: 2,
    noManagement: '154654',
    noInventory: '000147',
    description: 'AUTO ZERO KILOMETOS TOYOTA SUBARUN',
    quantity: 1,
    unity: 'PIEZA',
    resultEvaluation: 'NO CUMPLE',
    statusAsset: '',
    quantityMissingDamaged: '',
    observationsAsset: '',
  },
];

@Component({
  selector: 'app-assets-tab',
  templateUrl: './assets-tab.component.html',
  styleUrls: ['./assets-tab.component.scss'],
})
export class AssetsTabComponent extends BasePage implements OnInit {
  @Input() willSave: boolean = false;
  @Input() typeTask: string = '';
  bsModalRef: BsModalRef;
  assetsForm: ModelForm<any>;
  assetsArray: any[] = [];
  assetsSelected: Item[] = [];
  paragraphs3: any[] = [];
  jsonToCsv = JSON_TO_CSV;
  isReadonly: boolean = false;
  isCheckboxReadonly: boolean = false;
  checkboxTitle: string = '';
  settings3 = {
    ...TABLE_SETTINGS,
    actions: false,
    selectMode: 'multi',
    columns: LIST_VERIFY_NONCOMPLIANCE,
  };

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private excelService: ExcelService,
    private store: Store
  ) {
    super();
  }

  ngOnInit(): void {
    console.log(this.typeTask);
    this.setEnableInputs();
    this.assetsArray = data;
    this.paragraphs3 = data;
    //console.log(this.willSave);
    this.changeSettingTable();
  }

  initAssetForm(): void {
    this.assetsForm = this.fb.group({
      noManagement: [null],
      noInventory: [null],
      description: [null],
      quantity: [null],
      unity: [null],
      resultEvaluation: [null],
      statusAsset: [null],
      quantityMissingDamaged: [null],
      observationsAsset: [null],
    });
  }
  changeSettingTable() {
    if (this.typeTask == 'payment-validatios') {
      this.settings3 = {
        ...TABLE_SETTINGS,
        actions: false,
        selectMode: 'multi',
        columns: LIST_PAYMENT_VALIDATIONS,
      };
    } else {
      this.settings3 = {
        ...TABLE_SETTINGS,
        actions: false,
        selectMode: 'multi',
        columns: LIST_VERIFY_NONCOMPLIANCE,
      };
    }
  }
  setEnableInputs(): void {
    if (this.typeTask === 'verify-warehouse-assets') {
      this.checkboxTitle = 'Localizado';
      this.isReadonly = true;
    } else if (this.typeTask === 'assets-classification') {
      this.isReadonly = true;
      this.checkboxTitle = 'Número Gestión';
      this.isCheckboxReadonly = true;
    } else if (this.typeTask === 'payment-validatios') {
      this.isReadonly = true;
    }
  }

  selectOne(event: any, data: any) {
    if (event.target.checked == true) {
      this.assetsSelected.push(data);
    } else {
      let index = this.assetsSelected.indexOf(
        this.assetsArray.find(x => x.id == data.id)
      );
      this.assetsSelected.splice(index, 1);
    }

    //cargar los datos al store
    this.store.dispatch(listAssets({ items: this.assetsSelected }));
  }

  uploadExpedient() {
    //if (this.assetsSelected.length == 0) return;
    this.openModals(UploadExpedientFormComponent, '');
  }

  uploadImages(): void {
    //if (this.listAssetsCopiedSelected.length == 0) return;
    this.openModals(UploadImagesFormComponent, '');
  }

  changeStatusGood(value: string) {
    if (this.assetsSelected.length == 0) {
      this.onLoadToast('info', 'Debe tener selecionado al menos un Bien');
      return;
    }
    console.log(this.assetsSelected);
    console.log(this.paragraphs3);
    this.assetsSelected.map(item => {
      const index = this.paragraphs3.indexOf(item);
      if (value == 'F') {
        this.paragraphs3[index].statusAsset = 'FALTANTE';
      } else if (value == 'D') {
        this.paragraphs3[index].statusAsset = 'DAÑADO';
      }
    });
    this.paragraphs3 = [...this.paragraphs3];
    this.assetsSelected = [];
  }

  changeStatusGoodAproval(value: string) {
    if (this.assetsSelected.length == 0) {
      this.onLoadToast('info', 'Debe tener seleccionado al menos un Bien');
      return;
    }
    console.log(this.assetsSelected);
    console.log(this.paragraphs3);
    this.assetsSelected.map(item => {
      const index = this.paragraphs3.indexOf(item);
      if (value == 'A') {
        this.paragraphs3[index].statusEvaluation = 'APROBAR';
      } else if (value == 'R') {
        this.paragraphs3[index].statusEvaluation = 'RECHAZAR';
      }
    });
    this.paragraphs3 = [...this.paragraphs3];
    this.assetsSelected = [];
  }

  selectAsstsCopy(event: any) {
    this.assetsSelected = event.selected;
  }

  exportCsv() {
    const filename: string = 'Nombre del archivo';
    this.excelService.export(this.jsonToCsv, { type: 'csv', filename });
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
