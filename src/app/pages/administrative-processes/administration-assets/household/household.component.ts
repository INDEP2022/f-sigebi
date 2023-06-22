import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IGood } from 'src/app/core/models/ms-good/good';
import { GoodService } from 'src/app/core/services/good/good.service';
import { MenageService } from 'src/app/core/services/ms-menage/menage.service';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-household',
  templateUrl: './household.component.html',
  styles: [],
})
export class HouseholdComponent extends BasePage implements OnInit, OnChanges {
  list: any[] = [];
  good: IGood;
  menajes: IGood[] = [];
  @Input() goodId: number;
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private readonly goodServices: GoodService,
    private readonly menageServices: MenageService
  ) {
    super();
    this.settings.actions.delete = true;
    this.settings.actions.add = false;
    this.settings.hideSubHeader = false;
    this.settings.columns = {
      id: {
        title: 'Menaje',
        width: '20%',
        sort: false,
      },
      description: {
        title: 'Descripción',
        width: '70%',
        sort: false,
      },
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      this.searchGoodMenage(this.goodId);
    }
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.searchGoodMenage(this.goodId));
  }

  searchGoodMenage(idGood: number) {
    //this.menajes = [];
    this.loading = true;
    this.params.getValue()['filter.noGood'] = `$eq:${idGood}`;
    console.log(this.params.getValue());
    this.menageServices.getMenaje(this.params.getValue()).subscribe({
      next: response => {
        this.menajes = response.data.map(menage => {
          return menage.menajeDescription;
        });
        this.totalItems = response.count;
        console.log(this.menajes);
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        console.log(err);
        // this.onLoadToast('info', 'Información', err.error.message);
      },
    });
  }

  async showDeleteAlert(good: IGood) {
    const response = await this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    );
    if (response.isConfirmed) {
      this.delete(good.id);
    }
  }

  delete(idGood: string | number) {
    this.menageServices.remove(idGood).subscribe({
      next: responde => {
        console.log(responde);
        //this.searchGoodMenage(this.numberGoodSelect);
        this.onLoadToast(
          'success',
          'Exito',
          `Se elimino el Menaje N° ${idGood}`
        );
      },
      error: err => {
        console.log(err);
        this.onLoadToast(
          'error',
          'ERROR',
          `No se pudo eliminar el Menaje N° ${idGood}`
        );
      },
    });
  }
}
