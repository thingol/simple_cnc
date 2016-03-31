# -*- coding: utf-8 -*-
from cPickle import load
from datetime import datetime, timedelta

from flask import Flask, render_template, request

app = Flask("Simple C'n'C")
events = None

def get_events(date):
    global events

    if events == None:
        try:
            events_file = open("events.pickled", 'r')
            events = load(events_file)
            events_file.close()
        except:
            print 'Loading pickled events failed!'

    
    return {events.get(date, "nothing"): True}

@app.route('/', methods=['GET'])
def index():
    date = None
    if request.args.has_key('date'):
        date = request.args.get('date')
    else:
        date = unicode(datetime.now().date() + timedelta(days=1))
        
    return render_template("index.html", events=get_events(date))

@app.route('/test.html', methods=['GET'])
def index_test():
    date = None
    if request.args.has_key('date'):
        date = request.args.get('date')
    else:
        date = unicode(datetime.now().date() + timedelta(days=1))

    return render_template("test.html", events=get_events(date))


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)
