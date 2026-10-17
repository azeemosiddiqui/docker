require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const dayjs = require("dayjs");
const path = require("path");
const app = express();
const PORT = Number(process.env.PORT) || 3000;

const tasks = [
 {id:1,title:"Review production deployment",project:"Platform",priority:"High",status:"In progress",due:"Today"},
 {id:2,title:"Update container base image",project:"DevOps",priority:"Medium",status:"Todo",due:"Tomorrow"},
 {id:3,title:"Document CI/CD workflow",project:"Engineering",priority:"Low",status:"Done",due:"Yesterday"},
 {id:4,title:"Check service health metrics",project:"Platform",priority:"High",status:"Todo",due:"Oct 21"},
 {id:5,title:"Clean up old Docker images",project:"DevOps",priority:"Medium",status:"In progress",due:"Oct 22"}
];
app.disable("x-powered-by");
app.use(helmet({contentSecurityPolicy:{directives:{"script-src":["'self'","'unsafe-inline'"],"style-src":["'self'","'unsafe-inline'"]}}}));
app.use(compression());
app.use(morgan("tiny"));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));
app.use("/api",rateLimit({windowMs:60000,limit:100,standardHeaders:"draft-7",legacyHeaders:false}));

app.get("/",(_req,res)=>res.sendFile(path.join(__dirname,"views","index.html")));
app.get("/api/health",(_req,res)=>res.json({status:"ok",application:"Nexus Taskboard",environment:process.env.NODE_ENV||"production",timestamp:dayjs().toISOString(),uptimeSeconds:Math.floor(process.uptime())}));
app.get("/api/tasks",(req,res)=>{const list=req.query.status?tasks.filter(t=>t.status.toLowerCase()===String(req.query.status).toLowerCase()):tasks;res.json({count:list.length,tasks:list});});
app.post("/api/tasks",(req,res)=>{const title=String(req.body.title||"").trim();if(!title)return res.status(400).json({error:"Task title is required."});const task={id:Math.max(0,...tasks.map(t=>t.id))+1,title:title.slice(0,100),project:"Inbox",priority:"Medium",status:"Todo",due:"Unscheduled"};tasks.unshift(task);res.status(201).json({message:"Task created",task});});
app.patch("/api/tasks/:id",(req,res)=>{const task=tasks.find(t=>t.id===Number(req.params.id));if(!task)return res.status(404).json({error:"Task not found."});if(!["Todo","In progress","Done"].includes(req.body.status))return res.status(400).json({error:"Invalid status."});task.status=req.body.status;res.json({message:"Task updated",task});});
app.use((req,res)=>req.path.startsWith("/api/")?res.status(404).json({error:"API route not found."}):res.status(404).sendFile(path.join(__dirname,"views","index.html")));
app.listen(PORT,"0.0.0.0",()=>console.log(`Nexus Taskboard listening on port ${PORT}`));
