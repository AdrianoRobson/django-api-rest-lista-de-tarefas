
FROM python:3
ENV PYTHONUNBUFFERED=1 

WORKDIR /code

RUN apt-get update -y && \
  apt-get install -y python3-pip python3-dev

COPY requirements.txt /code/
RUN pip install -r requirements.txt
COPY . /code/
EXPOSE 8000