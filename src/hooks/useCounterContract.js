import { useEffect, useState } from "react"
import Counter from "../contracts/counter"
import { useTonClient } from "./useTonClient"
import { useAsyncInitialize } from "./useAsyncInitialize"
import { useTonConnect } from "./useTonConnect"
import { Address } from "ton-core"

export function useCounterContract() {
    const client = useTonClient()
    const [val, setVal] = useState()
    const { sender } = useTonConnect()

    const sleep = time => new Promise(resolve => setTimeout(resolve, time))

    const counterContract = useAsyncInitialize(async () => {
        if (!client) return
        const contract = new Counter( // replace with your address from tutorial 2 step 8
            Address.parse("EQBYLTm4nsvoqJRvs_L-IGNKwWs5RKe19HBK_lFadf19FUfb")
        )
        return client.open(contract)
    }, [client])

    useEffect(() => {
        async function getValue() {
            if (!counterContract) return
            setVal(null)
            const val = await counterContract.getCounter()
            setVal(val.toString())
            await sleep(5000) // sleep 5 seconds and poll value again
            getValue()
        }
        getValue()
    }, [counterContract])

    return {
        value: val,
        address: counterContract?.address.toString(),
        sendIncrement: () => {
            return counterContract?.sendIncrement(sender)
        }
    }
}
