import cassandra

from cassandra.cluster import Cluster
from cassandra.query import dict_factory


class SingleDBConnection(object):
        _c = {}
        def __new__(cls):
                if cls not in cls._c:
                        cls._c[cls] = super(SingleDBConnection,cls).__new__(cls)
                return cls._c[cls]

			
class DBConnection(SingleDBConnection):
	def __init__(self):
		cluster = Cluster()
		self.session = cluster.connect('demo')
	   	self.session.row_factory = dict_factory	
		self.prep_stmts = {}
		self.prep_stmts['INSERT'] = self.session.prepare("INSERT INTO message_content(email_id, date_happened, event_time, content) values(?,?,?,?)")
		self.prep_stmts['SELECT_ALL'] = self.session.prepare("SELECT * FROM message_content")
		self.prep_stmts['SELECT_RANGE'] = self.session.prepare("SELECT * FROM message_content where (email_id = ?) and (date_happened=?)")
		
	
	def get_prep_stmt(self,type):
		return self.prep_stmts[type]

	def bind_and_execute_stmt(self,type,bind_values):
	        insert_prep = self.get_prep_stmt(type)
        	bound_insert_prep = insert_prep.bind(bind_values)
		return self.session.execute(bound_insert_prep)

