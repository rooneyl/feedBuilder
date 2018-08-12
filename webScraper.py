import sys
import base64
import glob
import cfscrape
import json
import requests



targets = glob.glob("target/*.json")
headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36'
    }
sess = requests.session()
sess = cfscrape.create_scraper(sess)

def generateRawContent( url ):
    base32url = base64.b32encode(str.encode(url)).decode()
    with open("rawContent/"+base32url,"wb+") as f:
        try:
            output = sess.get(url,headers = headers)
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
