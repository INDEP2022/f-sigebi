import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { IGood } from 'src/app/core/models/ms-good/good';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { previewData } from 'src/app/pages/documents-reception/goods-bulk-load/interfaces/goods-bulk-load-table';
import { COLUMNS } from './columns';

interface NotData {
  id: number;
  reason: string;
}
@Component({
  selector: 'app-massive-change-status',
  templateUrl: './massive-change-status.component.html',
  styles: [],
})
export class MassiveChangeStatusComponent extends BasePage implements OnInit {
  fileName: string = 'Seleccionar archivo';
  tableSource: previewData[] = [];
  data: LocalDataSource = new LocalDataSource();
  ids: any[];
  form: FormGroup;
  goods: IGood[] = [];
  idsNotExist: NotData[] = [];
  showError: boolean = false;
  get goodStatus() {
    return this.form.get('goodStatus');
  }
  get observation() {
    return this.form.get('observation');
  }

  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private excelService: ExcelService,
    private readonly goodServices: GoodService
  ) {
    super();
    this.settings.columns = COLUMNS;
    this.settings.actions = false;
  }

  ngOnInit(): void {
    this.buildForm();
    /* this.loandData(); */
  }

  /**
   * @method: metodo para iniciar el formulario
   * @author:  Alexander Alvarez
   * @since: 27/09/2022
   */
  private buildForm() {
    this.form = this.fb.group({
      goodStatus: [null, [Validators.required]],
      observation: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      csv: [null, [Validators.required]],
    });
  }

  onFileChange(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (files.length != 1) throw 'No files selected, or more than of allowed';
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(files[0]);
    fileReader.onload = () => this.readExcel(fileReader.result);
  }
  readExcel(binaryExcel: string | ArrayBuffer) {
    /*     try {
      this.tableSource = [];
      let preloadFile = this.excelService.getData<previewData | any>(
        binaryExcel
      );
      preloadFile.forEach((data: any) => {
        let objReplace: any = {};
        for (const key in data) {
          if (Object.prototype.hasOwnProperty.call(data, key)) {
            if (key) {
              objReplace[key.toLowerCase()] = data[key];
            }
          }
        }
        this.tableSource.push(objReplace);
      });
      let obj: any = {};
      let object: any = this.tableSource[0];
      for (const key in object) {
        if (Object.prototype.hasOwnProperty.call(object, key)) {
          if (key) {
            obj[key] = {
              title: key.toLocaleUpperCase(),
              type: 'string',
              sort: false,
            };
          }
        }
      }
      const _settings = { columns: obj, actions: false };
      this.settings = { ...this.settings, ..._settings };
      this.loadGood(preloadFile);
      this.onLoadToast('success', 'Archivo subido con Exito', 'Exitoso');
    } catch (error) {
      this.onLoadToast('error', 'Ocurrio un error al leer el archivo', 'Error');
    } */
    try {
      this.data.load([]);
      this.ids = this.excelService.getData(binaryExcel);
      this.loadGood(this.ids);
      this.onLoadToast('success', 'Archivo subido con Exito', 'Exitoso');
    } catch (error) {
      this.onLoadToast('error', 'Ocurrio un error al leer el archivo', 'Error');
    }
  }
  loadDescription() {
    console.log(this.goodStatus.value);
  }
  loadGood(data: any[]) {
    this.loading = true;
    let count = 0;
    data.forEach(good => {
      count = count + 1;
      this.goodServices.getById(good.id).subscribe({
        next: response => {
          this.goods.push(response);
          this.addStatus();
        },
        error: err => {
          if (err.error.message === 'No se encontrarón registros')
            this.idsNotExist.push({ id: good.id, reason: err.error.message });
        },
      });
      if (count === data.length) {
        this.loading = false;
        this.showError = true;
      }
    });
  }
  addStatus() {
    this.data.load(this.goods);
    this.data.refresh();
  }
}
