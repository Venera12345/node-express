document.querySelectorAll('.price').forEach(node => {
    node.textContent = new Intl.NumberFormat('ru-Ru', {
        currency: 'rub',
        style: 'currency'
    }).format(node.textContent);
})
const toDate = date => {
    return new Intl.DateTimeFormat('ru-Ru', {
     day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).format(new Date(date))
}
document.querySelectorAll('.date').forEach((node)=>{
    node.textContent = toDate(node.textContent)
})
const $cardBlock = document.querySelector('#card');
if ($cardBlock) {
    $cardBlock.addEventListener('click', event => {
        if (event.target.classList.contains('js-remove')) {
            const id = event.target.dataset.id
            fetch('card/remove/' + id, {
                method: 'delete'
            }).then(res => res.json())
                .then((card) => {
                    if (card.courses.length) {
                        const content = card.courses.map((c)=>{
                         return     `
                        <tr>
                           <td>${c.title}</td>
                           <td>${c.count}</td>
                           <td>
                             <button class="btn bnt-primary js-remove" data-id="${c.id}">Delete</button>
                           </td>
                         </tr>
                       `
                            }).join('');
                        $cardBlock.querySelector('tbody').innerHTML = content;
                        $cardBlock.querySelector('.price').textContent = card.price;
                    } else {
                        $cardBlock.innerHTML=`<p>Product not found</p>`
                    }
                })
        }
    })
}
M.Tabs.init(document.querySelectorAll('.tabs'))