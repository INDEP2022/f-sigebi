import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { IExpedient } from 'src/app/core/models/ms-expedient/expedient';
import { IGood } from 'src/app/core/models/ms-good/good';
import { IMenageWrite } from 'src/app/core/models/ms-menage/menage.model';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { GoodFinderService } from 'src/app/core/services/ms-good/good-finder.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { MenageService } from 'src/app/core/services/ms-menage/menage.service';
import { BasePage } from 'src/app/core/shared/base-page';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { Repository } from 'src/app/common/repository/repository';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { KitchenwareModalGoodComponent } from '../kitchenware-modal-good/kitchenware-modal-good.component';
import { PROPERTY_REGISTRATION_COLUMNS } from './property-registration-columns';

@Component({
  selector: 'app-property-registration',
  templateUrl: './property-registration.component.html',
  styles: [],
})
export class PropertyRegistrationComponent extends BasePage implements OnInit {
  menajes: LocalDataSource = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  goods = new DefaultSelect<IGood>();
  goodsList = new DefaultSelect<IGood>();
  expedient: IExpedient;
  numberGoodSelect: number;
  addGood: boolean = false;
  enableAddgood: boolean = true;
  textButton: string = 'Agregar menaje';

  form: FormGroup;
  formGood: FormGroup;
  columnFilters: any = [];
  idGoodValue: number;
  idExpedientSearch: number | string;
  idGood: number;
  data: LocalDataSource = new LocalDataSource();

  isSelected: boolean = false;
  showButton: boolean = false;
  goodClassNumberIn: number;
  showSearchButton: boolean = true;

