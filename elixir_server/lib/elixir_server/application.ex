defmodule ElixirServer.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      # Starts a worker by calling: ElixirServer.Worker.start_link(arg)
      # {ElixirServer.Worker, arg}
      Plug.Adapters.Cowboy.child_spec(
        scheme: :http,
        plug: ElixirServer.Router,
        options: [port: 8085]
      )
    ]

    {output, _} = System.cmd("cmd.exe", ["/c", "echo", "%cd%"])
    IO.puts("Current path is #{output}")



    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: ElixirServer.Supervisor]
    Supervisor.start_link(children, opts)
  end
end
