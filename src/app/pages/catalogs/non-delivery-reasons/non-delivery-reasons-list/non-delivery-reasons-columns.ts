export const NON_DELIVERY_REASONS_COLUMNS = {
    id: {
        title: "Registro",
        type: "number",
        sort: false
    },
    reasonType: {
        title: "Tipo de motivo",
        type: "string",
        sort: false
    },
    eventType: {
        title: "Tipo de evento",
        type: "string",
        sort: false
    },
    reason: {
        title: "Motivo",
        type: "string",
        sort: false
    },
    userCreation: {
        title: "Creado por",
        type: "string",
        sort: false
    },
    userModification: {
        title: "Modificado por",
        type: "string",
        sort: false
    },
    version: {
        title: "Versión",
        type: "number",
        sort: false
    },
    status: {
        title: "Estado",
        type: "html",
        valuePrepareFunction: (value: number) => {
            if (value == 0) {
              return '<strong><span class="badge rounded-pill text-bg-success">Activo</span></strong>';
            } else {
              return '<strong><span class="badge rounded-pill text-bg-warning">Inactivo</span></strong>';
            }
          },
        sort: false
    },
};