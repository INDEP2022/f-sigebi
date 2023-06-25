import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { IExpedient } from 'src/app/core/models/ms-expedient/expedient';
import { IGood } from 'src/app/core/models/ms-good/good';
import { IMenageWrite } from 'src/app/core/models/ms-menage/menage.model';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { MenageService } from 'src/app/core/services/ms-menage/menage.service';
import { BasePage } from 'src/app/core/shared/base-page';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { Repository } from 'src/app/common/repository/repository';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { PROPERTY_REGISTRATION_COLUMNS } from './property-registration-columns';

@Component({
  selector: 'app-property-registration',
  templateUrl: './property-registration.component.html',
  styles: [],
})
export class PropertyRegistrationComponent extends BasePage implements OnInit {
  menajes: IGood[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  goods = new DefaultSelect<IGood>();
  expedient: IExpedient;
  numberGoodSelect: number;

  addGood: boolean = false;
  enableAddgood: boolean = true;
  textButton: string = 'Agregar menaje';

  form: FormGroup;
  formGood: FormGroup;
  columnFilters: any = [];
  idGoodValue: number;
  idGood: number;
  data: LocalDataSource = new LocalDataSource();

  isSelected: boolean = false;
  showButton: boolean = false;
  goodClassNumberIn: number;
  showSearchButton: boolean = true;

  get numberFile() {
    return this.form.get('numberFile');
  }
  get causePenal() {
    return this.form.get('causePenal');
  }
  get preliminaryInquiry() {
    return this.form.get('preliminaryInquiry');
  }
  get goodSelect() {
    return this.form.get('goodSelect');
  }

  constructor(
    private fb: FormBuilder,
    private readonly expedientServices: ExpedientService,
    private readonly goodServices: GoodService,
    private readonly menageServices: MenageService,
    private repositoryService: Repository<IGood>
  ) {
    super();
    this.settings.columns = PROPERTY_REGISTRATION_COLUMNS;
    this.settings.hideSubHeader = false;
    this.settings.actions.add = false;
    this.settings.actions.delete = true;
    this.settings.actions.edit = false;
  }

  ngOnInit(): void {
    this.buildForm();
    this.form.disable();
    this.formGood.disable();
    this.numberFile.enable();
    this.showButton = false;
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            filter.field == 'id' || filter.field == 'description'
              ? (searchFilter = SearchFilter.EQ)
              : (searchFilter = SearchFilter.ILIKE);
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.searchGoodMenage(this.idGoodValue);
        }
      });
    this.params.subscribe(() => {
      if (this.searchGoodMenageOnInit) {
        // Desactivar la ejecución condicional para la siguiente vez
        this.searchGoodMenageOnInit = false;
      } else {
        this.searchGoodMenage(this.idGoodValue);
      }
    });
  }

  private buildForm() {
    this.form = this.fb.group({
      numberFile: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      causePenal: [null],
      preliminaryInquiry: [null],
      goodSelect: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
    this.formGood = this.fb.group({
      goodId: [null, [Validators.required]],
    });
  }

  searchExpedient(event: any) {
    this.form.get('goodSelect').reset();
    this.formGood.disable();
    this.goodSelect.enable();
    this.goods = new DefaultSelect([], 0);
    this.menajes = [];
    this.numberGoodSelect = null;
    this.totalItems = 0;
    this.textButton = 'Agregar menaje';
    this.showSearchButton = false;

    const numberFile = Number(event);
    this.expedientServices.getById(numberFile).subscribe({
      next: response => {
        this.expedient = response;
        this.causePenal.setValue(this.expedient.criminalCase);
        this.preliminaryInquiry.setValue(this.expedient.preliminaryInquiry);
        this.searchGoods(this.expedient.id);
      },
      error: err => {
        this.onLoadToast('error', 'ERROR', 'No existe el registro');
      },
    });
  }

  uploadTableMenaje(good: IGood) {
    if (good) {
      this.enableAddgood = false;
      this.formGood.enable();
      this.numberGoodSelect = good.id;
      this.goodClassNumberIn = Number(good.goodClassNumber);
      this.searchGoodMenage(good.id);
    } else {
      this.cleandInfoGoods();
    }
  }

  searchGoods(idExpedient: number | string) {
    this.goodServices
      .getByExpedient(idExpedient, this.params.getValue())
      .subscribe({
        next: response => {
          this.goodSelect.enable();
          //Son todos los bienes listados en el input "Seleccione un bien para ver sus menajes"
          this.goods = new DefaultSelect(response.data, response.count);
        },
        error: err => {
          this.loading = false;
        },
      });
  }

  searchGoodMenageOnInit = true;
  searchGoodMenage(idGood: number) {
    this.repositoryService.getMenajeInmueble(this.goodClassNumberIn).subscribe({
      next: response => {
        this.menajes = [];
        let verifyProperty = response.data;
        this.showButton = verifyProperty[0]['numType'].id === '6';
        this.showSearchButton = true;
      },
      error: error => {
        this.loading = false;
      },
    });

    if (this.searchGoodMenageOnInit) {
      // Evitar la ejecución de this.menageServices.getByGood en ngOnInit
      return;
    }

    this.menageServices.getByGood(idGood, this.params.getValue()).subscribe({
      next: response => {
        this.idGoodValue = idGood;
        this.menajes = response.data.map(menaje => {
          if (menaje.menajeDescription === null) {
            return {
              noGoodMenaje: menaje.noGoodMenaje,
              id: menaje.noGoodMenaje as number,
              description: '' as string,
            } as IGood;
          } else {
            return {
              noGoodMenaje: menaje.noGoodMenaje,
              id: menaje.menajeDescription.id as number,
              description: menaje.menajeDescription.description as string,
            } as IGood;
          }
        });
        this.totalItems = response.count;
        this.loading = false;
      },
      error: err => {
        this.onLoadToast(
          'warning',
          'Eliminar',
          `No se encontraron menajes asociados al bien No. ${idGood}`
        );
        this.loading = false;
      },
    });
  }

  addMenage(good: IGood) {
    this.createMenage(this.numberGoodSelect, good.id);
    this.isSelected = true;
  }

  createMenage(idGood: string | number, idGoodMenaje: string | number) {
    const menaje: IMenageWrite = {
      noGood: idGood,
      noGoodMenaje: idGoodMenaje,
    };
    this.menageServices.create(menaje).subscribe({
      next: respose => {
        this.searchGoodMenage(this.numberGoodSelect);
        this.onLoadToast(
          'success',
          'Exitoso',
          `Menaje asociado correctamente al bien No. ${idGood}`
        );
        this.textButton = 'Agregar menaje';
        this.showSearchButton = false;
        this.addGood = false;
        this.loading = false;
      },
      error: err => {
        this.onLoadToast('error', 'ERROR', err.error.message);
      },
    });
  }

  showDeleteAlert(good: IGood) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(good.id);
      }
    });
  }

  delete(idGood: string | number) {
    this.menageServices.remove(idGood).subscribe({
      next: responde => {
        this.searchGoodMenage(this.numberGoodSelect);
        this.alert('success', 'Éxito', `Se elimino el menaje No. ${idGood}`);
      },
      error: err => {
        this.alert(
          'error',
          'ERROR',
          `No se pudo eliminar el menaje No. ${idGood}`
        );
      },
    });
  }

  cleandInfoGoods() {
    this.numberFile.enable();
    this.formGood.disable();
    this.goodSelect.enable();
    this.menajes = []; // Limpiar los datos actuales de menajes
    this.numberGoodSelect = null;
    this.showSearchButton = false;
    this.totalItems = 0;
    this.loading = false;
    this.isSelected = false;
    this.addGood = false;
  }

  cleandInfo() {
    this.form.reset();
    this.form.disable();
    this.numberFile.enable();
    this.formGood.disable();
    this.goodSelect.enable();
    this.goods = new DefaultSelect([], 0);
    this.menajes = [];
    this.numberGoodSelect = null;
    this.showSearchButton = false;
    this.textButton = 'Agregar menaje';
    this.totalItems = 0;
    this.loading = false;
    this.isSelected = false;
    this.addGood = false;
  }

  showGoods() {
    this.addGood = !this.addGood;
    this.addGood
      ? (this.textButton = 'Ocultar registro')
      : (this.textButton = 'Agregar menaje');
  }
}

