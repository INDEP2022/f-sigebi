import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
//Columns
import { BATTERY_COLUMNS } from './battery-colums';
import { LOCKERS_COLUMNS } from './lockers-columns';
import { SAVEVALUES_COLUMNS } from './save-values-columnst';
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
import { ISaveValue } from 'src/app/core/models/catalogs/save-value.model';
import Swal from 'sweetalert2';
import { BatteryModalComponent } from '../battery-modal/battery-modal.component';
import { LockersModalComponent } from '../lockers-modal/lockers-modal.component';
import { SaveValuesModalComponent } from '../save-values-modal/save-values-modal.component';
import { ShelvesModalComponent } from '../shelves-modal/shelves-modal.component';

@Component({
  selector: 'app-general-archive-catalog',
  templateUrl: './general-archive-catalog.component.html',
  styles: [],
})
export class GeneralArchiveCatalogComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});

  saveValuesList: ISaveValue[] = [];
  batteryList: IBattery[] = [];
  shelvesList: IShelves[] = [];
  lockerList: ILocker[] = [];

  idSaveValues: ISaveValue;
  storeCode: IBattery;
  idBattery: IBattery;
  idShelve: IShelves;

  saveValueKey: IShelves;
  numBattery: IShelves;
  numShelf: IShelves;

  params1 = new BehaviorSubject<ListParams>(new ListParams());
  params2 = new BehaviorSubject<ListParams>(new ListParams());
  params3 = new BehaviorSubject<ListParams>(new ListParams());
  params4 = new BehaviorSubject<ListParams>(new ListParams());

  totalItems1: number = 0;
  totalItems2: number = 0;
  totalItems3: number = 0;
  totalItems4: number = 0;

  loading1 = this.loading;
  loading2 = this.loading;
  loading3 = this.loading;
  loading4 = this.loading;

  dataShelves: LocalDataSource = new LocalDataSource();
  dataBattery: LocalDataSource = new LocalDataSource();
  dataLockers: LocalDataSource = new LocalDataSource();

  settingsSaveValues;
  settingsBattery;
  settingsShelves;
  settingsLockers;

  lockers: ILocker;

  selectedSaveValues: boolean = false;
  selectedBattery: boolean = false;
  selectedShelve: boolean = false;

  constructor(
    private fb: FormBuilder,
    private saveValueService: SaveValueService,
    private shelvessService: ShelvessService,
    private batterysService: BatterysService,
    private lockersService: LockersService,
    private modalService: BsModalService
  ) {
    super();
    this.settingsSaveValues = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: true,
        position: 'right',
      },
      columns: { ...SAVEVALUES_COLUMNS },
    };
    this.settingsBattery = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: true,
        position: 'right',
      },
      columns: { ...BATTERY_COLUMNS },
    };
    this.settingsShelves = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: true,
        position: 'right',
      },
      columns: { ...SHELVES_COLUMNS },
    };
    this.settingsLockers = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: true,
        position: 'right',
      },
      columns: { ...LOCKERS_COLUMNS },
    };
  }

  ngOnInit(): void {
    // this.prepareForm();
    this.params1
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getSaveValues());
  }

  //Tabla GuardaValor Archivo Gral
  getSaveValues() {
    this.loading1 = true;
    this.saveValueService.getAll(this.params1.getValue()).subscribe({
      next: response => {
        console.log(response);
        this.saveValuesList = response.data;
        this.totalItems1 = response.count;
        this.loading1 = false;
      },
      error: error => {
        this.loading1 = false;
        console.log(error);
      },
    });
  }

  openFormSaveValues(saveValues?: ISaveValue) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      saveValues,
      callback: (next: boolean) => {
        if (next) this.getSaveValues();
      },
    };
    this.modalService.show(SaveValuesModalComponent, modalConfig);
  }

  //msj de alerta para eliminar un guardavalor
  showDeleteAlert1(saveValues?: ISaveValue) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea borrar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(saveValues);
      }
    });
  }

  //método para borrar registro de guardavalor
  delete(saveValues?: ISaveValue) {
    this.saveValueService.remove2(saveValues).subscribe({
      next: () => (Swal.fire('Borrado', '', 'success'), this.getSaveValues()),
      error: err => {
        this.alertQuestion(
          'error',
          'No se puede eliminar Guardavalor',
          'Primero elimine sus baterias disponibles'
        );
      },
    });
  }

  //Evento al seleccionar fila de tabla Guardavaluo
  rowsSelectedSaveValues(event: any) {
    this.idSaveValues = event.data;
    this.batteryList = [];
    this.params2
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getBattery(this.idSaveValues));
    this.selectedSaveValues = true;
  }

  //Método para traer registros de Baterias basados en ID de Guardavalor
  getBattery(idSaveValues: ISaveValue) {
    this.loading2 = true;
    this.batterysService
      .getByCveSaveValues(idSaveValues.id, this.params2.getValue())
      .subscribe({
        next: response => {
          console.log(response);
          this.batteryList = response.data;
          this.totalItems2 = response.count;
          this.loading2 = false;
        },
        error: error => (
          this.showNullRegisterBattery(), (this.loading2 = false)
        ),
      });
  }

  //Msj de que no existe bateria del guardavalor seleccionado
  showNullRegisterBattery() {
    this.alertQuestion(
      'warning',
      'Guardavalor sin bateria',
      '¿Desea agregarlas ahora?'
    ).then(question => {
      if (question.isConfirmed) {
        this.openFormBattery();
      }
    });
  }

  //Abrir formulario de Batterias
  openFormBattery(battery?: IBattery) {
    const cve = { ...this.idSaveValues };
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      battery,
      cve,
      callback: (next: boolean) => {
        if (next) this.getBattery(this.idSaveValues);
      },
    };
    this.modalService.show(BatteryModalComponent, modalConfig);
  }

  //msj de alerta para eliminar una Bateria
  showDeleteAlert2(battery?: IBattery) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea borrar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete2(battery);
      }
    });
  }

  //método para borrar registro de Batteria
  delete2(battery?: IBattery) {
    this.batterysService.remove(battery.idBattery).subscribe({
      next: () => (Swal.fire('Borrado', '', 'success'), this.getSaveValues()),
      error: err => {
        this.alertQuestion(
          'error',
          'No se puede eliminar Bateria',
          'Primero elimine sus estantes disponibles'
        );
      },
    });
  }

  //Evento al seleccionar fila de Batteria
  rowsSelectedBattery(event: any) {
    this.storeCode = event.data;
    this.idBattery = event.data;
    this.shelvesList = [];
    this.params3
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getShelves(this.storeCode, this.idBattery));
    this.selectedBattery = true;
  }

  //Método para llenar tabla de registros basado en los filtros
  getShelves(battery1: IBattery, battery2: IBattery) {
    this.loading3 = true;
    this.idSaveValues = battery1.storeCode as unknown as ISaveValue;
    this.shelvessService
      .getByCveSaveValues(
        this.idSaveValues.id,
        battery2.idBattery,
        this.params3.getValue()
      )
      .subscribe({
        next: response => {
          console.log(response);
          this.shelvesList = response.data;
          this.totalItems3 = response.count;
          this.loading3 = false;
        },
        error: error => (
          this.showNullRegisterShelves(), (this.loading3 = false)
        ),
      });
  }

  //Msj de que no existe estantes de la bateria seleccionada
  showNullRegisterShelves() {
    this.alertQuestion(
      'warning',
      'Bateria sin estantes ',
      '¿Desea agregarlos ahora?'
    ).then(question => {
      if (question.isConfirmed) {
        this.openFormShelves();
      }
    });
  }

  //Abrir formulario de Estantes
  openFormShelves(shelves?: IShelves) {
    const modalConfig = MODAL_CONFIG;
    const cve = { ...this.idSaveValues };
    const noBattery = { ...this.idBattery };
    console.log(noBattery);
    modalConfig.initialState = {
      shelves,
      cve,
      noBattery,
      callback: (next: boolean) => {
        if (next) this.getShelves(this.storeCode, this.idBattery);
      },
    };
    this.modalService.show(ShelvesModalComponent, modalConfig);
  }

  //msj de alerta para eliminar un estante
  showDeleteAlert3(shelves?: IShelves) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea borrar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete3(shelves);
      }
    });
  }

  //método para borrar registro de estante
  delete3(shelves?: IShelves) {
    const idKey = { ...this.idSaveValues };
    const idBattery = { ...this.idBattery };

    const formData: Object = {
      key: idKey.id as string,
      batteryNumber: Number(idBattery.idBattery),
      id: Number(shelves.id),
    };
    console.log('key', formData);
    this.shelvessService.remove(formData).subscribe({
      next: () => (Swal.fire('Borrado', '', 'success'), this.getSaveValues()),
      error: err => {
        this.alertQuestion(
          'error',
          'No se puede eliminar estante',
          'Primero elimine sus casilleros disponibles'
        );
      },
    });
  }

  //Evento al seleccionar fila de Shelves
  rowsSelectedShelves(event: any) {
    this.saveValueKey = event.data;
    this.numBattery = event.data;
    this.numShelf = event.data;
    this.lockerList = [];
    this.params4
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() =>
        this.getLocker(this.saveValueKey, this.numBattery, this.numShelf)
      );
    this.selectedShelve = true;
  }

  //Métodos para llenar tabla de Casilleros/Locker con ID de Guardavalor/SaveValues
  getLocker(saveValueKey: IShelves, numBattery: IShelves, numShelf: IShelves) {
    this.loading4 = true;
    this.idSaveValues = saveValueKey.key as unknown as ISaveValue;
    this.idBattery = numBattery.batteryNumber as unknown as IBattery;
    this.lockersService
      .getByCveSaveValues(
        this.idSaveValues.id,
        this.idBattery.idBattery,
        numShelf.id,
        this.params4.getValue()
      )
      .subscribe({
        next: response => {
          console.log(response);
          this.lockerList = response.data;
          this.totalItems4 = response.count;
          this.loading4 = false;
        },
        error: error => (
          this.showNullRegisterLocker(), (this.loading4 = false)
        ),
      });
  }

  //Msj de que no existe casilleros del estante seleccionado
  showNullRegisterLocker() {
    this.alertQuestion(
      'warning',
      'Estante sin casilleros',
      '¿Desea agregarlos ahora?'
    ).then(question => {
      if (question.isConfirmed) {
        this.openFormLocker();
      }
    });
  }

  //Abrir formulario de casilleros
  openFormLocker(locker?: ILocker) {
    const modalConfig = MODAL_CONFIG;
    const cve = { ...this.idSaveValues };
    const noBattery = { ...this.idBattery };
    const noShelve = { ...this.numShelf };
    modalConfig.initialState = {
      locker,
      cve,
      noBattery,
      noShelve,
      callback: (next: boolean) => {
        if (next)
          this.getLocker(this.saveValueKey, this.numBattery, this.numShelf);
      },
    };
    this.modalService.show(LockersModalComponent, modalConfig);
  }

  //msj de alerta para eliminar un Casillero
  showDeleteAlert4(locker?: ILocker) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea borrar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete4(locker);
      }
    });
  }

  //método para borrar registro de casillero
  delete4(locker?: ILocker) {
    this.lockersService.remove(locker.id).subscribe({
      next: () => (
        (this.loading4 = false),
        Swal.fire('Borrado', '', 'success'),
        this.getShelves(this.storeCode, this.idBattery)
      ),
    });
  }
}
