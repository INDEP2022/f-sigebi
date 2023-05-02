import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-excel-report',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './excel-report.component.html',
  styles: [],
})
export class ExcelReportComponent implements OnInit {
  @Input() elementToExport: any[];
  @Input() text = '';
  @Input() nameExcel = 'ExcelSheet.xlsx';
  @Input() title_sheet = 'Sheet1';
  @Input() set externalClick(value: boolean) {
    this.exportToExcel();
  }
  constructor() {}

  ngOnInit(): void {}

  exportToExcel() {
    if (this.elementToExport) {
      // let element = document.getElementById(this.elementToExport);
      // console.log(this.elementToExport);

      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
        this.elementToExport
      );
      // console.log(worksheet);
      // XLSX.utils.sheet_add_aoa(worksheet, [[''], [''], ['']], { origin: 'K1' });
      const book: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(book, worksheet, this.title_sheet);

      XLSX.writeFile(book, this.nameExcel);
    }
  }
}
