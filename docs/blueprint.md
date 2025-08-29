# **App Name**: Willow Wind Warbler

## Core Features:

- Latest Edition Display: Displays the latest newsletter edition as a PDF in a container on the 'Latest Edition' page, fetched from Firebase Cloud Storage.
- Historical Editions Archive: Presents an archive of past newsletter editions on the 'Historical Editions' page, sorted chronologically by year and date, with links to the PDF files stored in Firebase Cloud Storage.
- Admin Authentication: Implements basic email/password authentication via Firebase Authentication to secure the 'Administration' page.
- Newsletter Upload: Allows authenticated administrators to upload new newsletter PDF files to Firebase Cloud Storage, naming them according to the upload date (MM-DD-YYYY.pdf).
- Newsletter Deletion: Enables authorized administrators to permanently delete selected newsletter files from Firebase Cloud Storage, after displaying a confirmation warning, through the 'Administration' page.
- Page Navigation: Dynamic navigation bar ensures effortless movement between the 'Latest Edition', 'Historical Editions', and 'Administration' pages.

## Style Guidelines:

- Primary color: Dark blue (#0D248C) to evoke a sense of stability and trust, fitting for a regal theme. Chosen for its versatility in creating a professional yet approachable feel.
- Background color: Light green (#bccd9c). A light color scheme aligns with a fun and modern feel, and provides visual clarity, keeping the focus on content rather than background.
- Accent color: Dark olive (#6F6521). It will act as a highlight and create contrast in call to action components.
- Font pairing: 'Playfair' (serif) for headings and titles, lending an elegant and classic feel; 'PT Sans' (sans-serif) for body text, providing excellent readability.
- Incorporate custom icons that suggest the blend of nature and technology represented in a modern design; streamline file representation in historical list and admin interfaces using minimalist document icons, enhancing visual simplicity
- Employ a clean, grid-based layout to present newsletter editions; ensure that controls such as the authentication form, buttons, checkboxes in the administration section are well spaced and visually distinct, which greatly helps to reduce cognitive load.