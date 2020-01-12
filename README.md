[![PyPI pyversions](https://img.shields.io/badge/python-3.6-blue.svg)](https://www.python.org/downloads/release/python-360)
[![PyPI pyversions](https://img.shields.io/badge/typescript-%5Ev3.0.0-blue.svg)
](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-0.html)

ClassicAuctionUI helps you to track changes in prices of WorldOfWarcraft AH items. Use it to explore patterns, track low prices, etc.
Feel free to send PRs, fork and modify.

# Installation

## Info

Development stack consists of several services:

1. Redis as a storage
2. Miner - a Scrapy project to scrape icons of the wow items
3. Frontend - Angular application for the UI
4. Backend - NestJS backend for the REST API

## Development

1. Run Redis Docker service

```sh
docker run -p 6379:6379 -v /var/lib/redis/6379/need-more-gold/:/data redis:alpine redis-server --requirepass r6121343809cbab19 --appendonly yes
# Create admin user
hset users admin '{"role": "admin", "password": "$2b$10$OHBD5yu8z7aDj8Ntg8FB2.hx4VdcwLBIx3MGcEY.7UMAUTHom7BLO"}'
```

2. Create log and icon folders for the Miner service

```sh
# Create folders for logs and icons
sudo mkdir -p /var/log/need-more-gold
sudo mkdir -p /data/need-more-gold/items
# Add write permissions to folders and nested files
sudo chown -R root:$USER /var/log/need-more-gold
sudo chown -R root:$USER /data/need-more-gold/items
sudo chmod 2775 /var/log/need-more-gold
sudo chmod 2775 /data/need-more-gold/items
find /var/log/need-more-gold -type d -exec sudo chmod 2775 {} +
find /data/need-more-gold/items -type d -exec sudo chmod 2775 {} +
find /var/log/need-more-gold -type f -exec sudo chmod 0664 {} +
find /data/need-more-gold/items -type f -exec sudo chmod 0664 {} +
```

3. Scrape wow item icons

```sh
# Create virtual environment
python3 -m venv venv
# Activate virtualenv
source venv/bin/activate
# Install dependencies
pip install -r requirements.txt
# Run icons scraper (make take several hours to finish)
scrapy crawl mmo4ever
```

4. Launch Frontend and Backend services

```sh
# Start backend
npm run start:dev
# Start frontend
npm start
```

5. Navigate to localhost:4041 from your browser and login with username `admin` and password `admin`. You should see an empty data table.
   ![Upload Page](../assets/upload.JPG?raw=true)
   ![Buying Page](../assets/table-empty.JPG?raw=true)

6. Create a file with AH data

The most tricky part is to somehow save AH items into a file and then feed it
to the application scripts. I achieved it by modifying the original Auctionator
addon. Modified files are: `shared/data/AuctionatorScanFull.lua` and
`shared/data/AuctionatorScan.lua`. I marked edited sections with `-- Desprit` comment.
Modified version of addon saves all AH items into a file called `Auctionator.lua`
which is stored in your `WTF` folder. Example of such file is located in `shared/data/AuctionatorDataExample.lua`. On my server this file would be about 1.5MB for every AH scan.
Install Auctionator, replace files with modified ones. Log into the game and perform a
full scan. You'll then need to reload UI or logout to force addon saving local state into a file.
Now than you have an Auctionator.lua file with AH items navigate to http://localhost:4041/upload and submit the file. Uploading make take up to 30 seconds, be patient. I also recommend to clear Addon history before every scan. You can find instructions in addon settings.
![Upload Page](../assets/table-data.JPG?raw=true)
![Buying Page](../assets/graph.JPG?raw=true)

## Database structure

Miner saves items into two HSETs. One store a mapping
between item id and item name. The other one stores a
mapping between icon name and icon id.

```sh
# List docker containers
docker ps
# Connect to Redis service
docker exec -it CONTAINER_ID redis-cli -a r6121343809cbab19
# List all items
hgetall name-id-map
hgetall id-name-map
# Get item by id
hget name-id-map "deadly fire opal"
# Get item by name
hget id-name-map 30582
```
