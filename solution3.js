let metrics_roomArea1_json; //object to store random generated raw json data by room and day (roomArea1)
let graph_roomArea1;    //object to store pre-simulation data from json raw data
const timestamp = 1643994000000;    //start time for pre-simulation data (5/2/2022 0:0:0)
const timeinterval_hour = 3600000;  //time interval per hour on timestamp unit

const median_func = (sequence) => {     //returns median of an array
    const mid = Math.floor(sequence.length / 2);
    return sequence.length % 2 !== 0 ? sequence[mid] : (sequence[mid - 1] + sequence[mid]) / 2;
};

//generate json raw data
//it will generate data and store it by date, each containing 24 sensor data (24 sensor data generated per day)
function generateDataJson(time_stamp,numberofDays){ 
    let data = {};
    for(let i=0;i<numberofDays;i++){
        let date = new Date(time_stamp);
        let date_format = date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear();
        data[date_format] = new Array(0); //generate new array for new date/day
        for(let j=0;j<24;j++){
            let new_data = {};
            let temp = Math.random()*25 + 15; //random value in range of 15 and 40
            new_data.temperature = parseFloat(temp.toFixed(0));
            let humid = Math.random()*20 + 80; //random value in range of 80 and 100
            new_data.humidity = parseFloat(humid.toFixed(0));
            new_data.id = i*24+j+1; //unique id 
            new_data.timestamp = time_stamp;
            
            data[date_format][j] = new_data;
    
            time_stamp += timeinterval_hour;
        }
    }
    return data;
}

//generate data from raw json object, calculate and store max, min, median and average of sensor data per day
function generateSequence(json){
    const keys = Object.keys(json);

    output = {};

    let temp_max_seq = [];
    let humid_max_seq = [];
    let temp_min_seq = [];
    let humid_min_seq = [];
    let temp_median_seq = [];
    let humid_median_seq = [];
    let temp_avg_seq = [];
    let humid_avg_seq = [];
    let timestep = [];

    keys.forEach((key) => { //looping through json raw data
        let temp = [];
        let humid = [];
        let length = metrics_roomArea1_json[key].length;
        for(i=0;i<length;i++){
            temp.push(metrics_roomArea1_json[key][i].temperature); //store sensor data with same date
            humid.push(metrics_roomArea1_json[key][i].humidity);
        }

        //calculate max, min, median and average sensor data per day/date
        temp.sort(function(a,b) { return a - b; });
        humid.sort(function(a,b) { return a - b; });
        temp_max_seq.push(temp[temp.length-1]);
        humid_max_seq.push(humid[humid.length-1]);
        temp_min_seq.push(temp[0]);
        humid_min_seq.push(humid[0]);
        temp_median_seq.push(median_func(temp));
        humid_median_seq.push(median_func(humid));
        temp_avg_seq.push(temp.reduce((partialSum, a) => partialSum + a, 0)/temp.length);
        humid_avg_seq.push(humid.reduce((partialSum, a) => partialSum + a, 0)/humid.length);

        timestep.push(key+" 0:0:0");
    });

    output.temp_max_seq = temp_max_seq;
    output.humid_max_seq = humid_max_seq;
    output.temp_min_seq = temp_min_seq;
    output.humid_min_seq = humid_min_seq;
    output.temp_median_seq = temp_median_seq;
    output.humid_median_seq = humid_median_seq;
    output.temp_avg_seq = temp_avg_seq;
    output.humid_avg_seq = humid_avg_seq;
    output.timestep = timestep;

    return output;
}

metrics_roomArea1_json = generateDataJson(timestamp,7);
graph_roomArea1 = generateSequence(metrics_roomArea1_json);

const keys = Object.keys(metrics_roomArea1_json);

//find latest timestamp and id to generate new data
let timestampContinue = metrics_roomArea1_json[keys[keys.length-1]][metrics_roomArea1_json[keys[keys.length-1]].length-1].timestamp;
let idContinue = metrics_roomArea1_json[keys[keys.length-1]][metrics_roomArea1_json[keys[keys.length-1]].length-1].id;
idContinue += 1;
timestampContinue += timeinterval_hour;

//generate new (numberofDataperDay) sensor data, calculate (max, min, median and average) on respective date/day and store it
function getNewData(numberofDataperDay) {
    let temp_new_sequence = []; //array to store sensor data for (max, min, median and average) calculation
    let humid_new_sequence = [];
    let date2 = new Date(timestampContinue);
    let date_format2 = date2.getDate()+"/"+(date2.getMonth()+1)+"/"+date2.getFullYear()
    metrics_roomArea1_json[date_format2] = new Array(0); //create new array after each day
    for(i=0;i<numberofDataperDay;i++){
        let s = {};
        let temp = Math.random()*25 + 15;
        let humid = Math.random()*20 + 80;
        temp_new_sequence.push(parseFloat(temp.toFixed(0)));
        humid_new_sequence.push(parseFloat(humid.toFixed(0)));
        
        s.temperature = parseFloat(temp.toFixed(0)); //save new data to metrics_roomArea1_json
        s.humidity = parseFloat(humid.toFixed(0));
        s.id = idContinue;
        s.timestamp = timestampContinue;

        metrics_roomArea1_json[date_format2][i] = s; 

        idContinue += 1;
        timestampContinue += 86400000/numberofDataperDay;
    }

    let output ={};

    //sort array
    temp_new_sequence.sort(function(a,b) { return a - b; });
    humid_new_sequence.sort(function(a,b) { return a - b; });

    //take out new generated (max, min, median and average) value 
    output.temp_max_val = temp_new_sequence[temp_new_sequence.length-1];
    output.humid_max_val = humid_new_sequence[humid_new_sequence.length-1];
    output.temp_min_val = temp_new_sequence[0];
    output.humid_min_val = humid_new_sequence[0];
    output.temp_median_val = median_func(temp_new_sequence);
    output.humid_median_val = median_func(humid_new_sequence);
    output.temp_avg_val = temp_new_sequence.reduce((partialSum, a) => partialSum + a, 0)/temp_new_sequence.length;
    output.humid_avg_val = humid_new_sequence.reduce((partialSum, a) => partialSum + a, 0)/humid_new_sequence.length;
    date2 = new Date(timestampContinue);
    output.timestep = date2.getDate()+"/"+(date2.getMonth()+1)+"/"+date2.getFullYear()+" "+date2.getHours()+":"+date2.getMinutes()+":"+date2.getSeconds();

    return output;
}  

