import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
    const {token} = req.cookies;
    
    if (!token) {
        return res.json({ success: false, message: 'Não autorizado' });
    }
    
    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = tokenDecode; // Attach decoded token payload (which includes id) to req.user
        next();

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export default authUser;