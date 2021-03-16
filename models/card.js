const fs = require('fs');
const path = require('path');
const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'card.json'
)

class Card {
    static async add(card) {
      const course = card;
      const courses = await Card.fetch();
      const idx = courses.courses.findIndex(c=>c.id===course.id);
      const candidate = courses.courses[idx];
      if(candidate) {
          candidate.count++;
          courses.courses[idx] = candidate;
      } else {
          course.count = 1;
          courses.courses.push(course);
      }
        courses.price += +course.price;
      return new Promise((resolve, reject)=>{
         fs.writeFile(p, JSON.stringify(courses),  (err, content)=>{
             if(err) {
                 reject(err);
             }else {
                 resolve();
             }
         })
      })
    }
    static async remove(id) {
        const courses = await Card.fetch();
        const course = courses.courses.find(c=>c.id === id);
        const idx = courses.courses.findIndex(c=>c.id === id)
        if(course.count > 1) {
            courses.courses[idx].count--;
        } else {
           courses.courses = courses.courses.filter(c=> c.id !== id)
        }
        courses.price -= +course.price;
        return new Promise((resolve, reject)=>{
            fs.writeFile(p, JSON.stringify(courses),  (err, content)=>{
                if(err) {
                    reject(err);
                }else {
                    resolve(courses);
                }
            })
        })

    }
    static async fetch() {
     return new Promise((resolve, reject)=>{
        fs.readFile(p, 'utf-8', (err, content)=>{
            if(err) {
                reject(err);
            }else {
                resolve(JSON.parse(content));
            }
        })
     })
    }
}
module.exports = Card;
