from flask import Flask
from flask_cors import CORS
from flask_restful import Api
from style_module import StyleModule


def create_app():
    app = Flask(__name__)
    CORS(app)

    api = Api(app)

    api.add_resource(StyleModule, '/')

    return app