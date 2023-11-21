import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { SurvillanceService } from 'src/app/core/services/ms-survillance/survillance.service';
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
  delegation: any = [];
  today: Date;
  maxDate: Date;
  minDate: Date;
  itemsDelegation = new DefaultSelect();

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private delegationService: DelegationService,
    private siabService: SiabService,
    private datePipe: DatePipe,
    private sanitizer: DomSanitizer,
    private binnacleService: SurvillanceService
  ) {
    super();
    this.today = new Date();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getDelegations(new ListParams());
  }

  private prepareForm() {
    this.form = this.fb.group({
      f_ini: [null, [Validators.required]],
      f_fin: [null, [Validators.required]],
      coordination: [null, [Validators.required]],
    });
    setTimeout(() => {
      this.getDelegations(new ListParams());
    }, 1000);
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

  getDelegations(params: ListParams) {
    this.loading = true;
    this.binnacleService.getViewVigDelegations_(params).subscribe(
      (resp: any) => {
        this.delegation = resp.data.map(async (item: any) => {
          item['tipoSupbtipoDescription'] =
            item.delegationNumber + ' - ' + item.description;
          return item; // Asegurarse de devolver el item modificado.
        });
        Promise.all(this.delegation).then((res: any) => {
          this.itemsDelegation = new DefaultSelect(resp.data, resp.count);
          console.log(this.itemsDelegation);
          this.loading = false;
        });
      },
      error => {
        this.itemsDelegation = new DefaultSelect([], 0);
      }
    );
  }

  selectCoordination(event: any) {
    this.selectedCoordination = event;
  }

  openPrevPdf() {
    // Obtener las fechas del formulario
    const fechaInicio = this.form.get('f_ini').value;
    const fechaFin = this.form.get('f_fin').value;

    if (fechaInicio > fechaFin) {
      this.alert(
        'warning',
        'La Fecha Inicial no puede ser mayor a la Fecha Fin',
        ''
      );
      return;
    }
    const delegation = this.form.get('coordination').value;
    console.log(delegation);

    // Formatear las fechas al formato "dd-mm-yyyy"
    const fechaInicioFormateada = this.datePipe.transform(
      fechaInicio,
      'dd-MM-yyyy'
    );
    const fechaFinFormateada = this.datePipe.transform(fechaFin, 'dd-MM-yyyy');
    let params = {
      DELEGACION: delegation,
      P_FECINI: fechaInicioFormateada,
      P_FECFIN: fechaFinFormateada,
    };
    console.log(params);

    this.siabService
      .fetchReport('RCOMERENVREMESA', params)
      .subscribe(response => {
        if (response !== null) {
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
        }
      });
  }

  clean() {
    this.form.reset();
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
