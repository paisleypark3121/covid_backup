/*const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('Hello Express app!')
});

app.listen(3000, () => {
  console.log('server started');
});*/


//"use strict"; // using strict i can avoid the const for ejs

const express = require('express');

const https = require('https');
require('ejs');
const app=express();
const bodyParser = require("body-parser");
var port=process.env.port || 3000;
app.set('view engine', 'ejs');
app.use( express.static( "public" ) );

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

 const full_url="https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/owid-covid-data.json";

const it_full_url="https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-andamento-nazionale.json";


app.get('/', function(req,res) {
  //res.send('HELLO WORLD');
  res.render('main.ejs');
});

app.get('/full', function(req,res) {
  console.log('*** full request ***')

  https.get(full_url, (resp) => {
    let data = '';

    resp.on('data', (chunk) => {
      data += chunk;
    });

    resp.on('end', () => {
      //console.log(data);
      var obj = JSON.parse(data); 
      // number of countries
      var len = Object.keys(obj).length;
      // keys for each country
      var keys = Object.keys(obj);

      var values=[];
      for (var i=0;i<len;i++)
      {
        var current=[
          keys[i],
          obj[keys[i]].location,
        ];
        values.push(current);
        //console.log(current);
      }

      //res.render('list.ejs', {list: keys});
      res.render('full.ejs', {list: values});
    });

  }).on("error", (err) => {
    console.log("ERROR: " + err.message);
  });
});

app.post('/getfull', function(req,res) {
  console.log('*** getfull request ***')
  console.log(req.body);

  var country = req.body.country;
  //console.log(country);
  var days = req.body.days;
  //console.log(days);
  if (!days)
    days=10;
  https.get(full_url, (resp) => {
    let data = '';

    resp.on('data', (chunk) => {
      data += chunk;
    });

    resp.on('end', () => {
      //console.log(data);
      var obj = JSON.parse(data); 
      // number of countries
      var len = Object.keys(obj).length;
      // keys for each country
      var keys = Object.keys(obj);

      // COUNTRY FILTER
      var dates = Object.keys(obj[country].data).length;
      //console.log(dates);
      var values=[];
      console.log("days: "+days);
      for (var i=1;i<=days;i++)
      {
        var current=[
          obj[country].data[dates-i].date,
          obj[country].data[dates-i].new_cases,
          obj[country].data[dates-i].new_deaths,
        ];
        values.push(current);
        //console.log(current);
      }

      res.send({country: country, values: values});
    });

  }).on("error", (err) => {
    console.log("ERROR: " + err.message);
  });
});

app.get('/it', function(req,res) {
  console.log('*** it request ***')

  https.get(it_full_url, (resp) => {
    let data = '';

    resp.on('data', (chunk) => {
      data += chunk;
    });

    resp.on('end', () => {
      //console.log(data);
      var obj = JSON.parse(data); 
      var len = Object.keys(obj).length;
      //console.log("i: "+i);
      
      var values=[];
      for (var i=1;i<=10;i++)
      {
        var current=[
          JSON.parse(data)[len-i].data,
          JSON.parse(data)[len-i].nuovi_positivi,
          JSON.parse(data)[len-i].deceduti-JSON.parse(data)[len-(i+1)].deceduti,
          JSON.parse(data)[len-i].terapia_intensiva,
          JSON.parse(data)[len-i].tamponi-JSON.parse(data)[len-(i+1)].tamponi,
          JSON.parse(data)[len-i].ricoverati_con_sintomi,
        ];
        values.push(current);
      }

      //console.log(values);  
      res.render('it.ejs', {values: values});
    });

  }).on("error", (err) => {
    console.log("ERROR: " + err.message);
  });
});

