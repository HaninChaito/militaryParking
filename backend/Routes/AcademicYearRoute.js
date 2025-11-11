import express from 'express';
import {
  getAcademicYears,
  addAcademicYear,
} from '../Controllers/academicYearController.js';

const router = express.Router();

router.get('/all', getAcademicYears);
router.post('/add', addAcademicYear);

export default router;
