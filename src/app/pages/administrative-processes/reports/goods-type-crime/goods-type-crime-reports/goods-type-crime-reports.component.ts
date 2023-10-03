import { Component, OnInit } from '@angular/core';
//Reactive Forms
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { GoodTypeService } from 'src/app/core/services/catalogs/good-type.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
//BasePage
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-goods-type-crime-reports',
  templateUrl: './goods-type-crime-reports.component.html',
  styles: [],
})
export class GoodsTypeCrimeReportsComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});

  dateI: string = '';
  dateF: string = '';
  loadTypes = false;
  public goodTypes = new DefaultSelect();

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private siabService: SiabService,
    private sanitizer: DomSanitizer,
    private goodTypesService: GoodTypeService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm(): void {
    this.form = this.fb.group({
      delegation: [null, [Validators.required]],
      subdelegation: [null, [Validators.required]],
      crime: [null, [Validators.required]],
      requestArea: [null, [Validators.required]],
      goodType: [null, [Validators.required]],
      from: [null, [Validators.required]],
      //dateFin: [null, [Validators.required]],
      to: [null, [Validators.required]],
    });
  }

  confirm(): void {
    if (!this.validarFechas()) {
      //this.loading = true;
      this.generar();
      //console.log(this.checkedListFA,this.checkedListFI)
      // console.log(this.form.value);
      // setTimeout((st: any) => {
      //   this.loading = false;
      // }, 5000);
    }
  }

  generar() {
    const {
      delegation,
      subdelegation,
      from,
      to,
      goodType,
      requestArea,
      crime,
    } = this.form.value;
    let params = {
      PARAMFORM: 'NO',
      PN_DELEG: Number(delegation),
      PN_SUBDEL: Number(subdelegation),
      PF_FECINI: this.formatDate2(new Date(from)),
      PF_FECFIN: this.formatDate2(new Date(to)),
      PC_CVE_DELITO: crime,
      PN_STIPO: Number(goodType),
      PN_TIPO: Number(requestArea),
    };
    console.log('Params Report-> ', params);
    this.siabService.fetchReport('RCONADBBIENXDELIT', params).subscribe(
      resp => {
        if (resp != null && resp != undefined) {
          const blob = new Blob([resp], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          let config = {
            initialState: {
              documento: {
                urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
                type: 'pdf',
              },
              callback: (data: any) => {
                if (data) {
                  data.map((item: any) => {
                    return item;
                  });
                }
              },
            }, //pasar datos por aca
            class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
            ignoreBackdropClick: true,
          };
          this.modalService.show(PreviewDocumentsComponent, config);
        }
      },
      error => {
        this.onLoadToast(
          'warning',
          'advertencia',
          'Por favor verificar los datos'
        );
      }
    );
  }

  formatDate2(date: Date): string {
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear().toString();
    return `${year}-${month}-${day}`;
  }

  validarFechas(): boolean {
    this.dateI = this.form.value.from;
    this.dateF = this.form.value.to;
    if (this.dateF < this.dateI) {
      this.onLoadToast('error', 'Rango de fechas erróneo');
      return true;
    }
    return false;
  }

  getGoodType(params?: ListParams) {
    this.goodTypesService.getAll(params).subscribe(
      data => {
        this.goodTypes = new DefaultSelect(data.data, data.count);
        console.log('getGoodType-> ', data);
        //this.form.get('').setValue(data);
      },
      error => {
        console.log('Err');
      }
    );
  }

  clear() {
    this.form.reset();
  }
}
