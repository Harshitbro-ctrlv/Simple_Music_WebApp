import jwt from 'jsonwebtoken';

export async function authArtist(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(!decoded.roles.includes("artist")){
            return res.status(403).json({ message: "You don't have permission to create music" });
        }

        req.user = decoded;
        next();
    }catch(error){
        return res.status(401).json({ message: "Invalid token" });
    }
}

export async function authUser(req, res, next) {
    const token = req.cookies.token;
    if(!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(!decoded.roles.includes("user") && !decoded.roles.includes("artist")){
            return res.status(403).json({ message: "You don't have permission to access this resource" });
        }

        req.user = decoded;
        next();
    }catch(error){
        return res.status(401).json({ message: "Invalid token" });
    }
}