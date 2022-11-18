export const baseMenuRegquest: string = '/pages/request/'; // Base url Menu
export const returnManageReturn: string = 'gestionar-devolucion/'; // Base url SubMenu
export const returnRequestRegistration: string =
  'registro-solicitud-devolucion/'; // Base url SubMenu

export const MENU_OPTIONS_REQUEST_MANAGE_RETURN = {
  label: 'Registro de Solicitud de Devolución',
  subItems: [
    {
      label: 'Registrar Documentación Complementaria Devolución',
      link:
        baseMenuRegquest +
        returnManageReturn +
        returnRequestRegistration +
        'registrar-documentacion-devolucion',
    },
    {
      label: 'Registro de Solicitud de Devolución',
      link:
        baseMenuRegquest +
        returnManageReturn +
        returnRequestRegistration +
        'registro-solicitud-devolucion',
    },
  ],
};
