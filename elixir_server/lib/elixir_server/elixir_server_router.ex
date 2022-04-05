defmodule ElixirServer.Router do
  use Plug.Router
  use Plug.Debugger
  require Logger

  plug(Plug.Logger, log: :debug)

  plug(:match)

  plug(:dispatch)

  post "/" do
    {:ok, body, conn} = read_body(conn)

    body = Poison.decode!(body)
    paths = Map.get(body, "paths") || []
    options = Map.get(body, "options") || %{}

    pathsFiltered = Ocr.filterPaths(paths, options)

    send_resp(conn, 200, Poison.encode!(%{paths: pathsFiltered}))
  end

  # "Default" route that will get called when no other route is matched

  match _ do
    send_resp(conn, 404, "not found")
  end
end
