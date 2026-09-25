import { Document, Types } from 'mongoose';

export default interface IDocument extends Document {
  userId: Types.ObjectId;
  name: string;
  type: 'Resume' | 'Cover Letter' | 'Portfolio' | 'Other';
  fileType: 'PDF' | 'DOCX' | 'Other';
  linkedJobId?: Types.ObjectId;
  size: string;
  url: string;         // Cloudinary secure URL (legacy records may use a local URL)
  publicId?: string;
  createdAt: Date;
  updatedAt: Date;
}
