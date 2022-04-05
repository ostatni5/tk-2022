defmodule Ocr do
  def pass(_outputOcr) do
    true
  end

  def hasText(outputOcr) do
    String.length(outputOcr) > 0
  end

  def containsText(text, outputOcr) do
    String.contains?(outputOcr, text)
  end

  def compareLength(operator, number, outputOcr) do
    case is_integer(number) do
      true ->
        operator.(String.length(outputOcr), number)

      false ->
        IO.puts("Is not a number #{number}")
        &pass/1
    end
  end

  def minLength(number, outputOcr) do
    compareLength(&Kernel.>=/2, number, outputOcr)
  end

  def maxLength(number, outputOcr) do
    compareLength(&Kernel.<=/2, number, outputOcr)
  end

  def parseOption(option) do
    {name, param} = option

    case name do
      "hasText" ->
        &hasText/1

      "containsText" ->
        &containsText(String.downcase(param), String.downcase(&1))

      "minLenght" ->
        &minLength(param, &1)

      "maxLenght" ->
        &maxLength(param, &1)

      _ ->
        IO.puts("Unknown function name #{name}")
        &pass/1
    end
  end

  def checkImage(path, options) do
    IO.puts(path)
    outputOcr = TesseractOcr.read(path)
    checked = Enum.map(options, fn option -> parseOption(option).(outputOcr) end)
    IO.inspect(checked)
    Enum.all?(checked)
  end

  def filterPaths(paths, options) do
    paths
    |> Enum.map(fn path ->
      Task.async(fn ->
        [path, Ocr.checkImage(path, options)]
      end)
    end)
    |> Enum.map(fn tsk -> Task.await(tsk) end)
    |> Enum.filter(fn tsk -> Enum.at(tsk, 1) end)
    |> Enum.map(fn tsk -> Enum.at(tsk, 0) end)
  end
end
