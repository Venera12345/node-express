const {Schema, model} = require('mongoose');
const courses = require('./courses');
const users = new Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
   cart: {
        item: [
            {
                count: {
                    type: Number,
                    required: true,
                    default: 1
                },
                courseId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Courses',
                    required: true
                }
            }
        ]
   }
})
users.methods.addToCard = function (course) {
    const item = [...this.cart.item];
    const index = item.findIndex((c)=>{
      return c.courseId.toString() === course._id.toString()
    })
    if(index >= 0) {
      item[index].count +=1;
    } else {
        item.push({
            count: 1,
            courseId: course._id
        })
    }
    this.cart = {item}
    return this.save();
}
users.methods.removeFromCart = function (id) {
   let item = [...this.cart.item];
   const index = item.findIndex(c => c._id.toString() === id.toString())
  if(item[index] && item[index].count === 1) {
      item = item.filter(c => c._id.toString() !== id.toString())
  } else {
    item[index].count -- 
  }
  this.cart = {item}
  return this.save();
}
users.methods.clearCard = function () {
    this.cart = {item: []}
    return this.save();
}
module.exports = model('User', users);
