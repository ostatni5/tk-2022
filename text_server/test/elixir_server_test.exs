defmodule TextServerTest do
  use ExUnit.Case
  use Plug.Test
  @options TextServer.Router.init([])

  @rootDir File.cwd!()

  @data %{
    "options" => %{},
    "paths" => [
      "#{@rootDir}/test/resources/not_text.png",
      "#{@rootDir}/test/resources/not_text.png",
      "#{@rootDir}/test/resources/text.png",
      "#{@rootDir}/test/resources/text.png",
      "#{@rootDir}/test/resources/pattern_text.png",
      "#{@rootDir}/test/resources/pattern_text.png",
      "#{@rootDir}/test/resources/nofile.png"
    ]
  }

  def testConn(testData, expected) do
    conn =
      :post
      |> conn("/", Poison.encode!(testData))
      |> put_req_header("content-type", "application/json")
      |> TextServer.Router.call(@options)

    resp = Poison.decode!(conn.resp_body)

    assert Enum.sort(expected) == Enum.sort(resp["paths"])
  end

  test "has text" do
    testData = Map.put(@data, "options", %{"hasText" => true})

    expected = [
      "#{@rootDir}/test/resources/text.png",
      "#{@rootDir}/test/resources/text.png",
      "#{@rootDir}/test/resources/pattern_text.png",
      "#{@rootDir}/test/resources/pattern_text.png"
    ]

    testConn(testData, expected)
  end

  test "has no text" do
    testData = Map.put(@data, "options", %{"hasText" => false})

    expected = [
      "#{@rootDir}/test/resources/not_text.png",
      "#{@rootDir}/test/resources/not_text.png",
      "#{@rootDir}/test/resources/nofile.png"
    ]

    testConn(testData, expected)
  end

  test "contains text ''" do
    testData = Map.put(@data, "options", %{"containsText" => ""})

    expected = @data["paths"]

    testConn(testData, expected)
  end

  test "contains text 'this'" do
    testData = Map.put(@data, "options", %{"containsText" => "this"})

    expected = [
      "#{@rootDir}/test/resources/text.png",
      "#{@rootDir}/test/resources/text.png"
    ]

    testConn(testData, expected)
  end

  test "minLength 100" do
    testData = Map.put(@data, "options", %{"minLength" => 100})

    expected = [
      "#{@rootDir}/test/resources/text.png",
      "#{@rootDir}/test/resources/text.png"
    ]

    testConn(testData, expected)
  end

  test "maxLength 100" do
    testData = Map.put(@data, "options", %{"maxLength" => 100})

    expected = [
      "#{@rootDir}/test/resources/not_text.png",
      "#{@rootDir}/test/resources/not_text.png",
      "#{@rootDir}/test/resources/pattern_text.png",
      "#{@rootDir}/test/resources/pattern_text.png",
      "#{@rootDir}/test/resources/nofile.png"
    ]

    testConn(testData, expected)
  end

  test "maxLength 100 and has text" do
    testData = Map.put(@data, "options", %{"hasText" => true, "maxLength" => 100})

    expected = [
      "#{@rootDir}/test/resources/pattern_text.png",
      "#{@rootDir}/test/resources/pattern_text.png"
    ]

    testConn(testData, expected)
  end
end
