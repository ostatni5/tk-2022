from marshmallow import Schema, fields
from flask_restful import Resource
from flask import make_response, request
from predict_weather_in_image import pwii
from check_json import check_json
import threading
import sys

THREAD_LIMIT = 10

class _OptionsSchema(Schema):
	"""Class specifies module options"""
	name = fields.String(required=False)
	weatherType = fields.String(required=True)
	precision = fields.Integer(required=False)
	

class _Schema(Schema):
	"""Class specifies API parameters"""

	paths = fields.List(fields.String())
	options = fields.Nested(_OptionsSchema)
 


class WeatherModule(Resource):
	"""Class responsible for handling the weather module"""
 
	@staticmethod
	def get_weather(weather_type, precision, paths, results):
		"""
		Predict weather in image using trained model.
  		Args:
			weather_type: weather type user wants to find
			precision: check if weather_type is contained in top n+1 preditions
			paths: list of image paths to predict weather in
			results: filtering list for paths that contain weather_type
		"""
		for k in range(len(paths)):
			result = pwii(paths[k])
			top_n_weather_types = list(result.keys())[:precision+1]
			results[k] = weather_type in top_n_weather_types
 
	@staticmethod
	def post():
		schema = _Schema()
		errors = schema.validate(request.get_json())
		if errors:
			print("ERROR: ", errors)
			return make_response(errors, 400)

		json_data: dict = request.get_json(force=True)

		response_err = check_json(json_data)
		if response_err:
			print("Response error: ", response_err)
			return make_response(response_err, 400)

		paths = json_data.get("paths")
		threads = []
		filter_array = [False] * len(paths)
		weather_type = json_data.get("options").get("weatherType")
		precision = json_data.get("options").get("precision", 0)
		
		#split paths into chunks
		chunk_size = len(paths) // THREAD_LIMIT + (1 if len(paths) % THREAD_LIMIT != 0 else 0) 
		paths_in_chunks = [
	  					paths[i:min(i+chunk_size,len(paths))] 
					 	for i in range(0, len(paths), chunk_size)
					]
		print("Paths in chunks: ", paths_in_chunks)

		filter_in_chunks = [
	  					filter_array[i:min(i+chunk_size,len(filter_array))] 
		   				for i in range(0, len(filter_array), chunk_size)
			   		]
  
		for i in range(len(paths_in_chunks)):
			t = threading.Thread(
				target=WeatherModule.get_weather, 
				args=(weather_type, precision, paths_in_chunks[i], filter_in_chunks[i])
			)
			threads.append(t)
			t.start()
	
		for thread in threads:
			print("joining {}".format(thread.name))
			thread.join()
		#join chunks
		filter_array = [item for sublist in filter_in_chunks for item in sublist]
		#filter pictures with filter_array
		return make_response({
			"pictures": [paths[x] for x in range(len(paths)) if filter_array[x]],
		}, 200)
