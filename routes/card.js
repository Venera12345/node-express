const {Router} = require('express');
const Courses = require('../models/courses');
const Users = require('../models/card');
const router = Router();
function mapCourses(card){
  return card.item.map(c =>({
       ...c.courseId._doc, 
       id: c.id,
       count: c.count
  }))
}
function mapCoursesPrise(courses){
  return courses.reduce((c, b)=>{
   return c += b.count*b.price
  },0)
}
router.post('/add', async (req, res)=>{
    const course = await Courses.findById(req.body.id);
    await req.user.addToCard(course);
    res.redirect('/card');
})
router.delete('/remove/:id', async (req, res)=>{
//    const card = await Card.remove(req.params.id);
    await req.user.removeFromCart(req.params.id);
    const user = await req.user
    .populate('cart.item.courseId')
    .execPopulate();
    const courses = mapCourses(user.cart);
    const cart = {
      courses, price: mapCoursesPrise(courses)
    }
     res.status(200).json(cart);
})

router.get('/', async (req, res)=>{
 const card = await req.user
 .populate('cart.item.courseId')
 .execPopulate();
  const courses = mapCourses(card.cart);
  const price = mapCoursesPrise(courses);
    res.render('card', {
        title: `Buy`,
        courses: courses,
        price: price,
        isBasket: true
    })
})

module.exports = router;
