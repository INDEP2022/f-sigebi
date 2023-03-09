import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { IDomicilies } from 'src/app/core/models/good/good.model';
import { GenericService } from 'src/app/core/services/catalogs/generic.service';
import { TypeRelevantService } from 'src/app/core/services/catalogs/type-relevant.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { MenageService } from 'src/app/core/services/ms-menage/menage.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { RequestHelperService } from 'src/app/pages/request/request-helper-services/request-helper.service';
import Swal from 'sweetalert2';
import { MenajeComponent } from '../records-of-request-child-tabs-components/menaje/menaje.component';
import { SelectAddressComponent } from '../records-of-request-child-tabs-components/select-address/select-address.component';
import { ASSETS_COLUMNS } from './assests-columns';
import { ExcelFormat } from './AssetExcelFormat';

var defaultData = [
  {
    id: 0,
    noManagement: '',
    descripTransfeAsset: '',
    typeAsset: '',
    physicalState: '',
    conservationState: '',
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
  goodObject: any; //bienes
  listgoodObjects: any[] = [];
  totalItems: number = 0;
  principalSave: boolean = false;
  bsModalRef: BsModalRef;
  params = new BehaviorSubject<FilterParams>(new FilterParams());
  paragraphs: any[] = [];
  createNewAsset: boolean = false;
  btnCreate: string = 'Crear Nuevo';
  domicilieObject: IDomicilies = null;
  data: ExcelFormat[] = [];
  menajeSelected: any;
  isSaveDomicilie: boolean = false;
  isSaveMenaje: boolean = false;
  //typeDoc: string = '';

  constructor(
    private route: ActivatedRoute,
    private modalServise: BsModalService,
    private goodService: GoodService,
    private typeRelevantSevice: TypeRelevantService,
    private genericService: GenericService,
    private requestHelperService: RequestHelperService,
    private excelService: ExcelService,
    private menageService: MenageService
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
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(data => {
      this.getData();
    });
  }

  getData() {
    this.loading = true;
    this.paragraphs = [];
    const requestId = Number(this.route.snapshot.paramMap.get('id'));
    this.params.value.addFilter('requestId', requestId);
    this.goodService.getAll(this.params.getValue().getParams()).subscribe({
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

            const goodMenaje = await this.getMenaje(item.id);
            item['goodMenaje'] = goodMenaje;
          });

          Promise.all(result).then(x => {
            this.totalItems = data.count;
            this.paragraphs = data.data;
            this.loading = false;
          });
        } else {
          this.paragraphs = defaultData;
          this.loading = false;
        }
      },
      error: error => {
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

  getMenaje(id: number) {
    return new Promise((resolve, reject) => {
      this.menageService.getById(id).subscribe({
        next: (resp: any) => {
          if (resp) {
            resolve(resp['noGood']);
          } else {
            resolve('');
          }
        },
        error: error => {
          resolve('');
        },
      });
    });
  }

  onFileChange(event: any, type?: string) {
    console.log(event.target.files[0]);
    const files = (event.target as HTMLInputElement).files;
    if (files.length != 1) throw 'No files selected, or more than of allowed';
    const fileReader = new FileReader();
    debugger;
    fileReader.readAsBinaryString(files[0]);
    //fileReader.onload = () => this.readExcel(fileReader.result);
  }

  readExcel(binaryExcel: string | ArrayBuffer) {
    try {
      this.data = this.excelService.getData<ExcelFormat>(binaryExcel);
      console.log(this.data);
    } catch (error) {
      this.onLoadToast('error', 'Ocurrio un error al leer el archivo', 'Error');
    }
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
    console.log(event);
    this.listgoodObjects = event.selected;
    if (this.listgoodObjects.length <= 1) {
      if (event.isSelected === true) {
        this.goodObject = this.listgoodObjects[0];
        this.createNewAsset = true;
        this.btnCreate = 'Cerrar Nuevo';
      } else {
        this.goodObject = null;
        this.createNewAsset = false;
        this.btnCreate = 'Crear Nuevo';
      }
    } else {
      this.goodObject = this.listgoodObjects;
      this.createNewAsset = false;
      this.btnCreate = 'Crear Nuevo';
    }
  }

  openSelectAddressModal() {
    if (this.listgoodObjects.length === 0) {
      this.onLoadToast('info', 'Información', `Seleccione uno o mas bienes!`);
      return;
    }
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
      if (res) {
        for (let i = 0; i < this.listgoodObjects.length; i++) {
          const element = this.listgoodObjects[i];
          element.addressId = res.id;
        }
        this.isSaveDomicilie = true;
      }
    });
  }
  // abrir menaje
  menajeModal() {
    if (this.listgoodObjects.length === 0) {
      this.onLoadToast('info', 'Información', `Seleccione uno o mas bienes!`);
      return;
    }
    let config: ModalOptions = {
      initialState: {
        goodsObject: this.listgoodObjects,
        requestId: this.requestObject.id,
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
      if (res) {
        this.menajeSelected = res;
        this.isSaveMenaje = true;
      }
    });
  }

  async save() {
    if (this.listgoodObjects.length > 0) {
      if (this.isSaveDomicilie === true) {
        await this.saveDomicilie();
      }
      if (this.isSaveMenaje === true) {
        await this.saveMenaje();
      }
      this.closeCreateGoodWIndows();
    } else {
      this.message('error', 'Error', `Seleccione al menos un bien`);
    }
  }

  saveDomicilie() {
    new Promise((resolve, reject) => {
      for (let i = 0; i < this.listgoodObjects.length; i++) {
        const element = this.listgoodObjects[i];
        delete element.goodTypeName;
        delete element.physicalStatusName;
        delete element.stateConservationName;
        delete element.transferentDestinyName;
        delete element.destinyLigieName;
        delete element.goodMenaje;
        this.goodService.update(element).subscribe({
          next: resp => {
            if (resp.statusCode != null) {
              this.message(
                'error',
                'Error',
                `El registro del bien del domicilio guardar!\n. ${resp.message}`
              );
              reject('El registro del bien del domicilio guardar!');
            }

            if (resp.id != null) {
              this.message(
                'success',
                'Actualizado',
                `Se guardo correctamente el bien del domicilio!`
              );
              this.isSaveDomicilie = false;
              resolve('Se guardo correctamente el bien del domicilio!');
            }
          },
        });
      }
    });
  }

  saveMenaje() {
    new Promise((resolve, reject) => {
      for (let i = 0; i < this.menajeSelected.length; i++) {
        const element = this.menajeSelected[i];
        console.log(element);

        this.menageService.create(element).subscribe({
          next: data => {
            if (data.statusCode != null) {
              this.message(
                'error',
                'Error',
                `El menaje no se pudo guardar!\n. ${data.message}`
              );
              reject('El registro del bien del domicilio no se guardo!');
            }

            if (data.noGoodMenaje != null) {
              this.message(
                'success',
                'Menaje guardado',
                `Se guardaron los menajes existosamente`
              );
              this.isSaveMenaje = false;
              resolve('Se guardo correctamente el menaje!');
            }
          },
        });
      }
    });
  }

  delete() {
    if (this.listgoodObjects.length > 0) {
      Swal.fire({
        title: 'Eliminar',
        text: 'Esta seguro de querer eliminar el bien seleccionado?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#9D2449',
        cancelButtonColor: '#B38E5D',
        confirmButtonText: 'Aceptar',
      }).then(result => {
        if (result.isConfirmed) {
          this.deleteGood();
        }
      });
    } else {
      this.message('info', 'Información', `Seleccione uno o mas bienes`);
    }
  }

  deleteGood() {
    for (let i = 0; i < this.listgoodObjects.length; i++) {
      const element = this.listgoodObjects[i];
      let goodRemove = { id: element.id, goodId: element.goodId };
      this.goodService.removeGood(goodRemove).subscribe({
        next: (resp: any) => {
          if (resp.statusCode === 200) {
            this.message('success', 'Eliminado', `Bien ${resp.message[0]}`);
            this.closeCreateGoodWIndows();
          } else {
            this.message('error', 'Eliminar', `${resp.message[0]}`);
          }
        },
        error: error => {
          console.log(error);
        },
      });
    }
  }

  refreshTable() {
    this.requestHelperService.currentRefresh.subscribe({
      next: data => {
        if (data) {
          setTimeout(() => {
            this.closeCreateGoodWIndows();
          }, 600);
        }
      },
    });
  }

  closeCreateGoodWIndows() {
    this.goodObject = null;
    this.createNewAsset = false;
    this.btnCreate = 'Crear Nuevo';
    this.paginatedData();
  }

  message(header: any, title: string, body: string) {
    this.onLoadToast(header, title, body);
  }
}
