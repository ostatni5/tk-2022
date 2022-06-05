import pytest
from create_app import create_app
from style_module import StyleModule
from style_module import Type
import os

ROOT_PATH = os.getcwd().split("style_server")[0].replace(os.sep, '/')


class TestStyleRest:
    paths = [
        os.path.join(ROOT_PATH, "resources/Styles/linedrawing.jpg"),
        os.path.join(ROOT_PATH, "resources/Styles/clipart.png"),
        os.path.join(ROOT_PATH, "resources/Styles/photo.jpg")
    ]

    style_type = Type.photo
    style = StyleModule()

    @pytest.fixture()
    def app(self):
        app = create_app()
        app.config.update({"TESTING": True})
        yield app

    @pytest.fixture()
    def client(self, app):
        return app.test_client()

    def test_detect_photo(self):
        self.style_type = Type.photo
        result = StyleModule().detect_style(self.paths[2])
        assert result == self.style_type

    def test_detect_linedrawing(self):
        self.style_type = Type.line
        result = StyleModule().detect_style(self.paths[0])
        assert result == self.style_type

    def test_detect_clipart(self):
        self.style_type = Type.clipart
        result = StyleModule().detect_style(self.paths[1])
        assert result == self.style_type

    def test_get_style_api(self, client):
        body = {"paths": self.paths, "options": {
            "styleType": self.style_type.name}}
        response = client.post("/", json=body)
        print("Response", response.json)
        assert response.status_code == 200
        assert len(response.json["pictures"]) == 1
        assert response.json["pictures"][0] == self.paths[2]
