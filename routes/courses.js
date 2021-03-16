const {Router} = require('express');
const Courses = require('../models/courses');
const router = Router();

router.get('/', async (req, res)=>{
    const courses = await Courses.find()
    .populate('userId', 'email name');
    res.render('courses', {
        title: 'Courses',
        isCourses: true,
        courses
    })
})
router.get('/:id/edit', async (req, res)=>{
    const course = await Courses.findById(req.params.id)
    res.render('course-edit', {
        title: `Edit ${course && course.title}`,
        course
    })
})
 router.post('/edit', async (req, res)=>{
     const {id} = req.body;
     delete req.body.id;
     await Courses.findByIdAndUpdate(id, req.body);
     res.redirect('/courses');
})
router.post('/remove', async (req, res)=>{
    try {
        await Courses.deleteOne({_id: req.body.id});
        res.redirect('/courses');
    } catch (e) {
        console.log(e)
    }

})
router.get('/:id', async (req, res)=>{
    const course = await Courses.findById(req.params.id)
    res.render('course', {
        layout: 'empty',
        title: `Course ${course && course.title}`,
        course
    })
})

module.exports = router;
