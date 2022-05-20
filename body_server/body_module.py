from marshmallow import Schema, fields
from flask_restful import Resource
from flask import make_response, request
from pbii import hand_detection, face_detection
from check_json import check_json


class _OptionsSchema(Schema):
    """Class specifies module options"""
    name = fields.String(required=False)
    bodyType = fields.String(required=True)
    precision = fields.Integer(required=False)


class _Schema(Schema):
    """Class specifies API parameters"""
    paths = fields.List(fields.String())
    options = fields.Nested(_OptionsSchema)


class BodyModule(Resource):
    """Class responsible for handling the body module"""

    @staticmethod
    def get_body(body_type, paths):
        """
        Predict weather in image using trained model.
        Args:
                        body_type: body type user wants to find
                        paths: list of image paths to predict weather in
        """
        results = {}
        for k in range(len(paths)):
            if body_type == 'Hands':
                results[paths[k]] = hand_detection(paths[k])
            else:
                results[paths[k]] = face_detection(paths[k])
        return results

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
        body_type = json_data.get("options").get("bodyType")
        precision = json_data.get("options").get("precision", 50)

        filter_paths = []

        unfiltered_dic = BodyModule.get_body(body_type, paths)

        for key, value in unfiltered_dic.items():
            if value > int(precision):
                filter_paths.append(key)

        return make_response({"pictures": filter_paths, }, 200)
