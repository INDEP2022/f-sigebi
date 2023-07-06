import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { PackageGoodService } from 'src/app/core/services/ms-packagegood/package-good.service';
import { BasePage } from 'src/app/core/shared';
import { UnitConversionPackagesDataService } from '../../services/unit-conversion-packages-data.service';
import { COLUMNS } from './column';
@Component({
  selector: 'app-paq-destion-det',
  templateUrl: './paq-destino-det.component.html',
  styleUrls: ['./paq-destino-det.component.scss'],
})
export class PaqDestinoDetComponent extends BasePage {
  @Input() packageType: AbstractControl;
  @Input() noPackage: AbstractControl;
  totalItems = 0;
  dataTemp: any[] = [];
  dataPaginated: LocalDataSource = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private packageGoodService: PackageGoodService,
    private unitConversionDataService: UnitConversionPackagesDataService
  ) {
    super();
    this.settings = {
      ...this.settings,
      columns: COLUMNS,
      hideSubHeader: false,
      rowClassFunction: (row: { data: { available: any } }) =>
        row.data.available ? 'bg-success text-white' : 'bg-dark text-white',
      actions: { add: false, delete: false, edit: false },
    };
    this.searchNotServerPagination();
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(params => {
      // console.log(params);
      if (this.dataPrevisualization) {
        this.getPaginated(params);
      }
    });
    this.unitConversionDataService.clearPrevisualizationData
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: response => {
          if (response) {
            this.clearTable();
          }
        },
      });
    this.unitConversionDataService.updatePrevisualizationData
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: response => {
          if (response) {
            this.getData();
          }
        },
      });
  }

  get dataPrevisualization() {
    return this.unitConversionDataService.dataPrevisualization;
  }

  set dataPrevisualization(value) {
    this.unitConversionDataService.dataPrevisualization = value;
  }

  private clearTable() {
    this.totalItems = 0;
    this.dataTemp = [];
    this.dataPaginated.load([]);
    this.dataPaginated.refresh();
    this.loading = false;
  }

  private searchNotServerPagination() {
    this.dataPaginated
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          // this.data = this.dataOld;
          // debugger;
          let filters = change.filter.filters;
          filters.map((filter: any, index: number) => {
            // console.log(filter, index);
            if (index === 0) {
              this.dataTemp = [...this.dataPrevisualization];
            }
            this.dataTemp = this.dataTemp.filter((item: any) =>
              filter.search !== ''
                ? (item[filter['field']] + '')
                    .toUpperCase()
                    .includes((filter.search + '').toUpperCase())
                : true
            );
          });
          // this.totalItems = filterData.length;
          console.log(this.dataTemp);
          this.totalItems = this.dataTemp.length;
          this.params.value.page = 1;
          this.getPaginated(this.params.getValue());
        }
      });
  }

  settingsChange($event: any): void {
    this.settings = $event;
  }

  private validateGood(item: any) {
    const packVal = this.noPackage.value;
    return new Promise((resolve, reject) => {
      if (item.delegationNumber != packVal.numberDelegation) {
        resolve({ available: false });
      } else if (item.bienes.numberClassifyGood != packVal.numberClassifyGood) {
        resolve({ available: false });
      } else if (item.bienes.labelNumber != packVal.labelNumber) {
        resolve({ available: false });
      } else if (item.bienes.status != packVal.status) {
        resolve({ available: false });
      } //!Busqueda de no_transferente por el no_expediente
      else if (item.bienes.storeNumber != packVal.numberStore) {
        resolve({ available: false });
      } else if (this.packageType.value != 3) {
        if (item.bienes.storeNumber != packVal.numberStore) {
          resolve({ available: false });
        } else {
          console.log('Entro aquí');
        }
      } else if (this.packageType.value == 3) {
        if (item.bienes.val24 == null) {
          resolve({ available: false });
        } else {
          console.log('Entro aquí');
        }
      } else {
        resolve({ available: true });
      }
    });
  }

  getData() {
    {
      if (!this.noPackage) {
        return;
      }
      if (!this.noPackage.value) {
        this.clearTable();
        return;
      }
      this.loading = true;
      const newParams = new ListParams();
      newParams['filter.numberPackage'] = this.noPackage.value.numberPackage;
      newParams.limit = 1000000;
      // this.params.getValue()['filter.numberPackage'] = noPackage;
      this.packageGoodService.getPaqDestinationDet(newParams).subscribe(
        async response => {
          // this.goodsList = response.data;
          let dataMap = await Promise.all(
            response.data.map(async (item: any) => {
              const respAvailable = await this.validateGood(item);
              let disponible = JSON.parse(
                JSON.stringify(respAvailable)
              ).available;
              return {
                ...item,
                available: disponible,
              };
            })
          );
          this.totalItems = response.count || 0;
          this.dataPrevisualization = dataMap;
          this.dataTemp = [...dataMap];
          this.getPaginated(this.params.value);
          this.loading = false;
        },
        error => {
          this.clearTable();
        }
      );
    }
  }

  private getPaginated(params: ListParams) {
    const cantidad = params.page * params.limit;
    this.dataPaginated.load([
      ...this.dataTemp.slice(
        (params.page - 1) * params.limit,
        cantidad > this.dataTemp.length ? this.dataTemp.length : cantidad
      ),
    ]);
    this.dataPaginated.refresh();
  }

  selectRow(e: any) {
    console.log(e);
  }

  edit(data: any) {
    //this.openModal({ edit: true, paragraph });
  }

  delete(data: any) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
      }
    });
  }
}
