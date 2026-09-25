import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema(
  {
    userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name:        { type: String, required: true },
    type:        { type: String, enum: ['Resume', 'Cover Letter', 'Portfolio', 'Other'], required: true },
    fileType:    { type: String, enum: ['PDF', 'DOCX', 'Other'], required: true },
    linkedJobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', default: null },
    size:        { type: String, required: true },
    url:         { type: String, required: true },
    publicId:    { type: String, default: null },
  },
  { timestamps: true }
);

const DocumentModel = mongoose.model('Document', documentSchema);
export default DocumentModel;
