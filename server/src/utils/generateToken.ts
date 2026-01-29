import jwt from 'jsonwebtoken';

const generateToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'padang_secret_key_123', {
        expiresIn: '30d',
    });
};

export { generateToken };
