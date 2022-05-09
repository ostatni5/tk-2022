#include <gtest/gtest.h>
#include <gmock/gmock.h>
#include <nlohmann/json.hpp>
#include "processRequest.hpp"

using json = nlohmann::json;


json paths = {
    {"paths", {
        "resources/books.jpg",
        "resources/businessman.jpg",
        "resources/coffeeshop.jpg",
        "resources/cows.jpg",
        "resources/family.jpg",
        "resources/family2.jpg",
        "resources/person_smiling.jpg",
        "resources/the-solvay-conference-photo.jpg"
    }}
};

class PeopleTest : public ::testing::Test {
protected:
    cv::FileStorage cascadeFile;

    virtual void SetUp(){
        const std::string cascadePath = "cascades/haarcascade_frontalface_default.xml";
        cascadeFile.open(cascadePath, cv::FileStorage::READ);
    }
    virtual void TearDown(){}
};

TEST_F(PeopleTest, noPeople){
    std::vector<std::string> expected = {
        "resources/books.jpg",
        "resources/coffeeshop.jpg",
        "resources/cows.jpg"
    };

    json options = {
        {"options", {
            {"hasPeople", false}
        }}
    };

    json reqJson = paths;
    reqJson.merge_patch(options);

    std::vector<std::string> result = processJsonRequestParallel(cascadeFile, reqJson);
    EXPECT_THAT(expected, ::testing::UnorderedElementsAreArray(result));
}

TEST_F(PeopleTest, onePerson){
    std::vector<std::string> expected = {
        "resources/businessman.jpg",
        "resources/person_smiling.jpg"
    };

    json options = {
        {"options", {
            {"hasPeople", true},
            {"minPeople", 1},
            {"maxPeople", 1}
        }}
    };

    json reqJson = paths;
    reqJson.merge_patch(options);

    std::vector<std::string> result = processJsonRequestParallel(cascadeFile, reqJson);
    EXPECT_THAT(expected, ::testing::UnorderedElementsAreArray(result));
}

TEST_F(PeopleTest, twoThreePeople){
    std::vector<std::string> expected = {
        "resources/family.jpg",
        "resources/family2.jpg"
    };

    json options = {
        {"options", {
            {"hasPeople", true},
            {"minPeople", 2},
            {"maxPeople", 3}
        }}
    };

    json reqJson = paths;
    reqJson.merge_patch(options);

    std::vector<std::string> result = processJsonRequestParallel(cascadeFile, reqJson);
    EXPECT_THAT(expected, ::testing::UnorderedElementsAreArray(result));
}

TEST_F(PeopleTest, moreThanTenPeople){
    std::vector<std::string> expected = {
        "resources/the-solvay-conference-photo.jpg"
    };

    json options = {
        {"options", {
            {"hasPeople", true},
            {"minPeople", 10}
        }}
    };

    json reqJson = paths;
    reqJson.merge_patch(options);

    std::vector<std::string> result = processJsonRequestParallel(cascadeFile, reqJson);
    EXPECT_THAT(expected, ::testing::UnorderedElementsAreArray(result));
}
