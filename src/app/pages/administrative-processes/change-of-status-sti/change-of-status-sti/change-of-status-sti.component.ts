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
import { clearGoodCheck, COLUMNS, goodCheck } from './columns';

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
  completeFilters: any[] = [];

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
          this.completeFilters = filters;
          filters.map((filter: any) => {
            let searchFilter = SearchFilter.ILIKE;
            if (filter.search !== '') {
              this.columnFilters[
                filter.field
              ] = `${searchFilter}:${filter.search}`;
            }
          });
          this.searchByFilter();
        }
      });

    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      if (this.busco && this.numberFile.value != null) {
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

  async changeStatusGood() {
    return new Promise(async (resolve, reject) => {
      try {
        const updatePromises = goodCheck.map(async item => {
          const good = item.row;
          const updateGood = {
            id: Number(good.id),
            goodId: Number(good.id),
            status: this.goodStatus.value,
            observations: `${good.observations}. ${this.description.value}`,
            userModification: this.token.decodeToken().preferred_username,
          };

          const response = await this.goodServices
            .update(updateGood)
            .toPromise();
          console.log(response);
          this.postHistoryGood(good);
          this.form.get('description').reset();
        });

        await Promise.all(updatePromises);

        resolve({ resp: 'finish updated' });
      } catch (error) {
        reject({ resp: 'updated error' });
      }
    });
  }

  async accept() {
    console.log('Se activo');
    if (goodCheck.length == 0) {
      this.alert('warning', 'Información', 'Debe seleccionar al menos un Bien');
      return;
    } else if (this.description.value == null) {
      this.alert(
        'warning',
        'Campos requerido',
        'La descripcion es obligatoria'
      );
      return;
    } else {
      const resp = await this.changeStatusGood();
      if (JSON.parse(JSON.stringify(resp)).resp == 'finish updated') {
        this.searchByFilter();
        this.alert(
          'success',
          'Se cambió el estatus a los Bienes seleccionados',
          ''
        );
      } else {
        this.searchByFilter();
        this.alert(
          'error',
          'Hubo un error inesperado al actualizar el estatus a los Bienes',
          ''
        );
      }
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

  searchByFilter() {
    this.loading = true;
    this.busco = true;
    const paramsF = new FilterParams();
    paramsF.addFilter('status', 'STI');
    paramsF.addFilter('fileNumber', this.numberFile.value);
    paramsF.page = this.params.value.page;
    paramsF.limit = this.params.value.limit;
    for (let data of this.completeFilters) {
      paramsF.addFilter(
        data.field,
        data.search,
        data.field != 'id' ? SearchFilter.ILIKE : SearchFilter.EQ
      );
    }

    console.log(paramsF.getParams());
    this.goodServices.getAllFilter(paramsF.getParams()).subscribe(
      res => {
        this.goods.load(res.data);
        this.loading = false;
        this.totalItems = res.count;
      },
      err => {
        console.log(err);
        this.goods.load([]);
        this.totalItems = 0;
        this.loading = false;
      }
    );
  }

  listGoods() {
    this.loading = true;
    this.busco = true;
    clearGoodCheck();
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
            this.alert(
              'warning',
              `El expediente ${this.numberFile.value} no cuenta con Bienes con estatus STI`,
              ''
            );
            this.goods.load([]);
            this.loading = false;
          } else {
            this.goods.load(response.data);
            this.totalItems = response.count;
            this.enableToDelete = true;
            this.loading = false;
            this.currentDate.disable();
          }
        },
        error: error => {
          this.alert(
            'warning',
            `El expediente ${this.numberFile.value} no cuenta con Bienes con estatus STI`,
            ''
          );
          console.log(error);
          this.goods.load([]);
          this.numberFile.reset();
          this.limit = new FormControl(10);
          this.params.next(new ListParams());
          this.totalItems = 0;
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
        if (goodCheck.length != this.goods['data'].length) {
          /* this.listGoods(); */
        }
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
