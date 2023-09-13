import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IPackageGoodDec } from 'src/app/core/models/ms-package-good/package-good-dec';
import { IPackageGoodEnc } from 'src/app/core/models/ms-package-good/package-good-enc';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
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
  @Input() noPackage: AbstractControl;
  @Input() packageType: AbstractControl;

  @Output() dataEmit: EventEmitter<any> = new EventEmitter();

  totalItems = 0;
  dataTemp: IPackageGoodDec[] = [];
  dataPaginated: LocalDataSource = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private packageGoodService: PackageGoodService,
    private goodService: GoodService,
    private unitConversionDataService: UnitConversionPackagesDataService
  ) {
    super();
    this.settings = {
      ...this.settings,
      columns: COLUMNS,
      mode: 'inline',
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        position: 'right',
        add: false,
        edit: true,
        delete: true,
      },
      edit: {
        ...this.settings.edit,
        saveButtonContent: '<i class="bx bxs-save me-1 text-success mx-2"></i>',
        cancelButtonContent:
          '<i class="bx bxs-x-square me-1 text-danger mx-2"></i>',
        confirmSave: true,
      },
      delete: {
        ...this.settings.delete,
        confirmDelete: true,
      },
      // add: {
      //   addButtonContent: '<i class="fa fa-plus text-success mx-2"></i>',
      // },
      rowClassFunction: (row: { data: { available: any } }) =>
        row.data.available ? 'bg-dark text-white' : 'bg-success text-white',
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

  ngOnChanges(changes: SimpleChanges) {
    if (changes['packageType']) {
      console.log(this.packageType.value);
      if (this.packageType.value != 3) {
        this.settings = {
          ...this.settings,
          columns: COLUMNS,
        };
      } else {
        this.settings = {
          ...this.settings,
          columns: {
            ...COLUMNS,
            val24: {
              title: 'Prog. Chatarra',
              sort: false,
              editable: true,
              valuePrepareFunction: (cell: any, row: any) => {
                if (row.bienes && row.bienes.val24) {
                  return row.bienes.val24;
                } else {
                  return null;
                }
              },
            },
          },
        };
      }
      this.fillTable([...this.dataPrevisualization]);
    }
  }

  get dataPrevisualization() {
    return this.unitConversionDataService.dataPrevisualization;
  }

  set dataPrevisualization(value) {
    this.unitConversionDataService.dataPrevisualization = value;
  }

  private clearTable() {
    this.totalItems = 0;
    this.dataPrevisualization = [];
    this.dataTemp = [];
    this.dataPaginated.load([]);
    this.dataPaginated.refresh();
    this.dataEmit.emit(this.dataPaginated);
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
    if (item.delegationNumber != packVal.numberDelegation) {
      return false;
    }
    if (item.bienes.numberClassifyGood != packVal.numberClassifyGood) {
      return false;
    }
    if (item.bienes.labelNumber != packVal.numberLabel) {
      return false;
    }
    if (item.bienes.status != packVal.status) {
      return false;
    } //!Busqueda de no_transferente por el no_expediente
    if (item.bienes.storeNumber != packVal.numberStore) {
      return false;
    }
    if (this.packageType.value != 3) {
      if (item.bienes.storeNumber != packVal.numberStore) {
        return false;
      } else {
        console.log('Entro aquí');
      }
    } else if (this.packageType.value == 3) {
      if (item.bienes.val24 == null) {
        return false;
      } else {
        console.log('Entro aquí');
      }
    }
    return true;
  }

  private async fillTable(data: IPackageGoodDec[]) {
    let dataMap = await Promise.all(
      data.map(item => {
        return {
          ...item,
          available: this.validateGood(item),
        };
      })
    );

    this.dataPrevisualization = dataMap;
    this.dataTemp = [...dataMap];
    this.getPaginated(this.params.value);
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
      this.packageGoodService.getPaqDestinationDet(newParams).subscribe({
        next: response => {
          // this.goodsList = response.data;
          // let dataMap = await Promise.all(
          //   response.data.map(async (item: any) => {
          //     const respAvailable = await this.validateGood(item);
          //     let disponible = JSON.parse(
          //       JSON.stringify(respAvailable)
          //     ).available;
          //     return {
          //       ...item,
          //       available: disponible,
          //     };
          //   })
          // );
          this.fillTable(response.data);
          this.totalItems = response.count || 0;
          this.loading = false;
        },
        error: err => {
          this.clearTable();
        },
      });
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
    this.dataEmit.emit(this.dataPaginated);
    this.dataPaginated.refresh();
  }

  selectRow(e: any) {
    console.log(e);
  }

  create() {
    console.log(this.noPackage.value);
    const noPack: IPackageGoodEnc = this.noPackage.value;
    // let body: IDecPackage = {
    //   numberPackage: noPack.numberPackage,
    //   amount: +noPack.amount,
    //   nbOrigin: noPack.nbOrigin,
    //   numberRecord: +noPack.numberRecord,
    //   amountConv: null,
    // };
    // this.packageGoodService.insertPaqDestDec(body);
  }

  edit(event: any) {
    //this.openModal({ edit: true, paragraph });
    let { newData, confirm } = event;

    if (!newData.val24) {
      this.alert('error', 'Edición de Bien', 'Campos incompletos');
      return;
    }
    newData = {
      ...newData,
      val24:
        typeof newData.val24 == 'boolean'
          ? newData.val24 === true
            ? 'S'
            : 'N'
          : newData.val24,
    };
    this.goodService
      .update({
        id: newData.numberGood,
        goodId: newData.numberGood,
        val24: newData.val24,
      })
      .subscribe({
        next: response => {
          event.confirm.resolve();
          this.alert(
            'success',
            'Edición Programa Chatarra',
            'Actualizado correctamente'
          );
          this.unitConversionDataService.updatePrevisualizationData.next(true);
        },
        error: err => {
          event.confirm.resolve();
          this.alert(
            'error',
            'ERROR',
            'No se pudo actualizar el programa chatarra'
          );
        },
      });
    // console.log(data);
  }

  delete(event: any) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        debugger;
        console.log(event);

        const data = event.data;
        this.packageGoodService
          .deletePaqDestDec({
            numberGood: data.numberGood,
            numberPackage: this.noPackage.value.numberPackage,
          })
          .subscribe({
            next: response => {
              event.confirm.resolve();
              this.unitConversionDataService.updatePrevisualizationData.next(
                true
              );
              // this.alert;
            },
            error: err => {
              event.confirm.resolve();
            },
          });
      }
    });
  }
}
