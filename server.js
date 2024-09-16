import express from "express"
import path from "path"
import { fileURLToPath } from 'url';


import multer from "multer"
import PDFMerger from "pdf-merger-js"
import cors from "cors"
import bodyParser from "body-parser"

const app = express();


const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directo
var merger = new PDFMerger();

const corsOptions = {
    origin: '*',
    credentials: true,            
    optionSuccessStatus: 200,
}

app.use(cors(corsOptions))

app.use(bodyParser.urlencoded({ extended: false }))
// app.use(bodyParser.json())

app.use(express.static(path.join('./public')))
// app.use('/static', express.static('./public'))

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

const upload = multer({ storage: storage })

app.get("/", (req, res) => {
    res.sendFile("index.html")
})

app.post('/mergeing', upload.array('pdfs', 2), async (req, res, next) => {    
    const [pdf1, pdf2] = req.files;
    await merger.add(pdf1.path);
    await merger.add(pdf2.path);
    const date = Date.now();
    await merger.save(`./public/mergeds/merged-${date}-file.pdf`);
    // res.redirect(`http://localhost:3000/static/mergeds/merged-${date}-file.pdf`);
    // res.download(`./public/mergeds/merged-${date}-file.pdf`)
    // res.json({ data: "Successfully" })
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline'); 
    res.sendFile(path.join(__dirname,`./public/mergeds/merged-${date}-file.pdf`))

})



app.listen(3000, () => {
    console.log("Server satrted successfully on port:3000, http://localhost:3000");
})