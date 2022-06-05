ARG version=3.10.4-slim-bullseye
FROM python:${version}

ARG src_dir=_servers

COPY $src_dir /$src_dir

WORKDIR /$src_dir

RUN python3 -m pip install -r requirements.txt

ARG port
ENV PORT=${port}

CMD ["bash"]
