from json import JSONEncoder

import cassandra
import uuid
from cassandra.util import unix_time_from_uuid1

class MessageEncoder(JSONEncoder):
	def default(self,o):
        	if isinstance(o,cassandra.util.Date):
			return str(o)
		elif isinstance(o, uuid.UUID):
			return str(unix_time_from_uuid1(o))       
		
		else:
			return o
