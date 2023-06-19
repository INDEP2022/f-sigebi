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
END;
