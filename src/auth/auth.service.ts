
import jwt from 'jsonwebtoken';
import fs from 'fs/promises';
import path from 'path';
const secret = 'workshop_123';

const dbPath = path.join(process.cwd(), 'db.json');
async function getDb() {
  const data = await fs.readFile(dbPath, 'utf8');
  return JSON.parse(data);
}

export async function login(req:any, res:any) {
    const { username, password } = req.body;
    const db = await getDb();
    const user = db.users.find((u:any) => u.username === username && u.password === password);

    if (user) {
        const role = db.roles.find((r:any) => r.id === user.roleId);
        const userObj = {
            id: user.id,
            name: user.fullName,
            role: role
        }
        const token = jwt.sign(userObj, secret, { expiresIn: '1h' });
        res.status(200).send({ token });
    } else {
        res.status(401).send({ 
            error: 'Invalid username or password'
        });
    }
}

export async function refreshToken(req:any, res:any) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        res.status(403).send("A token is required for authentication");
        return;
    }

    try {
        const decoded = jwt.verify(token, secret);
        const newToken = jwt.sign(decoded, secret, { expiresIn: '1h' });
        res.status(200).send({ token: newToken });
    } catch (err) {
        res.status(401).send("Invalid Token");
    }
}