//plot for temperature line chart
Plotly.newPlot('tester',[{
    x:graph_roomArea1.timestep,
    y:graph_roomArea1.temp_max_seq,
    type:'line',
    name:'temperature max'
}
,{
    x:graph_roomArea1.timestep,
    y:graph_roomArea1.temp_min_seq,
    type:'line',
    name:'temperature min'
},{
    x:graph_roomArea1.timestep,
    y:graph_roomArea1.temp_median_seq,
    type:'line',
    name:'temperature median'
},{
    x:graph_roomArea1.timestep,
    y:graph_roomArea1.temp_avg_seq,
    type:'line',
    name:'temperature average'
}
], {
    title: 'Temperature',
  xaxis: {
    title: 'Time',
  },
  yaxis: {
    title: 'Value'
  }
}
);

//plot for humidity line chart
Plotly.newPlot('tester2',[{
    x:graph_roomArea1.timestep,
    y:graph_roomArea1.humid_max_seq,
    type:'line',
    name:'humidity max'
},{
    x:graph_roomArea1.timestep,
    y:graph_roomArea1.humid_min_seq,
    type:'line',
    name:'humidity min'
},{
    x:graph_roomArea1.timestep,
    y:graph_roomArea1.humid_median_seq,
    type:'line',
    name:'humidity median'
},{
    x:graph_roomArea1.timestep,
    y:graph_roomArea1.humid_avg_seq,
    type:'line',
    name:'humidity average'
}

], {
    title: 'Humidity',
  xaxis: {
    title: 'Time',
  },
  yaxis: {
    title: 'Value'
  }
});

cnt = 7; 
var refreshIntervalId;
var buttonstate = 0; //state of start/stop button
function runningData(element){
    buttonstate= 1 - buttonstate;
    var blabel, bstyle, bcolor;
    if(buttonstate){    //when start button clicked
        blabel="Stop";
        bstyle="pink";
        bcolor="black";

        element.style.background=bstyle;
        element.style.color=bcolor;
        element.innerHTML=blabel;
        
        //run simulation every 2 sec
        refreshIntervalId = setInterval(function(){
            let b = getNewData(24);

            //show new generated data
            document.getElementById("tempMin").innerHTML = b.temp_min_val.toFixed(1);
            document.getElementById("tempMax").innerHTML = b.temp_max_val.toFixed(1);
            document.getElementById("tempMedian").innerHTML = b.temp_median_val.toFixed(1);
            document.getElementById("tempAvg").innerHTML = b.temp_avg_val.toFixed(1);
            document.getElementById("humidMin").innerHTML = b.humid_min_val.toFixed(1);
            document.getElementById("humidMax").innerHTML = b.humid_max_val.toFixed(1);
            document.getElementById("humidMedian").innerHTML = b.humid_median_val.toFixed(1);
            document.getElementById("humidAvg").innerHTML = b.humid_avg_val.toFixed(1);

            //extend line chart for new generated data
            Plotly.extendTraces('tester',{y:[[b.temp_max_val],[b.temp_min_val],[b.temp_median_val],[b.temp_avg_val]],
                x:[[b.timestep],[b.timestep],[b.timestep],[b.timestep]]}, [0,1,2,3]);
            
            Plotly.extendTraces('tester2',{y:[[b.humid_max_val],[b.humid_min_val],[b.humid_median_val],[b.humid_avg_val]],
            x:[[b.timestep],[b.timestep],[b.timestep],[b.timestep]]}, [0,1,2,3]);
        
            cnt++;
            if(cnt > 7) {   //number of xAxis points before chart moving to the right
                Plotly.relayout('tester',{
                    xaxis: {
                        range: [cnt-7,cnt], //show n data points at the same time
                        title: 'Time',
                    }
                });
        
                Plotly.relayout('tester2',{
                    xaxis: {
                        range: [cnt-7,cnt],
                        title: 'Time',
                    }
                });
            }
        
        },2000);

    }else{  //when stop button clicked
    blabel="Start";
    bstyle="lightgreen";
    bcolor="black";

    element.style.background=bstyle;
    element.style.color=bcolor;
    element.innerHTML=blabel;
    
    //stop the simulation
    clearInterval(refreshIntervalId);

    }
    
}
