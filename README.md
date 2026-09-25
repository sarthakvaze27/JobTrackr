# JobTrackr

JobTrackr is a full-stack job application tracker. It includes a React dashboard for applications, interviews, documents, and account settings, plus an Express and MongoDB API.

## Requirements

- Node.js 20 or later
- MongoDB running locally, or a MongoDB connection string
- A Cloudinary account for document uploads

## Backend

```powershell
cd Backend
npm install
Copy-Item .env.example .env
```

Set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, and a unique random `JWT_SECRET` in `Backend/.env`. Set `MONGO_URI` if MongoDB is not at the default local address.

Start the API:

```powershell
node index.js
```

The API listens at `http://localhost:8080`.

## Frontend

In a second terminal:

```powershell
cd Frontend/trackr
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

## Documents

PDF, DOC, and DOCX uploads up to 10 MB are sent to Cloudinary through signed backend requests. The Cloudinary API secret is used only by the backend. Upload metadata and the Cloudinary public ID are stored in MongoDB.
