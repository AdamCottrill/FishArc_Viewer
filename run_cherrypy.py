"""=============================================================
~/GreatLakesDjango/run_cherrypy.py Created: 03 Sep 2020 13:51:43

 DESCRIPTION:

  This python script starts the production cherrypy server. It imports both the
  django project and our flask apps and makes them available at the speficied
  host and port parameters.  Access and error logs can also be written if
  desired.

  NOTE: make sure that the root directory AND the directories for each Flask app
  are on PATH of your environment.

  Usage:

  > python run_cherrypy.py

  After starting the server, it is highly recommended that you open another
  command prompt and run the test file that verifies each of the endpoints are
  working as expected:

  > pytest utils/test_server_urls.py



 A. Cottrill
=============================================================

"""

import os

import cherrypy

from api.api import api as fisharc_viewer

PRODUCTION = False

if PRODUCTION:
    HOST = "0.0.0.0"
    PORT = 80
else:
    HOST = "127.0.0.1"
    PORT = 8011

global_options = {
    "server.socket_host": HOST,
    "server.socket_port": PORT,
    "engine.autoreload_on": True,
}


class Root(object):
    @cherrypy.expose
    def index(self):
        pass


class WebServer(object):
    def run(self):

        cherrypy.config.update(global_options)

        static_root = os.path.join(os.getcwd(), "api/build")

        static_config = {
            "/static": {
                "tools.staticdir.on": True,
                "tools.staticdir.dir": static_root,
                # "tools.staticdir.root": static_root,
                "tools.expires.on": True,
                "tools.expires.secs": 86400,
                "tools.staticdir.debug": True,
            }
        }

        cherrypy.tree.mount(Root(), "/", config=static_config)

        cherrypy.tree.graft(fisharc_viewer, "/fisharc_viewer")

        cherrypy.engine.start()
        cherrypy.engine.block()


if __name__ == "__main__":
    print("Your app is running at http://{}:{}".format(HOST, PORT))
    WebServer().run()
