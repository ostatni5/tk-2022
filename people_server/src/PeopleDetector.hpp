#pragma once

#include <opencv2/objdetect.hpp>


class PeopleDetector{
    cv::CascadeClassifier cascade;
public:
    PeopleDetector(const std::string& cascadePath);
    PeopleDetector(const cv::FileNode &node);
    size_t countPeople(const std::string& imagePath, bool nms = true);
private:
    std::vector<cv::Rect> nonMaximumSuppression(const std::vector<cv::Rect>& boxes, double overlapThreshold) const;
};
