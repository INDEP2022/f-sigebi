export const CLOSE_PROCEEDING_MESSAGE = (
  fecha: string,
  total: number,
  cve: string
) => `
Estimados: \n Se les notifica que con esta fecha: ${fecha}, ${total} registros considerados en la solicitud de autorización de destrucción número ${cve} cambiaron de estatus a RGA (Bien Recibido para Gestión de autorización), los cuales puede consultar en el SIAB. En caso de existir diferencia, los registros faltantes corresponden a los considerados como inconsistentes los cuales fueron referidos en correo(s) electrónico(s) que les fueron enviados. \n\nPara aquellos registros que no se realizó el cambio de estatus derivado de alguna inconsistencia, estos deberán ser perfeccionados y gestionados por esa Delegación Regional mediante el envío de un nueva solicitud de destrucción con el oficio correspondiente.
`;
