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
import { SafeService } from 'src/app/core/services/catalogs/safe.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { BasePage } from 'src/app/core/shared';
@Component({
  selector: 'app-assigned-vaults',
  templateUrl: './assigned-vaults.component.html',
  styles: [],
})
export class AssignedVaultsComponent
  extends BasePage
  implements OnInit, OnChanges
{
  list: any[] = [];
  good: IGood;
  @Input() goodId: number;
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private readonly goodServices: GoodService,
    private readonly vaultService: SafeService
  ) {
    super();
    this.settings.actions = false;
    this.settings.hideSubHeader = false;
    this.settings.columns = {
      id: {
        title: 'Bóveda',
        width: '20%',
        sort: false,
      },
      address: {
        title: 'Ubicación',
        width: '70%',
        sort: false,
      },
      drawerNumber: {
        title: 'Gaveta',
        width: '70%',
        sort: false,
      },
      entryDate: {
        title: 'Fecha Entrada',
        width: '70%',
        sort: false,
      },
      outDate: {
        title: 'Fecha Salida',
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
    this.loading = true;
    this.goodServices.getById(idGood).subscribe({
      next: (response: any) => {
        this.good = response.data[0];
        if (this.good.vaultNumber !== null) {
          this.vaultService.getById(this.good.vaultNumber).subscribe({
            next: (respo: any) => {
              console.log(respo);
              this.list = response.data.map((good: IGood) => {
                return {
                  id: good.vaultNumber,
                  address: respo.ubication,
                  drawerNumber: good.drawerNumber,
                  entryDate: good.dateIn,
                  outDate: good.dateOut,
                };
              });
            },
            error: err => console.log(err),
          });
          this.totalItems = response.count;
        }
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        console.log(err);
      },
    });
  }
}
