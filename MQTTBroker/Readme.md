Mosquitto Broker
---------------------------
Image eines MQTT-Brokers basierent auf (Mosquitto http://projects.eclipse.org/projects/technology.mosquitto "Link zum Mosquitto Projekt von Eclipse"). Dieser Broker stellt ermöglicht sowohl das Regestrieriung von Clients über den MQTT-Port 1883 als auch via Websockets über den Port 9883. Letzteres ist bspw. für die Anbindung der Web-Clients mittels paho (in Javascript) notwendig.

Erstellen des Image
---------------------------
	docker build --no-cache -t "mosquitto_broker" .

Starten des Containers
---------------------------
	docker run -d -h broker --name broker -p 1883:1883 -p 9883:9883 mosquitto_broker

Logging
--------------------------
Mosquitto wird in die Datei /var/log/mosquitto/mosquitto.log und in stdout seine Logging- Ausgaben schreiben.
Hierfür kann optional ein Volume mit -v ./log/:/var/log/mosquitto eingebunden werden. 
Dafür muss zuvor im Verzeichnis auf dem Host eine mosquitto.log erstellt werden.
Docker-Compose (/SmartModulApps/docker-compose.yml) ist entsprechend eingerichtet.

Hinweis
-----------------------------

1. Dieser Container ist auch via dockerhub verfügbar mit folgendem Kommando `eclipse-mosquitto`


