export const baseMenuRegquest: string = '/pages/request/'; // Base url Menu
// export const returnManageReturn: string = 'gestionar-devolucion/'; // Base url SubMenu
export const returnManageReturn: string = 'manage-return/'; // Base url SubMenu
// export const returnRequestRegistration: string =
//   'registro-solicitud-devolucion/'; // Base url SubMenu
export const returnRequestRegistration: string = 'return-request-registration/'; // Base url SubMenu
// export const goodsClassification: string = 'clasificacion-bienes/'; // Base url SubMenu
export const goodsClassification: string = 'goods-classification/'; // Base url SubMenu
// export const approveReturnRequest: string = 'aprobar-solicitud-bienes/'; // Base url SubMenu
export const approveReturnRequest: string = 'approve-return-request/'; // Base url SubMenu

export const MENU_OPTIONS_REQUEST_MANAGE_RETURN = {
  label: 'Registro de Solicitud de Devolución',
  subItems: [
    {
      label: 'Registrar Documentación Complementaria Devolución',
      link:
        baseMenuRegquest +
        returnManageReturn +
        returnRequestRegistration +
        'register-document-return',
    },
    {
      label: 'Registro de Solicitud de Devolución',
      link:
        baseMenuRegquest +
        returnManageReturn +
        returnRequestRegistration +
        'return-request-record',
    },
    {
      label: 'Clasificación de Bienes',
      link:
        baseMenuRegquest +
        returnManageReturn +
        goodsClassification +
        'goods-classification',
    },
    {
      label: 'Aprobar Solicitud de Devolución',
      link:
        baseMenuRegquest +
        returnManageReturn +
        approveReturnRequest +
        'approve-return-request',
    },
  ],
};
