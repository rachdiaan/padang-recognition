import express from 'express';
import { authUser, registerAdmin } from '../controllers/authController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/login', authUser);
router.post('/register', registerAdmin); // Ideally protect this or remove in prod

router.get('/profile', protect, admin, (req, res) => {
    res.send('Admin profile accessed');
});

export default router;
