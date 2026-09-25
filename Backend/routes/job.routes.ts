import {Router,type Response} from 'express';
import { Types } from 'mongoose';
import Job from '../models/job.js';
import { verifyToken ,type AuthRequest } from '../utils/auth.middleware.js';

const router = Router();

router.use(verifyToken);

function getUserId(req:AuthRequest,res:Response) {
    if(!req.userId) {
        res.status(401).json({message:"User not authenticated"});
        return null;
    }

    return new Types.ObjectId(req.userId);
}

function getJobId(req:AuthRequest,res:Response) {
    const jobId = req.params.id;

    if(typeof jobId !== 'string' || !Types.ObjectId.isValid(jobId)) {
        res.status(400).json({message:"Invalid job id"});
        return null;
    }

    return new Types.ObjectId(jobId);
}

router.post('/',async(req:AuthRequest,res:Response) => {
    try{
        const userId = getUserId(req,res);
        if(!userId) return;

        const newJob = new Job({
            ...req.body,
            userId,
        });
        await newJob.save();
        res.status(201).json(newJob);
    }
    catch(error)
    {
    res.status(500).json({message:"Error creating job application"});
    }
});

router.get('/',async(req:AuthRequest,res:Response) => {
    try{
        const userId = getUserId(req,res);
        if(!userId) return;

        const jobs = await Job.find({userId}).sort({createdAt: -1});
        res.status(200).json(jobs);
    }catch(err)
    {
        res.status(500).json({ message: "Error fetching jobs" });
    }
});

router.put('/:id',async(req:AuthRequest,res:Response) => {
    try{
        const userId = getUserId(req,res);
        if(!userId) return;
        const jobId = getJobId(req,res);
        if(!jobId) return;

        const updatedJob = await Job.findOneAndUpdate({_id:jobId,userId},
            req.body,
            {new:true}
        );
        if(!updatedJob) {
            res.status(404).json({message:"Job not found"});
            return;
        }

        res.status(200).json(updatedJob);
    } catch(error)
    {
        res.status(500).json({ message: "Error updating job" });
    }
});

router.delete('/:id',async(req:AuthRequest,res:Response) => {
    try{
        const userId = getUserId(req,res);
        if(!userId) return;
        const jobId = getJobId(req,res);
        if(!jobId) return;

        const deletedJob = await Job.findOneAndDelete({_id:jobId,userId});
        if(!deletedJob) {
            res.status(404).json({message:"Job not found"});
            return;
        }

        res.status(200).json({message:"Job deleted successfully"});
    }
    catch(err)
    {
        res.status(500).json({ message: "Error deleting job" });
    }
});

export default router;



