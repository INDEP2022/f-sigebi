export const CAT_DOC_REQUIRE_COLUMNS = {
  numRegister: {
    title: 'No. Registro',
    type: 'number',
    sort: false,
  },
  id: {
    title: 'Clave del Documento',
    type: 'number',
    sort: false,
  },
  description: {
    title: 'Descripción',
    type: 'string',
    sort: false,
  },
  typeDictum: {
    title: 'Tipo de Dictamen',
    type: 'html',
    valuePrepareFunction: (value: string) => {
      if (value == 'DECOMISO')
        return '<strong><span class="badge badge-pill badge-success">Decomiso</span></strong>';
      if (value == 'DEVOLUCION')
        return '<strong><span class="badge badge-pill badge-success">Devolución</span></strong>';
      if (value == 'RECREVISION')
        return '<strong><span class="badge badge-pill badge-success">Recrevisión</span></strong>';
      if (value == 'ASEGURAMIENTO')
        return '<strong><span class="badge badge-pill badge-success">Aseguramiento</span></strong>';
      if (value == 'ENAJENACION')
        return '<strong><span class="badge badge-pill badge-success">Enajenación</span></strong>';
      if (value == 'DESTRUCCION')
        return '<strong><span class="badge badge-pill badge-success">Destrucción</span></strong>';
      if (value == 'DONACION')
        return '<strong><span class="badge badge-pill badge-success">Donación</span></strong>';
      if (value == 'DESTINO')
        return '<strong><span class="badge badge-pill badge-success">Destino</span></strong>';
      if (value == 'TRANSFERENTE')
        return '<strong><span class="badge badge-pill badge-success">Transferente</span></strong>';
      if (value == 'ABANDONO')
        return '<strong><span class="badge badge-pill badge-success">Abandono</span></strong>';
      if (value == 'RESARCIMIENTO')
        return '<strong><span class="badge badge-pill badge-success">Resarcimiento</span></strong>';
      if (value == 'PROCEDENCIA')
        return '<strong><span class="badge badge-pill badge-success">Procedencia</span></strong>';
      if (value == 'COMER')
        return '<strong><span class="badge badge-pill badge-success">Comercialización</span></strong>';
      if (value == 'EXT_DOM')
        return '<strong><span class="badge badge-pill badge-success">Ext dom</span></strong>';
      return value;
    },
    filter: {
      type: 'list',
      config: {
        selectText: 'Seleccionar',
        list: [
          { value: 'DECOMISO', title: 'Decomiso' },
          { value: 'DEVOLUCION', title: 'Devolución' },
          { value: 'RECREVISION', title: 'Recrevisión' },
          { value: 'ASEGURAMIENTO', title: 'Aseguramiento' },
          { value: 'ENAJENACION', title: 'Enajenación' },
          { value: 'DESTRUCCION', title: 'Destrucción' },
          { value: 'DONACION', title: 'Donación' },
          { value: 'DESTINO', title: 'Destino' },
          { value: 'TRANSFERENTE', title: 'Transferente' },
          { value: 'ABANDONO', title: 'Abandono' },
          { value: 'RESARCIMIENTO', title: 'Resarcimiento' },
          { value: 'PROCEDENCIA', title: 'Procedencia' },
          { value: 'COMER', title: 'Comercialización' },
          { value: 'EXT_DOM', title: 'Ext dom' },
        ],
      },
    },
    sort: false,
  },
};
