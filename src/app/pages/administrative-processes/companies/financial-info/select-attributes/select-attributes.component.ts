import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

//Example
export interface FinancialIndicator {
  id: string;
  description: string;
  formula: string;
  isSelected: boolean;
}
//Example
export interface FinancialAtrib {
  id: string;
  description: string;
  isSelected: boolean;
}

@Component({
  selector: 'app-select-attributes',
  templateUrl: './select-attributes.component.html',
  styles: [
    `
      .list-group {
        max-height: 300px;
        max-width: 100%;
        margin-bottom: 10px;
        overflow: scroll;
        -webkit-overflow-scrolling: touch;
      }
    `,
  ],
})
export class SelectAttributesComponent implements OnInit {
  checkedListFI: FinancialIndicator[];
  checkedListFA: FinancialAtrib[];

  masterSelectedFA: boolean = false;
  masterSelectedFI: boolean = false;

  loading: boolean = false;
  title: string = 'INFORMACIÓN FINANCIERA';
  @Output() data = new EventEmitter<any>();

  constructor(private modalRef: BsModalRef) {}

  ngOnInit(): void {
    this.isAllSelected();
  }

  close() {
    this.modalRef.hide();
  }

  // The master checkbox will check/ uncheck all items
  checkUncheckAllFA() {
    this.checkedListFA.map(fa => {
      fa.isSelected = this.masterSelectedFA;
    });
  }
  // The master checkbox will check/ uncheck all items
  checkUncheckAllFI() {
    this.checkedListFI.map(fi => {
      fi.isSelected = this.masterSelectedFI;
    });
  }
  // Check All Checkbox Checked
  isAllSelected() {
    this.masterSelectedFI = this.checkedListFI.every((item: any) => {
      return item.isSelected == true;
    });
    this.masterSelectedFA = this.checkedListFA.every((item: any) => {
      return item.isSelected == true;
    });
  }

  // Get List of Checked Items and Return
  getCheckedItemList() {
    let data = {
      checkedListFA: this.checkedListFA,
      checkedListFI: this.checkedListFI,
    };
    this.data.emit(data);
    this.modalRef.hide();
  }
}
