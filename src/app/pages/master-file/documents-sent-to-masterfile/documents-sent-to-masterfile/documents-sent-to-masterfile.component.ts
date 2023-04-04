import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { DOCUMENTS_SENT_COLUMNS } from './documents-sent-columns';

import { IDocuments } from 'src/app/core/models/ms-documents/documents';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';

import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';

@Component({
  selector: 'app-documents-sent-to-masterfile',
  templateUrl: './documents-sent-to-masterfile.component.html',
  styles: [],
})
export class DocumentsSentToMasterfileComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup;

  data: LocalDataSource = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;

  columns: IDocuments[] = [];

  columnFilters: any = [];

  blk_doc: any = {};
  constructor(
    private fb: FormBuilder,
    private documentsService: DocumentsService
  ) {
    super();
    let objBase = this;
    this.settings = {
      ...this.settings,
      actions: false,

      columns: {
        ...DOCUMENTS_SENT_COLUMNS,
        check: {
          title: 'Check',
          type: 'custom',
          renderComponent: CheckboxElementComponent,
          onComponentInitFunction(instance: any) {
            instance.toggle.subscribe((data: any) => {
              objBase.enviarDocumento(data);
              /*
              this.enviarDocumento(data);
              
              if (data.toggle) {
                goodCheck.push(data);
              } else {
                goodCheck = goodCheck.filter(valor => valor.row.id != data.row.id);
              }
              */
            });
          },
          sort: false,
        },
      },
    };
  }

  ngOnInit(): void {
    this.prepareForm();
    this.objblk();
    //this.getDocument();

    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;

          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            /*SPECIFIC CASES*/
            filter.field == 'area'
              ? (field = `filter.${filter.field}.areaSends`)
              : (field = `filter.${filter.field}`);
            filter.field == 'id'
              ? (searchFilter = SearchFilter.EQ)
              : (searchFilter = SearchFilter.ILIKE);
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.getDocument();
        }
      });

    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getDocument());
  }

  prepareForm() {
    this.form = this.fb.group({
      file: [null, Validators.required],
      area: [null, Validators.required],
      sentBy: [null, Validators.required],

      record: [null, Validators.required],
      responsible: [null, Validators.required],
    });
  }

  onFilterChange(event: any) {
    let filtros = [];

    const expediente = this.form.get('file').value;
    const areaSends = this.form.get('area').value;
    const userRequestsScan = this.form.get('sentBy').value;

    const recordValue = this.form.get('record').value;
    const responsibleValue = this.form.get('responsible').value;

    if (areaSends != null) {
      if (areaSends.length > 0) {
        filtros.push({ field: 'areaSends', search: areaSends });
      }
    }

    if (expediente != null) {
      filtros.push({ field: 'id', search: expediente });
    }

    if (userRequestsScan != null) {
      filtros.push({ field: 'userSend', search: userRequestsScan });
    }

    this.data.setFilter(filtros);
    this.data.refresh();
  }

  getDocument() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };

    this.documentsService.getAll(params).subscribe({
      next: response => {
        this.columns = response.data;
        this.totalItems = response.count || 0;

        this.data.load(this.columns);
        this.data.refresh();
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  getFormElements() {
    const fileInput = this.form.get('file');
    const areaSelect = this.form.get('area');
    const sentByInput = this.form.get('sentBy');
    const recordInput = this.form.get('record');
    const responsibleInput = this.form.get('responsible');
    const sendButton = document.getElementById('send');

    return {
      fileInput,
      areaSelect,
      sentByInput,
      recordInput,
      responsibleInput,
      sendButton,
    };
  }

  getFormData() {
    const {
      fileInput,
      areaSelect,
      sentByInput,
      recordInput,
      responsibleInput,
    } = this.getFormElements();

    const file = fileInput.value;
    const area = areaSelect.value;
    const sentBy = sentByInput.value;
    const record = recordInput.value;
    const responsible = responsibleInput.value;
    return { file, area, sentBy, record, responsible };
  }

  validateForm() {
    const { file, area, sentBy, record, responsible } = this.getFormData();

    if (!file || !area || !sentBy || !record || !responsible) {
      alert('Por favor complete todos los campos');
      return false;
    }

    return true;
  }

  /***************
   * Aqui cambia la logica del check pero no hay secuencia
   */

  enviarDocumento(data: any) {
    const estatus_escaneo = data.scanStatus;
    const { file, area, sentBy, record, responsible } = this.getFormData();

    // Obtener los valores de los campos relevantes

    /*
  const expediente = this.form.get('file').value;
  const areaSends = this.form.get('area').value;
  const userRequestsScan = this.form.get('sentBy').value;


  const recordValue = this.form.get('record').value;
  const responsibleValue = this.form.get('responsible').value;
  */
    /*
    const cb_enviado = document.getElementById('cb_enviado').value;
    const estatus_escaneo = document.getElementById('estatus_escaneo').value;
    const ti_usuario = document.getElementById('ti_usuario').value;
    const ti_area = document.getElementById('ti_area').value;
    */

    const ti_usuario = this.form.get('sentBy').value;

    // Realizar la lógica de negocio
    if (this.blk_doc.cb_enviado === 'S') {
      if (estatus_escaneo === 'SOLICITADO') {
        alert(
          'Documento pendiente de digitalizar, para su envio al archivo debe digitalizarlo.'
        );
        return;
      } else if (ti_usuario === '') {
        alert('Falta quien lo Envia.');
        return;
      } else if (estatus_escaneo === 'ESCANEADO') {
        const usuario_envia = ti_usuario;
        const area_envia = area;
        const fecha_envio = new Date();
        const estatus_archivo = 'ENVIADO';

        // Realizar la acción correspondiente, como enviar una solicitud HTTP al servidor para guardar los cambios
        fetch('/guardarDocumento', {
          method: 'POST',
          body: JSON.stringify({
            usuario_envia,
            area_envia,
            fecha_envio,
            estatus_archivo,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then(() => {
            alert('Documento enviado correctamente.');
          })
          .catch(error => {
            console.error('Error al enviar el documento:', error);
          });
      }
    } else {
      /*
      const estatus_archivo = 'PENDIENTE';
      const cve_archivo_envia = null;
      const usr_responsable_archivo = null;

      // Realizar la acción correspondiente, como enviar una solicitud HTTP al servidor para guardar los cambios
      fetch('/guardarDocumento', {
        method: 'POST',
        body: JSON.stringify({ estatus_archivo, cve_archivo_envia, usr_responsable_archivo }),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(() => {
        alert('Documento actualizado correctamente.');
      }).catch((error) => {
        console.error('Error al actualizar el documento:', error);
      });
      */
    }
  }

  objblk() {
    this.blk_doc.area_envia = null;
    this.blk_doc.asunto = null;
    this.blk_doc.cb_enviado = 'N';
    this.blk_doc.cb_tipo_doc = null;
    this.blk_doc.cb_unidad_destino = null;
    this.blk_doc.cb_unidad_origen = null;
    this.blk_doc.ciclo_vida = null;
    this.blk_doc.descr_adjunto = null;
    this.blk_doc.despachado = null;
    this.blk_doc.despachado_fecha = null;
    this.blk_doc.despachado_usuario = null;
    this.blk_doc.di_area_desc = null;
    this.blk_doc.di_usuario_desc = null;
    this.blk_doc.estatus = null;
    this.blk_doc.excluido = null;
    this.blk_doc.fecha_registro = null;
    this.blk_doc.fec_captura = null;
    this.blk_doc.fec_modificacion = null;
    this.blk_doc.fec_registro = null;
    this.blk_doc.firma_electronica = null;
    this.blk_doc.firma_electronica_sha1 = null;
    this.blk_doc.id_documento = null;
    this.blk_doc.id_estatus = null;
    this.blk_doc.id_instruccion = null;
    this.blk_doc.id_movimiento = null;
    this.blk_doc.id_padre = null;
    this.blk_doc.id_tipo_documento = null;
    this.blk_doc.id_unidad_origen = null;
    this.blk_doc.id_usuario_envia = null;
    this.blk_doc.id_usuario_firma = null;
    this.blk_doc.idioma = null;
    this.blk_doc.instrucciones = null;
    this.blk_doc.no_documento = null;
    this.blk_doc.no_expediente = null;
    this.blk_doc.no_folio = null;
    this.blk_doc.no_registrado = null;
    this.blk_doc.no_serie = null;
    this.blk_doc.no_subdelegacion = null;
    this.blk_doc.no_turno = null;
    this.blk_doc.no_unidad = null;
    this.blk_doc.no_unidad_destino = null;
    this.blk_doc.no_unidad_origen = null;
    this.blk_doc.no_version = null;
    this.blk_doc.nombre_archivo = null;
    this.blk_doc.nombre_archivo_firmado = null;
    this.blk_doc.nombre_archivo_original = null;
    this.blk_doc.nombre_firmante = null;
    this.blk_doc.nombre_formato = null;
    this.blk_doc.nombre_usuario_envia = null;
    this.blk_doc.nueva_version = null;
    this.blk_doc.num_copias = null;
    this.blk_doc.num_folios = null;
    this.blk_doc.num_folios_anexos = null;
    this.blk_doc.observaciones = null;
    this.blk_doc.padre = null;
    this.blk_doc.procedencia = null;
    this.blk_doc.ruta_archivo = null;
    this.blk_doc.ruta_firma_electronica = null;
    this.blk_doc.subtipo_documento = null;
    this.blk_doc.tipo_documento = null;
    this.blk_doc.tipo_procedencia = null;
    this.blk_doc.tipo_turno = null;
    this.blk_doc.usuario_envia = null;
    this.blk_doc.usuario_firma = null;
    this.blk_doc.usuario_modifica = null;
    this.blk_doc.usuario_registro = null;
    this.blk_doc.vigencia = null;
    this.blk_doc.vigencia_fin = null;
    this.blk_doc.vigencia_inicio = null;
  }
}
