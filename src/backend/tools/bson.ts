import{ Types } from "mongoose"

let objId:string;

export function setObjectId(id:string):void {
    objId = id;
}

//? Is the string passed a valid object id in length
//? Is the obj id the same one being retrieved when the table was being created
export function isValid(id:string):boolean {

    if(!Types.ObjectId.isValid(id))
        return false
    const providedId:Types.ObjectId = new Types.ObjectId(id);
    console.log(providedId);
    console.log(objId);
    return true;
} 