export const BASIC_BUTTONS = [
  {
    name: 'Nuevo / Agregar',
    code: `<button type="button" tooltip="Agregar" containerClass="tooltip-style" class="btn btn-info btn-sm active ml-2 mr-2">
                <i class="bx bx-plus bx-sm float-icon"></i>
              </button>`,
  },
  {
    name: 'Nuevo',
    code: `<button type="button" tooltip="Nuevo" containerClass="tooltip-style" class="btn btn-info btn-sm active ml-2 mr-2">
                Nuevo <i class="bx bx-plus bx-sm float-icon"></i>
              </button>`,
  },
  {
    name: 'Agregar',
    code: `<button type="button" tooltip="Agregar" containerClass="tooltip-style" class="btn btn-info btn-sm active ml-2 mr-2">
                Agregar <i class="bx bx-plus bx-sm float-icon"></i>
              </button>`,
  },
  {
    name: 'Guardar',
    code: `<button
              type="button"
              class="btn btn-primary btn-sm active">
              Guardar
              <i aria-hidden="true" class="fa fa-save"></i>
            </button>`,
  },
  {
    name: 'Buscar',
    code: `<button
          type="button"
          class="btn btn-primary active btn-sm">
          <i class="bx bx-search-alt bx-sm float-icon"></i>
        </button>`,
  },
  {
    name: 'Buscar 2',
    code: `<button
          type="button"
          class="btn btn-primary active btn-sm">
          Buscar
          <i class="bx bx-search-alt bx-sm float-icon"></i>
        </button>`,
  },
  {
    name: 'Filtrar',
    code: `<button
            type="button"
            class="btn btn-primary btn-sm">
            <i class="bx bx-check bx-sm float-icon"></i>
          </button>
          <button
            type="button"
            class="btn btn-primary btn-sm">
            <i class="bx bx-x bx-sm float-icon"></i>
          </button>`,
  },
  {
    name: 'Listar catalogos etc...',
    code: `<button
      type="button"
      class="btn btn-primary btn-sm active">
      <i class="bx bx-list-plus bx-sm float-icon"></i>
    </button>`,
  },
  {
    name: 'Imprimir',
    code: `<button
              type="button"
              class="btn btn-primary active btn-sm">
              Imprimir <i class="bx bx-printer bx-sm float-icon"></i>
            </button>`,
  },

  {
    name: 'Aprobar',
    code: `<button
              class="btn btn-primary btn-sm active m-3">
              Aprobar <i class="fa fa-check" aria-hidden="true"></i>

            </button>`,
  },
  {
    name: 'Eliminar',
    code: `<button
              class="btn btn-red btn-sm active m-3">
              Eliminar <i class="fa fa-trash" aria-hidden="true"></i>

            </button>`,
  },
  {
    name: 'Generar folio de escaneo',
    code: `<button
            tooltip="Generar Folio de Escaneo y Solicitud"
            containerClass="tooltip-style"
            class="btn btn-secondary btn-sm active m-1">
            <i class="bx bxs-file-find"></i>
          </button>`,
  },
  {
    name: 'Escanear',
    code: `<button
                    tooltip="Escanear"
                    containerClass="tooltip-style"
                    class="btn btn-secondary btn-sm active m-1">
                    <i class="bx bxs-file"></i>
                  </button>`,
  },
  {
    name: 'Imprimir Solicitud de Escaneo',
    code: `<button
            tooltip="Generar Folio de Escaneo y Solicitud"
            containerClass="tooltip-style"
            class="btn btn-secondary btn-sm active m-1">
            <i class="bx bxs-file-find"></i>
          </button>`,
  },
  {
    name: 'Consulta de imágenes escaneadas',
    code: `<button
            type="button"
            data-toggle="tooltip"
            class="btn btn-secondary btn-sm active"
            tooltip="Consulta de imágenes escaneadas">
            <i class="bx bxs-file-find"></i>
          </button>`,
  },
  {
    name: 'Enviar',
    code: `<button
                type="submit"
                class="btn btn-primary btn-sm active"
                tooltip="Enviar"
                containerClass="tooltip-style">
                <i class="bx bx-send"></i>
              </button>`,
  },
  {
    name: 'Enviar',
    code: `<button
                type="submit"
                class="btn btn-primary btn-sm active"
                tooltip="Enviar"
                containerClass="tooltip-style">
                Enviar <i class="bx bx-send"></i>
              </button>`,
  },
  {
    name: 'Regresar',
    code: `<button class="btn btn-primary active btn-sm m-2">
          Regresar
          <i class="fas fa-arrow-circle-left"></i>
        </button>`,
  },
  {
    name: 'Imprimir',
    code: `<button
              type="button"
              class="btn btn-primary active btn-sm">
              Imprimir <i class="bx bx-printer bx-sm float-icon"></i>
            </button>`,
  },
  {
    name: 'Exportar a Excel',
    code: `<button
            class="btn btn-sm btn-success active">
            Exportar a Excel
            <i class="bx bx-download float-icon"></i>
          </button>`,
  },
  {
    name: 'Limpiar',
    code: `<button
            class="btn btn-danger btn-sm active mr-3">
            Limpiar <i class="fas fa-eraser"> </i>
          </button>`,
  },
  {
    name: 'Recargar',
    code: `<button
            class="btn btn-primary btn-sm active mr-3">
            Recargar <i class="fas fa-sync-alt"> </i>
          </button>`,
  },
  {
    name: 'Escanear 2',
    code: `<button  class="btn btn-info active btn-sm"> 
    Escanear <i  class="bx bx-file bx-sm float-icon"></i>
    </button>`,
  },
  {
    name: 'Turnar',
    code: `<button  class="btn btn-primary active btn-sm"> 
    Turnar <i aria-hidden="true" class="fa fa-share-square"></i>
    </button>`,
  },
  {
    name: 'Importar Excel',
    code: `<button
            type="button"
            class="btn btn-sm btn-success active m-3">
            Importar Excel <i class="bi bi-file-earmark-excel-fill"></i>
          </button>`,
  },
  {
    name: 'Seleccionar',
    code: `<button
          type="button"
          class="btn btn-primary active btn-sm">
          Seleccionar <i class="fas fa-edit bx-sm float-icon"></i>
        </button>`,
  },
  {
    name: 'Aceptar',
    code: `<button
            class="btn btn-primary btn-sm active mr-3">
            Aceptar
          </button>`,
  },
  {
    name: 'Cancelar',
    code: `<button
            class="btn btn-danger btn-sm active mr-3">
            Cancelar
          </button>`,
  },
  {
    name: 'Cerrar',
    code: `<button
            class="btn btn-primary btn-sm active mr-3">
            Cerrar
          </button>`,
  },
  {
    name: 'Procesar',
    code: `<button
          type="button"
          class="btn btn-primary active btn-sm">
          Procesar
          <i class="bx bx-search-alt bx-sm float-icon"></i>
        </button>`,
  },
  {
    name: 'Continuar',
    code: `<button
          type="button"
          class="btn btn-primary active btn-sm">
          Continuar
        </button>`,
  },
  {
    name: 'Firmar reporte',
    code: `<button
          type="button"
          class="btn btn-primary active btn-sm">
          <i class="bx bx-edit-alt"></i>
          Firmar Reporte
        </button>`,
  },
  {
    name: 'Rechazar',
    code: `<button
            class="btn btn-danger btn-sm active mr-3">
            Rechazar
          </button>`,
  },
  {
    name: 'Asociar',
    code: `<button
              tooltip="Asociar"
              containerClass="tooltip-style"
              class="btn btn-info btn-sm active">
              <i class="fa fa-link" aria-hidden="true"></i>
            </button>`,
  },
  {
    name: 'Nuevo Documento',
    code: `<button
             class="btn btn-success btn-sm active">
            Nuevo expediente <i class="fa fa-file"></i>
          </button>`,
  },
  {
    name: 'Ver (Oficio, Acta etc...)',
    code: `<button
            class="btn btn-primary btn-sm active mr-3">
            Ver  <i class="fa fa-eye" aria-hidden="true"></i>
          </button>`,
  },
  {
    name: 'Actualizar',
    code: `<button
            class="btn btn-primary btn-sm active mr-3">
            Actualizar <i class="fas fa-sync-alt"> </i>
          </button>`,
  },

  {
    name: 'Turnar',
    code: `<button
              class="btn btn-primary btn-sm active m-3">
              Turnar  <i class="fa fa-check" aria-hidden="true"></i>
            </button>`,
  },
  {
    name: 'Consultar',
    code: `<button
              class="btn btn-primary btn-sm active m-3">
              Consultar 
          <i class="bx bx-search-alt bx-sm float-icon"></i>
            </button>`,
  },
  {
    name: 'Filtrar',
    code: `<button
            class="btn btn-primary btn-sm active"
            (click)="buildFilters()">
            Filtrar
            <i class="fa fa-filter" aria-hidden="true"></i>
          </button>`,
  },
  {
    name: 'Siguiente',
    code: `<button class="btn btn-primary active btn-sm m-2">
          Siguiente
          <i class="fas fa-arrow-circle-right"></i>
        </button>`,
  },
  {
    name: 'Transferir',
    code: `<button class="btn btn-success active btn-sm m-2">
          Transferir
        </button>`,
  },
  {
    name: 'Replicar Folio',
    code: `<button class="btn btn-primary active btn-sm m-2">
          Replicar Folio
        </button>`,
  },
];
