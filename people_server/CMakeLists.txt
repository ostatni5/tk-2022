cmake_minimum_required(VERSION 3.21.0)
project(peopleServer)

set(CMAKE_CXX_STANDARD 17)

include(${CMAKE_BINARY_DIR}/conanbuildinfo.cmake)
conan_basic_setup()

add_library(lib
    src/PeopleDetector.cpp
    src/processRequest.cpp
)

add_executable(peopleServer src/peopleServer.cpp)
target_link_libraries(peopleServer ${CONAN_LIBS} lib)

add_executable(peopleTest test/peopleTest.cpp)
target_link_libraries(peopleTest ${CONAN_LIBS} lib)
target_include_directories(peopleTest PUBLIC ${CMAKE_SOURCE_DIR}/src)

file(COPY ${CMAKE_SOURCE_DIR}/src/cascades DESTINATION ${CMAKE_RUNTIME_OUTPUT_DIRECTORY})
IF(NOT EXISTS ${CMAKE_RUNTIME_OUTPUT_DIRECTORY}/resources)
    file(COPY ${CMAKE_SOURCE_DIR}/../resources/people DESTINATION ${CMAKE_RUNTIME_OUTPUT_DIRECTORY})
    file(RENAME ${CMAKE_RUNTIME_OUTPUT_DIRECTORY}/people ${CMAKE_RUNTIME_OUTPUT_DIRECTORY}/resources)
endif()
