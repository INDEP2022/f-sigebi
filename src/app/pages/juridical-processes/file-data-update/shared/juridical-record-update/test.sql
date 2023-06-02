DECLARE
	vc_usu_resar  NUMBER;
	DIC           VARCHAR2(80);
	SUMA          NUMBER;
	EXISTE        NUMBER;

BEGIN
 --  :GLOBAL.VARDIC  := NULL;
   :GLOBAL.VALINSERT := 'N';
   BEGIN
	    SELECT DICT_OFI
	      INTO :VARIABLES.DICT_OFI
	      FROM CAT_DICTAMEN
	     WHERE  DICTAMEN = :DICTAMEN;
   EXCEPTION WHEN OTHERS THEN 
      NULL;
   END;
  
    /*  IF :GLOBAL.VARDIC := DIC  IS NULL THEN 
   	   SUMA := 1;
   ELSE  SUMA := 0;
   	END IF;*/
   
   /**********/ --DBM 25062013 GENERAR DICTAMEN CUANDO ES ACLARACION O SOLICITUD
   
   IF :BLK_NOT.DICTAMEN IN (9,10,14) THEN 
  	 --IF SUMA = 1 THEN 
   	 BEGIN
        SELECT CVE_DICTAMEN
          INTO :GLOBAL.VARDIC 
          FROM NOTIFICACIONES
         WHERE NO_VOLANTE = :BLK_NOT.NO_VOLANTE;
     EXCEPTION WHEN OTHERS THEN 
           :GLOBAL.VARDIC := NULL;
            --LIP_MENSAJE('MENSAJE'||SQLERRM,'A');
     END;
     

        SELECT COUNT(0)
					INTO EXISTE
					FROM SAT_TRANSFERENCIA
				 WHERE SAT_DETERMINANTE||'-'||SAT_NUMOFICTRANSF = :BLK_NOT.CVE_OFICIO_EXTERNO;
  	
		  IF EXISTE=0 THEN 
				 	SELECT COUNT(0)
					INTO EXISTE
					FROM PGR_TRANSFERENCIA
				    WHERE PGR_OFICIO  = :BLK_NOT.CVE_OFICIO_EXTERNO;
			END IF;/*jiam  se incorpora la posibilidad de generar un dictamen cuando exixte una  aclaracion para la transferente PGR*/--06/2016	 
			
     IF EXISTE > 0 THEN 
     	IF LIF_MENSAJE_SI_NO('El Volante: '||:BLK_NOT.NO_VOLANTE||' , ya cuenta con una aclaración. Desea generar dictámen de recepción?') = 'S' THEN 		
     		  :DICTAMEN := NULL;
        	:CVE_DICTAMEN := NULL;
           LIP_COMMIT_SILENCIOSO;	
     	   IF :CVE_DICTAMEN IS NULL THEN 
	          LIP_MENSAJE('Es necesario especificar el tipo de Desahogo Asunto','S'); 
            go_item ('cve_dictamen');
               RAISE Form_Trigger_Failure;
     		 END IF;
     		 LIP_COMMIT_SILENCIOSO;
	       :VARIABLES.CONSULTA := 'S';
	       PUP_LANZA_DICTAMEN; 

     	END IF;
     END IF;
ELSE
	 /**********/

   IF :CVE_DICTAMEN IS NULL THEN 
	   -- :DICTAMEN := NULL;
	    LIP_MENSAJE('Es necesario especificar el tipo de Desahogo Asunto','S'); 
      go_item ('cve_dictamen');
      RAISE Form_Trigger_Failure;
   END IF;
   IF :CVE_ASUNTO IS NULL THEN 
      LIP_MENSAJE('Es necesario especificar el tipo de desahogo','S'); 
      go_item ('cve_dictamen');
      RAISE Form_Trigger_Failure; 
   END IF;
   IF :CVE_DICTAMEN IS NOT NULL THEN 
      SET_ITEM_PROPERTY ('CVE_DICTAMEN',ENABLED,PROPERTY_FALSE);
   END IF;
   vc_usu_resar := 0;
   SELECT count(0)
     INTO vc_usu_resar
     FROM R_TDICTA_AARUSR
    WHERE USUARIO = :BLK_TOOLBAR.TOOLBAR_USUARIO
      AND NO_TIPO = 'RESARCIMIENTO' 
      AND ESCRITURA = 'S' AND LECTURA = 'S';
      
   IF :CVE_ASUNTO IS NOT NULL AND :VARIABLES.DICT_OFI = 'D' THEN
      IF :DICTAMEN = '18' AND vc_usu_resar < 1 THEN
         LIP_MENSAJE('No tienes privilegios para entrar a los Dictamenes de Resarcimiento ','S');
         RAISE FORM_TRIGGER_FAILURE;
      END IF; 
	    IF :NO_DEL_DESTINO = :TOOLBAR_NO_DELEGACION THEN
		     LIP_COMMIT_SILENCIOSO;
		     :VARIABLES.CONSULTA := 'N';
		     PUP_LANZA_DICTAMEN;
	    ELSE
	       LIP_COMMIT_SILENCIOSO;
	       :VARIABLES.CONSULTA := 'S';
	       PUP_LANZA_DICTAMEN;
	    END IF;
   END IF;
END IF;
END;

/*

IF :CVE_ASUNTO IS NOT NULL AND :DICTAMEN = 1 THEN 
   IF :NO_DEL_DESTINO = :TOOLBAR_NO_DELEGACION THEN
	    LIP_COMMIT_SILENCIOSO;
	    :VARIABLES.CONSULTA := 'N';
	    PUP_LANZA_DICTAMEN;
   ELSE
	    LIP_COMMIT_SILENCIOSO;
	    :VARIABLES.CONSULTA := 'S';
	    PUP_LANZA_DICTAMEN;
   END IF;	  	  
END IF;
IF :CVE_ASUNTO IS NOT NULL AND :DICTAMEN IN (3,16,15,17,18,19,25,20) THEN
   IF :DICTAMEN = '18' AND USER NOT IN ('ERMARTINEZ','MPICHARDO','MALCOCER','AABREGO','DPALOMEC','CGRANDE','CEZETA','ALEDESMA','SERA','MAC34','BSANCHEZ','MAEC18') THEN
      LIP_MENSAJE('No tienes privilegios para entrar a los Dictamenes de Resarcimiento ','S');
      RAISE FORM_TRIGGER_FAILURE;
   END IF; 
   IF :NO_DEL_DESTINO = :TOOLBAR_NO_DELEGACION THEN
	 	  LIP_COMMIT_SILENCIOSO;
	 	  :VARIABLES.CONSULTA := 'N';
	    PUP_LANZA_DICTAMEN;
   ELSE
	 		LIP_COMMIT_SILENCIOSO;
      :VARIABLES.CONSULTA := 'S';
	    PUP_LANZA_DICTAMEN;
	 END IF;
END IF;*/




