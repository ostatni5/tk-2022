import json
import threading

from flask import Flask, make_response, request
from flask_cors import CORS
from flask_restful import Api, Resource
from marshmallow import Schema, fields

from predict_weather_in_image import pwii

THREAD_LIMIT = 10
LABELS = []
weather_types_file = open("./predict_weather_in_image/retrained_labels.txt", "r")

for line in weather_types_file:
	LABELS.append(line.rstrip())

class _OptionsSchema(Schema):
	"""Class specifies module options"""
	name = fields.String(required=False)
	weather_type = fields.String(required=True)
	precision = fields.Integer(required=False)
	

class _Schema(Schema):
	"""Class specifies API parameters"""

	paths = fields.List(fields.String())
	options = fields.Nested(_OptionsSchema)
 
def check_json(json_data):
	"""Check if JSON is valid"""
	if not json_data:
		return make_response("No JSON in body", 400)
	if not json_data.get("paths"):
		return make_response("No paths specified", 400)
	if not json_data.get("options"):
		return make_response("No options specified", 400)
	if not json_data.get("options").get("weather_type"):
		return make_response("No weather type specified", 400)
	weather_type = json_data.get("options").get("weather_type")
	if weather_type not in LABELS:
		return make_response("Invalid weather type specified", 400)

class WeatherModule(Resource):
	"""Class responsible for handling the weather module"""
 
	@staticmethod
	def get_weather(weather_type, precision, paths, results, index, size):
		"""Get weather"""
		for k in range(size):
			if k+index >= len(paths):
				break
			result = pwii(paths[index+k])
			top_n_weather_types = list(result.keys())[:precision+1]
			results[index+k] = weather_type in top_n_weather_types
 
	@staticmethod
	def post():
		schema = _Schema()
		errors = schema.validate(request.get_json())
		if errors:
			print(errors)
			return make_response(errors, 400)
		json_data: dict = request.get_json(force=True)
		response = check_json(json_data)
		if response:
			return response
		paths = json_data.get("paths")
		threads = []
		filter_array = [False] * len(paths)
		weather_type = json_data.get("options").get("weather_type")
		precision = json_data.get("options").get("precision", 0)
		
		thread_batch_size = len(paths) // THREAD_LIMIT + len(paths) % THREAD_LIMIT > 0 and 1 or 0
		batch_count = len(paths) // thread_batch_size + len(paths) % thread_batch_size > 0 and 1 or 0
		for i in range(batch_count):
			t = threading.Thread(target=WeatherModule.get_weather, args=(weather_type, precision, paths, filter_array, i, thread_batch_size))
			threads.append(t)
			t.start()
	
		for thread in threads:
			print("joining {}".format(thread.name))
			thread.join()
   
		#filter pictures with filter_array
		return make_response({
			"pictures": [paths[x] for x in range(len(paths)) if filter_array[x]],
		}, 200)

def create_app():
	app = Flask(__name__)
	CORS(app)

	api = Api(app)

	api.add_resource(WeatherModule, '/')

	return app

if __name__ == '__main__':
	app = create_app()

	app.run(host='localhost', port=8086)
