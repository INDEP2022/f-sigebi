import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SweetAlertIcon } from 'sweetalert2';
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
  @Input() showAlert = true;
  loading = false;
  private _toastrService = inject(ToastrService);
  constructor() {}

  ngOnInit(): void {}

  protected onLoadToast(
    icon: SweetAlertIcon,
    title: string,
    text: string,
    timeOut: number
  ) {
    const throwToast = {
      success: (title: string, text: string) =>
        this._toastrService.success(text, title, { timeOut }),
      info: (title: string, text: string) =>
        this._toastrService.info(text, title, { timeOut }),
      warning: (title: string, text: string) =>
        this._toastrService.warning(text, title, { timeOut }),
      error: (title: string, text: string) =>
        this._toastrService.error(text, title, { timeOut }),
      question: (title: string, text: string) =>
        this._toastrService.info(text, title, { timeOut }),
    };
    return throwToast[icon](title, text);
  }

  exportToExcel() {
    if (this.elementToExport) {
      this.loading = true;
      this.onLoadToast('info', 'Descargando Excel', this.nameExcel, 1000);
      // let element = document.getElementById(this.elementToExport);
      // console.log(this.elementToExport[0].length);

      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
        this.elementToExport
      );
      // console.log(worksheet);

      // const max_width = this.elementToExport.reduce((w, r) => Math.max(w, r.name.length), 10);

      worksheet['!cols'] = Object.keys(this.elementToExport[0]).map(x => {
        const max_width = this.elementToExport.reduce((acumulator, r) => {
          // console.log(acumulator, r[x]);
          return Math.max(acumulator, (r[x] + '').length);
        }, x.length);
        // console.log(max_width);
        return { wch: max_width };
      });

      // const row = worksheet.lastRow;
      // row.getCell(3).alignment = { wrapText: true };

      // worksheet['!cols'].push({ width: 20 })

      // console.log(worksheet);
      // XLSX.utils.sheet_add_aoa(worksheet, [[''], [''], ['']], { origin: 'K1' });
      const book: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(book, worksheet, this.title_sheet);

      XLSX.writeFile(book, this.nameExcel, {
        bookType: 'xlsx',
        type: 'buffer',
      });
      this.loading = false;
      setTimeout(() => {
        this._toastrService.clear();
      }, 1000);
    }
  }
}
