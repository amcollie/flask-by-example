import os

from flask import Flask
from flask_sqlalchemy import SQLAlchemy

from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

app = Flask(__name__)
app.config.from_object(os.environ.get('APP_SETTINGS'))
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
# app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://wordcount_app:superfly73@0.0.0.0:5432/wordcount_dev'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

from models import Result
print(os.environ.get('DATABASE_URL'))
@app.route('/')
def hello():
    return "Hello World!"


@app.route('/<name>')
def hello_name(name):
    return f'Hello {name}!'

if __name__ == '__main__':
    app.run()
