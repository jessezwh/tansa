import { google } from 'googleapis'

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets']

function getAuth() {
  return new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: SCOPES,
  })
}

type RegistrationRow = {
  createdAt: string
  email: string
  firstName: string
  lastName: string
  upi: string
  phoneNumber: string
  universityId: string
  areaOfStudy: string
  yearLevel: string
  gender: string
  ethnicity: string
  signedUpBy: string
}

export async function appendRegistrationRow(row: RegistrationRow): Promise<void> {
  const sheetId = process.env.GOOGLE_SHEET_ID
  if (!sheetId) {
    console.error('[google-sheets] GOOGLE_SHEET_ID env var is not set')
    return
  }

  const auth = getAuth()
  const sheets = google.sheets({ version: 'v4', auth })

  const values = [
    [
      row.createdAt,
      row.email,
      row.firstName,
      row.lastName,
      row.upi,
      row.phoneNumber,
      row.universityId,
      row.areaOfStudy,
      row.yearLevel,
      row.gender,
      row.ethnicity,
      row.signedUpBy,
    ],
  ]

  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: 'details',
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
    requestBody: { values },
  })
}
