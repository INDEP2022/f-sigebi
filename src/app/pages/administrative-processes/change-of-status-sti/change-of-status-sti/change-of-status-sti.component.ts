import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IHistoryGood } from 'src/app/core/models/administrative-processes/history-good.model';
import { IGood } from 'src/app/core/models/ms-good/good';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { HistoryGoodService } from 'src/app/core/services/ms-history-good/history-good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  POSITVE_NUMBERS_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';

import { LocalDataSource } from 'ng2-smart-table';
import { COLUMNS, goodCheck } from './columns';

@Component({
  selector: 'app-change-of-status-sti',
  templateUrl: './change-of-status-sti.component.html',
  styleUrls: ['./change-of-status-sti.component.scss'],
})
export class ChangeOfStatusStiComponent extends BasePage implements OnInit {
  form: FormGroup;
  busco: boolean = false;
  get numberFile() {
    return this.form.get('numberFile');
  }
  get goodStatus() {
    return this.form.get('goodStatus');
  }
  get descriptionStatus() {
    return this.form.get('descriptionStatus');
  }
  get currentDate() {
    return this.form.get('currentDate');
  }
  get description() {
    return this.form.get('description');
  }

  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  limit: FormControl = new FormControl(10);
  goodSelect: any[] = [];
  goods: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  completeFilters: any[] = []

  //Activar y desactivar botones
  enableToDelete = false;

  constructor(
    private fb: FormBuilder,
    private readonly goodServices: GoodService,
    private token: AuthService,
    private readonly historyGoodService: HistoryGoodService
  ) {
    super();
    this.settings.hideSubHeader = false;
    this.settings.columns = COLUMNS;
    this.settings.actions = true;
  }

  ngOnInit(): void {
    this.goods
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        console.log(change);
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          this.completeFilters = filters
          filters.map((filter: any) => {
            let searchFilter = SearchFilter.ILIKE;
            if(filter.search !== ''){
              this.columnFilters[filter.field] = `${searchFilter}:${filter.search}`
            }
          });
          this.searchByFilter()
        }
      });

    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      if (this.busco) {
        this.listGoods();
      }
    });

    this.buildForm();
    this.form.disable();
    this.numberFile.enable();
    this.description.enable();
  }

  private buildForm() {
    this.form = this.fb.group({
      numberFile: [
        null,
        [Validators.required, Validators.pattern(POSITVE_NUMBERS_PATTERN)],
      ],
      goodStatus: ['ROP'],
      descriptionStatus: ['Notificado en Oficialia de Partes'],
      currentDate: [new Date()],
      description: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
  }

  settingsChange($event: any): void {
    this.settings = $event;
  }

  accept() {
    if (goodCheck.length == 0) {
      this.onLoadToast(
        'info',
        'Información',
        'Debe seleccionar al menos un Bien'
      );
      return;
    }
    if (this.description.value == null) {
      this.onLoadToast(
        'info',
        'Campos requerido',
        'La descripcion es obligatoria'
      );
      return;
    }
    try {
      goodCheck.forEach(item => {
        const good: IGood = item.row;
        const updateGood: IGood = {
          id: Number(good.id),
          goodId: Number(good.id),
          status: this.goodStatus.value,
          observations: `${good.observations}. ${this.description.value}`,
          userModification: this.token.decodeToken().preferred_username,
        };

        this.goodServices.update(updateGood).subscribe({
          next: response => {
            console.log(response);
            this.postHistoryGood(good);
            this.form.get('description').reset();
          },
          error: error => (this.loading = false),
        });
      });
      this.alert(
        'success',
        'Actualizado',
        'Se ha cambiado el Estatus de los bienes seleccionados'
      );
    } catch (error) {
      this.alert(
        'error',
        'ERROR',
        'Ha ocurrido un error en el proceso de cambio'
      );
    }
  }

  clearAll() {
    this.form.get('numberFile').reset();
    this.form.get('description').reset();
    this.goods.load([]);
    this.limit = new FormControl(10);
    this.params.next(new ListParams());
    this.totalItems = 0;
    this.enableToDelete = false;
  }

  searchByFilter(){
    this.loading = true
    this.busco = true
    const paramsF = new FilterParams()
    paramsF.addFilter('status', 'STI')
    paramsF.addFilter('fileNumber', this.numberFile.value)
    paramsF.page = this.params.value.page
    paramsF.limit = this.params.value.limit
    for(let data of this.completeFilters){
      paramsF.addFilter(data.field, data.search, SearchFilter.ILIKE)
    }

    console.log(paramsF.getParams())
    this.goodServices.getAllFilter(paramsF.getParams()).subscribe(
      res => {
        this.goods.load(res.data)
        this.loading = false
      },
      err => {
        console.log(err)
        this.loading = false
      }
    )
  }

  listGoods() {
    this.loading = true;
    this.busco = true;
    this.form.get('description').reset();
    this.goodServices
      .getByExpedientAndStatus(
        this.numberFile.value,
        'STI',
        this.params.getValue()
      )
      .subscribe({
        next: (response: any) => {
          console.log(response);
          if (response.length == 0) {
            this.onLoadToast(
              'info',
              'Información',
              'No hay bienes con status STI'
            );
            this.goods.load([]);
            this.loading = false;
            return;
          }
          this.goods.load(response.data);
          this.totalItems = response.count;
          this.enableToDelete = true;
          this.loading = false;
          this.currentDate.disable();
        },
        error: error => {
          this.onLoadToast('info', 'Información', 'No existe este expediente');
          console.log(error);
          this.goods.load([]);
          this.loading = false;
        },
      });
  }

  postHistoryGood(good: IGood) {
    const historyGood: IHistoryGood = {
      propertyNum: good.id,
      status: this.goodStatus.value,
      changeDate: new Date(),
      userChange: this.token.decodeToken().preferred_username,
      statusChangeProgram: 'FCAMBIOESTATSTI',
      reasonForChange: 'CAMBIO ESTATUS STI',
      registryNum: null,
      extDomProcess: null,
    };
    this.historyGoodService.create(historyGood).subscribe({
      next: response => {
        this.listGoods();
      },
      error: error => {
        this.loading = false;
      },
    });
  }

  deleteExpedient() {
    this.goodServices.getByExpedient(this.numberFile.value).subscribe(
      res => {
        if (res.count > 0) {
          this.alert(
            'warning',
            'No es posible suprimir el registro principal al existir registros detallados asociados',
            ''
          );
        } else {
        }
      },
      err => {
        console.log(err);
      }
    );
  }
}
