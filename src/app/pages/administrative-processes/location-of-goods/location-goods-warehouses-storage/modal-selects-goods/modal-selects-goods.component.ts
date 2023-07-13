import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IGood } from 'src/app/core/models/ms-good/good';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { getTrackedGoods } from 'src/app/pages/general-processes/goods-tracker/store/goods-tracker.selector';
import { LocationGoodsWarehousesStorageComponent } from '../location-goods-warehouses-storage/location-goods-warehouses-storage.component';
@Component({
  selector: 'app-modal-selects-goods',
  templateUrl: './modal-selects-goods.component.html',
  styles: [],
})
export class ModalSelectsGoodsComponent extends BasePage implements OnInit {
  params = new BehaviorSubject<ListParams>(new ListParams());
  form: FormGroup;
  goods: IGood[] = [];
  goodsNotChange: number[] = [];
  selectedRow: IGood;
  selectedGooods: IGood[] = [];
  $trackedGoods = this.store.select(getTrackedGoods);
  formVau: FormGroup;
  formAlm: FormGroup;
  @Input() allGoods = new LocalDataSource();
  @Input() totalItems: number;
  @Input() validarGood: Function;
  @Input() formVault: LocationGoodsWarehousesStorageComponent;
  @Input() formWarehouse: LocationGoodsWarehousesStorageComponent;
  @Output() allGoodsUpdated = new EventEmitter();
  //Data Table

  get radio() {
    return this.form.get('radio');
  }
  get warehouse() {
    return this.form.get('warehouse');
  }
  get safe() {
    return this.form.get('safe');
  }

