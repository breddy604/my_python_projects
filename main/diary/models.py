from google.appengine.ext import ndb

# Create your models here.

class DayAndUser(ndb.Model):
	user=ndb.StringProperty()
	day=ndb.DateProperty()


class Message(ndb.Model):
	time=ndb.DateTimeProperty()
	content=ndb.StringProperty()

	@classmethod
    	def query_messages(cls, ancestor_key):
        	return cls.query(ancestor=ancestor_key).order(-cls.time)

class UserFeedback(ndb.Model):
	user=ndb.StringProperty()
	feedback=ndb.StringProperty()
	time_submitted = ndb.DateTimeProperty()
		

