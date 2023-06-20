<<<<<<< HEAD
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
=======
PROCEDURE PUP_LANZA_DICTAMEN IS
   pl_id        ParamList; 
   pl_name      VARCHAR2(15) := 'Params_Forma';
   TIPO_DIC     VARCHAR2(30);
   v_no_volante NOTIFICACIONES.NO_VOLANTE%type;
   VVAL         NUMBER;
   VVAL1        NUMBER;
BEGIN
	IF :DICTAMEN = 1 OR :DICTAMEN = 16 OR :DICTAMEN = 23 THEN 
		  TIPO_DIC := 'PROCEDENCIA';
	END IF;
	
	IF :DICTAMEN = 15 THEN 
		  TIPO_DIC := 'DESTRUCCION';
	END IF;
	
	IF :DICTAMEN = 2 THEN 
		  TIPO_DIC := 'DECOMISO';
	END IF;
	
	IF :DICTAMEN = 22 THEN 
		  TIPO_DIC := 'EXT_DOM';
	END IF;
	
	IF :DICTAMEN = 3 OR :DICTAMEN = 19 THEN 
		  TIPO_DIC := 'DEVOLUCION';
	END IF;
	
	IF  :DICTAMEN = 17 THEN 
		  TIPO_DIC := 'TRANSFERENTE';
	END IF;

	IF  :DICTAMEN = 18 THEN 
		  TIPO_DIC := 'RESARCIMIENTO';
	END IF;

	IF  :DICTAMEN = 20 THEN 				--JAMM 250707
		  TIPO_DIC := 'ABANDONO';
	END IF;
	
		IF  :DICTAMEN = 24 THEN 				--JAMM 250707
		  TIPO_DIC := 'ACLARA';
	END IF;

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
  
  pl_id := Get_Parameter_List(pl_name);
  
  IF NOT Id_Null(pl_id) THEN 
    Add_Parameter(pl_id, 'EXPEDIENTE',TEXT_PARAMETER,TO_CHAR(:BLK_NOT.NO_EXPEDIENTE));
    Add_Parameter(pl_id, 'TIPO_DIC',TEXT_PARAMETER,TIPO_DIC);
    Add_Parameter(pl_id, 'VOLANTE',TEXT_PARAMETER,TO_CHAR(:BLK_NOT.NO_VOLANTE));
    Add_Parameter(pl_id, 'CONSULTA',TEXT_PARAMETER,:VARIABLES.CONSULTA);
    Add_Parameter(pl_id, 'TIPO_VO',TEXT_PARAMETER,:BLK_NOT.CONDICION);
	 Add_Parameter(pl_id, 'P_GEST_OK',TEXT_PARAMETER, :PARAMETER.P_GEST_OK);
	 Add_Parameter(pl_id, 'P_NO_TRAMITE',TEXT_PARAMETER, :PARAMETER.P_NO_TRAMITE);

  END IF;
   CALL_FORM('FACTJURDICTAMASG',hide,do_replace,no_query_only,pl_id); 	
 	 --**** aqui la validación y eliminación de la clave de dictamen --
   v_no_volante := :BLK_NOT.NO_VOLANTE;
   
  BEGIN

         SELECT COUNT(0)
           INTO VVAL
           FROM DICTAMINACIONES
          WHERE NO_VOLANTE = v_no_volante;
          
         SELECT COUNT(0)
           INTO VVAL1
           FROM M_OFICIO_GESTION
          WHERE NO_VOLANTE = v_no_volante;
            
         IF VVAL = 0 AND  VVAL1=0 THEN
            UPDATE NOTIFICACIONES
               SET CVE_DICTAMEN = NULL
             WHERE NO_VOLANTE = v_no_volante;
            LIP_COMMIT_SILENCIOSO;
         ELSIF VVAL = 0 AND  VVAL1 >0 AND :GLOBAL.VARDIC IS NOT NULL  THEN
         	  UPDATE NOTIFICACIONES
               SET CVE_DICTAMEN =  :GLOBAL.VARDIC
             WHERE NO_VOLANTE = v_no_volante;
            LIP_COMMIT_SILENCIOSO;
            
         END IF;
       
      EXCEPTION
         WHEN OTHERS THEN
            NULL;
      END;
      GO_BLOCK('BLK_NOT');
      CLEAR_BLOCK(NO_VALIDATE);
      SET_BLOCK_PROPERTY('BLK_NOT',DEFAULT_WHERE,'NO_VOLANTE = '||TO_CHAR(v_no_volante));
      EXECUTE_QUERY;
      SET_BLOCK_PROPERTY('BLK_NOT',DEFAULT_WHERE,'');
       -- :GLOBAL.VARDIC  := NULL;
EXCEPTION
   when no_data_found then
   lip_mensaje('No se REALIZO LA CONSULTA','C');  	
>>>>>>> 95f973dcd38fd3e4bc31e859edd97ccb2f26244f
END;
