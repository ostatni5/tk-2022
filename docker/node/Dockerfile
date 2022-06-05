ARG version=18-bullseye-slim
FROM node:${version}

ARG src_dir=node_servers

COPY $src_dir /$src_dir

WORKDIR /$src_dir

RUN npm install

ARG port
ENV PORT=${port}

CMD ["bash"]
