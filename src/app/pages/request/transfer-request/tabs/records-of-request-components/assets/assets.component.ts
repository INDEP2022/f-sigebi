import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { GenericService } from 'src/app/core/services/catalogs/generic.service';
import { TypeRelevantService } from 'src/app/core/services/catalogs/type-relevant.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { RequestHelperService } from 'src/app/pages/request/request-helper-services/request-helper.service';
import { MenajeComponent } from '../records-of-request-child-tabs-components/menaje/menaje.component';
import { SelectAddressComponent } from '../records-of-request-child-tabs-components/select-address/select-address.component';
import { ASSETS_COLUMNS } from './assests-columns';

var defaultData = [
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
  styleUrls: ['./assets.component.scss'],
})
export class AssetsComponent extends BasePage implements OnInit {
  @Input() requestObject: any; //solicitudes
  goodObject: ModelForm<any>; //bienes
  bsModalRef: BsModalRef;
  params = new BehaviorSubject<ListParams>(new ListParams());
  paragraphs: any[] = [];
  createNewAsset: boolean = false;
  btnCreate: string = 'Crear Nuevo';
  idDomicilie: number = null;
  //typeDoc: string = '';

  constructor(
    private route: ActivatedRoute,
    private modalServise: BsModalService,
    private goodService: GoodService,
    private typeRelevantSevice: TypeRelevantService,
    private genericService: GenericService,
    private requestHelperService: RequestHelperService
  ) {
    super();
  }

  ngOnInit(): void {
    this.settings = {
      ...TABLE_SETTINGS,
      actions: false,
      columns: ASSETS_COLUMNS,
      selectMode: 'multi',
    };
    //this.settings.actions.delete = true;
    // this.settings.actions.position = 'left';

    //oye los camibios de detail-assets-tab para refrescar la tabla
    this.refreshTable();
    this.paginatedData();
  }

  paginatedData() {
    var newParam = new ListParams();
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(data => {
      newParam.page = data.inicio;
      newParam.limit = data.pageSize;
      this.getData(newParam);
    });
  }

  getData(params: ListParams) {
    this.loading = true;
    const requestId = Number(this.route.snapshot.paramMap.get('id'));
    params['filter.requestId'] = `$eq:${requestId}`;
    this.goodService.getAll(params).subscribe({
      next: async (data: any) => {
        if (data !== null) {
          const result = data.data.map(async (item: any) => {
            //obtener tipo bien
            const goodType = await this.getGoodType(item.goodTypeId);
            item['goodTypeName'] = goodType;

            //obtener el estado fisico
            const physicalStatus = await this.getPhysicalStatus(
              item.physicalStatus
            );
            item['physicalStatusName'] = physicalStatus;

            //obtener el estado de concervacion
            const stateConservation = await this.getStateConservation(
              item.stateConservation
            );
            item['stateConservationName'] = stateConservation;

            //obtener el destino de la transferencia
            const transferentDestiny = await this.getTransferDestiny(
              item.transferentDestiny
            );
            item['transferentDestinyName'] = transferentDestiny;
            item['destinyLigieName'] = transferentDestiny;
          });

          Promise.all(result).then(x => {
            this.paragraphs = data.data;
          });
        } else {
          this.paragraphs = defaultData;
        }
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  getGoodType(goodTypeId: number) {
    return new Promise((resolve, reject) => {
      if (goodTypeId !== null) {
        this.typeRelevantSevice.getById(goodTypeId).subscribe({
          next: (data: any) => {
            resolve(data.description);
          },
        });
      } else {
        resolve('');
      }
    });
  }

  getPhysicalStatus(physicalState: any) {
    return new Promise((resolve, reject) => {
      if (physicalState !== null) {
        var params = new ListParams();
        params['filter.keyId'] = `$eq:${physicalState}`;
        params['filter.name'] = `$eq:Estado Fisico`;
        this.genericService.getAll(params).subscribe({
          next: data => {
            resolve(data.data[0].description);
          },
        });
      } else {
        resolve('');
      }
    });
  }

  getStateConservation(stateConcervation: any) {
    return new Promise((resolve, reject) => {
      if (stateConcervation !== null) {
        var params = new ListParams();
        params['filter.keyId'] = `$eq:${stateConcervation}`;
        params['filter.name'] = `$eq:Estado Conservacion`;
        this.genericService.getAll(params).subscribe({
          next: data => {
            resolve(data.data[0].description);
          },
        });
      } else {
        resolve('');
      }
    });
  }

  getTransferDestiny(transferentDestiny: any) {
    return new Promise((resolve, reject) => {
      if (transferentDestiny !== null) {
        var params = new ListParams();
        params['filter.keyId'] = `$eq:${transferentDestiny}`;
        params['filter.name'] = `$eq:Destino`;
        this.genericService.getAll(params).subscribe({
          next: data => {
            resolve(data.data[0].description);
          },
        });
      } else {
        resolve('');
      }
    });
  }

  onFileChange(event: any) {
    console.log(event);
  }

  newAsset(): void {
    if (this.createNewAsset === false) {
      this.createNewAsset = true;
      this.btnCreate = 'Cerrar Nuevo';
      window.scroll(0, 600);
    } else {
      this.createNewAsset = false;
      this.btnCreate = 'Crear Nuevo';
    }
  }

  selectRows(event: any) {
    if (event.isSelected === true) {
      this.goodObject = event.data;
      this.createNewAsset = true;
      this.btnCreate = 'Cerrar Nuevo';
    } else {
      this.goodObject = null;
      this.createNewAsset = false;
      this.btnCreate = 'Crear Nuevo';
    }
  }

  openSelectAddressModal() {
    let config: ModalOptions = {
      initialState: {
        request: this.requestObject,
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
      this.idDomicilie = res.id;

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
      this.idDomicilie = res.id;
      console.log(res);
    });
  }

  save() {}

  refreshTable() {
    this.requestHelperService.currentRefresh.subscribe({
      next: data => {
        if (data) {
          setTimeout(() => {
            this.goodObject = null;
            this.createNewAsset = false;
            this.btnCreate = 'Crear Nuevo';
            this.paginatedData();
          }, 1000);
        }
      },
    });
  }
}
