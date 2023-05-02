import { Component, EventEmitter, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { RealStateService } from 'src/app/core/services/ms-good/real-state.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { MENAJE_COLUMN } from './menaje-columns';

class Manege {
  id: number;
  description: string;
  requestId: string;
}

@Component({
  selector: 'app-menaje',
  templateUrl: './menaje.component.html',
  styles: [],
})
export class MenajeComponent extends BasePage implements OnInit {
  title: any = 'Inmuebles de la solicitud';
  paragraphs: any[] = [];
  params = new BehaviorSubject<FilterParams>(new FilterParams());
  totalItems: number = 0;
  public event: EventEmitter<any> = new EventEmitter();
  immovablesSelected: any;
  requestId: number = null;
  listMenage: any = [];
  menage = new Manege();

  goodsObject: any;

  constructor(
    private modelRef: BsModalRef,
    private goodService: GoodService,
    private goodRealState: RealStateService
  ) {
    super();
  }

  ngOnInit(): void {
    this.settings = {
      ...TABLE_SETTINGS,
      actions: false,
      columns: MENAJE_COLUMN,
    };
    this.loadPaginator();
  }

  loadPaginator() {
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(data => {
      this.getData();
    });
  }

  getData() {
    this.loading = true;
    this.paragraphs = [];
    this.listMenage = [];
    this.params.value.addFilter('requestId', this.requestId);
    var filter = this.params.getValue().getParams();
    this.goodService.getAll(filter).subscribe({
      next: async (resp: any) => {
        if (resp.data) {
          const result = resp.data.map(async (item: any) => {
            if (item.idGoodProperty) {
              const menage = await this.getGoodRealState(item);
              if (menage !== null) {
                this.listMenage.push(menage);
              }
            }
          });

          Promise.all(result).then(data => {
            this.totalItems = this.listMenage.length;
            this.paragraphs = this.listMenage;
            this.loading = false;
          });
        }
      },
      error: error => {
        this.loading = false;
      },
    });
  }

  //obtiene los inmuebles
  getGoodRealState(item: any): any {
    const params = new ListParams();
    return new Promise((resolve, reject) => {
      params['filter.id'] = `$eq:${item.id}`;
      this.goodRealState.getAll(params).subscribe({
        next: resp => {
          this.menage = new Manege();
          var good = resp.data;
          if (good.length !== 0) {
            this.menage.id = item.goodId;
            this.menage.description = good[0].description;
            this.menage.requestId = item.requestId.id;
            resolve(this.menage);
          } else {
            resolve(null);
          }
        },
      });
    });
  }

  selectRow(event: any) {
    if (event.isSelected) {
      this.immovablesSelected = event.data;
    } else {
      this.immovablesSelected = null;
    }
  }

  selectImmovable() {
    if (!this.immovablesSelected) {
      this.onLoadToast('info', 'Información', `Seleccione un inmueble!`);
      return;
    }
    var menages = this.builtMenage(this.immovablesSelected);

    this.event.emit(menages);
    this.close();
  }

  builtMenage(menage: any) {
    const menageList: any[] = [];
    for (let i = 0; i < this.goodsObject.length; i++) {
      const element = this.goodsObject[i];
      menageList.push({
        noGood: menage.id, //bien padre o Bien Inmueble
        noGoodMenaje: element.id, //Good hijo o Good
        noRegister: null, //no insertar nada
      });
    }
    return menageList;
  }

  close() {
    this.modelRef.hide();
  }
}
