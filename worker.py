import os
from redis import Redis
from rq import Worker, Queue, Connection

listen = ['default']

redis_host = os.getenv('REDISTOGO_HOST', 'localhost')
redis_port = os.getenv('REDISTOGO_PORT', 6379)


redis_client = Redis(host=redis_host, port=redis_port)

if __name__ == '__main__':
    with Connection(redis_client):
        worker = Worker(list(map(Queue, listen)))
        worker.work()
