# JobTrackr backend setup

## Cloudinary document uploads

Uploads are sent from the backend to Cloudinary using a signed API request. The Cloudinary API secret stays on the backend and is never sent to the browser.

1. In the Cloudinary console, copy your **Cloud name**, **API Key**, and **API Secret**.
2. Copy `.env.example` to `.env` in this folder.
3. Fill in `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` in `.env`.
4. Start the backend from this folder so dotenv loads the local `.env` file.

The backend accepts PDF, DOC, and DOCX files up to 10 MB. New uploads are stored in Cloudinary as raw files. Existing documents that were stored in the local `uploads/` folder remain downloadable and are removed locally when deleted.

If the Cloudinary values are missing, document upload returns a configuration error and does not save a partial document record.
