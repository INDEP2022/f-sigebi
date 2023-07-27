import {
  Component,
  Input,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Ng2SmartTableComponent } from 'ng2-smart-table';
import { takeUntil } from 'rxjs';
import { ProgrammingGoodReceiptService } from 'src/app/core/services/ms-programming-good/programming-good-receipt.service';
import { BasePageWidhtDinamicFiltersExtra } from 'src/app/core/shared/base-page-dinamic-filters-extra';
import { ReceiptGenerationDataService } from '../services/receipt-generation-data.service';
import { COLUMNS } from './columns';
import { IReceiptItem } from './ireceipt';

@Component({
  selector: 'app-receipt-table-goods',
  templateUrl: './receipt-table-goods.component.html',
  styleUrls: ['./receipt-table-goods.component.scss'],
})
export class ReceiptTableGoodsComponent
  extends BasePageWidhtDinamicFiltersExtra<IReceiptItem>
  implements OnInit
{
  @Input() folio: string; // = 'R-METROPOLITANA-SAT-24-OS';
  @Input() estatus_bien_programacion: string = null;
  @Input() override haveInitialCharge = false;
  pageSelecteds: number[] = [];
  previousSelecteds: IReceiptItem[] = [];

  pageSizeOptions = [5, 10, 20, 25];
  limit: FormControl = new FormControl(5);
  @ViewChild('table') table: Ng2SmartTableComponent;
  constructor(
    private dataService: ReceiptGenerationDataService,
    private receiptService: ProgrammingGoodReceiptService
  ) {
    super();
    this.service = this.receiptService;
    this.params.value.limit = 5;
    // this.haveInitialCharge = false;
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: false,
      selectMode: 'multi',
      columns: {
        ...COLUMNS,
      },
      rowClassFunction: (row: any) => {
        return row.data.notSelect ? 'notSelect' : '';
      },
    };
    this.dataService.refreshAll.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: response => {
        if (response) {
          this.getData();
        }
      },
    });
  }

  get selectedGooods() {
    return this.dataService.selectedGooods;
  }

  set selectedGooods(value) {
    this.dataService.selectedGooods = value;
  }

  ngOnChanges(changes: SimpleChanges) {
    // debugger;
    if (
      (changes['estatus_bien_programacion'] &&
        changes['estatus_bien_programacion'].currentValue) ||
      (changes['folio'] && changes['folio'].currentValue)
    ) {
      console.log('ngOnChanges Table Goods');
      this.getData();
    }
  }

  override extraOperationsGetData() {
    this.fillSelectedRows();
    if (this.estatus_bien_programacion === 'CANCELADO_TMP') {
      this.dataService.cancelacion = this.totalItems;
    }
    if (this.estatus_bien_programacion === 'EN_PROGRAMACION_TMP') {
      this.dataService.programacion = this.totalItems;
    }
  }

  private removeGood(item: IReceiptItem) {
    const good = this.selectedGooods.find(x => x.id_bien === item.id_bien);
    if (good) {
      this.selectedGooods = this.selectedGooods.filter(
        _good => _good.id_bien != good.id_bien
      );
    }
  }

  selectGood(event: {
    selected: IReceiptItem[];
    isSelected: boolean;
    data: IReceiptItem;
  }) {
    console.log(event);
    const selecteds = event.selected;

    if (selecteds.length === 0) {
      if (this.previousSelecteds.length > 0 && event.isSelected === null) {
        this.previousSelecteds.forEach(selected => {
          this.removeGood(selected);
        });
      }
      if (event.isSelected === false) {
        this.removeGood(event.data);
      }
    } else {
      if (event.isSelected === null) {
        const currentPage = this.params.getValue().page;
        const selectedPage = this.pageSelecteds.find(
          page => page === currentPage
        );
        if (!selectedPage) {
          this.pageSelecteds.push(currentPage);
        }
        selecteds.forEach(selected => {
          const item = this.selectedGooods.find(
            x => x.id_bien === selected.id_bien
          );
          if (!item) {
            this.selectedGooods.push(selected);
          }
        });
      } else if (event.isSelected === true) {
        // this.addGood(event.data);
        const currentPage = this.params.getValue().page;
        const selectedPage = this.pageSelecteds.find(
          page => page === currentPage
        );
        if (!selectedPage) {
          this.pageSelecteds.push(currentPage);
        }
        selecteds.forEach(selected => {
          const item = this.selectedGooods.find(
            x => x.id_bien === selected.id_bien
          );
          if (!item) {
            this.selectedGooods.push(selected);
          }
        });
      } else {
        this.removeGood(event.data);
      }
    }
    console.log(this.selectedGooods);
    this.previousSelecteds = [...selecteds];
  }

  private fillSelectedRows() {
    setTimeout(() => {
      // debugger;
      console.log(this.selectedGooods, this.table);
      const currentPage = this.params.getValue().page;
      const selectedPage = this.pageSelecteds.find(
        page => page === currentPage
      );
      this.table.isAllSelected = false;
      let allSelected = true;
      if (this.selectedGooods && this.selectedGooods.length > 0) {
        this.table.grid.getRows().forEach(row => {
          // console.log(row);

          if (
            this.selectedGooods.find(
              item => row.getData()['id_bien'] === item.id_bien
            )
          ) {
            this.table.grid.multipleSelectRow(row);
            allSelected = allSelected && true;
          } else {
            allSelected = allSelected && false;
          }
          // if(row.getData())
          // this.table.grid.multipleSelectRow(row)
        });
        this.table.isAllSelected = allSelected;
      }
    }, 300);
  }

  override getParams() {
    // debugger;
    let newColumnFilters = this.columnFilters;
    if (this.folio) {
      newColumnFilters['filter.folio'] = '$eq:' + this.folio;
    }
    if (this.estatus_bien_programacion) {
      newColumnFilters['filter.estatus_bien_programacion'] =
        '$eq:' + this.estatus_bien_programacion;
    }
    return {
      ...this.params.getValue(),
      ...newColumnFilters,
    };
  }
}
