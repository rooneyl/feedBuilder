# Configuration Detail

## Channel Configuration

Given example.com/news source (Fig 1)
```html
<html>
<head> head </html>
<body>
    <div>
        <div>
            <table>
```
```html
//ROOT          <tbody>

//SECITON1      <div class='content'>
                    <td class='no'> 1 </td>
                    <td class='title'> new1 </td>
                    <td class='date'> 20.11.2018 </td>
                    <td class='link'><a href='www.example.com/post/123'>link</a></td>
                </div>

//SECITON2      <div class='content'>**
                    <td class='no'> 2 </td>
                    <td class='title'> new2 </td>
                    <td class='date'> 21.11.2018 </td>
                    <td class='link'><a href='www.example.com/post/1233'>link</a></td>
                </div>

//SECITON3      <div class='content'>
                    <td class='no'> 3 </td>
                    <td class='title'> new3 </td>
                    <td class='date'> 22.11.2018 </td>
                    <td class='link'><a href='www.example.com/post/13'>link</a></td>
                </div>

                </tbody>
```
```html  
            </table>
        </div>
    </div>
</body>
</html>
```

Example of channel configuration - target/example.json
```json
{
  "id": "example",                                // url route
  "title": "this is example website",             // title
  "link": "http://www.example.com",               // link to website
  "description": "latest news from example.com",  // description
  "url": "http://www.example.com/news",           // url that will be creating list of rss
  "root": "body>div>div>table>tbody",             // main html root of elements, see below
  "section": "div"                                // starting point of each element
}
```

where 'root' sepecifies the root of contents list (as seen in Fig 1) and 'section' sepcifies the starting point of each dividing block.

## Element Configuration

feedBuilder first extracts each website's content and slices them into sectional htmls, then is passed onto the example.js(element configuration) module to extract neccessary information to build the rss feed. Note that 'id' specified in the channel configuration must match with the name of the element configuration. For example, a channel configuration with 'id : wikipedia' must have the corresponding wikipedia.js elemenent configuration.

Hence, from the above example, the following sample html paramater is passed along to example.js:
```html
<div class='content'>
    <td class='no'> 3 </td>
    <td class='title'> new3 </td>
    <td class='date'> 22.11.2018 </td>
    <td class='link'><a href='www.example.com/post/13'>link</a></td>
</div>
```

example.js is needed to extract the required RSS sepecification elements.
```javascript
const exampleParser = async $ => {
    const no = $.find("td[class='no']").text();           // post number
    const date = $.find("td[class='date']").text();       // date of post
    const subject = $.find("a[class='title']").text();  // subject of post
    const href = $.find("a[class='link']").attr("href");  // link to post
    
    return {
        subject,
        date,
        href,
        description,
        guid: href
      };
};

module.exports = exampleParser;
```