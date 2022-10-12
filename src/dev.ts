import express, { Request, Response } from "express";
import initialise from "./main";

const pdfactoryHandler = await initialise()

const app = express();

app.use(express.json());

const requestHandler = async (req: Request, res: Response): Promise<void> => {
    const pdf = await pdfactoryHandler(req.body)

    res.set({
        "Content-Type": "application/pdf",
        "Content-Length": pdf.length,
    });

    res.send(pdf);
}

app.post('/', requestHandler)

app.listen(3000);

const pdfactory = app

export { pdfactory }