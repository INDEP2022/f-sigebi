import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
//Models
import { BATTERY_COLUMNS } from './battery-colums';
import { LOCKERS_COLUMNS } from './lockers-columns';
import { SHELVES_COLUMNS } from './shelves-columns';
//services
import { SaveValueService } from 'src/app/core/services/catalogs/save-value.service';
import { BatterysService } from 'src/app/core/services/save-values/battery.service';
import { LockersService } from 'src/app/core/services/save-values/locker.service';
import { ShelvessService } from 'src/app/core/services/save-values/shelves.service';
//models
import { IBattery } from 'src/app/core/models/catalogs/battery.model';
import { ILocker } from 'src/app/core/models/catalogs/locker.model';
import { IShelves } from 'src/app/core/models/catalogs/shelves.model';

//Component modal
import { BatteryModalComponent } from '../battery-modal/battery-modal.component';
import { LockersModalComponent } from '../lockers-modal/lockers-modal.component';
import { ShelvesModalComponent } from '../shelves-modal/shelves-modal.component';

@Component({
  selector: 'app-general-archive-catalog',
  templateUrl: './general-archive-catalog.component.html',
  styles: [],
})
export class GeneralArchiveCatalogComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  battery: IBattery[] = [];

  params1 = new BehaviorSubject<ListParams>(new ListParams());
  params2 = new BehaviorSubject<ListParams>(new ListParams());
  params3 = new BehaviorSubject<ListParams>(new ListParams());

  totalItems1: number = 0;
  totalItems2: number = 0;
  totalItems3: number = 0;

  dataShelves: LocalDataSource = new LocalDataSource();
  dataBattery: LocalDataSource = new LocalDataSource();
  dataLockers: LocalDataSource = new LocalDataSource();

  settingsBattery;
  settingsShelves;
  settingsLockers;

  shelvesList: IShelves[] = [];
  lockers: ILocker;

  constructor(
    private fb: FormBuilder,
    private saveValueService: SaveValueService,
    private shelvessService: ShelvessService,
    private batterysService: BatterysService,
    private lockersService: LockersService,
    private modalService: BsModalService
  ) {
    super();
    this.settingsBattery = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: false,
        position: 'right',
      },
      columns: { ...BATTERY_COLUMNS },
    };
    this.settingsShelves = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: false,
        position: 'right',
      },
      columns: { ...SHELVES_COLUMNS },
    };
    this.settingsLockers = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: false,
        position: 'right',
      },
      columns: { ...LOCKERS_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      id: [null, [Validators.required]],
      description: [{ value: null, disabled: true }],
      location: [{ value: null, disabled: true }],
      responsible: [{ value: null, disabled: true }],
    });
  }

  //Traer Guardavalores por ID y rellenar en los inputs
  getSaveValuesById(): void {
    let _id = this.form.controls['id'].value;
    this.loading = true;
    this.saveValueService.getById(_id).subscribe(
      response => {
        console.log(response);
        if (response !== null) {
          this.form.patchValue(response);
          this.form.updateValueAndValidity();
          this.getShelvesBySaveValues(response.id);
          this.getBatteryBySaveValues(response.id);
          this.getLockerBySaveValues(response.id);
        } else {
          this.alert('info', 'No se encontraron algunos registros', '');
        }
        this.loading = false;
      },
      error => (this.loading = false)
    );
  }

  //Métodos para llenar tabla de Bateria/Battery con ID de Guardavalor/SaveValues
  getBatteryBySaveValues(id: string | number): void {
    this.params1
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getBattery(id));
  }

  getBattery(id: string | number): void {
    this.batterysService
      .getByCveSaveValues(id, this.params1.getValue())
      .subscribe(
        response => {
          //console.log(response);
          let data = response.data.map((item: IBattery) => {
            //console.log(item);
            return item;
          });
          this.dataBattery.load(data);
          this.totalItems1 = response.count;
          this.loading = false;
        },
        error => (this.loading = false)
      );
  }

  openFormBattery(battery?: IBattery) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      battery,
      callback: (next: boolean) => {
        if (next) this.getSaveValuesById();
      },
    };
    this.modalService.show(BatteryModalComponent, modalConfig);
  }

  //Métodos para llenar tabla de Estantes/Shelves con ID de Guardavalor/SaveValues
  getShelvesBySaveValues(id: string | number): void {
    this.params3
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getShelves(id));
  }

  getShelves(id: string | number): void {
    this.shelvessService
      .getByCveSaveValues(id, this.params3.getValue())
      .subscribe(
        response => {
          //console.log(response);
          let data = response.data.map((item: IShelves) => {
            //console.log(item);
            return item;
          });
          this.dataShelves.load(data);
          this.totalItems3 = response.count;
          this.loading = false;
        },
        error => (this.loading = false)
      );
  }

  openFormShelves(shelves?: IShelves) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      shelves,
      callback: (next: boolean) => {
        if (next) this.getSaveValuesById();
      },
    };
    this.modalService.show(ShelvesModalComponent, modalConfig);
  }

  //Métodos para llenar tabla de Casilleros/Locker con ID de Guardavalor/SaveValues
  getLockerBySaveValues(id: string | number): void {
    this.params2
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getLocker(id));
  }

  getLocker(id: string | number): void {
    this.lockersService
      .getByCveSaveValues(id, this.params2.getValue())
      .subscribe(
        response => {
          //console.log(response);
          let data = response.data.map((item: ILocker) => {
            //console.log(item);
            return item;
          });
          this.dataLockers.load(data);
          this.totalItems2 = response.count;
          this.loading = false;
        },
        error => (this.loading = false)
      );
  }

  openFormLocker(locker?: ILocker) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      locker,
      callback: (next: boolean) => {
        if (next) this.getSaveValuesById();
      },
    };
    this.modalService.show(LockersModalComponent, modalConfig);
  }
}
