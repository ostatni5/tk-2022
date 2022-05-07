import os, sys

import tensorflow.compat.v1 as tf

MODULE_PATH = os.path.dirname(__file__)
GRAPH_PATH = os.path.join(MODULE_PATH,"retrained_graph.pb").replace(os.sep, '/')
LABELS_PATH = os.path.join(
    MODULE_PATH, "retrained_labels.txt").replace(os.sep, '/')


def pwii(image_path):
    """Predicts weather in image"""

    os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

    human_readable_prediction = dict()
    
    # Read in the image_data
    image_data = tf.gfile.FastGFile(image_path.replace(os.sep, '/'), 'rb').read()

    # Loads label file, strips off carriage return
    label_lines = [line.rstrip() for line 
                    in tf.gfile.GFile(LABELS_PATH)]

    # Unpersists graph from file
    with tf.gfile.FastGFile(GRAPH_PATH, 'rb') as f:
        graph_def = tf.GraphDef()
        graph_def.ParseFromString(f.read())
        tf.import_graph_def(graph_def, name='')

    with tf.Session() as sess:
        # Feed the image_data as input to the graph and get first prediction
        softmax_tensor = sess.graph.get_tensor_by_name('final_result:0')
        
        predictions = sess.run(softmax_tensor, \
                {'DecodeJpeg/contents:0': image_data})
        
        # Sort to show labels of first prediction in order of confidence
        top_k = predictions[0].argsort()[-len(predictions[0]):][::-1]
        
        
        for node_id in top_k:
            human_string = label_lines[node_id]
            score = predictions[0][node_id]
            # print('%s (score = %.5f)' % (human_string, score))
            human_readable_prediction[human_string] = score
        
        
    return human_readable_prediction
    
    


# change this as you see fit
# if(len(sys.argv) > 1):
#     image_path = sys.argv[1]
#     pwii(image_path)

#save function as module
sys.modules[__name__] = pwii

