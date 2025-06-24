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
export function reseteverything(
    item:Dispatch<SetStateAction<BordElement[]>>,
    selectedId:Dispatch<SetStateAction<number | null>> ,
    contbg:Dispatch<SetStateAction<string>> ,
    textsize:Dispatch<SetStateAction<number >>,
) {
    item([]);
    selectedId(null);
    contbg("white");
    textsize(15);
}