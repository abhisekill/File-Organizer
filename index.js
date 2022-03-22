const extenions = require('./extensions');
const fs = require('fs');
const path = require('path');

const inputPath = process.argv[2];
const organizedDirPath = path.join(inputPath,"Organized_folder");

// check source dir is correct or not
if(fs.existsSync(inputPath)){
    // path given by the user is correct
    organizeDirectory(inputPath);  
}
else{
    console.log("Please give correct Path !!!")
}

function organizeDirectory(srcDirPath){
    const files = fs.readdirSync(srcDirPath);
    for(let idx = 0; idx < files.length; idx++){
        if(fs.lstatSync(path.join(srcDirPath,files[idx])).isFile() ){
            if(!fs.existsSync(organizedDirPath)){
                fs.mkdirSync(organizedDirPath);
            }

            const dirName = getDirName(srcDirPath,files[idx]);
            // console.log(files[idx], "belongs to -->",dirName);
            const dirPath = path.join(organizedDirPath,dirName);
            const fileSrcPath = path.join(srcDirPath,files[idx]);
            const fileDestPath = path.join(dirPath,files[idx]);
            
            if(fs.existsSync(dirPath)){
                // directory like audio,video,image already exists
                moveFile(fileSrcPath,fileDestPath);
                fs.unlinkSync(fileSrcPath);
            }
            else{
                // directory doesnot exists, create it
                fs.mkdirSync(dirPath);
                moveFile(fileSrcPath,fileDestPath);
                fs.unlinkSync(fileSrcPath);
            }
        }
        else{
            // files[idx] is a directory
           // if(!fs.existsSync(organizedDirPath))
                const subDirPath = path.join(srcDirPath,files[idx]);
                const baseName = path.basename(subDirPath);
                if(baseName !== 'Organized_folder')
                    organizeDirectory(subDirPath);
           // }
        }
    }
}

function getDirName(srcDirPath,file){
    const filePath = path.join(srcDirPath,file);
    // console.log(filePath);
    let extName = path.extname(filePath);
    extName = extName.slice(1);
    // console.log(extName);
    for(let dirType in extenions){
        const extArr = extenions[dirType];
        for(let idx = 0; idx < extArr.length ; idx++){
            if(extArr[idx] === extName){
                return dirType;
            }
        }
    }
    return "Others";
}

function moveFile(src,dest){
    fs.copyFileSync(src,dest);
}

