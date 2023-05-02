import csvParser from "csv-parser";
import fs from "fs";
import csv from "csvtojson";
import pdfMake from "pdfmake";
import { TDocumentDefinitions } from "pdfmake/interfaces";
import { promises as fsPromises } from "fs";
import path from "path";

async function UNL2CSV(inputFile: string) {
  const writeStream = fs.createWriteStream(inputFile + "-csv");

  const data = await fsPromises.readFile(inputFile, "utf8");

  const csvData = data.replace(/\|/g, ",");

  // Write the CSV data to output file
  const res = await fsPromises.writeFile(inputFile + "-csv", csvData);
  return inputFile + "-csv";
}

function CSV2PDF(inputFile: string) {
  csv()
    .fromFile(inputFile)
    .then((jsonObj: Record<string, any>[]) => {
      // Create the PDF document
      const pdfDocDefinition: TDocumentDefinitions = {
        defaultStyle: {
          font: "Helvetica",
        },
        content: [
          {
            layout: "lightHorizontalLines",
            table: {
              headerRows: 1,
              // widths: Array(jsonObj[0].length).fill("*"),
              body: [
                Object.keys(jsonObj[0]),
                ...jsonObj.map((obj) => Object.values(obj)),
              ],
            },
          },
        ],
      };
      const pdfMaker = new pdfMake({
        Helvetica: {
          normal: path.join(__dirname, "../font/Helvetica.ttf"),
          bold: path.join("font/Helvetica-Bold"),
          italics: path.join("font/Helvetica-Oblique"),
          bolditalics: path.join("font/Helvetica-BoldOblique"),
        },
      });
      const pdfDoc = pdfMaker.createPdfKitDocument(pdfDocDefinition);

      // Write the PDF file

      const pdfFilePath = inputFile.replace("csv", "pdf");
      pdfDoc.pipe(fs.createWriteStream(pdfFilePath));
      console.log(`PDF file created at ${pdfFilePath}`);
      pdfDoc.end();
    });
}

function CSV2JSON(inputFile: string) {
  const jsonFilePath = inputFile.replace("-csv", "-json");
  try {
    csv()
      .fromFile(inputFile)
      .then((json) => {
        fs.writeFile(jsonFilePath, JSON.stringify(json), (err) => {
          if (err) {
            console.error(err);
            return;
          }
          console.log(`JSON data saved to ${jsonFilePath}`);
        });
      });
  } catch (err) {
    console.error(err);
  }
}

export default async function convertUNL(filename: string) {
  const csvFile = await UNL2CSV(filename);
  CSV2PDF(csvFile);
  CSV2JSON(csvFile);
}
