let users = {};
let chislo = +prompt('Введите число пользователей')

for (let i = 1; i <=chislo; i++) {

   let name = prompt("Введите имя");

   let age = +prompt("Введите возраст");

   

   users[i] = {

       name: name,

       age: age

   };

}


for (let id in users) {

   console.log(`Пользователь - ${id}`);

   console.log(`Имя - ${users[id].name}`);

   console.log(`Возраст - ${users[id].age}`);

}


console.log(users);



let cartrr = receipt()
let text = 'Вы заказали'
let delivery = 9000

for(let key in cartrr) {
    text = `${text} ${key} ${cartrr[key].info},`
    delivery = delivery + cartrr[key]['price']
}
console.log(`${text} | Общая стоимость ${delivery}сумм с доставкой (9000)`);