  paramsSubject = new BehaviorSubject<ListParams>(new ListParams());
  idExpedient: number | string;

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
    private readonly goodFinderService: GoodFinderService,
    private repositoryService: Repository<IGood>,
    private service: GoodFinderService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = PROPERTY_REGISTRATION_COLUMNS;
    this.settings.hideSubHeader = false;
    // this.settings.actions.add = false;
    // this.settings.actions.delete = false;
    // this.settings.actions.edit = false;
    this.settings.actions = false;
  }
  ngOnInit(): void {
    this.buildForm();
    this.form.disable();
    this.formGood.disable();
    this.numberFile.enable();
    this.showButton = false;
    this.menajes
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
              this.columnFilters = filters;
            } else {
              delete this.columnFilters;
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
      goodSelect: [null, [Validators.required]],
      goodsList: [null, [Validators.pattern(STRING_PATTERN)]],
    });
    this.formGood = this.fb.group({
      goodId: [null, [Validators.required]],
      goodsList: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
  }

  searchExpedient(event: any) {
    this.form.get('goodSelect').reset();
    this.formGood.disable();
    this.goodSelect.enable();
    this.goods = new DefaultSelect([], 0);
    this.menajes.load([]);
    this.numberGoodSelect = null;
    this.totalItems = 0;
    this.textButton = 'Agregar menaje';
    this.showSearchButton = false;
    const numberFile = Number(event);
    this.expedientServices.getById(numberFile).subscribe({
      next: response => {
        this.expedient = response;
        this.idExpedient = this.expedient.id;
        this.causePenal.setValue(this.expedient.criminalCase);
        this.preliminaryInquiry.setValue(this.expedient.preliminaryInquiry);
        this.goods = new DefaultSelect([], 0, true);
        // this.searchGoods(this.paramsSubject.getValue(), this.idExpedient);
      },
      error: err => {
        this.alert('warning', 'No Existe el Registro', '');
      },
    });
  }

  //TODO - Este es el bien que se escoge en el select
  uploadTableMenaje(good: IGood) {
    if (good) {
      this.loading = false;
      this.enableAddgood = false;
      this.formGood.enable();
      this.numberGoodSelect = good.id;
      this.goodClassNumberIn = Number(good.goodClassNumber);
      this.numberFile.enable();
      this.goodSelect.enable();
      this.menajes.load([]);
      // this.goods = new DefaultSelect([], 0);
      this.showSearchButton = false;
      this.textButton = 'Agregar menaje';
      this.totalItems = 0;
      this.isSelected = false;
      this.addGood = false;
      this.searchGoodMenage(good.id);
      this.searchGood(new ListParams());
    } else {
      this.cleandInfoGoods();
    }
  }
  openSearchGoods() {
    let expedient = this.idExpedient;
    console.log(expedient);
    let config: ModalOptions = {
      initialState: {
        expedient,
        callback: (next: any) => {
          if (next) {
            console.log(next);
            this.uploadTableMenaje(next.data);
            this.goodSelect.setValue(
              next.data.goodId + ' - ' + next.data.description
            );
          }
        },
      },
      class: 'modal-xl modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(KitchenwareModalGoodComponent, config);
  }
  //Busca el expediente
  searchGoods(paramsSubject?: ListParams, idExpedient?: number | string) {
    if (idExpedient) {
      this.idExpedientSearch = idExpedient;
      console.log(idExpedient);
    }
    console.log(idExpedient);
    // this.paramsSubject.getValue = paramsSubject;
    this.goodServices
      .getByExpedient(this.idExpedientSearch, paramsSubject)
      .subscribe({
        next: response => {
          //Son todos los bienes listados en el input "Seleccione un bien para ver sus menajes"
          this.goodSelect.enable();
          this.goods = new DefaultSelect(response.data, response.count);

          this.loading = false;
        },
        error: err => {
          this.goods = new DefaultSelect([], 0, true);
          this.loading = false;
          this.alert('warning', 'Expediente sin Bienes Asociados', ``);
        },
      });
  }

  searchGoodMenageOnInit = true;
  searchGoodMenage(idGood: number) {
    //Busca si el tipo de bien en INMUEBLE para mostrar o no el botón de Agregar menaje
    this.repositoryService.getMenajeInmueble(this.goodClassNumberIn).subscribe({
      next: response => {
        let verifyProperty = response.data;
        this.showButton = verifyProperty[0]['numType'].id === '6';
        this.showSearchButton = true;
      },
      error: error => {
        this.loading = false;
      },
    });

    if (this.searchGoodMenageOnInit) {
      return;
    }

    const paramsF = new FilterParams();
    if (this.columnFilters !== undefined) {
      for (let data of this.columnFilters) {
        if (data.search !== '') {
          paramsF.addFilter(
            data.field === 'id' ? 'menajeDescription.id' : data.field,
            data.search,
            data.field !== 'id' ? SearchFilter.ILIKE : SearchFilter.EQ
          );
        }
      }
    }
    paramsF.addFilter('noGood', idGood);
    paramsF.page = this.params.value.page;
    paramsF.limit = this.params.value.limit;

    //Son los menajes que aparecen listados en la tabla
    this.menageServices.getMenaje(paramsF.getParams()).subscribe({
      next: response => {
        this.idGoodValue = idGood;
        if (response.count > 0) {
          console.log(response);
          this.menajes.load(
            response.data.map((menaje: any) => {
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
                  description: menaje.menajeDescription
                    .goodDescription as string,
                } as IGood;
              }
            })
          );
          this.menajes.refresh();
          this.totalItems = 0;
          this.totalItems = response.count;
          this.loading = false;
        } else {
          this.alert('warning', 'Bien sin menajes asociados', ``);
          this.loading = false;
          this.menajes.load([]);
          this.menajes.refresh();
          this.totalItems = 0;
          this.searchGoods(
            this.paramsSubject.getValue(),
            this.idExpedientSearch
          );
        }
      },
      error: err => {
        this.alert('warning', 'Bien sin menajes asociados', ``);
        this.menajes.load([]);
        this.menajes.refresh();
        this.loading = false;
        this.totalItems = 0;
        this.searchGoods(this.paramsSubject.getValue(), this.idExpedientSearch);
      },
    });
  }

  //Lista los menajes en el select
  searchGood(params: ListParams) {
    // if (id) {
    //   params['filter.goodId'] = id;
    // }
    params['filter.goodDescription'] = `$ilike:${params.text}`;
    params.text = '';
    params['search'] = '';
    console.log(params);
    this.service.getAll3(params).subscribe({
      next: response => {
        this.goodsList = new DefaultSelect(response.data, response.count);
        this.loading = false;
      },
      error: (err: any) => {
        this.loading = false;
        this.goodsList = new DefaultSelect();
        this.alert('warning', 'No Existen Bienes', ``);
      },
    });
  }

  //Busca en los menajes, lo que el usuario escribe para filtrar
  goodsListChange(inputElement: any) {
    const name = inputElement.value;
    console.log(name);
    setTimeout(() => {
      this.params.getValue().text = '';
      this.params.getValue()['search'] = '';
      this.goodFinderService
        .goodFinder2(name, this.params.getValue())
        .subscribe({
          next: response => {
            this.goodsList = new DefaultSelect(response.data, response.count);
            this.loading = false;
          },
          error: (err: any) => {
            this.loading = false;
            this.alert('warning', 'No Existen Bienes', ``);
          },
        });
    }, 4000);
  }

  onSelect(event: any) {
    const selectedValue = event;
    this.createMenage(this.numberGoodSelect, selectedValue.id);
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
        this.alert('success', 'Menaje Asociado', ``);
        this.textButton = 'Agregar menaje';
        this.showSearchButton = false;
        this.addGood = false;
        this.loading = false;
      },
      error: err => {
        this.alert('error', 'El Menaje ya fue Asociado', '');
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
        this.alert('success', 'Menaje Eliminado', '');
      },
      error: err => {
        this.alert('error', 'No es Posible Eliminar el Menaje', ``);
      },
    });
  }

  cleandInfoGoods() {
    this.numberGoodSelect = null;
    this.goods = new DefaultSelect([], 0);
    this.params = new BehaviorSubject<ListParams>(new ListParams());
    this.searchGoods(this.paramsSubject.getValue(), this.idExpedientSearch);
    this.menajes.load([]);
    this.showSearchButton = false;
    this.textButton = 'Agregar menaje';
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
    this.goodSelect.disable();
    this.goods = new DefaultSelect([], 0);
    this.menajes.load([]);
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
