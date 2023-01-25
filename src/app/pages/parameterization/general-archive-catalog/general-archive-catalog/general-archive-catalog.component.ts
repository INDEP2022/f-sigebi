import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
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

@Component({
  selector: 'app-general-archive-catalog',
  templateUrl: './general-archive-catalog.component.html',
  styles: [],
})
export class GeneralArchiveCatalogComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});

  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;

  dataShelves: LocalDataSource = new LocalDataSource();
  dataBattery: LocalDataSource = new LocalDataSource();
  dataLockers: LocalDataSource = new LocalDataSource();

  settingsBattery;
  settingsShelves;
  settingsLockers;

  constructor(
    private fb: FormBuilder,
    private saveValueService: SaveValueService,
    private shelvessService: ShelvessService,
    private batterysService: BatterysService,
    private lockersService: LockersService
  ) {
    super();
    this.settingsBattery = {
      ...this.settings,
      actions: {
        add: false,
        edit: true,
        delete: false,
      },
      columns: { ...BATTERY_COLUMNS },
    };
    this.settingsShelves = {
      ...this.settings,
      actions: {
        add: false,
        edit: true,
        delete: false,
      },
      columns: { ...SHELVES_COLUMNS },
    };
    this.settingsLockers = {
      ...this.settings,
      actions: {
        add: false,
        edit: true,
        delete: false,
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
      description: [null, []],
      location: [null, []],
      responsible: [null, []],
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
          this.alert('info', 'No se encontraron registros', '');
        }
        this.loading = false;
      },
      error => (this.loading = false)
    );
  }

  //Métodos para llenar tabla de Estantes/Shelves con ID de Guardavalor/SaveValues
  getShelvesBySaveValues(id: string | number): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getShelves(id));
  }

  getShelves(id: string | number): void {
    this.shelvessService
      .getByCveSaveValues(id, this.params.getValue())
      .subscribe(
        response => {
          //console.log(response);
          let data = response.data.map((item: IShelves) => {
            //console.log(item);
            return item;
          });
          this.dataShelves.load(data);
          this.totalItems = response.count;
          this.loading = false;
        },
        error => (this.loading = false)
      );
  }

  //Métodos para llenar tabla de Bateria/Battery con ID de Guardavalor/SaveValues
  getBatteryBySaveValues(id: string | number): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getBattery(id));
  }

  getBattery(id: string | number): void {
    this.batterysService
      .getByCveSaveValues(id, this.params.getValue())
      .subscribe(
        response => {
          //console.log(response);
          let data = response.data.map((item: IBattery) => {
            //console.log(item);
            return item;
          });
          this.dataBattery.load(data);
          this.totalItems = response.count;
          this.loading = false;
        },
        error => (this.loading = false)
      );
  }

  //Métodos para llenar tabla de Casilleros/Locker con ID de Guardavalor/SaveValues
  getLockerBySaveValues(id: string | number): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getLocker(id));
  }

  getLocker(id: string | number): void {
    this.lockersService
      .getByCveSaveValues(id, this.params.getValue())
      .subscribe(
        response => {
          //console.log(response);
          let data = response.data.map((item: ILocker) => {
            //console.log(item);
            return item;
          });
          this.dataLockers.load(data);
          this.totalItems = response.count;
          this.loading = false;
        },
        error => (this.loading = false)
      );
  }
}
