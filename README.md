# feedBuilder
FeedBuilder is a RSS generating and publishing server for websites. It automatically extracts content and data from the desired website to create a RSS feed.

## Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites
You will need to have the following installed.
```
mongodb
nodejs
npm
```

Then, you need to create a configuration file to the target website.
*  target/example.json - sepecifies the channel
```js
{
  "id": "example",                                      // url route
  "title": "this is example website",                   // title
  "link": "http://www.example.com",                     // link to website
  "description": "latest news from example.com",        // description
  "url": "http://www.example.com/news",                 // url that will be creating list of rss
  "root": "tr>td>form>table>tbody",                     // main html root of elements, see below
  "section": "tr"                                       // starting point of each element
}
```
* target/example.js - specifiies the element
```js
const rp = require("request-promise");
const cheerio = require("cheerio");

const exampleParser = async $ => {
    const no = $.find("td[class='no']").text();           // post number
    const date = $.find("td[class='date']").text();       // date of post
    const subject = $.find("a[class='subject']").text();  // subject of post
    const href = $.find("a[class='link']").attr("href");  // link to post

    if (date && subject && href && bbsNo != "") {
        try {
            const descriptionHtml = await rp(href);
            const $des = cheerio.load(descriptionHtml, { decodeEntities: false });
            const description = $des("div[id='content']").html();

            return {
                subject,
                date: date.toUTCString(),
                href,
                guid: href,
                description
            };
        } catch (err) {}
    }
    return undefined;
};

module.exports = exampleParser;
```
Please read [CONFIG.md](CONFIG.md) for details on how to configure.

### Installing

```
git clone https://github.com/rooneyl/feedBuilder.git
cd feedBuilder
npm build
npm start
```

### Usage
RSS.xml should now be available from localhost:12121/:id to be added to your prefered RSS reader.
Note: the deafult port is configured as 12121.
* http://localhost:12121/example

## Testing Configuration file

After setting up the configuration, and before running the application, the following testing tool can be used to ensure that the configuration files are set up properly.
```
npm test exmaple
```
where example is the id of the configuration website.

## Built With

* [cheerio](https://cheerio.js.org/) - HTML parser
* [express](https://expressjs.com/) - Server framework
* [request-promise](https://github.com/request/request-promise/) - HTTP request client

## License

The MIT License (MIT)

Copyright (c) 2018 Seongjun Lee

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
