import session from 'express-session';
import MongoStore from 'connect-mongo'; // You'll need to install this package

const sessionConfig = {
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        ttl: 24 * 60 * 60 // 24 hours - matches JWT expiry
    }),
    cookie: {
        secure: process.env.NODE_ENV === 'production', // HTTPS only in production
        httpOnly: true, // Prevents client-side access to the cookie
        sameSite: 'strict', // Protects against CSRF
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        path: '/' // Cookie is valid for all paths
    }
};

export default sessionConfig;
