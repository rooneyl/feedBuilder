import sys
import base64
import glob
import cfscrape
import json

scraper = cfscrape.create_scraper()
targets = glob.glob("target/*.json")

def generateRawContent( url ):
    base32url = base64.b32encode(str.encode(url)).decode()
    with open("rawContent/"+base32url,"wb+") as f:
        try:
            output = scraper.get(url)
            f.write(output.content)
        except:
            pass

for target in targets:
    with open(target) as f:
        try:
            urls = json.load(f)['feed']['urls']
            for url in urls: 
                generateRawContent(url)
        except:
            pass

print('done')
