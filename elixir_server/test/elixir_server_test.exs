defmodule ElixirServerTest do
  use ExUnit.Case
  use Plug.Test
  doctest ElixirServer

  test "greets the world" do
    assert ElixirServer.hello() == :world
  end

  use ExUnit.Case

  @options ElixirServer.Router.init([])

  @rootDir File.cwd!()

  @data %{
    "options" => %{},
    "paths" => [
      "#{@rootDir}/test/resources/not_text.png",
      "#{@rootDir}/test/resources/not_text.png",
      "#{@rootDir}/test/resources/text.png",
      "#{@rootDir}/test/resources/text.png",
      "#{@rootDir}/test/resources/pattern.png",
      "#{@rootDir}/test/resources/pattern.png",
      "#{@rootDir}/test/resources/nofile.png"
    ]
  }

  def testConn(testData, expected) do
    conn =
      :post
      |> conn("/", Poison.encode!(testData))
      |> put_req_header("content-type", "application/json")
      |> ElixirServer.Router.call(@options)

    resp = Poison.decode!(conn.resp_body)

    assert Enum.sort(expected) == Enum.sort(resp["paths"])
  end

  test "has text" do
    testData = Map.put(@data, "options", %{"hasText" => true})

    expected = [
      "#{@rootDir}/test/resources/text.png",
      "#{@rootDir}/test/resources/text.png",
      "#{@rootDir}/test/resources/pattern.png",
      "#{@rootDir}/test/resources/pattern.png"
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

  test "minLenght 100" do
    testData = Map.put(@data, "options", %{"minLenght" => 100})

    expected = [
      "#{@rootDir}/test/resources/text.png",
      "#{@rootDir}/test/resources/text.png"
    ]

    testConn(testData, expected)
  end

  test "maxLenght 100" do
    testData = Map.put(@data, "options", %{"maxLenght" => 100})

    expected = [
      "#{@rootDir}/test/resources/not_text.png",
      "#{@rootDir}/test/resources/not_text.png",
      "#{@rootDir}/test/resources/pattern.png",
      "#{@rootDir}/test/resources/pattern.png",
      "#{@rootDir}/test/resources/nofile.png"
    ]

    testConn(testData, expected)
  end

  test "maxLenght 100 and has text" do
    testData = Map.put(@data, "options", %{"hasText" => true, "maxLenght" => 100})

    expected = [
      "#{@rootDir}/test/resources/pattern.png",
      "#{@rootDir}/test/resources/pattern.png"
    ]

    testConn(testData, expected)
  end
end
