import { animate, style, transition, trigger } from '@angular/animations';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-remittances-recorded-region',
  templateUrl: './remittances-recorded-region.component.html',
  styles: [
    `
      .btn-event-search {
        position: absolute;
        width: 30px;
        height: 30px;
        padding: 5px;
        border-radius: 50%;
        border: none;
        right: 5px;
      }

      button.loading:after {
        content: '';
        display: inline-block;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 2px solid #fff;
        border-top-color: transparent;
        border-right-color: transparent;
        animation: spin 0.8s linear infinite;
        margin-left: 5px;
        vertical-align: middle;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
    `,
  ],
  animations: [
    trigger('OnEventSelected', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('500ms', style({ opacity: 0 }))]),
    ]),
  ],
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

  loadingBtn: boolean = false;
  delegations = new DefaultSelect();

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private delegationService: DelegationService,
    private siabService: SiabService,
    private datePipe: DatePipe,
    private sanitizer: DomSanitizer
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
  }

  getDelegations(params: ListParams) {
    this.loading = true;
    params['filter.description'] = `$ilike:${params.text}`;
    params['sortBy'] = `description:ASC`;
    params['filter.etapaEdo'] = '2';

    this.delegationService.getAll2(params).subscribe({
      next: resp => {
        console.log('Resp: ', resp);
        this.delegations = new DefaultSelect(resp.data, resp.count);
      },
      error: error => {
        console.log('Error: ', error);
      },
    });
  }

  selectCoordination(event: any) {
    this.selectedCoordination = event;
  }

  openPrevPdf() {
    // Obtener las fechas del formulario
    this.loadingBtn = true;
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
          this.loadingBtn = false;
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
          this.loadingBtn = false;
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
}
