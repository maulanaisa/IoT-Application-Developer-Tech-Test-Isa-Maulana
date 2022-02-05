let sensor = require('./JSON Files/sensor_data.json'); //import local JSON data

let roomArea1 = {}; //object to save sensor data based on room and then date
let roomArea2 = {};
let roomArea3 = {};

let tempDate1 = 0; //variable to initiate date loop from 1-31 per month
let tempDate2 = 0;
let tempDate3 = 0;

let metrics_roomArea1 = []; //object to save max, min, median and average sensor data per day
let metrics_roomArea2 = [];
let metrics_roomArea3 = [];

let temp_sequence_roomArea1 = []; //temporary sequence to store data for temperature and humidity per day for calculation
let humid_sequence_roomArea1 = [];  // on max, min, median and average
let temp_sequence_roomArea2 = [];
let humid_sequence_roomArea2 = [];
let temp_sequence_roomArea3 = [];
let humid_sequence_roomArea3 = [];

const median_func = (sequence) => {     //returns median of an array
    const mid = Math.floor(sequence.length / 2);
    return sequence.length % 2 !== 0 ? sequence[mid] : (sequence[mid - 1] + sequence[mid]) / 2;
};

for(i=0; i < sensor.array.length; i++){ //loop through sensor data
    date = new Date(sensor.array[i].timestamp); //save date of recent data
    date_format = date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear();

    if(sensor.array[i].id % 3 === 1){ //if data belongs to roomArea1
        if(date.getDate() === tempDate1){ //check if the day has changed

            roomArea1[date_format].push(sensor.array[i]);

            temp_sequence_roomArea1.push(sensor.array[i].temperature);
            humid_sequence_roomArea1.push(sensor.array[i].humidity);

        }else{
            if(tempDate1 !== 0){ //check if it is the first loop of roomArea1 data
                date_y = new Date(sensor.array[i-1].timestamp); //yesterday date
                date_format_y = date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear();

                let metrics_date = {};  //temporary object to save max, min, median and average per day data
                temp_sequence_roomArea1.sort();
                humid_sequence_roomArea1.sort();

                metrics_date.date = date_format_y;
                metrics_date.temperature_max = temp_sequence_roomArea1[temp_sequence_roomArea1.length-1];
                metrics_date.temperature_min = temp_sequence_roomArea1[0];
                metrics_date.temperature_median = median_func(temp_sequence_roomArea1);
                metrics_date.temperature_avg = temp_sequence_roomArea1.reduce((partialSum, a) => partialSum + a, 0)/temp_sequence_roomArea1.length;
                metrics_date.humidity_max = humid_sequence_roomArea1[humid_sequence_roomArea1.length-1];
                metrics_date.humidity_min = humid_sequence_roomArea1[0];
                metrics_date.humidity_median = median_func(humid_sequence_roomArea1);
                metrics_date.humidity_avg = humid_sequence_roomArea1.reduce((partialSum, a) => partialSum + a, 0)/humid_sequence_roomArea1.length;
                
                metrics_roomArea1.push(metrics_date); //save data
                temp_sequence_roomArea1 = []; //reset sequences for next day calculation
                humid_sequence_roomArea1 = [];
            }

            roomArea1[date_format] = new Array(0); //save sensor data based on room and date to object
            roomArea1[date_format].push(sensor.array[i]);
            tempDate1 = date.getDate();

            temp_sequence_roomArea1.push(sensor.array[i].temperature); //insert sensor data for the day
            humid_sequence_roomArea1.push(sensor.array[i].humidity);

            tempDate1 = date.getDate(); //adjust date

        }
    } else if(sensor.array[i].id % 3 === 2){ //if data belongs to roomArea2
        if(date.getDate() === tempDate2){

            roomArea2[date_format].push(sensor.array[i]);

            temp_sequence_roomArea2.push(sensor.array[i].temperature);
            humid_sequence_roomArea2.push(sensor.array[i].humidity);

        }else{
            if(tempDate2 !== 0){
                date_y = new Date(sensor.array[i-1].timestamp);
                date_format_y = date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear();

                let metrics_date = {};
                temp_sequence_roomArea2.sort();
                humid_sequence_roomArea2.sort();

                metrics_date.date = date_format_y;
                metrics_date.temperature_max = temp_sequence_roomArea2[temp_sequence_roomArea2.length-1];
                metrics_date.temperature_min = temp_sequence_roomArea2[0];
                metrics_date.temperature_median = median_func(temp_sequence_roomArea2);
                metrics_date.temperature_avg = temp_sequence_roomArea2.reduce((partialSum, a) => partialSum + a, 0)/temp_sequence_roomArea2.length;
                metrics_date.humidity_max = humid_sequence_roomArea2[humid_sequence_roomArea2.length-1];
                metrics_date.humidity_min = humid_sequence_roomArea2[0];
                metrics_date.humidity_median = median_func(humid_sequence_roomArea2);
                metrics_date.humidity_avg = humid_sequence_roomArea2.reduce((partialSum, a) => partialSum + a, 0)/humid_sequence_roomArea2.length;
                
                metrics_roomArea2.push(metrics_date);
                temp_sequence_roomArea2 = [];
                humid_sequence_roomArea2 = [];
            }
            roomArea2[date_format] = new Array(0);
            roomArea2[date_format].push(sensor.array[i]);
            tempDate2 = date.getDate();

            temp_sequence_roomArea2.push(sensor.array[i].temperature);
            humid_sequence_roomArea2.push(sensor.array[i].humidity);

            tempDate2 = date.getDate();
        }
    }else { //if data belongs to roomArea3
        if(date.getDate() === tempDate3){ 

            roomArea3[date_format].push(sensor.array[i]);

            temp_sequence_roomArea3.push(sensor.array[i].temperature);
            humid_sequence_roomArea3.push(sensor.array[i].humidity);

        }else{
            if(tempDate3 !== 0){
                date_y = new Date(sensor.array[i-1].timestamp);
                date_format_y = date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear();

                let metrics_date = {};
                temp_sequence_roomArea3.sort();
                humid_sequence_roomArea3.sort();
                metrics_date.date = date_format_y;
                metrics_date.temperature_max = temp_sequence_roomArea3[temp_sequence_roomArea3.length-1];
                metrics_date.temperature_min = temp_sequence_roomArea3[0];
                metrics_date.temperature_median = median_func(temp_sequence_roomArea3);
                metrics_date.temperature_avg = temp_sequence_roomArea3.reduce((partialSum, a) => partialSum + a, 0)/temp_sequence_roomArea3.length;
                metrics_date.humidity_max = humid_sequence_roomArea3[humid_sequence_roomArea3.length-1];
                metrics_date.humidity_min = humid_sequence_roomArea3[0];
                metrics_date.humidity_median = median_func(humid_sequence_roomArea3);
                metrics_date.humidity_avg = humid_sequence_roomArea3.reduce((partialSum, a) => partialSum + a, 0)/humid_sequence_roomArea3.length;
                
                metrics_roomArea3.push(metrics_date);
                temp_sequence_roomArea3 = [];
                humid_sequence_roomArea3 = [];
            }

            roomArea3[date_format] = new Array(0);
            roomArea3[date_format].push(sensor.array[i]);
            tempDate3 = date.getDate();
        }
    }
}

//Uncomment to print objects that classify sensor data based on room and date
// console.log(roomArea1);
// console.log(roomArea2);
// console.log(roomArea3);

//Uncomment to print objects that contain max, min, median and average per day data
// console.log(metrics_roomArea1);
// console.log(metrics_roomArea2);
// console.log(metrics_roomArea3);
