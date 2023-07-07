import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IWarehouse } from 'src/app/core/models/catalogs/warehouse.model';
import { IGood } from 'src/app/core/models/ms-good/good';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { SafeService } from 'src/app/core/services/catalogs/safe.service';
import { WarehouseService } from 'src/app/core/services/catalogs/warehouse.service';
import { DictationService } from 'src/app/core/services/ms-dictation/dictation.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { ModalSelectsGoodsComponent } from '../modal-selects-goods/modal-selects-goods.component';

@Component({
  selector: 'app-location-goods-warehouses-storage',
  templateUrl: './location-goods-warehouses-storage.component.html',
  styles: [],
})
export class LocationGoodsWarehousesStorageComponent
  extends BasePage
  implements OnInit
{
  //Reactive Forms
  form: FormGroup;
  formWarehouse: FormGroup;
  mostrarAlmacen = true;
  formVault: FormGroup;
  typeLocation: string = '';
  good: IGood;
  goods: IGood[] = [];
  newWarehouse: number = 0;
  fileNum: number = 0;
  selectedOption: string = 'B';
  disableConsultLocation: boolean = false;
  params = new BehaviorSubject<ListParams>(new ListParams());
  warehouseDisable: boolean = true;
  vaultDisable: boolean = true;
  nullDisable: boolean = true;
  di_desc_est: string = '';
  paramsScreen: IParamsUbicationGood = {
    PAR_MASIVO: '',
    origin: '',
  };
  paramsCurrentScreen = {
    TIPO_PROC: '',
    NO_INDICADOR: '',
  };
  screenKey: string = 'FACTADBUBICABIEN'; // Clave de la pantalla actual
  origin: string = null;

  get numberGood() {
    return this.form.get('good');
  }
  get description() {
    return this.form.get('description');
  }
  get statusGoods() {
    return this.form.get('statusGoods');
  }
  get radio() {
    return this.form.get('radio');
  }
  get currentLocationWare() {
    return this.formWarehouse.get('currentLocationWare');
  }
  get currentDescriptionWare() {
    return this.formWarehouse.get('currentDescriptionWare');
  }
  get warehouse() {
    return this.formWarehouse.get('warehouse');
  }

  get currentLocationVault() {
    return this.formVault.get('currentLocationVault');
  }
  get currentDescriptionVault() {
    return this.formVault.get('currentDescriptionVault');
  }
  get safe() {
    return this.formVault.get('safe');
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private modalService: BsModalService,
    private readonly goodServices: GoodService,
    private serviceGood: GoodService,
    private dictationServ: DictationService,
    private token: AuthService,
    private warehouseService: WarehouseService,
    private safeService: SafeService,
    private activatedRoute: ActivatedRoute
  ) {
    super();
  }

  ngOnInit(): void {
    /////////// validar los persmisos del usuario
    console.log(this.token.decodeToken());
    this.buildForm();
    this.buildFormWare();
    this.buildFormVault();
    this.form.disable();
    this.numberGood.enable();
    // this.formWarehouse.value.warehouse = this.formWarehouse.get('warehouse').value != null ? this.formWarehouse.get('warehouse').value : 9999;
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(paramsQuery => {
        this.origin = paramsQuery['origin'] ?? null;
        this.paramsScreen.PAR_MASIVO = paramsQuery['PAR_MASIVO'] ?? null;
        if (this.origin == 'FACTADBUBICABIEN') {
          for (const key in this.paramsScreen) {
            if (Object.prototype.hasOwnProperty.call(paramsQuery, key)) {
              this.paramsScreen[key as keyof typeof this.paramsScreen] =
                paramsQuery[key] ?? null;
            }
          }
          // this.origin2 = paramsQuery['origin2'] ?? null;
          // this.origin3 = paramsQuery['origin3'] ?? null;
        }
      });
    if (this.paramsScreen) {
      if (this.paramsScreen.PAR_MASIVO) {
        this.loadGood();
      } else {
        console.log('SIN PARAMETROS');
        if (!this.origin) {
          // this.showSearchAppointment = true; // Habilitar pantalla de búsqueda de Actas
          // this.showSearchAppointment = true; // Habilitar pantalla de búsqueda de Actas
        } else {
        }
      }
    }
  }

  private buildForm() {
    this.form = this.fb.group({
      good: [null, [Validators.required]],
      description: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      statusGoods: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      radio: [null, [Validators.required]],
    });
  }
  private buildFormWare() {
    this.formWarehouse = this.fb.group({
      currentLocationWare: [null, [Validators.required]],
      currentDescriptionWare: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      warehouse: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
  }
  private buildFormVault() {
    this.formVault = this.fb.group({
      currentLocationVault: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      currentDescriptionVault: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      safe: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
    });
  }

  checkLocations() {
    if (this.radio.value === null) return;
    this.radio.value === 'A'
      ? this.router.navigate([
          '/pages/administrative-processes/warehouse-inquiries',
        ])
      : this.router.navigate([
          '/pages/administrative-processes/vault-consultation',
        ]);
  }

  openModal(): void {
    this.modalService.show(ModalSelectsGoodsComponent, {
      initialState: {},
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }

  loadGood() {
    this.loading = true;
    this.warehouseDisable = true;
    this.vaultDisable = true;
    let body: IParamsUbicationGoodBody = {
      PAR_MASIVO: this.paramsScreen.PAR_MASIVO,
    };
    let subscription = this.goodServices
      .getByIdAndGoodId(body.PAR_MASIVO, body.PAR_MASIVO)
      .subscribe({
        next: response => {
          this.loading = false;
          console.log(response);
          this.good = response;
          this.validRadio(this.good);
          this.loadDescriptionStatus(this.good);
          this.loadDescriptionWarehouse(this.good.storeNumber);
          this.loadDescriptionVault(this.good.vaultNumber);
          this.setGood(this.good);
          this.onLoadGoodList();
          this.radio.enable();
          this.currentLocationWare.disable();
          this.currentDescriptionWare.disable();
          this.currentLocationVault.disable();
          this.currentDescriptionVault.disable();
          this.validarGood();
          subscription.unsubscribe();
        },
        error: err => {
          console.log(err);
        },
      });
  }

  setGood(good: IGood) {
    this.numberGood.setValue(good.id);
    this.description.setValue(good.description);
    this.radio.setValue(good.ubicationType);
    this.currentLocationWare.setValue(good.storeNumber);
    this.currentLocationVault.setValue(good.vaultNumber);
    this.currentDescriptionVault.setValue('');
  }

  loadDescriptionStatus(good: IGood) {
    this.goodServices.getStatusByGood(good.id).subscribe({
      next: response => {
        this.statusGoods.setValue(response.status_descripcion);
      },
      error: error => {
        this.loading = false;
        this.onLoadToast(
          'info',
          'Información',
          'Este bien no tiene un Status asignado'
        );
      },
    });
  }
  loadDescriptionWarehouse(id: string | number) {
    this.warehouseService.getById(id).subscribe({
      next: response => {
        this.validLocationsConsult(response);
        this.currentDescriptionWare.setValue(response.description);
      },
      error: err => {
        this.onLoadToast(
          'info',
          'Opps...',
          'Este bien no tiene asignado almacen'
        );
      },
    });
  }
  loadDescriptionVault(id: string | number) {
    this.safeService.getById(id).subscribe({
      next: response => {
        this.currentDescriptionVault.setValue(response.description);
      },
      error: err => {
        this.onLoadToast(
          'info',
          'Opps...',
          'Este bien no tiene asignado Bóvedas'
        );
      },
    });
  }

  onChangeType(event: string) {
    this.typeLocation = event;
  }

  changeLocation() {
    const data = {
      id: this.good.id,
      goodId: this.good.goodId,
      observations: this.good.observations,
      quantity: this.good.quantity,
      goodClassNumber: this.good.goodClassNumber,
      unit: this.good.unit,
      labelNumber: this.good.labelNumber,
      storeNumber: this.formWarehouse.get('warehouse').value,
    };
    if (this.validarGood()) return;
    console.log('nuevo -->', this.good);
    this.serviceGood.update(data).subscribe(
      res => {
        this.alert('success', 'Bien', `Actualizado correctamente`);
        this.loadGood();
      },
      err => {
        this.alert(
          'error',
          'Bien',
          'No se pudo actualizar el bien, por favor intentelo nuevamente'
        );
      }
    );
  }

  changeLocationVault() {
    const data = {
      id: this.good.id,
      goodId: this.good.goodId,
      observations: this.good.observations,
      quantity: this.good.quantity,
      goodClassNumber: this.good.goodClassNumber,
      unit: this.good.unit,
      labelNumber: this.good.labelNumber,
      vaultNumber: this.formVault.get('safe').value,
    };
    if (this.validarGood()) return;
    console.log('nuevo -->', this.good);
    this.serviceGood.update(data).subscribe(
      res => {
        this.alert('success', 'Bien', `Actualizado correctamente`);
      },
      err => {
        this.alert(
          'error',
          'Bien',
          'No se pudo actualizar el bien, por favor intentelo nuevamente'
        );
      }
    );
  }

  validarGood(): boolean {
    if (this.radio.value === 'A') {
      if (Number(this.good.type) === 5 && Number(this.good.subTypeId) === 16) {
        this.warehouseDisable = true;
        this.vaultDisable = true;
        // this.good.ubicationType = 'A';
        return true;
      } else if (Number(this.good.type) === 7) {
        // this.good.ubicationType = 'A';
        this.vaultDisable = false;
        this.formVault.disable();
      } else {
        this.warehouseDisable = false;
        this.vaultDisable = false;
        this.good.storeNumber = this.warehouse.value;
        this.good.ubicationType = '';
        this.good.dateIn = new Date();
      }
    } else {
      if (Number(this.good.type) === 5 && Number(this.good.subTypeId) === 16) {
        this.warehouseDisable = true;
        this.vaultDisable = true;
        // this.good.ubicationType = 'B';
        // this.good.vaultNumber = 9999;
        // this.good.storeNumber = null;
      } else if (Number(this.good.type) === 7) {
        this.warehouseDisable = false;
        this.formWarehouse.disable();
        // this.good.ubicationType = 'B';
      } else {
        this.warehouseDisable = true;
        this.vaultDisable = true;
        this.good.vaultNumber = this.safe.value;
        this.good.ubicationType = '';
        this.good.dateIn = new Date();
        // this.good.ubicationType = 'B';
      }
    }
    return false;
  }
  validLocationsConsult(warehouse: IWarehouse) {
    if (warehouse.manager === this.token.decodeToken().preferred_username) {
      this.disableConsultLocation = true;
    }
  }
  validRadio(good: IGood) {
    good.storeNumber === null ? (this.warehouseDisable = false) : '';
    good.vaultNumber === null ? (this.vaultDisable = false) : '';
  }

  onLoadGoodList() {
    this.loading = true;
    let noExpediente = this.good.fileNumber || '';
    this.params.getValue().page = 1;
    this.params.getValue().limit = 10;
    if (noExpediente !== '') {
      this.goodServices
        .getByExpedient(noExpediente, this.params.getValue())
        .subscribe({
          next: response => {
            const data = response.data;
            this.loading = false;
            console.log(data);
            this.goods = data;
            data.map(async (good: any, index) => {
              if (index == 0) this.di_desc_est = good.estatus.descriptionStatus;
              good.di_disponible = 'S';
              this.di_desc_est = good.di_disponible;
              await new Promise((resolve, reject) => {
                const body = {
                  no_bien: good.id,
                  estatus: good.status,
                  identificador: good.identifier,
                  vc_pantalla: 'FACTADBUBICABIEN',
                  proceso_ext_dom: good.extDomProcess ?? '',
                };
                resolve(body);
              });
            });
          },
          error: err => {
            console.log(err);
          },
        });
    }
  }
}

export interface IParamsUbicationGood {
  PAR_MASIVO: string;
  origin: string;
}

export interface IParamsUbicationGoodBody {
  PAR_MASIVO: string;
}
