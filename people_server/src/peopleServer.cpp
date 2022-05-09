#include <restinio/all.hpp>
#include <nlohmann/json.hpp>
#include <iostream>
#include "processRequest.hpp"
#include "PeopleDetector.hpp"

using json = nlohmann::json;


int main(){
    const std::string cascadePath = "cascades/haarcascade_frontalface_default.xml";
    cv::FileStorage cascadeFile(cascadePath, cv::FileStorage::READ);
    if(!cascadeFile.isOpened()){
        std::cerr << "could not open " << cascadePath << " file\n";
        return -1;
    }

    const int port = 8087;
    std::cout << "Server is starting on http://localhost:" << port << std::endl;
    restinio::run(
        restinio::on_this_thread()
        .port(port)
        .address("localhost")
        .request_handler([&cascadeFile](auto req){
            json reqJson = json::parse(req->body());
            std::cout << "request\n" << reqJson.dump(4) << '\n';

            json respJson = {
                {"pictures", processJsonRequestParallel(cascadeFile, reqJson)}
            };

            return req->create_response()
                   .append_header(restinio::http_field::content_type, "text/json; charset=utf-8")
                   .set_body(respJson.dump())
                   .done();
        }));

    return 0;
}