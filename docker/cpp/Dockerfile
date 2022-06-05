ARG version=12.1.0
FROM gcc:${version}

ARG src_dir

COPY $src_dir /$src_dir

RUN apt-get update -y  && \
    apt-get install -y --no-install-recommends \
    libfmt-dev \
    libasio-dev \
    cmake

RUN mkdir -p /builds

WORKDIR /builds

ARG opencv_version=4.5.5
RUN wget --quiet -O opencv.zip https://github.com/opencv/opencv/archive/${opencv_version}.zip  && \
    unzip -qq opencv.zip  && \
    rm -f opencv.zip  && \
    cd opencv-${opencv_version}  && \
    mkdir build  && \
    cd build  && \ 
    cmake ..  && \
    make install

ARG restinio_version=0.6.15
RUN curl -L --output restinio.zip https://github.com/Stiffstream/restinio/releases/download/v.${restinio_version}/restinio-${restinio_version}-full.zip  && \
    unzip -qq restinio.zip  && \
    rm -f restinio.zip  && \
    cd restinio-${restinio_version}/vcpkg  && \
    ./build_with_cmake.sh


RUN mkdir -p /builds/json/nlohmann  && \
    curl -L --output /builds/json/nlohmann/json.hpp https://raw.githubusercontent.com/nlohmann/json/develop/single_include/nlohmann/json.hpp

# COMPILE
WORKDIR /$src_dir

ENV LD_LIBRARY_PATH=${LD_LIBRARY_PATH}:/usr/local/lib
RUN cd src  && \
    g++ -o processRequest -c processRequest.cpp -I /usr/local/include/opencv4 -I /builds/json  && \
    g++ -o peopleDetector -c PeopleDetector.cpp -I /usr/local/include/opencv4  && \
    g++ -o peopleServer -c peopleServer.cpp -I /builds/restinio-0.6.15/vcpkg/local_installs/include -I /usr/local/include/opencv4/ -I /builds/json  && \
    g++ -o out -I /builds/restinio-0.6.15/vcpkg/local_installs/include -I /usr/local/include/opencv4 -I . -L /usr/local/lib/ -lopencv_core -lopencv_objdetect -lopencv_imgcodecs -pthread peopleDetector processRequest peopleServer /builds/restinio-0.6.15/vcpkg/cmake_build_fmt/libfmt.a /builds/restinio-0.6.15/vcpkg/cmake_build_http_parser/libhttp_parser.a


ARG port
ENV PORT=${port}

CMD ["bash"]
