# Utiliser une image de base Python
FROM python:3.9-slim

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Installation des outils nécessaires
RUN apt-get update && apt-get install -y wget

# Installation de wait-for-it pour attendre que Flask soit prêt
RUN wget -O /usr/local/bin/wait-for-it.sh https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh
RUN chmod +x /usr/local/bin/wait-for-it.sh

# Copier le fichier requirements.txt et installer les dépendances
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copier ton script Python dans le conteneur
COPY . /app/

# Exécuter le script Python une fois que Flask est prêt
CMD ["/bin/bash", "-c", "wait-for-it.sh flask-app:5001 --timeout=120 -- python insersion.py"]
