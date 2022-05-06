import multer from 'multer';
import MulterGridfsStorage from 'multer-gridfs-storage';

const username = "akila_l";
const password = "ZUUQsnjqABxzkWFv";
const cluster = "caffconfclstr0.gbbqp";
const dbname = "myFirstDatabase";
const storage = new MulterGridfsStorage({
    url: `mongodb+srv://${username}:${password}@${cluster}.mongodb.net/${dbname}`,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
        const match = ["image/png","image/jpeg"];
        if(match.indexOf(file.mimetype) === -1){
            const filename = `${Date.now()}-any-name-${file.originalname}`;
            return filename
        }
        return {
            bucketName : "photos",
            filename: `${Date.now()}-any-name-${file.originalname}`,
        }
    }
})

export default multer({ storage });