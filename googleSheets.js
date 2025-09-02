import { google } from "googleapis";
import dotenv from "dotenv";
import path from "path";
dotenv.config();

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(process.cwd(), "platoonpro-forms-cdfd81511983.json"), // put your JSON key here
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const spreadsheetId = "1Ylw4yUnN-iivlvqWaETFUGp_tDzpzht_ZAqZ06qw5XI";

export async function appendToSheet(row) {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: "v4", auth: client });

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: "Sheet1!A:D", // columns
    valueInputOption: "RAW",
    resource: { values: [row] },
  });
}
