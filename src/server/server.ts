import JsonServer from 'json-server';
import { Request, Response, NextFunction } from "express";
import { registerRoutes } from './routes';
import jwt from 'jsonwebtoken';
import { gradeSchema, roleSchema, subjectSchema, subjectStudentSchema, subjectTeacherSchema, userSchema } from '../schemas/index.schema';
const secret = 'workshop_123';

class Server{
    public start(){
        let server = JsonServer.create();
        const router = JsonServer.router('db.json');
        const middlewares = JsonServer.defaults();
        
        server.use(middlewares);
        server.use(JsonServer.bodyParser)
        server.use(this.validate);
        server.use(this.timestamp);
        // server.use(this.tokenValidator);
        registerRoutes(server);
        server.use(router);  
        server.listen(3000, () => {
            console.log('JSON Server is running at port ' + 3000);
        });
    }

    private timestamp = (req:Request, res:Response, next:NextFunction) => {
        if(req.method === 'POST'){
            req.body.createdAt = new Date().getTime(); 
            req.body.updatedAt = new Date().getTime();
        }
        else if(req.method === 'PUT'){
            req.body.updatedAt = new Date().getTime();
        }

        next();
    }

    private validate = (req:Request, res:Response, next:NextFunction) => {
        if(['POST', 'PUT'].includes(req.method)){
            const path = req.path.split('/')[1];
            const schema = schemas[path];

            if(schema){
                schema.validate(req.body)
                .then(() => next())
                .catch((err: { message: any; }) => {
                    res.status(400).send(err.message);
                    return
                });
            }
            else next();
        }
        else next();
    }

    private tokenValidator = (req: Request, res: Response, next: NextFunction) => {
        const openPaths = ['auth']; // Adjust according to your auth paths
        const root = req.path.split('/')[1];
        if (openPaths.includes(root)) return next();

        const token = req.headers.authorization?.split(' ')[1]; // Assuming token is a Bearer token
        if (!token) {
            return res.status(403).send("A token is required for authentication");
        }

        try {
            const decoded = jwt.verify(token, secret);
            // You can attach user details or permissions from the decoded token to the request here if needed
            next();
        } catch (err) {
            return res.status(401).send({
                message: "Invalid Token",
                error: err
            });
        }
    }
}

const schemas = {
    users: userSchema,
    roles: roleSchema,
    grades: gradeSchema,
    subjects: subjectSchema,
    subjectsTeachers: subjectTeacherSchema,
    subjectsStudents: subjectStudentSchema,
} as any;

export default Server;