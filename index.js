"use strict";

const express = require('express');
const app = express();
const port = 3000;

const puppeteer = require('puppeteer');
const stringify = require('csv-stringify');
const fs = require('file-system');
const nodemailer = require('nodemailer')
const smtpTransport = require('nodemailer-smtp-transport');


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

    const data = async () => {
        console.log("test")
        let bookcarUrl = 'https://hasonhaivan.vn/admin_lv2/modules/account/login.php';


        const browser = await puppeteer.launch({
            headless: false,
            args: ["--no-sandbox"]
        });
        let page = await browser.newPage();

        await page.goto(bookcarUrl, { waitUntil: 'networkidle2' });
        await page.evaluate(() => {
            let username = document.querySelector('div[class="form-group has-feedback"] > input[name="username"]');
            let password = document.querySelector('div[class="form-group has-feedback"] > input[name="password"]');
            let submit = document.querySelector('button[type="submit"]');
            username.value = "dl.hhtravelvn";
            password.value = "Hiepnguyen12345689";

            submit.click();
        });

        await page.waitForSelector(".treeview-menu");

        await page.evaluate(() => {
            let linkToBook = document.querySelector('ul[class="treeview-menu"] > li > a');
            linkToBook.click();
        });

        await page.waitForSelector(".view_adm_search_element");
        await page.select(".form-control.bvv_ca_select", "1")
        // await page.select(".form-control.bvv_ca_select", "")

        await page.click(".form-control.bv_form_day.hasDatepicker")


        // await page.waitFor(1000)
        debugger;

        //chon ngay
        await page.waitForSelector('span.d')

        const date = await page.$$('.d');
        await date[16].click()
        console.log(date)

        await page.focus('.form-control.bv_form_day.hasDatepicker')
        // await page.$$eval('.d', (e) => { console.log(e) })

        await page.waitForSelector(".bv_top_not_li");

        const dataChuyen = await page.$$eval('ul.dropdown-menu.bv_menu_a.not_colum_2 > li.bv_top_not_li', (e) => {

            console.log(e)
            var input = [];
            e.forEach(async li => {
                const listchuyendi = li.getElementsByClassName('did_stt_1 menu_loai_xe_1 ');
                for (const chuyen of listchuyendi) {
                    // chuyen =
                    // <span><b>13:15</b>  ← 13:15 &nbsp; MDI → SPA - 24B00569</span>
                    // <span class="bvt_so_cho stt_1">&nbsp;&nbsp;<b>44/44</b></span>
                    const dataChuyen = chuyen.getElementsByTagName('span');
                    for (const data of dataChuyen) {
                        var thongtinchuyen = data.innerText;
                        // if (thongtinchuyen.includes("SPA")) {
                        input.push(thongtinchuyen);
                        input.push('\n')
                        console.log(thongtinchuyen)
                        // }

                    }
                }


            })
            return input;
        });
        // console.log(dataChuyen)
        stringify(dataChuyen, function (err, output) {
            fs.writeFile("output.csv", dataChuyen.join('\t'), 'utf-8');
        });
        console.log(dataChuyen.join('\t'))
        // sendEmail(dataChuyen.join(','))



        console.log("ok");
        // return dataChuyen.join('\t')
        // const dataxx =   data(); 
        return res.send(dataChuyen.join(' \t \n'));
        // await browser.close();
    };
    data();
})