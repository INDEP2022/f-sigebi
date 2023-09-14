import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
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
import { GoodprocessService } from 'src/app/core/services/ms-goodprocess/ms-goodprocess.service';
import { ProceedingsService } from 'src/app/core/services/ms-proceedings';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
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
  totalItems: number = 0;
  noExpediente: number | string;
  formWarehouse: FormGroup;
  mostrarAlmacen = true;
  formVault: FormGroup;
  typeLocation: string = '';
  good: IGood;
  goods: IGood[] = [];
  newWarehouse: number = 0;
  fileNum: number = 0;
  selectedGooodsValid: any[] = [];
  selectedGooods: any[] = [];
  goodsValid: any;
  selectedOption: string = 'B';
  dataTableGood_: any[] = [];
  columnFilters: any;
  origin2: string;
  disableConsultLocation: boolean = false;
  params = new BehaviorSubject<ListParams>(new ListParams());
  warehouseDisable: boolean = true;
  vaultDisable: boolean = true;
  nullDisable: boolean = true;
  di_desc_est: string = '';
  allGoods: LocalDataSource = new LocalDataSource();
  paramsScreen: IParamsUbicationGood = {
    PAR_MASIVO: '',
    origin: '',
    origin2: '',
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
    private activatedRoute: ActivatedRoute,
    private GoodprocessService_: GoodprocessService,
    private proceedingsService: ProceedingsService
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
        this.formVault.value.safe = this.formVault.value.safe ?? 9999;
        this.formVault.value.safe = this.formVault.value.safe ?? 1;
        this.paramsScreen.PAR_MASIVO = paramsQuery['PAR_MASIVO'] ?? null;
        if (this.origin == 'FACTADBUBICABIEN') {
          for (const key in this.paramsScreen) {
            if (Object.prototype.hasOwnProperty.call(paramsQuery, key)) {
              this.paramsScreen[key as keyof typeof this.paramsScreen] =
                paramsQuery[key] ?? null;
            }
          }
          this.origin2 = paramsQuery['origin2'] ?? null;
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
      ? this.router.navigate(
          ['/pages/administrative-processes/warehouse-inquiries'],
          {
            queryParams: {
              origin: this.screenKey,
              PAR_MASIVO: this.form.value.good,
              origin2: 'FCONADBBOVEDAS',
              origin3: 'FACTGENACTDATEX',
              origin4: 'FCONADBALMACENES',
            },
          }
        )
      : this.router.navigate(
          ['/pages/administrative-processes/vault-consultation'],
          {
            queryParams: {
              origin: this.screenKey,
              PAR_MASIVO: this.form.value.good,
              origin2: 'FCONADBBOVEDAS',
              origin3: 'FACTGENACTDATEX',
              origin4: 'FCONADBALMACENES',
            },
          }
        );
  }

  openModal(goods?: IGood[]): void {
    this.modalService.show(ModalSelectsGoodsComponent, {
      initialState: {
        goods,
      },
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
        this.alert('info', 'Este bien no tiene asignado almacen', '');
      },
    });
  }
  loadDescriptionVault(id: string | number) {
    this.safeService.getById(id).subscribe({
      next: response => {
        this.currentDescriptionVault.setValue(response.description);
      },
      error: err => {
        this.alert('info', 'Este bien no tiene asignado Bóvedas', '');
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

  validarGood(): boolean {
    if (this.radio.value === 'A') {
      if (Number(this.good.type) === 5 && Number(this.good.subTypeId) === 16) {
        this.good.dateIn = new Date();
        this.good.ubicationType = 'A';
        return true;
      } else if (Number(this.good.type) === 7) {
        this.good.ubicationType = 'A';
        this.formVault.disable();
        this.good.dateIn = new Date();
      } else {
        this.good.storeNumber = this.warehouse.value;
        this.radio.setValue('A');
        this.good.dateIn = new Date();
      }
    } else {
      if (Number(this.good.type) === 5 && Number(this.good.subTypeId) === 16) {
        this.good.ubicationType = 'B';
        this.good.vaultNumber = 9999;
        this.good.storeNumber = null;
        this.good.dateIn = new Date();
      } else if (Number(this.good.type) === 7) {
        this.warehouseDisable = false;
        this.formWarehouse.disable();
        this.good.dateIn = new Date();
        // this.good.ubicationType = 'B';
      } else {
        this.good.vaultNumber = this.safe.value;
        this.good.ubicationType = '';
        this.good.dateIn = new Date();
        this.radio.setValue('B');
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
    this.noExpediente = this.good.fileNumber || '';
    let params: any = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    if (this.noExpediente !== '') {
      this.serviceGood.getByExpedient(this.noExpediente, params).subscribe({
        next: data => {
          this.goods = data.data;
          this.loading = false;
          console.log('Bienes', this.goods);

          let result = data.data.map(async (item: any) => {
            let obj = {
              vcScreen: 'FACTADBUBICABIEN',
              pNumberGood: item.id,
            };
            const di_dispo = await this.getStatusScreen(obj);
            item['di_disponible'] = di_dispo;
            // item.di_disponible != null ? 'N' : di_dispo;
          });

          Promise.all(result).then(item => {
            this.dataTableGood_ = this.goods;
            this.allGoods.load(this.dataTableGood_);
            this.allGoods.refresh();
            this.totalItems = data.count;
            console.log(this.goods);
          });
        },
        error: error => {
          this.loading = false;
        },
      });
    }
  }
  onGoodSelect(instance: CheckboxElementComponent) {
    instance.toggle.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: data => this.goodSelectedChange(data.row, data.toggle),
    });
  }

  isGoodSelected(_good: IGood) {
    const exists = this.selectedGooods.find(good => good.id == _good.id);
    return !exists ? false : true;
  }

  goodSelectedChange(good: IGood, selected: boolean) {
    if (selected) {
      this.selectedGooods.push(good);
    } else {
      this.selectedGooods = this.selectedGooods.filter(
        _good => _good.id != good.id
      );
    }
  }
  onGoodSelectValid(instance: CheckboxElementComponent) {
    instance.toggle.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: data => this.goodSelectedChangeValid(data.row, data.toggle),
    });
  }

  isGoodSelectedValid(_good: IGood) {
    const exists = this.selectedGooodsValid.find(good => good.id == _good.id);
    return !exists ? false : true;
  }

  goodSelectedChangeValid(good: IGood, selected?: boolean) {
    if (selected) {
      this.selectedGooodsValid.push(good);
    } else {
      this.selectedGooodsValid = this.selectedGooodsValid.filter(
        _good => _good.id != good.id
      );
    }
  }
  rowsSelected(event: any) {
    this.selectedGooodsValid = event.selected;
  }
  getEstatusColor(estatus: string): string {
    return estatus === 'S' ? '#28A745' : '#343A40';
  }
  async getStatusScreen(body: any) {
    return new Promise((resolve, reject) => {
      this.GoodprocessService_.getScreenGood(body).subscribe({
        next: async (state: any) => {
          if (state.data) {
            console.log('di_dispo', state);
            resolve('S');
            this.di_desc_est = 'S';
          } else {
            console.log('di_dispo', state);
            resolve('N');
            this.di_desc_est = 'N';
          }
        },
        error: () => {
          resolve('N');
        },
      });
    });
  }
  goBack() {
    this.router.navigate(['/pages/administrative-processes/derivation-goods'], {
      queryParams: {
        origin: this.screenKey,
        PAR_MASIVO: this.form.value.good,
        origin2: 'FCONADBBOVEDAS',
        origin3: 'FACTGENACTDATEX',
        origin4: 'FACTGENACTDATEX',
      },
    });
  }
}

export interface IParamsUbicationGood {
  PAR_MASIVO: string;
  origin: string;
  origin2: string;
}

export interface IParamsUbicationGoodBody {
  PAR_MASIVO: string;
}
