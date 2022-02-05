//Dependencies : node-fetch v2.0
const fetch = require('node-fetch');

//url to fetch user data and currency convert value from IDR to USD
const url = "https://jsonplaceholder.typicode.com/users";
const url_IdrtoUsd = "https://free.currconv.com/api/v7/convert?q=IDR_USD&compact=ultra&apiKey=ae9e5162dfb27f6c4b40"

Promise.all([
	fetch(url),
	fetch(url_IdrtoUsd)
]).then(function (responses) {
	return Promise.all(responses.map(function (response) { //create an array to store responses data
		return response.json(); //return array of responses data as JSON
	}));
}).then(function (data) {
	let user_data = data[0];
    let currency = data[1];
    let salary = require('./JSON Files/salary_data.json');  //salary data from local file
    let table = []; //required to store and display data using table format
    
    for (let i = 0; i < user_data.length; i++){  
        user_data[i].salaryInIDR = salary.array[i].salaryInIDR; //input new currency data
        user_data[i].salaryInUSD = salary.array[i].salaryInIDR*currency.IDR_USD;

        let new_data = {id : user_data[i].id, name : user_data[i].name, username : user_data[i].username,
        email : user_data[i].email, address : user_data[i].address.street+", "+user_data[i].address.suite+
        ", "+user_data[i].address.city+", "+user_data[i].address.zipcode, phone : user_data[i].phone, 
        salary_in_IDR : parseFloat(user_data[i].salaryInIDR.toFixed(0)), salary_in_USD : parseFloat(user_data[i].salaryInUSD.toFixed(2))};
        
        table.push(new_data); //input new data for table
    }
    console.table(table);

}).catch(function (error) {
	console.log(error);
});
