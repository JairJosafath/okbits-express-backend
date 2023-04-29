
import { sequelize } from '../config/db';
import { FileModel } from '../models/file';
import { FileI } from '../utils/types';

export async function addFile(data:FileI){
    const File = await FileModel.create(data);
}