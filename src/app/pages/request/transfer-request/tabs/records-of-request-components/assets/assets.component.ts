import { Component, Input, OnInit } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { MenajeComponent } from '../records-of-request-child-tabs-components/menaje/menaje.component';
import { SelectAddressComponent } from '../records-of-request-child-tabs-components/select-address/select-address.component';
import { ASSETS_COLUMNS } from './assests-columns';

var data = [
  {
    id: 1,
    noManagement: '1546645',
    descripTransfeAsset: 'descripcion',
    typeAsset: 'VEHICULO',
    physicalState: 'BUENO',
    conservationState: 'BUENO',
    tansferUnitMeasure: '',
    transferAmount: '',
    destinyLigie: '',
    destinyTransfer: '',
    householdAsset: '',
  },
];
@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  styles: [],
})
export class AssetsComponent extends BasePage implements OnInit {
  @Input() dataObject: string;
  bsModalRef: BsModalRef;
  params = new BehaviorSubject<ListParams>(new ListParams());
  paragraphs: any[] = [];
  createNewAsset: boolean = false;
  //typeDoc: string = '';

  constructor(private modalServise: BsModalService) {
    super();
  }

  ngOnInit(): void {
    console.log(this.dataObject);

    this.settings = {
      ...TABLE_SETTINGS,
      actions: false,
      columns: ASSETS_COLUMNS,
      selectMode: 'multi',
    };
    //this.settings.actions.delete = true;
    // this.settings.actions.position = 'left';

    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getData());
  }
  getData(): void {
    this.loading = true;
    this.paragraphs = data;
    setTimeout(() => {
      this.loading = false;
    }, 2000);
  }

  onFileChange(event: any) {
    console.log(event);
  }

  newAsset(): void {
    if (this.createNewAsset === false) {
      this.createNewAsset = true;
      window.scroll(0, 600);
    } else {
      this.createNewAsset = false;
    }
  }

  selectRows(event: any) {
    console.log(event);
  }

  openSelectAddressModal() {
    let config: ModalOptions = {
      initialState: {
        address: '',
        onlyOrigin: true,
        callback: (next: boolean) => {
          //if (next) this.getExample();
        },
      },
      class: 'modalSizeXL modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.bsModalRef = this.modalServise.show(SelectAddressComponent, config);

    this.bsModalRef.content.event.subscribe((res: any) => {
      //cargarlos en el formulario
      console.log(res);

      //this.assetsForm.controls['address'].get('longitud').enable();
      //this.requestForm.get('receiUser').patchValue(res.user);
    });
  }

  menajeModal() {
    let config: ModalOptions = {
      initialState: {
        data: '',
        callback: (next: boolean) => {
          //if (next) this.getExample();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.bsModalRef = this.modalServise.show(MenajeComponent, config);

    this.bsModalRef.content.event.subscribe((res: any) => {
      //ver si es necesario recivir los datos desde menaje
      console.log(res);
    });
  }

  save() {}
}
