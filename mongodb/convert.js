const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const csv = require('csvtojson');

const baseDir = path.join(__dirname, 'interview-prep'); // resolves from project root

const filePaths = [
  '1. Machine Learning Interview Questions',
  '2. Deep Learning Interview Questions',
  'deeplearning_questions.csv',
  'Data_Science_Resume_Checklist_Data_Interview_Pro.pdf',
  '5. Behavioral_HR Interview Questions.pdf'
].map(filename => path.join(baseDir, filename));

// Utility function to wrap content into HTML
const wrapHtml = (title, bodyContent) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    body { font-family: Arial, sans-serif; white-space: pre-wrap; padding: 2em; }
    table { width: 100%; border-collapse: collapse; margin-top: 1em; }
    td, th { border: 1px solid #999; padding: 0.5em; }
  </style>
</head>
<body>
  ${bodyContent}
</body>
</html>
`;

// Convert .txt files
const convertTxt = (filePath) => {
  const title = path.basename(filePath);
  const outputPath = filePath + '.html';

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return console.error(`❌ TXT Error (${title}):`, err);

    const html = wrapHtml(title, data);
    fs.writeFile(outputPath, html, err => {
      if (err) return console.error(`❌ Write Error (TXT):`, err);
      console.log(`✅ Converted TXT: ${outputPath}`);
    });
  });
};

// Convert .pdf files
const convertPDF = async (filePath) => {
  const title = path.basename(filePath);
  const outputPath = filePath + '.html';

  const buffer = fs.readFileSync(filePath);
  try {
    const data = await pdfParse(buffer);
    const html = wrapHtml(title, data.text);
    fs.writeFileSync(outputPath, html);
    console.log(`✅ Converted PDF: ${outputPath}`);
  } catch (err) {
    console.error(`❌ PDF Error (${title}):`, err);
  }
};

// Convert .csv files
const convertCSV = async (filePath) => {
  const title = path.basename(filePath);
  const outputPath = filePath + '.html';

  try {
    const jsonArray = await csv().fromFile(filePath);
    let table = '<table><thead><tr>';

    const keys = Object.keys(jsonArray[0]);
    table += keys.map(k => `<th>${k}</th>`).join('') + '</tr></thead><tbody>';

    jsonArray.forEach(row => {
      table += '<tr>' + keys.map(k => `<td>${row[k]}</td>`).join('') + '</tr>';
    });

    table += '</tbody></table>';

    const html = wrapHtml(title, table);
    fs.writeFileSync(outputPath, html);
    console.log(`✅ Converted CSV: ${outputPath}`);
  } catch (err) {
    console.error(`❌ CSV Error (${title}):`, err);
  }
};

// 🔁 Loop through each file and convert based on type
filePaths.forEach(file => {
  const ext = path.extname(file).toLowerCase();
  if (ext === '.pdf') {
    convertPDF(file);
  } else if (ext === '.csv') {
    convertCSV(file);
  } else {
    convertTxt(file); // For .txt or no extension
  }
});
