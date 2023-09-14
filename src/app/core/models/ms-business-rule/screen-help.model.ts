export interface IScreenHelp {
  screenKey: string;
  businessRoleNumber: number;
  //help: string;// Verificar con que esta esta relacionado.
  businessRoleDesc: string;
  recordNumber: number; // TODO: checar a que tabla hace referencia
}

export interface IScreenHelpTwo {
  screenKey: string;
  help: string;
  recordNumber: number;
  appScreen: [];
}
