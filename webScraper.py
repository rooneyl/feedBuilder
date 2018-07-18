import sys
import cfscrape

fileName = sys.argv[1];
url = sys.argv[2];

scraper = cfscrape.create_scraper()
output = scraper.get(url)

f = open("rawContent/"+fileName,"wb+")
f.write(output.content)
f.close()

print("done")
