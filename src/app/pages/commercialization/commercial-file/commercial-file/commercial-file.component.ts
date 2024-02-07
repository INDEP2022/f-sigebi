import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IGood } from 'src/app/core/models/ms-good/good';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { GoodFinderService } from 'src/app/core/services/ms-good/good-finder.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-commercial-file',
  templateUrl: './commercial-file.component.html',
  styles: [],
})
export class CommercialFileComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  loading2 = this.loading;
  loading3 = this.loading;
  loadingText: string;
  viewPhoto: boolean = false;
  disabled: boolean = false;
  goodNumber: number;
  @Input() statusActaValue: string;
  classifGood: number;
  params = new BehaviorSubject<FilterParams>(new FilterParams());
  goods = new DefaultSelect<IGood>();
  searchTabForm: ModelForm<any>;
  goodSelect: IGood;
  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private siabService: SiabService,
    private sanitizer: DomSanitizer,
    private service: GoodFinderService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      noGood: [null, [Validators.required]],
    });
  }

  fcom() {
    this.loading = true;
    let params = {
      P_NO_BIEN: this.form.controls['noGood'].value,
    };
    this.goodNumber = this.form.controls['noGood'].value;
    this.viewPhoto = true;
    this.downloadReport('FICHACOMERCIAL', params); //Cuando el reporte este disponible en jasper, sustituir el nombre a -> 'FICHACOMERCIAL'
  }

  ftec() {
    this.loading2 = true;
    let params = {
      P_NO_BIEN: this.form.controls['noGood'].value,
      P_IDENTIFICADOR: 0,
    };
    this.goodNumber = this.form.controls['noGood'].value;
    this.viewPhoto = true;
    this.downloadReport('FICHATECNICA', params);
  }

  fie() {
    console.log('Bien:', this.goodSelect);
    this.loading3 = true;
    let params = {
      P_NO_BIEN: this.form.controls['noGood'].value,
      P_NO_EXPEDIENTE: this.goodSelect?.associatedFileNumber,
      P_TRANSFERENTE: this.goodSelect?.origin,
    };
    this.downloadReport('REINGRESOSEGRESOS', params); //Cuando el reporte este disponible en jasper, sustituir el nombre a -> 'RINGRESOSEGRESOS'
  }

  downloadReport(reportName: string, params: any) {
    this.loadingText = 'Generando Reporte ...';
    this.siabService.fetchReport(reportName, params).subscribe({
      next: response => {
        console.log('Respuesta de Jasper: ', response);

        this.loading = false;
        this.loading2 = false;
        this.loading3 = false;

        if (response != null) {
          const blob = new Blob([response], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          let config = {
            initialState: {
              documento: {
                urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
                type: 'pdf',
              },
              callback: (data: any) => {},
            }, //pasar datos por aca
            class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
            ignoreBackdropClick: true, //ignora el click fuera del modal
          };
          this.modalService.show(PreviewDocumentsComponent, config);
        } else {
          this.alert(
            'warning',
            'El No. Bien no cuenta con reporte',
            'Intente con otro No. Bien'
          );
        }
      },
    });
  }

  clean() {
    window.scrollTo(0, 0);
    this.viewPhoto = false;
  }
  cleanBtn() {
    this.form.reset();
  }

  onChangeGood(event: IGood) {
    console.log(event);
    this.goodSelect = event;
  }

  getGoodsSheard(params: ListParams) {
    //Provisional data
    console.log(params);
    // this.searchTabForm.controls['noBien'].disable();
    this.params = new BehaviorSubject<FilterParams>(new FilterParams());
    this.loader.load = true;
    let data = this.params.value;
    data.page = params.page;
    data.limit = params.limit;
    console.log('CLASIFICADOR DEL BEINE ES: ', this.classifGood);
    if (this.classifGood) {
      data.addFilter('goodClassNumber', this.classifGood);
    }
    if (!isNaN(parseFloat(params.text)) && isFinite(+params.text)) {
      if (params.text != undefined && params.text != '') {
        data.addFilter('id', params.text, SearchFilter.EQ);
      }
    } else {
      if (params.text != undefined && params.text != '') {
        data.addFilter('description', params.text, SearchFilter.ILIKE);
      }
    }
    this.service.getAll2(data.getParams()).subscribe({
      next: data => {
        // this.dataGoods = data.data.map(clasi => {
        //   return {
        //     ...clasi,
        //     info: `${clasi.id} - ${clasi.description ?? ''}`,
        //   };
        // });
        this.goods = new DefaultSelect(data.data, data.count);
        this.loader.load = false;
        // this.searchTabForm.controls['noBien'].enable();
      },
      error: err => {
        this.goods = new DefaultSelect([], 0, true);
        let error = '';
        this.loader.load = false;
        // if (err.status === 0) {
        //   error = 'Revise su conexión de Internet.';
        //   this.onLoadToast('error', 'Error', error);
        // }
        // this.alert(
        //   'warning',
        //   'Información',
        //   'No hay bienes que mostrar con los filtros seleccionado'
        // );
      },
      complete: () => {
        this.searchTabForm.updateValueAndValidity();
      },
    });
  }
}

/* 
private async getData() {
    this.files = [];
    // debugger;
    // this.lastConsecutive = 1;
    this.filePhotoService
      .getAll(this.goodNumber + '')
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: async response => {
          if (response) {
            console.log(response);
            // debugger;
            if (response) {
              this.files = [...response];
              // const index = last.indexOf('F');
              // this.lastConsecutive += +last.substring(index + 1, index + 5);
              const pufValidaUsuario = await this.pufValidaUsuario();
              if (pufValidaUsuario === 1) {
                this.errorMessage = null;
              } else {
                const noActa = await this.pufValidaProcesoBien();
                if (noActa) {
                  this.errorMessage =
                    'No tiene permisos de escritura debio a que el bien ya fue recibido por el acta ' +
                    noActa +
                    ' y esta se encuentra cerrada';
                  console.log(this.errorMessage);
                } else {
                  this.errorMessage = null;
                }
              }
            }
          }
        },
      });
  }

*/
