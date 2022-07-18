import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export const ConsoleWarning = () => {
  const { t } = useTranslation()

  useEffect(() => {
    console.log(
      `%c
                                                    
                          ////////                   
                      ///*      //                   
                ////    ////// //                   
                //  */////////////,                  
              // //////////////////                  
            ///////////////////////                  
          ////////////////////////       GAMRAMSTONE
          ////////////////////////         Website  
          /////////////////////////                 
          /////////////////////////      developed by
          /////////////////////////        Sochiru   
          //////////////////////////                 
          //////////////////////////.                
          ///////////////////////  //                
  /////////////////////////////////////////         
                                                    
    `,
      'color: green'
    )
    console.log(
      `%c${t('console_warn')}`,
      `font-size:64px;color:red;font-weight:bold;`
    )
    console.log(
      `%c${t('console_warn_description')}`,
      `font-size:16px;color:orange;font-weight:bold;`
    )
  }, [t])

  return <></>
}

export default ConsoleWarning
