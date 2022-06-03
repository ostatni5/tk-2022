from marshmallow import Schema, fields
from flask_restful import Resource
from flask import make_response, request
from pbii import hand_detection, face_detection
from check_json import check_json


class _OptionsSchema(Schema):
    """Class specifies module options"""
    name = fields.String(required=False)
    handsChecked = fields.Bool(required=True)
    faceChecked = fields.Bool(required=True)
    faceConfidence = fields.Integer(required=False)
    handsConfidence = fields.Integer(required=False)


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
                        body_type: dic with body type user wants to find with minimum confidence
                        paths: list of image paths to predict body in
        """

        if "face_check" in body_type:
            paths = [x for x in paths if face_detection(x) >= int(body_type["face_check"])]

        if "hand_check" in body_type:
            paths = [x for x in paths if hand_detection(x) >= int(body_type["hand_check"])]

        return paths

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
        face_check = json_data.get("options").get("faceChecked")
        hand_check = json_data.get("options").get("handsChecked")

        dic_setting = {}
        if face_check:
            if not json_data.get("options").get("faceConfidence"):
                dic_setting["face_check"] = 1
            else:
                dic_setting["face_check"] = json_data.get("options").get("faceConfidence")

        if hand_check:
            if not json_data.get("options").get("handsConfidence"):
                dic_setting["hand_check"] = 1
            else:
                dic_setting["hand_check"] = json_data.get("options").get("handsConfidence")

        filter_paths = BodyModule.get_body(dic_setting, paths)

        return make_response({"pictures": filter_paths, }, 200)
