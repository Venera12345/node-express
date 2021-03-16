const {Router} = require("express");
const Order = require('../models/order');
const router = Router();

router.get('/', async (req, res) => {
    try {
        const order = await Order.find({
            'user.userId': req.user._id
        }).populate('user.userId');
        console.log(order)
        const orders = order.map(o =>{
            return {...o._doc, price: o.courses.reduce((c,a) => {return c += a.count*a.course.price}, 0)}
        })

        res.render('order', {
            title: 'Order',
            isOrder: true,
            orders
        })
        debugger;
    } catch (e) {
        console.log(e)
    }

})
router.post('/', async (req, res) => {
    try {
        const user = await req.user.populate('cart.item.courseId').execPopulate();
      //  console.log(user.cart.item)
        const coursesList = user.cart.item.map(c => {
            return {
                count: c.count,
                course: {...c.courseId._doc}
            }
        })
       console.log(coursesList)
        const order = new Order({
            courses: coursesList,
            user: {
                name: req.user.name,
                userId: req.user
            }
        })
        console.log(order)
        await order.save();
        await req.user.clearCard();
        res.redirect('/order');
    } catch (e) {
        console.log(e)
    }

})
module.exports = router;