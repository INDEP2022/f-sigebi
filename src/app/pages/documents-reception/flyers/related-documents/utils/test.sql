DECLARE
   vNO_OF_DICTA  DICTAMINACIONES.NO_OF_DICTA%TYPE;
   vIDENTI       VARCHAR2(2);
   vTIPO_VOLANTE NOTIFICACIONES.TIPO_VOLANTE%TYPE;
   pl_id         ParamList; 
   pl_name       VARCHAR2(15) := 'Params_Reporte';
BEGIN
   IF :DICTAMINACIONES.NO_OF_DICTA IS NULL AND :DICTAMINACIONES.TIPO_DICTAMINACION IS NULL AND :DICTAMINACIONES.CLAVE_OFICIO_ARMADA IS NULL THEN
      LIP_MENSAJE('Se debe ingresar un Dictamen.','A');
      RAISE FORM_TRIGGER_FAILURE;
   END IF;
   BEGIN
      SELECT NO_OF_DICTA
        INTO vNO_OF_DICTA
        FROM DICTAMINACIONES
       WHERE NO_OF_DICTA = :DICTAMINACIONES.NO_OF_DICTA
         AND TIPO_DICTAMINACION = :DICTAMINACIONES.TIPO_DICTAMINACION;
   EXCEPTION
      WHEN NO_DATA_FOUND THEN
         LIP_MENSAJE('No se encontró el Dictamen.','S');
         GO_ITEM('DICTAMINACIONES.NO_OF_DICTA');
         RAISE FORM_TRIGGER_FAILURE;
      WHEN OTHERS THEN
         LIP_MENSAJE('No se encontró el Dictamen.','S');
         GO_ITEM('DICTAMINACIONES.NO_OF_DICTA');
         RAISE FORM_TRIGGER_FAILURE;
   END;
   BEGIN
      SELECT DISTINCT SUBSTR(B.IDENTIFICADOR,1,1)
        INTO vIDENTI
        FROM BIENES B,DICTAMINACION_X_BIEN1 D
       WHERE B.NO_BIEN IN (D.NO_BIEN)
         AND D.TIPO_DICTAMINACION = :DICTAMINACIONES.TIPO_DICTAMINACION
         AND D.NO_OF_DICTA = :DICTAMINACIONES.NO_OF_DICTA;
   EXCEPTION
      WHEN NO_DATA_FOUND THEN
         LIP_MENSAJE('No se encontró identificador en el Dictamen.','S');
         GO_ITEM('DICTAMINACIONES.NO_OF_DICTA');
         RAISE FORM_TRIGGER_FAILURE;
      WHEN TOO_MANY_ROWS THEN
         LIP_MENSAJE('Se tiene varios identificadores en el Dictamen.','S');
         GO_ITEM('DICTAMINACIONES.NO_OF_DICTA');
         RAISE FORM_TRIGGER_FAILURE;
      WHEN OTHERS THEN
         LIP_MENSAJE('Otro error al localizar identificador del Dictamen.','S');
         GO_ITEM('DICTAMINACIONES.NO_OF_DICTA');
         RAISE FORM_TRIGGER_FAILURE;
   END;
   BEGIN
      SELECT TIPO_VOLANTE
        INTO vTIPO_VOLANTE
        FROM NOTIFICACIONES
       WHERE NO_VOLANTE = :DICTAMINACIONES.NO_VOLANTE;
   EXCEPTION
      WHEN NO_DATA_FOUND THEN
         LIP_MENSAJE('No se encontró la Notificación del Dictamen.','S');
         GO_ITEM('DICTAMINACIONES.NO_OF_DICTA');
         RAISE FORM_TRIGGER_FAILURE;
      WHEN OTHERS THEN
         LIP_MENSAJE('Otro error al localizar Notificación del Dictamen.','S');
         GO_ITEM('DICTAMINACIONES.NO_OF_DICTA');
         RAISE FORM_TRIGGER_FAILURE;
   END;
   pl_id := Get_Parameter_List(pl_name); 
   IF Id_Null(pl_id) THEN 
      pl_id := Create_Parameter_List(pl_name); 
      IF Id_Null(pl_id) THEN 
         LIP_MENSAJE('Error al crear lista de parámetros. '||pl_name,'N'); 
         RAISE Form_Trigger_Failure; 
      END IF; 
   ELSE 
      Destroy_Parameter_List(pl_id); 
      pl_id := Create_Parameter_List(pl_name); 
   END IF; 
   pl_id := Get_Parameter_List('Params_Reporte');
   IF NOT Id_Null(pl_id) THEN 
      Add_Parameter(pl_id, 'PARAMFORM' , TEXT_PARAMETER, 'NO');
      Add_Parameter(pl_id, 'P_OFICIO',TEXT_PARAMETER, TO_CHAR(:DICTAMINACIONES.NO_OF_DICTA));
      Add_Parameter(pl_id, 'TIPO_DIC',TEXT_PARAMETER,:DICTAMINACIONES.TIPO_DICTAMINACION);
      Add_Parameter(pl_id, 'CLAVE_ARMADA',TEXT_PARAMETER,:DICTAMINACIONES.CLAVE_OFICIO_ARMADA);
      Add_Parameter(pl_id, 'TIPO_VOL',TEXT_PARAMETER,vTIPO_VOLANTE);
   END IF;
   IF vIDENTI LIKE '%4%' AND :DICTAMINACIONES.TIPO_DICTAMINACION = 'PROCEDENCIA' THEN
   	--LIP_MENSAJE('1','A');
      Run_Product(REPORTS, '..\reportes\RGENREPDICTAMASDES_EXT', SYNCHRONOUS, RUNTIME, FILESYSTEM, pl_id, NULL);    
   ELSE
   	--LIP_MENSAJE('2','A');
      Run_Product(REPORTS, '..\reportes\RGENREPDICTAMASDES', SYNCHRONOUS, RUNTIME, FILESYSTEM, pl_id, NULL);
   END IF;
EXCEPTION
   WHEN OTHERS THEN
      LIP_MENSAJE('Error inesperado en el proceso.','S');
      SET_APPLICATION_PROPERTY(CURSOR_STYLE,'DEFAULT');
END;