/*

import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { IExpedient } from 'src/app/core/models/ms-expedient/expedient';
import { IGood } from 'src/app/core/models/ms-good/good';
import { IMenageWrite } from 'src/app/core/models/ms-menage/menage.model';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { MenageService } from 'src/app/core/services/ms-menage/menage.service';
import { BasePage } from 'src/app/core/shared/base-page';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { Repository } from 'src/app/common/repository/repository';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { PROPERTY_REGISTRATION_COLUMNS } from './property-registration-columns';

@Component({
  selector: 'app-property-registration',
  templateUrl: './property-registration.component.html',
  styles: [],
})
export class PropertyRegistrationComponent extends BasePage implements OnInit {
  menajes: IGood[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  goods = new DefaultSelect<IGood>();
  expedient: IExpedient;
  numberGoodSelect: number;

  addGood: boolean = false;
  enableAddgood: boolean = true;
  textButton: string = 'Agregar menaje';

  form: FormGroup;
  formGood: FormGroup;
  columnFilters: any = [];
  idGoodValue: number;
  idGood: number;
  data: LocalDataSource = new LocalDataSource();

  isSelected: boolean = false;
  showButton: boolean = false;
  goodClassNumberIn: number;
  showSearchButton: boolean = true;

  get numberFile() {
    return this.form.get('numberFile');
  }
  get causePenal() {
    return this.form.get('causePenal');
  }
  get preliminaryInquiry() {
    return this.form.get('preliminaryInquiry');
  }
  get goodSelect() {
    return this.form.get('goodSelect');
  }

  constructor(
    private fb: FormBuilder,
    private readonly expedientServices: ExpedientService,
    private readonly goodServices: GoodService,
    private readonly menageServices: MenageService,
    private repositoryService: Repository<IGood>
  ) {
    super();
    this.settings.columns = PROPERTY_REGISTRATION_COLUMNS;
    this.settings.hideSubHeader = false;
    this.settings.actions.add = false;
    this.settings.actions.delete = true;
    this.settings.actions.edit = false;
  }

  ngOnInit(): void {
    this.buildForm();
    this.form.disable();
    this.formGood.disable();
    this.numberFile.enable();
    this.showButton = false;
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            filter.field == 'id' || filter.field == 'description'
              ? (searchFilter = SearchFilter.EQ)
              : (searchFilter = SearchFilter.ILIKE);
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.searchGoodMenage(this.idGood);
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.searchGoodMenage(this.idGood));
  }

  private buildForm() {
    this.form = this.fb.group({
      numberFile: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      causePenal: [null],
      preliminaryInquiry: [null],
      goodSelect: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
    this.formGood = this.fb.group({
      goodId: [null, [Validators.required]],
    });
  }

  searchExpedient(event: any) {
    this.form.get('goodSelect').reset();
    this.formGood.disable();
    this.goodSelect.enable();
    this.goods = new DefaultSelect([], 0);
    this.menajes = [];
    this.numberGoodSelect = null;
    this.totalItems = 0;
    this.textButton = 'Agregar menaje';
    this.showSearchButton = false;

    const numberFile = Number(event);
    this.expedientServices.getById(numberFile).subscribe({
      next: response => {
        this.expedient = response;
        this.causePenal.setValue(this.expedient.criminalCase);
        this.preliminaryInquiry.setValue(this.expedient.preliminaryInquiry);
        this.searchGoods(this.expedient.id);
      },
      error: err => {
        this.onLoadToast('error', 'ERROR', 'No existe el registro');
      },
    });
  }

  uploadTableMenaje(good: IGood) {
    if (good) {
      this.enableAddgood = false;
      this.formGood.enable();
      this.numberGoodSelect = good.id;
      this.goodClassNumberIn = Number(good.goodClassNumber);
      this.searchGoodMenage(good.id);
    } else {
      this.cleandInfoGoods();
    }
  }

  searchGoods(idExpedient: number | string) {
    this.goodServices
      .getByExpedient(idExpedient, this.params.getValue())
      .subscribe({
        next: response => {
          this.goodSelect.enable();
          this.goods = new DefaultSelect(response.data, response.count); //Son todos los bienes listados en el input "Seleccione un bien para ver sus menajes"
        },
        error: err => {
          this.loading = false;
        },
      });
  }

  searchGoodMenage(idGood: number) {
    console.log('idGood', idGood)
    this.idGoodValue = idGood;
    this.repositoryService.getMenajeInmueble(this.goodClassNumberIn).subscribe({
      next: response => {
        let verifyProperty = response.data;
        this.showButton = verifyProperty[0]['numType'].id === '6';
        this.showSearchButton = true;
      },
      error: error => (this.loading = false),
    });

    this.menageServices.getByGood(idGood, this.params.getValue()).subscribe({
      next: response => {
        console.log('menageServices', idGood)
        this.menajes = response.data.map(menaje => {
          if (menaje.menajeDescription === null) {
            return {
              noGoodMenaje: menaje.noGoodMenaje,
              id: menaje.noGoodMenaje as number,
              description: '' as string,
            } as IGood;
          } else {
            return {
              noGoodMenaje: menaje.noGoodMenaje,
              id: menaje.menajeDescription.id as number,
              description: menaje.menajeDescription.description as string,
            } as IGood;
          }
        });
        this.totalItems = response.count;
        this.loading = false;
      },
      error: err => {
        this.loading = false;
      },
    });
  }

  addMenage(good: IGood) {
    this.createMenage(this.numberGoodSelect, good.id);
    this.isSelected = true;
  }

  createMenage(idGood: string | number, idGoodMenaje: string | number) {
    const menaje: IMenageWrite = {
      noGood: idGood,
      noGoodMenaje: idGoodMenaje,
    };
    this.menageServices.create(menaje).subscribe({
      next: respose => {
        this.searchGoodMenage(this.numberGoodSelect);
        this.onLoadToast(
          'success',
          'Exitoso',
          `Menaje asociado correctamente al bien No ${idGood}`
        );
        this.textButton = 'Agregar menaje';
        // this.isSelected = false;
        this.addGood = false;
        // this.numberGoodSelect = null;
        this.goods = new DefaultSelect([], 0);
      },
      error: err => {
        this.onLoadToast('error', 'ERROR', err.error.message);
      },
    });
  }

  showDeleteAlert(good: IGood) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(good.id);
      }
    });
  }

  delete(idGood: string | number) {
    this.menageServices.remove(idGood).subscribe({
      next: responde => {
        this.searchGoodMenage(this.numberGoodSelect);
        this.alert('success', 'Éxito', `Se elimino el menaje N° ${idGood}`);
      },
      error: err => {
        this.alert(
          'error',
          'ERROR',
          `No se pudo eliminar el menaje N° ${idGood}`
        );
      },
    });
  }

  cleandInfoGoods() {
    this.formGood.disable();
    this.numberFile.enable();
    this.goodSelect.enable();
    this.menajes = []; // Limpiar los datos actuales de menajes
    this.totalItems = 0;
    this.numberGoodSelect = null;
    this.loading = false;
    this.showSearchButton = false;
    this.addGood = false;
    this.isSelected = false;
  }

  cleandInfo() {
    this.form.reset();
    this.form.disable();
    this.formGood.disable();
    this.numberFile.enable();
    this.goodSelect.enable();
    this.goods = new DefaultSelect([], 0);
    this.menajes = [];
    this.numberGoodSelect = null;
    this.totalItems = 0;
    this.loading = false;
    this.textButton = 'Agregar menaje';
    this.showSearchButton = false;
    this.addGood = false;
    this.isSelected = false;
  }

  showGoods() {
    this.addGood = !this.addGood;
    this.addGood
      ? (this.textButton = 'Ocultar registro')
      : (this.textButton = 'Agregar menaje');
  }
}



 */
