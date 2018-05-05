const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const url = require('url');
const fs = require('fs');
const mysql = require('mysql');
const ejs = require('ejs');

// MySQL config variables
// MySQL setup:
// 1. use cmpe280;
// 2. create table bootstrap (first varchar(255), last varchar(255), email varchar(255));
const USE_CONNECTION_POOL = true;
const MYSQL_POOL_SIZE = 75;

// Heroku environment variables
const PORT = 5007;

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

var server = app.listen(PORT, () => console.log(`Listening on ${ PORT }`));

app.get('/', (req, res) => res.render('landing'));
app.get('/mobile', (req, res) => res.render('mobile'));
app.get('/bigdata', (req, res) => res.render('bigdata'));
app.get('/iot', (req, res) => res.render('iot'));
app.get('/management', (req, res) => res.render('management'));
app.get('/conduct', (req, res) => res.render('conduct'));
app.get('/process', (req, res) => res.render('process'));
app.get('/locations', (req, res) => res.render('locations'));
app.get('/contact', (req, res) => res.render('contact'));

function getMySqlConnection(){
  // Need to do error handling
  var sqlconnection = mysql.createConnection({
      host     : 'localhost',
      user     : 'root',
      password : 'root',
      database : 'cmpe280',
      port   : 3306
  });

  return sqlconnection;
};

function getData(sqlquery, callbackFunction){
  var mysqlconnection = getMySqlConnection();
  mysqlconnection.query(sqlquery, function(err, matchedrows, fields){
    if(!err){
      console.log("gerData matchedrows", matchedrows);
      console.log("Query Result:"+JSON.stringify(matchedrows));
      callbackFunction(err, matchedrows);
    }else{
      console.log(err.message);
    }
  });
};

function getMysqlConnectionPool(){
  var connectionPool = mysql.createPool({
      connectionLimit:MYSQL_POOL_SIZE,
      host     : 'localhost',
      user     : 'root',
      password : 'root',
      database : 'cmpe280',
      port   : 3306
  });
  return connectionPool;
};

function executeSQLQuery(queryCmd, callbackFunction){
  if (USE_CONNECTION_POOL){
    var connectionPool = getMysqlConnectionPool();
    connectionPool.getConnection(function(err,databaseConnection){
      if(err){
        console.log("Failed to get connection !!!");
        callbackFunction(err,[]);
        //databaseConnection.release();
      }else{
        databaseConnection.query(queryCmd, function(err,result){
          //console.log("Sql Query: ",queryCmd,"\nSql result:", result);
          callbackFunction(err,result);
          databaseConnection.release();
        });
      }

    });
  }else{
    var mysqlConnection = getMySqlConnection();
    if(mysqlConnection){
      //console.log(queryCmd);
      mysqlConnection.query(queryCmd,function(err, result, fields){
        if(err){
          console.log(err.message);
          callbackFunction(err,[]);
        }else{

          callbackFunction(err,result);
        }
      });
      mysqlConnection.end();
    }
  }

};

function stop() {
  server.close();
}

module.exports = app;
module.exports.stop = stop;