import type { Dispatch,SetStateAction } from "react";
import type { BordElement } from "../App";

export function clearall(setItems:Dispatch<SetStateAction<BordElement[]>>){
    return()=>setItems([]);
}
export function unselect(selectedId:Dispatch<SetStateAction<number |  null>>){
    return ()=>selectedId(null);
}
export function deletedselected(Items:Dispatch<SetStateAction<BordElement[]>>,selectedId: number | null ){
    if(selectedId==null) return;
    Items(prev=>prev.filter(item=>item.id!=selectedId))
}
    