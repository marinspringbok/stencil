import fs from 'fs';
export const patchFs = (userSys) => {
    const fsObj = fs;
    Object.assign(fsObj.__sys, userSys);
};
