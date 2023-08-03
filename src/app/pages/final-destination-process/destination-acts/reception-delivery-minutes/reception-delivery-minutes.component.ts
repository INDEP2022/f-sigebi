import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { ProceedingsDeliveryReceptionService } from 'src/app/core/services/ms-proceedings';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-reception-delivery-minutes',
  templateUrl: './reception-delivery-minutes.component.html',
  styles: [],
})
export class ReceptionDeliveryMinutesComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  bsModalRef?: BsModalRef;
  refresh: boolean = false;
  params = new BehaviorSubject<ListParams>(new ListParams());
  expediente: number;
  dataDelivery: any[] = [];
  proceedingsList: any[] = [];
  source: LocalDataSource = new LocalDataSource();
  totalItems: number = 0;

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private excelService: ExcelService,
    private proceedingsDetailDel: ProceedingsDeliveryReceptionService
  ) {}

  ngOnInit(): void {
    this.prepareForm();
    this.getProceeding();
    //console.log('expediente ', this.expediente);
  }

  prepareForm() {
    this.form = this.fb.group({
      nameAr: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
    });
  }

  close() {
    //this.modalRef.content.callback(this.refresh);
    this.modalRef.hide();
  }

  onFileChangeDelivery(event: Event) {
    this.exportExcel();
  }

  exportExcel() {
    if (this.form.get('nameAr').value != null) {
      console.log(this.form.get('nameAr').value);
      const workSheet = XLSX.utils.json_to_sheet(this.proceedingsList, {
        skipHeader: true,
      });
      const workBook: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workBook, workSheet, 'Hoja1');
      let aux = this.form.get('nameAr').value + '.xlsx';
      XLSX.writeFile(workBook, aux);
    }
  }

  getProceeding() {
    if (this.expediente != null) {
      this.proceedingsDetailDel.getProceeding(this.expediente).subscribe({
        next: response => {
          console.log(response);
          for (let i = 0; i < response.count; i++) {
            if (response.data[i] != undefined) {
              if (response.data[i].keysProceedings != null) {
                this.proceedingsList.push(response.data[i].keysProceedings);
              }
            }
          }
          this.getDistinct(this.proceedingsList);
          //console.log('this.proceedingsList ', this.proceedingsList);
        },
        error: err => {
          console.log(err);
        },
      });
    }
  }

  getDistinct(arreglo: any[]): void {
    const conjunto = new Set(arreglo);
    const datosNoRepetidos = Array.from(conjunto);
    this.proceedingsList = datosNoRepetidos;
    //console.log(datosNoRepetidos);
  }
}
