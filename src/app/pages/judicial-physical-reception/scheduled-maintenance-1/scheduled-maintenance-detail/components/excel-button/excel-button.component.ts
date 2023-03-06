import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MsIndicatorGoodsService } from 'src/app/core/services/ms-indicator-goods/ms-indicator-goods.service';

@Component({
  selector: 'app-excel-button',
  templateUrl: './excel-button.component.html',
  styles: [],
})
export class ExcelButtonComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() goodsCant = 0;
  @Input() loading = true;
  loadingExcel = false;
  flagDownload = false;
  elementToExport: any[];
  constructor(private service: MsIndicatorGoodsService) {}

  ngOnInit(): void {}

  exportExcel() {
    this.loadingExcel = true;
    this.service.getExcel(this.form.value).subscribe(x => {
      this.elementToExport = x;
      this.flagDownload = !this.flagDownload;
      // console.log(x);
      this.loadingExcel = false;
    });
  }

  nameExcel() {
    return (
      'Reporte Mantenimiento de Acta Entrega Recepción_' +
      this.form.get('claveActa').value +
      '.xlsx'
    );
  }
}
