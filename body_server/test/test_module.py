import pytest
from create_app import create_app
from body_module import BodyModule
import os

ROOT_PATH = os.getcwd().split("body_server")[0].replace(os.sep, '/')


class TestBodyRest:
    paths = [
        os.path.join(ROOT_PATH, "resources/BodyPeople/Musk.jpg"),
        os.path.join(ROOT_PATH, "resources/BodyPeople/Apple.png"),
        os.path.join(ROOT_PATH, "resources/BodyPeople/Face.jpg")
    ]

    body_type = "Faces"

    @pytest.fixture()
    def app(self):
        app = create_app()
        app.config.update({"TESTING": True})
        yield app

    @pytest.fixture()
    def client(self, app):
        return app.test_client()

    def test_predict_type(self):
        result = BodyModule.get_body(self.body_type, self.paths[0])
        print(result)
        assert isinstance(result, dict)

    def test_detect_hands(self):
        self.body_type = "Hands"
        results = BodyModule.get_body(self.body_type, self.paths)
        assert all(value >= result for (key, value), result in zip(results.items(), [50, 0, 0]))

    def test_detect_faces(self):
        results = BodyModule.get_body(self.body_type, self.paths)
        assert all(value >= result for (key, value), result in zip(results.items(), [0, 0, 50]))

    def test_get_body_api(self, client):
        body = {"paths": self.paths, "options": {
            "bodyType": self.body_type, "precision": 0}}

        response = client.post("/", json=body)
        print("Response", response.json)
        assert response.status_code == 200
        assert len(response.json["pictures"]) == 2
        assert response.json["pictures"][0] == self.paths[0]
