const express = require("express");
const path = require("path");
const mongoose = require("mongoose")
const NewsAPI = require('newsapi');
let bodyParser = require('body-parser');
var moment = require('moment');
var _ = require('lodash');
const Newsarticles = require('./models/newsarticles.js');
const app = express();
const port = process.env.PORT;

const newsapi = new NewsAPI('bf8fa21e1bb9441f91e4f8b81db51225');

mongoose.connect("mongodb://agssjk:HJ1P7njDm3vdrQJZ@cluster0-shard-00-00-4tr5f.gcp.mongodb.net:27017,cluster0-shard-00-01-4tr5f.gcp.mongodb.net:27017,cluster0-shard-00-02-4tr5f.gcp.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority", {
    useNewUrlParser: true
})


app.use(bodyParser.json()); app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'ejs')


async function saveNews() {
    try {
        let date = moment().subtract(7, 'd').format('YYYY-MM-DD');
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
                    newsArticlesForElement.keyword = element;
                    newsArticlesForElement.articles = response.articles;
                    await newsArticlesForElement.save();
                }
            });
        }

    } catch (error) {
        console.log(error)
        throw error;
    }

}

app.get("/", async (req, res) => {
    await saveNews(); // THIS FUNCTION CALLS THE NEWSAPI
    res.render('index', { data: "" })
});

app.post("/getnews", async (req, res) => {
    try {
        // await saveNews();
        let keyword = _.capitalize(req.body.keyword);
        let newsObject = await Newsarticles.find({ keyword: keyword });
        if (newsObject.length) {
            res.render('index', { data: JSON.parse(JSON.stringify(newsObject[0])).articles,moment:moment });
        }
        else {
            console.log('No article found')
            res.render('index', { data: null });
        }

    } catch (error) {
        console.log(`an error has occured. error:${error}`)
        throw error;
    }
})
app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
});