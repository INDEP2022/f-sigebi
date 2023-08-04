import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { IProceedingDeliveryReception } from 'src/app/core/models/ms-proceedings/proceeding-delivery-reception';
import { ProceedingsDeliveryReceptionService } from 'src/app/core/services/ms-proceedings';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
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
  CONTUNR: number = 1;
  cve_acta: string;
  idActa: string;
  headerString: string =
    'CVE ACTA~FEC_RECEPCION_FISICA~DIRECCION~ENTREGA~RECIBE~OBSERVACIONES~NO_BIEN~DESCRIPCION~CANTIDAD_RECIBIDA';

  dataExport: any[] = [];
  public cities = new DefaultSelect();
  states = new DefaultSelect<IProceedingDeliveryReception>();

  keys: any[];

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private excelService: ExcelService,
    private proceedingsDetailDel: ProceedingsDeliveryReceptionService
  ) {}

  ngOnInit(): void {
    this.prepareForm();
    this.getProceeding();
    const headerArray = this.headerString.split('~');
    this.dataExport.push(headerArray);

    //console.log('expediente ', this.expediente);
  }

  prepareForm() {
    this.form = this.fb.group({
      actas: [null, [Validators.required]],
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
      //console.log(this.form.get('nameAr').value);

      //this.getFilterProceedings();
      this.getFilterProceedings2();
      const workSheet = XLSX.utils.json_to_sheet(this.dataExport, {
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
          console.log('data actas ', response);
          let claves = [];
          for (let i = 0; i < response.count; i++) {
            if (response.data[i] != undefined) {
              if (response.data[i].keysProceedings != null) {
                claves.push(
                  response.data[i].id + ' - ' + response.data[i].keysProceedings
                );
              }
            }
          }
          this.cities = new DefaultSelect(claves, response.count);
          let clave = response.data[0].keysProceedings;
          this.getDistinct(this.proceedingsList);
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

  getFilterProceedings() {
    if (this.idActa != null) {
      this.proceedingsDetailDel.getFilterProceeding(this.idActa).subscribe({
        next: response => {
          console.log('getFilterProceeding ', response);
        },
      });
    }
  }

  getFilterProceedings2() {
    if (this.idActa != null) {
      this.proceedingsDetailDel.getFilterProceeding2(this.idActa).subscribe({
        next: response => {
          console.log('getFilterProceedings2', response);
          for (let i = 0; i < response.data.length; i++) {
            if (response.data[i] != undefined) {
              const Array = response.data[i].one.split('~');
              this.dataExport.push(Array);
            }
          }
        },
      });
    }
  }

  stateChange(event: any) {
    console.log('select ', event);
    this.idActa = this.extractData(event);
    console.log(' this.idActa', this.idActa);
  }

  extractData(event: string): string {
    const regex = /^([\d-]+)/;
    const match = event.match(regex);
    return match ? match[1] : null;
  }
}
