import sys
import base64
import cfscrape

url = sys.argv[1];
fileName = sys.argv[2]

scraper = cfscrape.create_scraper()
output = scraper.get(url)

f = open("rawContent/"+fileName,"wb+")
f.write(output.content)
f.close()

print("done")
