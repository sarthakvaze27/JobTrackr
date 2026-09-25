import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/jobtrackr";

const jobSchema = new mongoose.Schema(
  {
    userId:   { type: mongoose.Schema.Types.ObjectId, required: true },
    company:  { type: String, required: true },
    role:     { type: String, required: true },
    status:   {
      type: String,
      enum: ["Wishlist", "Applied", "Interviewing", "Offer", "Rejected"],
      default: "Wishlist",
    },
    salary:   { type: String, default: "" },
    location: {
      type: String,
      enum: ["Remote", "Hybrid", "Onsite"],
      default: "Remote",
    },
    notes:    { type: String, default: "" },
  },
  { timestamps: true }
);

const Job = mongoose.models.Job ?? mongoose.model("Job", jobSchema);

const PLACEHOLDER_USER_ID = new mongoose.Types.ObjectId("6a1c6cd966c284880d4862ea");

const seedJobs = [
  { userId: PLACEHOLDER_USER_ID, company: "Netflix",     role: "Senior Frontend Engineer",  status: "Wishlist",     salary: "$145k–$185k", location: "Remote", notes: "Bookmarked from LinkedIn" },
  { userId: PLACEHOLDER_USER_ID, company: "Linear",      role: "Full-stack Developer",       status: "Wishlist",     salary: "$120k–$160k", location: "Hybrid", notes: "" },
  { userId: PLACEHOLDER_USER_ID, company: "Vercel",      role: "Software Engineer, DX",      status: "Applied",      salary: "$130k–$170k", location: "Remote", notes: "Applied via website" },
  { userId: PLACEHOLDER_USER_ID, company: "Stripe",      role: "Frontend Engineer",          status: "Applied",      salary: "$160k–$210k", location: "Onsite", notes: "Referred by Priya" },
  { userId: PLACEHOLDER_USER_ID, company: "GitHub",      role: "Product Engineer",           status: "Applied",      salary: "$150k–$195k", location: "Remote", notes: "" },
  { userId: PLACEHOLDER_USER_ID, company: "Notion",      role: "Senior React Engineer",      status: "Interviewing", salary: "$135k–$165k", location: "Hybrid", notes: "Round 3 – final tomorrow" },
  { userId: PLACEHOLDER_USER_ID, company: "Figma",       role: "Full-stack Engineer",        status: "Interviewing", salary: "$155k–$200k", location: "Hybrid", notes: "Round 1" },
  { userId: PLACEHOLDER_USER_ID, company: "PlanetScale", role: "Software Engineer",          status: "Offer",        salary: "$165k base",  location: "Remote", notes: "$165k + equity · Due Jun 1" },
  { userId: PLACEHOLDER_USER_ID, company: "Railway",     role: "Frontend Lead",              status: "Offer",        salary: "$140k–$160k", location: "Remote", notes: "Negotiating" },
  { userId: PLACEHOLDER_USER_ID, company: "Airbnb",      role: "Software Engineer III",      status: "Rejected",     salary: "$155k–$195k", location: "Onsite", notes: "No feedback" },
  { userId: PLACEHOLDER_USER_ID, company: "Shopify",     role: "Senior Engineer",            status: "Rejected",     salary: "$140k–$180k", location: "Remote", notes: "After round 2" },
];

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log("✅ Connected to MongoDB:", MONGO_URI);

  const deleted = await Job.deleteMany({ userId: PLACEHOLDER_USER_ID });
  console.log(`🗑  Cleared ${deleted.deletedCount} existing jobs for this user`);

  const inserted = await Job.insertMany(seedJobs);
  console.log(`🌱 Seeded ${inserted.length} jobs successfully`);

  await mongoose.disconnect();
  console.log("👋 Done!");
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});