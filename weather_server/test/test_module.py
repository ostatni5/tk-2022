import json
import pytest
from urllib import response
from predict_weather_in_image import pwii
from create_app import create_app
from weather_module import WeatherModule
from urllib.request import urlopen
from flask import request
import os
ROOT_PATH = os.getcwd().split("weather_server")[0].replace(os.sep, '/')

class TestModule:
    paths = [
        os.path.join(ROOT_PATH,"resources/Cloudy/Cloudy13.jpg"),
        os.path.join(ROOT_PATH,"resources/Clear/Clear374.jpg")
        ]
    
    label_lines = [
        "mostlycloudy",
        "moderate rain",
        "clear",
        "rain showers",
        "mainly clear",
        "cloudy",
        "snow",
        "fog",
        "rain",
        "drizzle",
        "rain fog"
    ]
        
    weather_type = "mostlycloudy"

    @pytest.fixture()
    def app(self):
        app = create_app()
        app.config.update({"TESTING": True})
        # app.run()
        yield app
        
    @pytest.fixture()
    def client(self, app):
        return app.test_client()
    
    def test_predict_function(self):
        result = pwii(self.paths[0])
        print(result.keys())
        assert len(result.keys()) == len(self.label_lines)
        
    def test_get_weather_method(self):
        results = [False] * len(self.paths)
        for i in range(len(self.paths)):
            WeatherModule.get_weather(self.weather_type, 0, self.paths, results)
        assert all(a == b for a, b in zip(results, [True, False]))
        
    def test_precision(self):
        results = [False] * len(self.paths)
        for i in range(len(self.paths)):
            WeatherModule.get_weather(self.weather_type, 10, self.paths, results)
        assert all(a == b for a, b in zip(results, [True, True]))
    
    def test_get_weather_api(self, client):
        body = {"paths": self.paths, "options": {"weatherType": self.weather_type, "precision": 0}}
        response = client.post("/", json=body)
        print("Response",response.json)
        assert response.status_code == 200
        assert len(response.json["pictures"]) == 1
        assert response.json["pictures"][0] == self.paths[0]

        
