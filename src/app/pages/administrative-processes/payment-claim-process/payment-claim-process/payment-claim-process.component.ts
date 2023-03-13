import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { IDocuments } from 'src/app/core/models/ms-documents/documents';
import { IGood } from 'src/app/core/models/ms-good/good';
import { DocumentsService } from 'src/app/core/services/ms-documents-type/documents.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { HistoryGoodService } from 'src/app/core/services/ms-history-good/history-good.service';
import { ScreenStatusService } from 'src/app/core/services/ms-screen-status/screen-status.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

interface IDs {
  goodNumber: number;
}
interface NotData {
  id: number;
  reason: string;
}

@Component({
  selector: 'app-payment-claim-process',
  templateUrl: './payment-claim-process.component.html',
  styles: [],
})
export class PaymentClaimProcessComponent extends BasePage implements OnInit {
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  ids: IDs[];
  goods: IGood[] = [];
  idsNotExist: NotData[] = [];
  showError: boolean = false;
  showStatus: boolean = false;
  document: IDocuments;
  goodClassNumber: string[] = ['1424', '1426', '1427'];
  good: IGood;
  //Reactive Forms
  form: FormGroup;

  get justification() {
    return this.form.get('justification');
  }

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private excelService: ExcelService,
    private readonly goodServices: GoodService,
    private readonly historyGoodService: HistoryGoodService,
    private readonly screenStatusService: ScreenStatusService,
    private readonly documnetServices: DocumentsService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: {
        id: {
          title: 'No Bien',
          width: '10%',
          sort: false,
        },
        status: {
          title: 'Estatus',
          width: '20%',
          sort: false,
        },
        description: {
          title: 'Descripcion',
          width: '40%',
          sort: false,
        },
      },
    };
  }

  ngOnInit(): void {
    this.buildForm();
    this.form.disable();
  }

  /**
   * @method: metodo para iniciar el formulario
   * @author:  Alexander Alvarez
   * @since: 27/09/2022
   */

  private buildForm() {
    this.form = this.fb.group({
      justification: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
  }

  onFileChange(event: Event) {
    console.log('Entro');
    const files = (event.target as HTMLInputElement).files;
    if (files.length != 1) throw 'No files selected, or more than of allowed';
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(files[0]);
    fileReader.onload = () => this.readExcel(fileReader.result);
  }
  readExcel(binaryExcel: string | ArrayBuffer) {
    try {
      this.ids = this.excelService.getData(binaryExcel);
      if (this.ids[0].goodNumber === undefined) {
        this.onLoadToast(
          'error',
          'Ocurrio un error al leer el archivo',
          'El archivo no cuenta con la estructura requerida'
        );
        return;
      }
      this.data.load([]);
      this.goods = [];
      this.idsNotExist = [];
      this.showError = false;
      this.showStatus = false;
      this.loadGood(this.ids);
      this.onLoadToast('success', 'Archivo subido con Exito', 'Exitoso');
    } catch (error) {
      this.onLoadToast('error', 'Ocurrio un error al leer el archivo', 'Error');
    }
  }

  changeStatusGood() {
    if (this.goods.length === 0) {
      this.onLoadToast('error', 'ERROR', 'Debe cargar la lista de bienes');
      return;
    }
    this.validStatusXScreen(this.good);
  }

  change() {
    this.goods.forEach(good => {
      good.status = good.status === 'PRP' ? 'ADM' : 'PRP';
      this.goodServices.update(good).subscribe({
        next: response => {
          console.log(response);
        },
        error: err => {
          this.loading = false;
          this.idsNotExist.push({ id: good.id, reason: err.error.message });
        },
      });
    });
    this.onLoadToast(
      'success',
      'Actualizado',
      'Se ha cambiado el status de los bienes seleccionados'
    );
    this.addStatus();
    this.showStatus = true;
  }
  addStatus() {
    this.data.load(this.goods);
    this.data.refresh();
  }

  loadGood(data: any[]) {
    this.loading = true;
    let count = 0;
    data.forEach(good => {
      count = count + 1;
      this.goodServices.getById(good.goodNumber).subscribe({
        next: response => {
          if (response.status === 'PRP' || response.status === 'ADM') {
            if (this.goodClassNumber.includes(`${response.goodClassNumber}`)) {
              console.log(response);
              this.goods.push(response);
              this.addStatus();
            } else {
              this.idsNotExist.push({
                id: response.id,
                reason: `no cuenta con un numeor de clasificador valido`,
              });
            }
          } else {
            this.idsNotExist.push({
              id: response.id,
              reason: `no cuenta con estatus valido, debe ser PRP o ADM`,
            });
          }
        },
        error: err => {
          if (err.error.message === 'No se encontrarón registros')
            this.idsNotExist.push({
              id: good.goodNumber,
              reason: err.error.message,
            });
        },
      });
      if (count === data.length) {
        this.loading = false;
        this.showError = true;
      }
    });
    this.form.enable();
  }

  changeFoli(event: any) {
    this.document = event;
  }

  clean(event: any) {
    this.goods = [];
    this.addStatus();
    this.form.reset();
    this.ids = [];
    this.showError = false;
  }

  validStatusXScreen(good: IGood) {
    this.screenStatusService
      .getStatusXScreen({
        screen: 'FPROCRECPAG',
        status: good.status,
      })
      .subscribe({
        next: response => {
          console.log('Desde el Valid');
          console.log(response.data[0].action, good.status);
          if (response.data[0].action === good.status) {
            this.change();
          } else {
            this.question();
          }
        },
        error: err => {
          this.question();
          console.log(err);
        },
      });
  }

  firstGood(good: IGood) {
    this.good = good;
  }

  question() {
    this.alertQuestion(
      'info',
      'Confirmación',
      'No realizó la actualización de estatus, el folio de escaneo generado se eliminara ¿Deceas segir?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        this.deleteFoli();
      }
    });
  }

  deleteFoli() {
    this.documnetServices.delete(this.document.id).subscribe({
      next: response => {
        this.onLoadToast(
          'success',
          'Elimiado',
          'Se ha eliminado correctamente el Folio'
        );
      },
      error: err => {
        console.log(err);
      },
    });
  }
}
