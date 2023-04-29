
import { sequelize } from '../config/db';
import  FileModel from '../models/file';
import { FileI } from '../utils/types';

export async function addFile(data:FileI){
    try{
        const File = await FileModel.create(data);
    console.log(File.toJSON(),"add");
    return File?.id;
    }catch(e){
        console.log("couldnt add file",e);
    }
    return null;
}
export async function getFileByID(id:number){
    try{
         const File = await FileModel.findByPk(id);
    if(!File){
        console.log("record not found with id "+id)
    }
    console.log(File?.toJSON(),"update");
    return File;
    }catch(e){
        console.log("could not retrieve record",e)
    }
   return null
}

export async function deleteFileByID(id:number){
    try{
        const File = await getFileByID(id);
    await File?.destroy();
    console.log("deleted");
    return true;
    }catch(e){
        console.log("could not delete record",e);
return false;
    }
    
}
export async function updateFileByID(id:number,data:FileI){
    try{
        const File = await getFileByID(id);
        File?.set(
            {...data}
        ) ;
    await File?.save();
    console.log("updated");
    return true;
    }catch(e){
        console.log("could not update record",e);
        return false;
    }
    
}

