import pytest
from create_app import create_app
from format_module import FormatModule
import os

ROOT_PATH = os.getcwd().split("format_server")[0].replace(os.sep, '/')


class TestFormatRest:
    paths = [
        os.path.join(ROOT_PATH, "resources/format/mike.jpg"),
        os.path.join(ROOT_PATH, "resources/format/marian.jpeg"),
        os.path.join(ROOT_PATH, "resources/format/tiger.png")
    ]

    selected_formats = [".jpg", ".png"]

    @pytest.fixture()
    def app(self):
        app = create_app()
        app.config.update({"TESTING": True})
        yield app

    @pytest.fixture()
    def client(self, app):
        return app.test_client()

    def test_find_jpg(self):
        desired_formats = [".jpg"]
        result = FormatModule.get_desired_formats(desired_formats, self.paths)
        print(result)
        assert result == [self.paths[0]]

    def test_find_png(self):
        desired_formats = [".png"]
        result = FormatModule.get_desired_formats(desired_formats, self.paths)
        print(result)
        assert result == [self.paths[2]]

    def test_find_jpg_and_png(self):
        desired_formats = [".jpg", ".png"]
        result = FormatModule.get_desired_formats(desired_formats, self.paths)
        print(result)
        assert result == [self.paths[0], self.paths[2]]

    def test_get_body_api(self, client):
        body = {"paths": self.paths, "options": {
            "_selectedFormats": self.selected_formats}}

        response = client.post("/", json=body)
        print("Response", response.json)
        assert response.status_code == 200
        assert len(response.json["pictures"]) == 2
        assert response.json["pictures"][0] == self.paths[0]
        assert response.json["pictures"][1] == self.paths[2]
