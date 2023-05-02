import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-generate-report',
  templateUrl: './generate-report.component.html',
  styles: [],
})
export class GenerateReportComponent implements OnInit {
  title: string = 'Vista Previa Reporte';

  constructor(private bsModalRef: BsModalRef) {}

  ngOnInit(): void {}

  close(): void {
    this.bsModalRef.hide();
  }
}
