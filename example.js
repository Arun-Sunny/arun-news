const express = require("express");
const path = require("path");
const mongoose = require("mongoose")
const NewsAPI = require('newsapi');
let bodyParser = require('body-parser');
var moment = require('moment');
var _ = require('lodash');
const Newsarticles = require('./models/newsarticles.js');
const app = express();
const port = 8000;

const newsapi = new NewsAPI('bcef2d833f5944f0881eeac96b5e33d5');

// mongoose.connect("mongodb://arunsunny:vcFWVcV9oR2PE7av@cluster0-shard-00-00-jzylx.mongodb.net:27017,cluster0-shard-00-01-jzylx.mongodb.net:27017,cluster0-shard-00-02-jzylx.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority", {
//     useNewUrlParser: true
// })


// mongoose.connect("mongodb://agssjk:VBwsVJCZvistUyGp@cluster0-shard-00-00-4tr5f.gcp.mongodb.net:27017,cluster0-shard-00-01-4tr5f.gcp.mongodb.net:27017,cluster0-shard-00-02-4tr5f.gcp.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority", {
//     useNewUrlParser: true
// })
mongoose.connect("mongodb://agssjk:VBwsVJCZvistUyGp@cluster0-shard-00-00-4tr5f.gcp.mongodb.net:27017,cluster0-shard-00-01-4tr5f.gcp.mongodb.net:27017,cluster0-shard-00-02-4tr5f.gcp.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority", {
    useNewUrlParser: true
})

async function saveNews() {
    try {
        let date = moment().subtract(7, 'd').format('YYYY-MM-DD'); // USED TO CREATE A DATE WHICH IS 1 WEEK BEFORE
        const keywords = ['Sports', 'Technology', 'Economics', 'Covid', 'Politics', 'Startups', 'Business', 'Trump', 'India', 'World'];
        for (let index = 0; index < keywords.length; index++) {
            const element = keywords[index];
            let newsData;
            newsapi.v2.topHeadlines({
                from: date,
                q: element,
                language: 'en',
                pageSize: 20,
            }).then(async response => {
                let newsArticlesForElement = await Newsarticles.find({ keyword: element });
                if (!newsArticlesForElement) {
                    let newsArticlesForElement = new Newsarticles()
                    newsObject.keyword = element;
                    newsObject.articles = response.articles;
                    newsArticlesForElement.save();
                }
            });
        }

    } catch (error) {
        console.log(error)
        throw error;
    }

}
saveNews()