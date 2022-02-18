import { useEffect } from "react"

export const ConsoleWarning = () => {
  useEffect(() => {
    console.log(`%c
                                                    
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
                                                    
    `, 'color: green')
    console.log(`%c잠깐! 왕해킹사건~`, `font-size:64px;color:red;font-weight:bold;`)
    console.log(`%c이 창에 절대 아무 것도 입력하지 마시고\n누군가 시키는 일 (어느 탭을 보여달라) 등을 하지마세요. 간절히 요청하더라도요!`, `font-size:16px;color:orange;font-weight:bold;`)
  }, [])

  return <></>
}

export default ConsoleWarning