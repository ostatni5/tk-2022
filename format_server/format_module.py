from marshmallow import Schema, fields
from flask_restful import Resource
from flask import make_response, request
from pbii import check_for_formats
from check_json import check_json


class _OptionsSchema(Schema):
    """Class specifies module options"""
    name = fields.String(required=False)
    _selectedFormats = fields.List(fields.String(), required=True)


class _Schema(Schema):
    """Class specifies API parameters"""
    paths = fields.List(fields.String())
    options = fields.Nested(_OptionsSchema)


class FormatModule(Resource):
    """Class responsible for handling the body module"""

    @staticmethod
    def get_desired_formats(desired_formats, paths):
        """
        Returns pictures that have desired format.
        Args:
                        desired_formats: list of desired formats ([".jpg", ".jp2"])
                        paths: list of image paths to check for desired format
        """
        paths = [x for x in paths if check_for_formats(x, desired_formats)]

        return paths

    @staticmethod
    def post():
        schema = _Schema()

        # validate request
        print(request.get_json())
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
        desired_formats = json_data.get("options").get("_selectedFormats")

        filter_paths = FormatModule.get_desired_formats(desired_formats, paths)

        return make_response({"pictures": filter_paths, }, 200)
