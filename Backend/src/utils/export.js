import { Parser as Json2CsvParser } from 'json2csv';
import ExcelJS from 'exceljs';


export function toCSV(rows) {
const fields = Object.keys(rows[0] || {id: ''});
const parser = new Json2CsvParser({ fields });
return parser.parse(rows);
}


export async function toXLSX(rows) {
const workbook = new ExcelJS.Workbook();
const sheet = workbook.addWorksheet('Transactions');
if (!rows.length) {
sheet.addRow(['No data']);
} else {
sheet.columns = Object.keys(rows[0]).map(key => ({ header: key, key }));
rows.forEach(r => sheet.addRow(r));
// Simple formatting
sheet.getRow(1).font = { bold: true };
sheet.columns.forEach(col => { col.width = Math.min(30, Math.max(12, (col.header + '').length)); });
}
const buf = await workbook.xlsx.writeBuffer();
return buf;
}