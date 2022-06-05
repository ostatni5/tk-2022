from marshmallow import Schema, fields
from flask_restful import Resource
from flask import make_response, request
from check_json import check_json
import requests
import enum


class _OptionsSchema(Schema):
    """Class specifies module options"""
    name = fields.String(required=False)
    styleType = fields.String(required=True)


class _Schema(Schema):
    """Class specifies API parameters"""
    paths = fields.List(fields.String())
    options = fields.Nested(_OptionsSchema)

class Type(enum.Enum):
    line = 'line drawing'
    clipart = 'clip art'
    photo = 'photo'


class StyleModule(Resource):
    ENDPOINT = 'https://westeurope.api.cognitive.microsoft.com/vision/v3.2/analyze'

    def __init__(self):
        self._sub_key = None

        with open('.skey', 'r') as f:
            self._sub_key = f.read().replace('\n', '')
        
        if self._sub_key is None:
            raise ValueError('Subscription key file was not read properly.')

    def detect_styles(self, style:Type, paths):
        filtered_paths = []
        for file in paths:
            if self.detect_style(file) == style:
                filtered_paths.append(file)

        return filtered_paths

    def detect_style(self, file_path: str):
        with open(file_path, 'rb') as fileobj:
            data = self.ask_provider(fileobj)

        if data is None:
            return Type.photo
    
        image_type = data['imageType']

        if image_type['lineDrawingType'] == 1:
            return Type.line
        elif image_type['clipArtType'] >= 2:
            return Type.clipart
        else:
            return Type.photo

    def ask_provider(self, fileobj) -> dict | None:
        headers = {'Ocp-Apim-Subscription-Key': f'{self._sub_key}'}
        params = {'visualFeatures': 'ImageType'}
        files = {'file': (None, fileobj, 'multipart/form-data')}

        retrials = 3

        while retrials:
            try:
                response = requests.post(self.ENDPOINT, params=params,
                                        headers=headers, files=files, timeout=0.5)
                response.raise_for_status()
                return response.json()
            except (requests.exceptions.HTTPError,
                    requests.exceptions.RequestException) as _:
                retrials -= 1
            
        return None


    @staticmethod
    def post():
        schema = _Schema()

        # validate request
        errors = schema.validate(request.get_json())
        if errors:
            print("ERROR: ", errors)
            return make_response(errors, 400)

        json_data: dict = request.get_json(force=True)
        response_err = check_json(json_data)
        if response_err:
            print("Response error: ", response_err)
            return make_response(response_err, 400)

        # load data
        paths = json_data.get("paths")
        style_type = json_data.get("options").get("styleType")

        style = StyleModule()
        filter_paths = style.detect_styles(Type(style_type), paths)

        # filter pictures with filter_array
        return make_response({"pictures": filter_paths, }, 200)