app.post('/getit', function(req,res) {
  console.log('*** getit request ***')
  console.log(req.body);

  //console.log(country);
  var days = req.body.days;
  //console.log(days);
  if (!days)
    days=10;
  https.get(it_full_url, (resp) => {
    let data = '';

    resp.on('data', (chunk) => {
      data += chunk;
    });

    resp.on('end', () => {
      var obj = JSON.parse(data); 
      var len = Object.keys(obj).length;
      
      var values=[];
      for (var i=1;i<=days;i++)
      {
        var current=[
          JSON.parse(data)[len-i].data,
          JSON.parse(data)[len-i].nuovi_positivi,
          JSON.parse(data)[len-i].deceduti-JSON.parse(data)[len-(i+1)].deceduti,
          JSON.parse(data)[len-i].terapia_intensiva,
          JSON.parse(data)[len-i].tamponi-JSON.parse(data)[len-(i+1)].tamponi,
          JSON.parse(data)[len-i].ricoverati_con_sintomi,
        ];
        values.push(current);
      }

      //console.log(values);  
      res.send({values: values});

    });

  }).on("error", (err) => {
    console.log("ERROR: " + err.message);
  });
});

/*
app.get('/chart', function(req,res) {
  console.log('*** chart request ***')

  https.get(full_url, (resp) => {
    let data = '';

    resp.on('data', (chunk) => {
      data += chunk;
    });

    resp.on('end', () => {
      //console.log(data);
      var obj = JSON.parse(data); 
      // number of countries
      var len = Object.keys(obj).length;
      // keys for each country
      var keys = Object.keys(obj);

      // example: 1st country continent, location, dates per country
      //console.log(obj[keys[0]].continent);
      //console.log(obj[keys[0]].location);
      //var dates = Object.keys(obj[keys[0]].data).length;
      // how to access data for a specific country key
      //console.log(obj.ALB);
      //console.log(obj[keys[0]].data[0].date);
      //console.log(obj[keys[0]].data[dates-1].date);
      
      // CHINA FILTER
      var dates = Object.keys(obj.CHN.data).length;
      var values=[];
      for (var i=1;i<=10;i++)
      {
        var current=[
          obj.CHN.data[dates-i].date,
          obj.CHN.data[dates-i].new_cases,
          obj.CHN.data[dates-i].new_deaths,
        ];
        values.push(current);
        //console.log(current);
      }

      // console.log(values);  
      res.render('chart.ejs', {values: values});
    });

  }).on("error", (err) => {
    console.log("ERROR: " + err.message);
  });
});

app.get('/list', function(req,res) {
  console.log('*** list request ***')

  https.get(full_url, (resp) => {
    let data = '';

    resp.on('data', (chunk) => {
      data += chunk;
    });

    resp.on('end', () => {
      //console.log(data);
      var obj = JSON.parse(data); 
      // number of countries
      var len = Object.keys(obj).length;
      // keys for each country
      var keys = Object.keys(obj);

      var values=[];
      for (var i=0;i<len;i++)
      {
        var current=[
          keys[i],
          obj[keys[i]].location,
        ];
        values.push(current);
        //console.log(current);
      }

      //res.render('list.ejs', {list: keys});
      res.render('list.ejs', {list: values});
    });

  }).on("error", (err) => {
    console.log("ERROR: " + err.message);
  });
});
*/



/*
app.post('/filter', function(req,res) {
  console.log('*** filter request ***')
  console.log(req.body);

  var country = req.body.country;
  console.log(country);
  https.get(full_url, (resp) => {
    let data = '';

    resp.on('data', (chunk) => {
      data += chunk;
    });

    resp.on('end', () => {
      //console.log(data);
      var obj = JSON.parse(data); 
      // number of countries
      var len = Object.keys(obj).length;
      // keys for each country
      var keys = Object.keys(obj);

      // COUNTRY FILTER
      var dates = Object.keys(obj[country].data).length;
      //console.log(dates);
      var values=[];
      for (var i=1;i<=10;i++)
      {
        var current=[
          obj[country].data[dates-i].date,
          obj[country].data[dates-i].new_cases,
          obj[country].data[dates-i].new_deaths,
        ];
        values.push(current);
        //console.log(current);
      }

      res.render('chart.ejs', {country: country, values: values});
    });

  }).on("error", (err) => {
    console.log("ERROR: " + err.message);
  });
});
*/

app.listen(port);