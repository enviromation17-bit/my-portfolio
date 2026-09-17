/**
 * RENOLT CONTACT FORM — Google Apps Script backend
 * ---------------------------------------------------
 * Does two things when the website form is submitted:
 *   1. Appends the lead as a new row in this Google Sheet
 *   2. Sends you an instant email alert
 *
 * SETUP (about 2 minutes):
 * 1. Go to https://sheets.google.com and create a new blank sheet.
 *    Name it "Renolt Leads". In row 1, add these headers exactly:
 *    Name | Business | Phone | Need | Message | Source | Received At
 *
 * 2. In that sheet: Extensions -> Apps Script.
 *    Delete anything in the editor and paste this whole file in.
 *
 * 3. Change ALERT_EMAIL below to the email you want alerts sent to.
 *
 * 4. Click Deploy -> New deployment -> select type "Web app".
 *    - Execute as: Me
 *    - Who has access: Anyone
 *    Click Deploy, authorize it (it's your own script, safe to allow),
 *    and copy the "Web app URL" it gives you — it ends in /exec.
 *
 * 5. Paste that URL into contact.html as CONTACT_ENDPOINT (see the
 *    matching comment in that file), replacing the n8n webhook line.
 *
 * That's it — no server, no n8n, no monthly cost.
 */

const ALERT_EMAIL = "you@example.com"; // <-- change this

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    sheet.appendRow([
      data.name || "",
      data.business || "",
      data.phone || "",
      data.need || "",
      data.message || "",
      data.source || "renolt-website",
      new Date()
    ]);

    const subject = "New Renolt website lead: " + (data.name || "Unknown");
    const body =
      "New lead from the Renolt contact form:\n\n" +
      "Name: " + (data.name || "-") + "\n" +
      "Business: " + (data.business || "-") + "\n" +
      "Phone: " + (data.phone || "-") + "\n" +
      "Need: " + (data.need || "-") + "\n\n" +
      "Message:\n" + (data.message || "-");

    MailApp.sendEmail(ALERT_EMAIL, subject, body);

    return ContentService
      .createTextOutput(JSON.stringify({ status: "received" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
