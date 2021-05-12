"use strict";

const express = require('express');
const app = express();
const port = 3000;

const puppeteer = require('puppeteer');
const stringify = require('csv-stringify');
const fs = require('file-system');
const nodemailer = require('nodemailer')
const smtpTransport = require('nodemailer-smtp-transport');

const { getBrowserInstance } = require('./instance');


app.listen(port, function (err) {
    if (err) {
        console.error('Something error !!');
        console.error(err);
    }

    console.log('App listen on port ' + port);
});


app.get("/", (req, res) => {
    res.sendFile(__dirname + '/server.html');


})

app.get("/test", (req, res) => {


    const login = async () => {

        const browser = await getBrowserInstance();
        console.log("browser" + browser);

        const pages = await browser.pages();

        const page1 = await browser.newPage();
        await page1.goto("https://shopee.vn/buyer/login?next=https%3A%2F%2Fshopee.vn%2F", { waitUntil: 'networkidle2' });
        // document.getElementsByClassName('')[0].click()
    };
    login();

})


app.get("/newtab", (req, res) => {


    const createNewTab = async () => {

        const browser = await getBrowserInstance();
        console.log("browser" + browser);
        const page1 = await browser.newPage();
        await page1.goto("https://www.shopee.vn", { waitUntil: 'networkidle2' });

    };
    createNewTab();

})