ARG version=1.13.4-slim
FROM elixir:${version}

ARG src_dir

COPY $src_dir /$src_dir

WORKDIR /$src_dir

RUN apt-get update -y  &&\
    apt-get install -y --no-install-recommends tesseract-ocr  &&\
    rm -rf /var/lib/apt/lists/*

# apt-get update && apt-get install -y --no-install-recommends curl xz-utils ca-certificates make
# curl --output tesseract_5.1.0-1.debian.tar.xz https://notesalexp.org/tesseract-ocr5/source/pool/main/t/tesseract/tesseract_5.1.0-1.debian.tar.xz

#RUN	&& buildDeps=' \
#		ca-certificates \
#		curl \
#		make \
#	' \
#	&& apt-get update \
#	&& apt-get install -y --no-install-recommends $buildDeps \

RUN mix local.hex --force  &&\
    mix deps.get  &&\
    mix local.rebar --force  &&\
    mix run

ARG port
ENV PORT=${port}

CMD ["bash"]
