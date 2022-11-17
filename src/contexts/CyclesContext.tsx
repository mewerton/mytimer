import { differenceInSeconds } from "date-fns";
import { createContext, ReactNode, useState, useReducer, useEffect } from "react";
import { ActionTypes, Cycle, cycleReducer } from '../reducers/cycles'

interface CreateCycleData{
    task: string
    minutesAmount: number
}



interface CyclesContextType{
    cycles: Cycle[]
    activeCycle: Cycle | undefined
    activeCycleId: string | null
    markCurrentCycleAsFinished: () => void
    amountSecondsPassed: number
    setSecondsPassed: (seconds: number) => void
    createNewCycle:(data: CreateCycleData) => void
    interruptCurrentCycle:() => void

 }

export const CyclesContext = createContext({} as CyclesContextType)

interface CyclesContextProviderProps{
    children: ReactNode
}


export function CyclesContextProvider({ children }: CyclesContextProviderProps) {

    const [cyclesState, dispatch] = useReducer( cycleReducer, {
        cycles:[],
        activeCycleId: null
    }, () => {
        const storedStateAsJSON = localStorage.getItem('@mytimer:cycles-state-1.0.0')

        if (storedStateAsJSON){
            return JSON.parse(storedStateAsJSON)
        }
        }
    )

    const { cycles, activeCycleId } = cyclesState
    const activeCycle = cycles.find((cycle) => cycle.id == activeCycleId)

    const [amountSecondsPassed, setAmountSecondsPassed] = useState(()=>{
      if(activeCycle){
        return differenceInSeconds(new Date(), new Date(activeCycle.startDate)
        )
      }

        return 0
    })

    useEffect(() => {
        const stateJSON = JSON.stringify(cyclesState)

        localStorage.setItem('@mytimer:cycles-state-1.0.0', stateJSON)
    },[cyclesState])

    

    

    function setSecondsPassed(seconds: number){
        setAmountSecondsPassed(seconds)
    }

    function markCurrentCycleAsFinished(){

        dispatch({
            type: ActionTypes.MARK_CURRENT_CYCLE_AS_FINISHED,
            payload: {
                activeCycleId
            }
        })

        // setCycles((state) =>
        //              state.map((cycle) => {
        //                 if(cycle.id == activeCycleId) {
        //                     return { ...cycle, finishedDate: new Date()}
        //                 } else{
        //                     return cycle
        //                 }
        //                 })
        //             )
    }

    function createNewCycle(data: CreateCycleData){
        const id = String(new Date().getTime())

        const newCycle: Cycle = {
            id,
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date(),
        }

        dispatch({
            type: ActionTypes.ADD_NEW_CYCLE,
            payload: {
                newCycle
            }
        })

        // setCycles((state) => [...cycles, newCycle])
        // setActiveCycleId(id)
        setAmountSecondsPassed(0)
   
    }

    function interruptCurrentCycle(){

        dispatch({
            type: ActionTypes.INTERRUPT_CURRENT_CYCLE,
            payload: {
                activeCycleId
            }
        })
    }



    return (
        <CyclesContext.Provider value={{ 
            cycles,
            activeCycle, 
            activeCycleId, 
            markCurrentCycleAsFinished, 
            amountSecondsPassed, 
            setSecondsPassed,
            createNewCycle,
            interruptCurrentCycle 
            }}
            >
            {children} 
        </CyclesContext.Provider>
    )
}