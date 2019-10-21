# Installation

## Development

1. Run Redis Docker service

```sh
docker run -p 6379:6379 -v /var/lib/redis/6379/need-more-gold/:/data redis:alpine redis-server --requirepass r6121343809cbab19 --appendonly yes
# Create admin user
hset users admin '{"role": "admin", "password": "$2b$10$OHBD5yu8z7aDj8Ntg8FB2.hx4VdcwLBIx3MGcEY.7UMAUTHom7BLO"}'
```

2. Create Miner log folder

```sh
# Create logs and icons folders
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

## Production

1. Install latest Node and NPM
2. [Install Docker](https://docs.docker.com/install/linux/docker-ce/ubuntu/)
3.

### Frontend

1. [Install Angular CLI](https://angular.io/cli)

```sh
npm install -g @angular/cli
```

2. Start project

```sh
ng new frontend
```

### Backend

1. [Install NestJS CLI](https://docs.nestjs.com)

```sh
npm i -g @nestjs/cli
```

2. Start project

```sh
nest new backend
```

### Install and start Redis server

https://www.digitalocean.com/community/tutorials/how-to-install-and-secure-redis-on-ubuntu-18-04

```sh
# Connect to Redis
redis-cli -a 749her0fsp74232
```