  constructor(
    private bsModalRef: BsModalRef,
    private fb: FormBuilder,
    private readonly goodServices: GoodService,
    private router: Router,
    private store: Store,
    private changeDetectorRef: ChangeDetectorRef,
    private serviceGood: GoodService
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      selectMode: 'multi',
      actions: {
        columnTitle: 'Acciones',
        edit: false,
        delete: false,
        add: false,
        position: 'right',
      },
      columns: {
        id: {
          title: 'No Bien',
          sort: false,
        },
        description: {
          title: 'Descripcion',
          sort: false,
        },
        quantity: {
          title: 'Cantidad',
          sort: false,
        },
        fileNumber: {
          title: 'Expediente',
          sort: false,
        },
        goodClassNumber: {
          title: 'Clasif Bien',
          sort: false,
        },
        storeNumber: {
          title: 'Almacen',
          sort: false,
        },
        vaultNumber: {
          title: 'Boveda',
          sort: false,
        },
      },
      rowClassFunction: (row: any) => {
        if (row.data.di_disponible == 'S') {
          return 'bg-success text-white';
        } else {
          return 'bg-dark text-white';
        }
      },
    };
    // this.settings.actions.delete = true;
    // this.settings.actions.edit = false;
  }

  ngOnInit(): void {
    this.loading = true;
    // this.allGoods.refresh();
    // console.log(this.totalItems);
    this.allGoodsUpdated.next(this.allGoods);
    this.buildForm();
    this.loading = false;
    // this.$trackedGoods.subscribe({
    //   next: response => {
    //     response.forEach(good => {
    //       this.getGoodByID(good.goodNumber);
    //     });
    //     this.loading = false;
    //   },
    //   error: err => {
    //     console.log(err);
    //     this.loading = false;
    //   },
    // });
  }

  returnModal() {
    this.bsModalRef.hide();
  }
  private buildForm() {
    this.form = this.fb.group({
      radio: [null, [Validators.required]],
      warehouse: [null, [Validators.required]],
      safe: [null, [Validators.required]],
    });
  }
  asigLocation() {
    if (this.validar()) return;
    try {
      this.goods.forEach(good => {
        let valid: boolean = true;
        if (this.radio.value === 'A') {
          if (Number(good.type) === 5 && Number(good.subTypeId) === 16) {
            this.goodsNotChange.push(Number(good.id));
            valid = false;
          } else {
            good.storeNumber = this.warehouse.value;
            good.ubicationType = 'A';
            good.dateIn = new Date();
          }
        } else if (this.radio.value === 'B') {
          if (Number(good.type) === 5 && Number(good.subTypeId) === 16) {
            good.vaultNumber = 9999;
            good.storeNumber = null;
            good.ubicationType = 'B';
          } else {
            good.vaultNumber = this.safe.value;
            good.ubicationType = 'B';
            good.dateIn = new Date();
          }
        }
        if (valid) {
          this.goodServices.update(good).subscribe({
            next: response => {
              console.log('response', response);
              this.add();
            },
          });
        }
      });
      this.onLoadToast(
        'success',
        'Exito',
        'Se ha cambiado la ubicación de los bienes seleccionados'
      );
      this.loading = false;
    } catch (error) {
      console.log(error);
      this.loading = false;
      this.onLoadToast(
        'error',
        'ERROR',
        'Ha ocurrido un error al cambiar la ubicacion del bien'
      );
    }
  }

  validar(): boolean {
    if (this.radio.value === null) {
      this.onLoadToast('error', 'ERROR', 'Selecione un tipo de ubicacion');
      return true;
    }
    if (this.warehouse.value === null && this.safe.value === null) {
      this.onLoadToast('error', 'ERROR', 'Selecione un elemento de la lista');
      return true;
    }
    return false;
  }

  deleteGood(good: IGood) {
    this.goods = this.selectedGooods.filter(item => item.id != good.id);
    this.add();
  }
  /////////// Temporal2222222222222222222222222222222222222
  getGoodByID(idGood: number | string) {
    this.goodServices.getById(idGood).subscribe({
      next: response => {
        this.goods.push(response);
        this.add();
      },
      error: err => {
        console.log(err);
      },
    });
  }
  add() {
    this.settings;
  }
  selectData(event: { data: IGood; selected: any }) {
    this.selectedRow = event.data;
    this.selectedGooods = event.selected;
    console.log(this.selectedRow);
    console.log(this.selectedGooods);
    this.changeDetectorRef.detectChanges();
  }

  updateGoodsVault() {
    try {
      this.selectedGooods.forEach(good => {
        const data = {
          id: good.id,
          goodId: good.goodId,
          observations: good.observations,
          quantity: good.quantity,
          goodClassNumber: good.goodClassNumber,
          unit: good.unit,
          labelNumber: good.labelNumber,
          vaultNumber: this.form.get('safe').value,
          // estatus: good.estatus // incluir la propiedad estatus
        };
        // if (this.validarGood()) return;
        console.log('nuevo -->', data);
        this.serviceGood.update(data).subscribe(
          res => {
            // this.alert('success', 'Bienes', `Actualizados correctamente`);
            // this.add();
            console.log(res);
            this.allGoodsUpdated.emit(this.allGoods);
          },
          err => {
            this.alert(
              'error',
              'Bien',
              'No se pudo actualizar el bien, por favor intentelo nuevamente'
            );
          }
        );
      });

      this.alert('success', 'Bienes', `Actualizados correctamente`);
    } catch (err) {
      console.error(err);
    }
  }

  updateGoodsWareHouse() {
    try {
      this.selectedGooods.forEach(good => {
        const data = {
          id: good.id,
          goodId: good.goodId,
          observations: good.observations,
          quantity: good.quantity,
          goodClassNumber: good.goodClassNumber,
          unit: good.unit,
          labelNumber: good.labelNumber,
          storeNumber: this.form.get('warehouse').value,
          // estatus: this.selectedRow.estatus // incluir la propiedsad estatus
        };
        // if (this.validarGood()) return;
        console.log('nuevo -->', data);
        this.serviceGood.update(data).subscribe(
          res => {
            // this.alert('success', 'Bienes', `Actualizados correctamente`);
            // this.add();
            console.log(res);
            this.allGoodsUpdated.emit(this.allGoods);
          },
          err => {
            this.alert(
              'error',
              'Bien',
              'No se pudo actualizar el bien, por favor intentelo nuevamente'
            );
          }
        );
      });
      this.alert('success', 'Bienes', `Actualizados correctamente`);
    } catch (err) {
      console.error(err);
    }
  }

  goToGoodTracker() {
    this.bsModalRef.hide();
    this.router.navigate(['/pages/general-processes/goods-tracker'], {
      queryParams: { origin: 'FACTADBUBICABIEN' },
    });
  }
}
