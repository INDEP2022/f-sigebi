import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { maxDate } from 'src/app/common/validations/date.validators';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-remittances-recorded-region',
  templateUrl: './remittances-recorded-region.component.html',
  styles: [],
})
export class RemittancesRecordedRegionComponent
  extends BasePage
  implements OnInit
{
  pdfurl = 'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf';
  coordinationsItems = new DefaultSelect();
  selectedCoordination: any = null;
  form: FormGroup = new FormGroup({});

  today: Date;
  maxDate: Date;
  minDate: Date;

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer
  ) {
    super();
    this.today = new Date();
    this.minDate = new Date(this.today.getFullYear(), this.today.getMonth(), 2);
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getCoordinations({ page: 1, text: '' });
  }

  private prepareForm() {
    this.form = this.fb.group({
      rangeDate: [null, [Validators.required, maxDate(new Date())]],
      coordination: [null, [Validators.required]],
    });
  }

  getCoordinations(params: ListParams) {
    if (params.text == '') {
      this.coordinationsItems = new DefaultSelect(
        this.coordinationsTestData,
        5
      );
    } else {
      const id = parseInt(params.text);
      const item = [this.coordinationsTestData.filter((i: any) => i.id == id)];
      this.coordinationsItems = new DefaultSelect(item[0], 1);
    }
  }

  selectCoordination(event: any) {
    this.selectedCoordination = event;
  }

  openPrevPdf() {
    let config: ModalOptions = {
      initialState: {
        documento: {
          urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfurl),
          type: 'pdf',
        },
        callback: (data: any) => {
          console.log(data);
        },
      }, //pasar datos por aca
      class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
      ignoreBackdropClick: true, //ignora el click fuera del modal
    };
    this.modalService.show(PreviewDocumentsComponent, config);
  }

  coordinationsTestData: any[] = [
    {
      no_delegacion: 0,
      descripcion: 'OFICINAS CENTRALES',
    },
    {
      no_delegacion: 1,
      descripcion: 'COORD. REGIONAL TIJUANA',
    },
    {
      no_delegacion: 2,
      descripcion: 'COORD. REGIONAL HERMOSILLO',
    },
    {
      no_delegacion: 3,
      descripcion: 'COORD. REGIONAL CIUDAD JUAREZ',
    },
    {
      no_delegacion: 4,
      descripcion: 'COORD. REGIONAL MONTERREY',
    },
    {
      no_delegacion: 5,
      descripcion: 'COORD. REGIONAL CULIACAN',
    },
    {
      no_delegacion: 6,
      descripcion: 'COORD. REGIONAL GUADALAJARA',
    },
    {
      no_delegacion: 7,
      descripcion: 'COORD. REGIONAL QUERETARO',
    },
    {
      no_delegacion: 8,
      descripcion: 'COORD. REGIONAL VERACRUZ',
    },
    {
      no_delegacion: 9,
      descripcion: 'COORD. REGIONAL TUXTLA GTZ',
    },
    {
      no_delegacion: 10,
      descripcion: 'COORD. REGIONAL CANCUN',
    },
    {
      no_delegacion: 11,
      descripcion: 'COORD. REGIONAL CENTRO',
    },
    {
      no_delegacion: 15,
      descripcion: 'DELEGACION MIGRACION',
    },
  ];
}
