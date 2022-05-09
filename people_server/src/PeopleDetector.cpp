#include <opencv2/imgcodecs.hpp>
#include <opencv2/objdetect.hpp>
#include <vector>
#include <algorithm>
#include <numeric>
#include "PeopleDetector.hpp"


PeopleDetector::PeopleDetector(const std::string& cascadePath){
    cascade.load(cascadePath);
    if(cascade.empty()){
        throw std::invalid_argument("could not load " + cascadePath + " cascade file");
    }
}

PeopleDetector::PeopleDetector(const cv::FileNode &node){
    cascade.read(node);
    if(cascade.empty()){
        throw std::invalid_argument("could not read file node");
    }
}

size_t PeopleDetector::countPeople(const std::string& imagePath, bool nms){
    constexpr double scaleFactor = 1.08;
    constexpr int minNeighbours = 8;
    cv::Mat img = cv::imread(imagePath);
    if(img.empty()){
        throw std::invalid_argument("could not load " + imagePath + " image");
    }

    std::vector<cv::Rect> people;
    cascade.detectMultiScale(img, people, scaleFactor, minNeighbours);
    if(nms){
        constexpr double overlapThreshold = 0.35;
        people = nonMaximumSuppression(people, overlapThreshold);
    }

    return people.size();
}

std::vector<cv::Rect> PeopleDetector::nonMaximumSuppression(const std::vector<cv::Rect>& boxes, double overlapThreshold) const{
    if(boxes.empty())
        return {};

    std::vector<cv::Rect> result;

    // calc areas of boxes
    std::vector<double> areas(boxes.size());
    for(int i=0; i < boxes.size(); i++)
        areas.at(i) = boxes.at(i).area();

    // argsort of bottom right ys of boxes
    std::vector<int> idxs(boxes.size());
    std::iota(idxs.begin(), idxs.end(), 0);
    std::sort(idxs.begin(), idxs.end(),
        [&boxes](size_t i1, size_t i2) {
            return boxes.at(i1).br().y < boxes.at(i2).br().y;
        });

    while(idxs.size() > 0){
        int last = static_cast<int>(idxs.size() - 1);
        int i = idxs.at(last);
        result.push_back(boxes.at(i));

        idxs.pop_back();
        for(int pos = last-1; pos >= 0; pos--){
            int j = idxs.at(pos);

            int tlxMax = std::max(boxes.at(i).tl().x, boxes.at(j).tl().x);
            int tlyMax = std::max(boxes.at(i).tl().y, boxes.at(j).tl().y);
            int brxMin = std::min(boxes.at(i).br().x, boxes.at(j).br().x);
            int bryMin = std::min(boxes.at(i).br().y, boxes.at(j).br().y);

            int width = std::max(0, brxMin - tlxMax);
            int height = std::max(0, bryMin - tlyMax);

            double overlap = static_cast<double>(width*height) / areas.at(j);

            if(overlap > overlapThreshold){
                idxs.erase(idxs.begin() + pos);
            }
        }
    }

    return result;
}
